const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todas as salas com informações de ocupação
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { testTime } = req.query;
    const currentTime = testTime || 'CURTIME()';
    const timeCondition = testTime 
      ? `'${testTime}' BETWEEN h.hora_inicio AND h.hora_fim`
      : 'CURTIME() BETWEEN h.hora_inicio AND h.hora_fim';
    const timeCondition2 = testTime
      ? `'${testTime}' BETWEEN h2.hora_inicio AND h2.hora_fim`
      : 'CURTIME() BETWEEN h2.hora_inicio AND h2.hora_fim';

    const [rooms] = await pool.execute(`
      SELECT 
        s.id,
        s.numero,
        s.bloco,
        s.andar,
        s.capacidade,
        s.tipo,
        s.ativa,
        CASE 
          WHEN MAX(h.id) IS NOT NULL THEN 'ocupada'
          ELSE 'disponivel'
        END as status,
        d.nome as aula_atual,
        p.nome as professor_atual,
        COALESCE(
          (SELECT COUNT(DISTINCT h2.aluno_id) 
           FROM horarios h2
           WHERE h2.sala_id = s.id
             AND h2.ativo = true
             AND h2.aluno_id IS NOT NULL
             AND h2.dia_semana = CASE DAYOFWEEK(CURDATE())
               WHEN 2 THEN 'segunda'
               WHEN 3 THEN 'terca' 
               WHEN 4 THEN 'quarta'
               WHEN 5 THEN 'quinta'
               WHEN 6 THEN 'sexta'
               WHEN 7 THEN 'sabado'
               ELSE 'domingo'
             END
             AND ${timeCondition2}),
          0
        ) as alunos_presentes
      FROM salas s
      LEFT JOIN horarios h ON s.id = h.sala_id 
        AND h.ativo = true
        AND h.dia_semana = CASE DAYOFWEEK(CURDATE())
          WHEN 2 THEN 'segunda'
          WHEN 3 THEN 'terca' 
          WHEN 4 THEN 'quarta'
          WHEN 5 THEN 'quinta'
          WHEN 6 THEN 'sexta'
          WHEN 7 THEN 'sabado'
          ELSE 'domingo'
        END
        AND ${timeCondition}
      LEFT JOIN disciplinas d ON h.disciplina_id = d.id
      LEFT JOIN professores p ON h.professor_id = p.id
      WHERE s.ativa = true
      GROUP BY s.id, s.numero, s.bloco, s.andar, s.capacidade, s.tipo, s.ativa, d.nome, p.nome
      ORDER BY s.bloco, s.numero
    `);

    res.json(rooms);
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar coordenadas de uma sala (DEVE VIR ANTES das rotas genéricas)
router.put('/:id/coordinates', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mapa_bloco_id } = req.body;
    
    // Verificar se a sala existe
    const [salas] = await pool.execute(
      'SELECT * FROM salas WHERE id = ?',
      [id]
    );
    
    if (salas.length === 0) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }
    
    // Atualizar coordenadas
    await pool.execute(
      `UPDATE salas 
       SET mapa_bloco_id = ?
       WHERE id = ?`,
      [ mapa_bloco_id, id]
    );
    
    res.json({ 
      message: 'Coordenadas atualizadas com sucesso',
      sala: {
        id,
        mapa_bloco_id
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar coordenadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar salas por filtros
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;
    const { bloco, tipo, disponivel, testTime } = req.query;
    const timeCondition = testTime 
      ? `'${testTime}' BETWEEN h.hora_inicio AND h.hora_fim`
      : 'CURTIME() BETWEEN h.hora_inicio AND h.hora_fim';
    
    let sql = `
      SELECT 
        s.id,
        s.numero,
        s.bloco,
        s.andar,
        s.capacidade,
        s.tipo,
        CASE 
          WHEN h.id IS NOT NULL THEN 'ocupada'
          ELSE 'disponivel'
        END as status,
        d.nome as aula_atual,
        p.nome as professor_atual
      FROM salas s
      LEFT JOIN horarios h ON s.id = h.sala_id 
        AND h.ativo = true
        AND h.dia_semana = CASE DAYOFWEEK(CURDATE())
          WHEN 2 THEN 'segunda'
          WHEN 3 THEN 'terca' 
          WHEN 4 THEN 'quarta'
          WHEN 5 THEN 'quinta'
          WHEN 6 THEN 'sexta'
          WHEN 7 THEN 'sabado'
          ELSE 'domingo'
        END
        AND ${timeCondition}
      LEFT JOIN disciplinas d ON h.disciplina_id = d.id
      LEFT JOIN professores p ON h.professor_id = p.id
      WHERE s.ativa = true
        AND (s.numero LIKE ? OR s.bloco LIKE ? OR s.tipo LIKE ?)
    `;
    
    let params = [`%${query}%`, `%${query}%`, `%${query}%`];
    
    if (bloco) {
      sql += ` AND s.bloco = ?`;
      params.push(bloco);
    }
    
    if (tipo) {
      sql += ` AND s.tipo = ?`;
      params.push(tipo);
    }
    
    if (disponivel === 'true') {
      sql += ` AND h.id IS NULL`;
    } else if (disponivel === 'false') {
      sql += ` AND h.id IS NOT NULL`;
    }
    
    sql += ` GROUP BY s.id, s.numero, s.bloco, s.andar, s.capacidade, s.tipo, d.nome, p.nome ORDER BY s.bloco, s.numero`;
    
    const [rooms] = await pool.execute(sql, params);
    
    res.json(rooms);
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter informações detalhadas de uma sala específica
router.get('/:roomId', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { testTime } = req.query;
    const timeCondition = testTime 
      ? `'${testTime}' BETWEEN h.hora_inicio AND h.hora_fim`
      : 'CURTIME() BETWEEN h.hora_inicio AND h.hora_fim';
    const timeGreaterCondition = testTime
      ? `h.hora_inicio > '${testTime}'`
      : 'h.hora_inicio > CURTIME()';

    // Buscar dados da sala
    const [rooms] = await pool.execute(`
      SELECT id, numero, bloco, andar, capacidade, tipo, ativa
      FROM salas 
      WHERE id = ? AND ativa = true
    `, [roomId]);

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    const room = rooms[0];

    // Buscar ocupação atual baseada nos horários
    const [currentOccupancy] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT h.aluno_id) as alunos_presentes,
        d.nome as disciplina,
        p.nome as professor,
        h.hora_inicio as inicio_aula
      FROM horarios h
      JOIN disciplinas d ON h.disciplina_id = d.id
      JOIN professores p ON h.professor_id = p.id
      WHERE h.sala_id = ? 
        AND h.ativo = true
        AND h.aluno_id IS NOT NULL
        AND h.dia_semana = CASE DAYOFWEEK(CURDATE())
          WHEN 2 THEN 'segunda'
          WHEN 3 THEN 'terca' 
          WHEN 4 THEN 'quarta'
          WHEN 5 THEN 'quinta'
          WHEN 6 THEN 'sexta'
          WHEN 7 THEN 'sabado'
          ELSE 'domingo'
        END
        AND ${timeCondition}
      GROUP BY d.id, p.id, h.hora_inicio
      LIMIT 1
    `, [roomId]);

    // Buscar próximas aulas programadas para hoje
    const [nextClasses] = await pool.execute(`
      SELECT 
        TIME_FORMAT(h.hora_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(h.hora_fim, '%H:%i') as hora_fim,
        d.nome as disciplina,
        p.nome as professor,
        h.tipo_aula as tipo
      FROM horarios h
      JOIN disciplinas d ON h.disciplina_id = d.id
      JOIN professores p ON h.professor_id = p.id
      WHERE h.sala_id = ? 
        AND h.ativo = true
        AND h.dia_semana = CASE DAYOFWEEK(CURDATE())
          WHEN 2 THEN 'segunda'
          WHEN 3 THEN 'terca' 
          WHEN 4 THEN 'quarta'
          WHEN 5 THEN 'quinta'
          WHEN 6 THEN 'sexta'
          WHEN 7 THEN 'sabado'
          ELSE 'domingo'
        END
        AND ${timeGreaterCondition}
      ORDER BY h.hora_inicio
      LIMIT 3
    `, [roomId]);

    const roomData = {
      ...room,
      status: currentOccupancy.length > 0 ? 'ocupada' : 'disponivel',
      ocupacao_atual: currentOccupancy.length > 0 ? {
        alunos_presentes: currentOccupancy[0].alunos_presentes,
        disciplina: currentOccupancy[0].disciplina,
        professor: currentOccupancy[0].professor,
        inicio_aula: currentOccupancy[0].inicio_aula
      } : null,
      proximas_aulas: nextClasses
    };

    res.json(roomData);
  } catch (error) {
    console.error('Erro ao buscar dados da sala:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;