const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole, canAccessStudent } = require('../middleware/auth');

const router = express.Router();

// Obter aulas ministradas pelo professor
router.get('/classes', authenticateToken, requireRole(['professor']), async (req, res) => {
  try {
    // Buscar dados do professor
    const [professor] = await pool.execute(
      'SELECT id FROM professores WHERE usuario_id = ?',
      [req.user.id]
    );

    if (professor.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const professorId = professor[0].id;

    // Buscar horários/aulas do professor com informação da aula atual
    const [classes] = await pool.execute(`
      SELECT 
        h.disciplina_id,
        d.nome as disciplina,
        h.dia_semana,
        TIME_FORMAT(h.hora_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(h.hora_fim, '%H:%i') as hora_fim,
        CONCAT(TIME_FORMAT(h.hora_inicio, '%H:%i'), ' - ', TIME_FORMAT(h.hora_fim, '%H:%i')) as horario,
        CONCAT(s.bloco, s.numero) as sala,
        s.numero as sala_numero,
        s.bloco as sala_bloco,
        h.tipo_aula,
        COUNT(DISTINCT h.aluno_id) as total_alunos,
        GROUP_CONCAT(DISTINCT a.id) as aluno_ids,
        GROUP_CONCAT(DISTINCT u.nome SEPARATOR '; ') as alunos_nomes,
        CASE 
          WHEN DAYNAME(NOW()) = 'Monday' AND h.dia_semana = 'segunda' AND NOW() BETWEEN CONCAT(CURDATE(), ' ', h.hora_inicio) AND CONCAT(CURDATE(), ' ', h.hora_fim) THEN 'atual'
          WHEN DAYNAME(NOW()) = 'Tuesday' AND h.dia_semana = 'terca' AND NOW() BETWEEN CONCAT(CURDATE(), ' ', h.hora_inicio) AND CONCAT(CURDATE(), ' ', h.hora_fim) THEN 'atual'
          WHEN DAYNAME(NOW()) = 'Wednesday' AND h.dia_semana = 'quarta' AND NOW() BETWEEN CONCAT(CURDATE(), ' ', h.hora_inicio) AND CONCAT(CURDATE(), ' ', h.hora_fim) THEN 'atual'
          WHEN DAYNAME(NOW()) = 'Thursday' AND h.dia_semana = 'quinta' AND NOW() BETWEEN CONCAT(CURDATE(), ' ', h.hora_inicio) AND CONCAT(CURDATE(), ' ', h.hora_fim) THEN 'atual'
          WHEN DAYNAME(NOW()) = 'Friday' AND h.dia_semana = 'sexta' AND NOW() BETWEEN CONCAT(CURDATE(), ' ', h.hora_inicio) AND CONCAT(CURDATE(), ' ', h.hora_fim) THEN 'atual'
          ELSE 'nao_atual'
        END as status_aula
      FROM horarios h
      JOIN disciplinas d ON h.disciplina_id = d.id
      JOIN salas s ON h.sala_id = s.id
      JOIN alunos a ON h.aluno_id = a.id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE h.professor_id = ? AND h.ativo = true
      GROUP BY h.disciplina_id, h.dia_semana, h.hora_inicio, h.hora_fim, h.sala_id, h.tipo_aula, d.nome, s.numero, s.bloco, s.id
      ORDER BY 
        FIELD(h.dia_semana, 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'),
        h.hora_inicio
    `, [professorId]);

    // Agrupar por disciplina
    const classesBySubject = {};
    
    classes.forEach(classe => {
      if (!classesBySubject[classe.disciplina]) {
        classesBySubject[classe.disciplina] = [];
      }
      
      classesBySubject[classe.disciplina].push({
        disciplina_id: classe.disciplina_id,
        dia_semana: classe.dia_semana,
        horario: classe.horario,
        sala: classe.sala,
        sala_numero: classe.sala_numero,
        sala_bloco: classe.sala_bloco,
        tipo_aula: classe.tipo_aula,
        total_alunos: classe.total_alunos,
        aluno_ids: classe.aluno_ids ? classe.aluno_ids.split(',').map(id => parseInt(id)) : [],
        alunos_nomes: classe.alunos_nomes,
        status_aula: classe.status_aula,
        is_current: classe.status_aula === 'atual'
      });
    });

    res.json(classesBySubject);
  } catch (error) {
    console.error('Erro ao buscar aulas do professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter alunos de uma disciplina específica do professor
router.get('/classes/:disciplineId/students', authenticateToken, requireRole(['professor']), async (req, res) => {
  try {
    const { disciplineId } = req.params;
    
    // Buscar dados do professor
    const [professor] = await pool.execute(
      'SELECT id FROM professores WHERE usuario_id = ?',
      [req.user.id]
    );

    if (professor.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const professorId = professor[0].id;

    // Verificar se o professor ministra esta disciplina
    const [disciplineCheck] = await pool.execute(
      'SELECT 1 FROM horarios WHERE professor_id = ? AND disciplina_id = ? LIMIT 1',
      [professorId, disciplineId]
    );

    if (disciplineCheck.length === 0) {
      return res.status(403).json({ error: 'Você não ministra esta disciplina' });
    }

    // Buscar alunos da disciplina
    const [students] = await pool.execute(`
      SELECT DISTINCT 
        a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade,
        pa.status as status_atual,
        CASE 
          WHEN pa.status = 'presente' AND pa.data_saida IS NULL THEN s.numero
          ELSE NULL
        END as sala_atual
      FROM horarios h
      JOIN alunos a ON h.aluno_id = a.id
      JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN presenca_atual pa ON a.id = pa.aluno_id AND pa.disciplina_id = h.disciplina_id
      LEFT JOIN salas s ON pa.sala_id = s.id
      WHERE h.professor_id = ? AND h.disciplina_id = ? AND h.ativo = true
      ORDER BY u.nome
    `, [professorId, disciplineId]);

    res.json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos da disciplina:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter alunos que o professor pode acessar
router.get('/students', authenticateToken, requireRole(['professor']), async (req, res) => {
  try {
    // Buscar dados do professor
    const [professor] = await pool.execute(
      'SELECT id FROM professores WHERE usuario_id = ?',
      [req.user.id]
    );

    if (professor.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const professorId = professor[0].id;

    // Buscar todos os alunos que este professor ensina
    const [students] = await pool.execute(`
      SELECT DISTINCT 
        a.id, u.nome, a.matricula, a.curso, a.turma, a.modalidade
      FROM horarios h
      JOIN alunos a ON h.aluno_id = a.id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE h.professor_id = ? AND h.ativo = true
      ORDER BY u.nome
    `, [professorId]);

    res.json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos do professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;