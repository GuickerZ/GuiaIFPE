const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, canAccessStudent } = require('../middleware/auth');

const router = express.Router();

// Buscar alunos (apenas admin pode listar todos)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    
    // Apenas admin pode buscar qualquer aluno
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    let query = `
      SELECT a.id, u.nome, a.matricula, a.cpf, u.email, a.telefone, 
             a.curso, a.turma, a.modalidade
      FROM alunos a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE u.ativo = true
    `;
    
    let params = [];
    
    if (search) {
      query += ` AND (u.nome LIKE ? OR a.matricula LIKE ? OR a.cpf LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }
    
    query += ` ORDER BY u.nome`;
    
    const [students] = await pool.execute(query, params);
    
    res.json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter dados de um aluno específico
router.get('/:studentId', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const [students] = await pool.execute(`
      SELECT a.id, u.nome, a.matricula, a.cpf, u.email, a.telefone, 
             a.curso, a.turma, a.modalidade
      FROM alunos a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = ? AND u.ativo = true
    `, [studentId]);
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    const student = students[0];
    
    // Buscar aula atual
    const [currentClass] = await pool.execute(`
      SELECT d.nome as subject, p.nome as teacher, s.numero as room, 
             CONCAT(s.bloco, s.numero) as fullRoom, s.bloco as block,
             TIME_FORMAT(h.hora_inicio, '%H:%i') as start_time,
             TIME_FORMAT(h.hora_fim, '%H:%i') as end_time,
             CONCAT(TIME_FORMAT(h.hora_inicio, '%H:%i'), ' - ', TIME_FORMAT(h.hora_fim, '%H:%i')) as time,
             h.tipo_aula as type
      FROM presenca_atual pa
      JOIN disciplinas d ON pa.disciplina_id = d.id
      JOIN professores p ON pa.professor_id = p.id
      JOIN salas s ON pa.sala_id = s.id
      JOIN horarios h ON h.aluno_id = pa.aluno_id AND h.disciplina_id = pa.disciplina_id 
                        AND h.professor_id = pa.professor_id AND h.sala_id = pa.sala_id
      WHERE pa.aluno_id = ? AND pa.status = 'presente' AND pa.data_saida IS NULL
      ORDER BY pa.data_entrada DESC
      LIMIT 1
    `, [studentId]);
    
    let currentClassData = null;
    if (currentClass.length > 0) {
      currentClassData = {
        subject: currentClass[0].subject,
        teacher: currentClass[0].teacher,
        room: currentClass[0].fullRoom,
        time: currentClass[0].time,
        block: currentClass[0].block,
        type: currentClass[0].type
      };
    }
    
    res.json({
      ...student,
      currentClass: currentClassData
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados do aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter horários de um aluno
router.get('/:studentId/schedule', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const [schedules] = await pool.execute(`
      SELECT h.dia_semana as day,
             TIME_FORMAT(h.hora_inicio, '%H:%i') as start_time,
             TIME_FORMAT(h.hora_fim, '%H:%i') as end_time,
             CONCAT(TIME_FORMAT(h.hora_inicio, '%H:%i'), ' - ', TIME_FORMAT(h.hora_fim, '%H:%i')) as time,
             d.nome as subject,
             p.nome as teacher,
             CONCAT(s.bloco, s.numero) as room,
             h.tipo_aula as type
      FROM horarios h
      JOIN disciplinas d ON h.disciplina_id = d.id
      JOIN professores p ON h.professor_id = p.id
      JOIN salas s ON h.sala_id = s.id
      WHERE h.aluno_id = ? AND h.ativo = true
      ORDER BY 
        FIELD(h.dia_semana, 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'),
        h.hora_inicio
    `, [studentId]);
    
    // Organizar por dia da semana
    const schedule = {
      segunda: [],
      terca: [],
      quarta: [],
      quinta: [],
      sexta: [],
      sabado: []
    };
    
    schedules.forEach(item => {
      schedule[item.day].push({
        time: item.time,
        subject: item.subject,
        teacher: item.teacher,
        room: item.room,
        type: item.type
      });
    });
    
    res.json(schedule);
    
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar alunos que o usuário logado pode acessar
router.get('/accessible/list', authenticateToken, async (req, res) => {
  try {
    let students = [];
    
    if (req.user.tipo === 'admin') {
      // Admin pode ver todos os alunos
      const [allStudents] = await pool.execute(`
        SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade
        FROM alunos a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.ativo = true
        ORDER BY u.nome
      `);
      students = allStudents;
      
    } else if (req.user.tipo === 'aluno') {
      // Aluno só pode ver a si mesmo
      const [selfData] = await pool.execute(`
        SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade
        FROM alunos a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.usuario_id = ?
      `, [req.user.id]);
      students = selfData;
      
    } else if (req.user.tipo === 'responsavel') {
      // Responsável pode ver apenas seus dependentes
      const [responsavel] = await pool.execute(
        'SELECT id FROM responsaveis WHERE usuario_id = ?',
        [req.user.id]
      );
      
      if (responsavel.length > 0) {
        const [dependents] = await pool.execute(`
          SELECT a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade
          FROM aluno_responsavel ar
          JOIN alunos a ON ar.aluno_id = a.id
          JOIN usuarios u ON a.usuario_id = u.id
          WHERE ar.responsavel_id = ?
          ORDER BY u.nome
        `, [responsavel[0].id]);
        students = dependents;
      }
    }
    
    res.json(students);
    
  } catch (error) {
    console.error('Erro ao buscar alunos acessíveis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;