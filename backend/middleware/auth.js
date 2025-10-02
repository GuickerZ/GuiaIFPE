const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar dados completos do usuário
    const [users] = await pool.execute(
      'SELECT id, nome, email, tipo, ativo FROM usuarios WHERE id = ? AND ativo = true',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};

// Middleware para verificar se o usuário pode acessar dados do aluno
const canAccessStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const userId = req.user.id;
  const userType = req.user.tipo;

  try {
    // Admin pode acessar qualquer aluno
    if (userType === 'admin') {
      return next();
    }

    // Se é o próprio aluno
    if (userType === 'aluno') {
      const [aluno] = await pool.execute(
        'SELECT id FROM alunos WHERE id = ? AND usuario_id = ?',
        [studentId, userId]
      );
      
      if (aluno.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      return next();
    }

    // Se é responsável, verificar se tem acesso ao aluno
    if (userType === 'responsavel') {
      const [responsavel] = await pool.execute(
        'SELECT r.id FROM responsaveis r WHERE r.usuario_id = ?',
        [userId]
      );

      if (responsavel.length === 0) {
        return res.status(403).json({ error: 'Responsável não encontrado' });
      }

      const [relacao] = await pool.execute(
        'SELECT 1 FROM aluno_responsavel ar WHERE ar.aluno_id = ? AND ar.responsavel_id = ?',
        [studentId, responsavel[0].id]
      );

      if (relacao.length === 0) {
        return res.status(403).json({ error: 'Acesso negado - você não é responsável por este aluno' });
      }

      return next();
    }

    return res.status(403).json({ error: 'Acesso negado' });
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  canAccessStudent
};