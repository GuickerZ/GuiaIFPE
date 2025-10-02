const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login por CPF
router.post('/login', [
  body('cpf').isLength({ min: 11, max: 14 }).matches(/^[0-9.\-]+$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    const { cpf } = req.body;

    // Limpar CPF (remover pontos e hífens)
    const cleanCpf = cpf.replace(/[.\-]/g, '');

    // Buscar primeiro se é um professor (prioridade para professores)
    const [professores] = await pool.execute(`
      SELECT u.id, u.nome, u.email, u.tipo, u.ativo, p.id as professor_id, p.cpf, p.telefone
      FROM usuarios u
      JOIN professores p ON u.id = p.usuario_id
      WHERE REPLACE(REPLACE(p.cpf, '.', ''), '-', '') = ? AND u.ativo = 1
    `, [cleanCpf]);

    if (professores.length > 0) {
      const user = professores[0];
      
      // Verificar se o professor também é responsável
      const [responsavelProf] = await pool.execute(
        'SELECT id FROM responsaveis WHERE usuario_id = ?',
        [user.id]
      );

      let alunosResponsaveis = [];
      if (responsavelProf.length > 0) {
        const [alunos] = await pool.execute(`
          SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade, ar.parentesco
          FROM aluno_responsavel ar
          JOIN alunos a ON ar.aluno_id = a.id
          JOIN usuarios u ON a.usuario_id = u.id
          WHERE ar.responsavel_id = ?
        `, [responsavelProf[0].id]);
        alunosResponsaveis = alunos;
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
        process.env.JWT_SECRET || 'chave-secreta-desenvolvimento',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          professor: {
            id: user.professor_id,
            cpf: user.cpf,
            telefone: user.telefone
          },
          alunosResponsaveis: alunosResponsaveis.length > 0 ? alunosResponsaveis : undefined
        }
      });
    }

    // Se não é professor, buscar se é um aluno
    const [alunos] = await pool.execute(`
      SELECT u.id, u.nome, u.email, u.tipo, u.ativo, a.id as aluno_id, a.matricula, a.cpf, a.telefone, a.curso, a.turma, a.modalidade
      FROM usuarios u
      JOIN alunos a ON u.id = a.usuario_id
      WHERE REPLACE(REPLACE(a.cpf, '.', ''), '-', '') = ? AND u.ativo = 1
    `, [cleanCpf]);

    if (alunos.length > 0) {
      const user = alunos[0];
      
      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
        process.env.JWT_SECRET || 'chave-secreta-desenvolvimento',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          aluno: {
            id: user.aluno_id,
            matricula: user.matricula,
            cpf: user.cpf,
            telefone: user.telefone,
            curso: user.curso,
            turma: user.turma,
            modalidade: user.modalidade
          }
        }
      });
    }


    // Se não é aluno nem professor, buscar se é responsável
    const [responsaveis] = await pool.execute(`
      SELECT u.id, u.nome, u.email, u.tipo, u.ativo, r.id as responsavel_id, r.cpf, r.telefone
      FROM usuarios u
      JOIN responsaveis r ON u.id = r.usuario_id
      WHERE REPLACE(REPLACE(r.cpf, '.', ''), '-', '') = ? AND u.ativo = 1
    `, [cleanCpf]);

    if (responsaveis.length === 0) {
      return res.status(401).json({ error: 'CPF não encontrado' });
    }

    const user = responsaveis[0];
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET || 'chave-secreta-desenvolvimento',
      { expiresIn: '24h' }
    );

    // Buscar alunos que este responsável pode acessar
    const [alunosResp] = await pool.execute(`
      SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade, ar.parentesco
      FROM aluno_responsavel ar
      JOIN alunos a ON ar.aluno_id = a.id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE ar.responsavel_id = ?
    `, [user.responsavel_id]);

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        responsavel: {
          id: user.responsavel_id,
          cpf: user.cpf,
          telefone: user.telefone
        },
        alunosResponsaveis: alunosResp
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token (para refresh)
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    let userData = {
      id: req.user.id,
      nome: req.user.nome,
      email: req.user.email,
      tipo: req.user.tipo
    };

    if (req.user.tipo === 'aluno') {
      const [aluno] = await pool.execute(
        'SELECT id, matricula, cpf, telefone, curso, turma, modalidade FROM alunos WHERE usuario_id = ?',
        [req.user.id]
      );
      if (aluno.length > 0) {
        userData.aluno = aluno[0];
      }
    } else if (req.user.tipo === 'professor') {
      const [professor] = await pool.execute(
        'SELECT id, cpf, telefone FROM professores WHERE usuario_id = ?',
        [req.user.id]
      );
      if (professor.length > 0) {
        userData.professor = professor[0];
        
        // Verificar se também é responsável
        const [responsavel] = await pool.execute(
          'SELECT id FROM responsaveis WHERE usuario_id = ?',
          [req.user.id]
        );
        
        if (responsavel.length > 0) {
          const [alunos] = await pool.execute(`
            SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade, ar.parentesco
            FROM aluno_responsavel ar
            JOIN alunos a ON ar.aluno_id = a.id
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE ar.responsavel_id = ?
          `, [responsavel[0].id]);
          
          if (alunos.length > 0) {
            userData.alunosResponsaveis = alunos;
          }
        }
      }
    } else if (req.user.tipo === 'responsavel') {
      const [responsavel] = await pool.execute(
        'SELECT id, cpf, telefone FROM responsaveis WHERE usuario_id = ?',
        [req.user.id]
      );
      if (responsavel.length > 0) {
        userData.responsavel = responsavel[0];
        
        const [alunos] = await pool.execute(`
          SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade, ar.parentesco
          FROM aluno_responsavel ar
          JOIN alunos a ON ar.aluno_id = a.id
          JOIN usuarios u ON a.usuario_id = u.id
          WHERE ar.responsavel_id = ?
        `, [responsavel[0].id]);
        
        userData.alunosResponsaveis = alunos;
      }
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logout (opcional - apenas limpa o token no frontend)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;