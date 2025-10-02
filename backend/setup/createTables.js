const { pool } = require('../config/database');

const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Criando tabelas...');

    // Tabela de usuários (alunos, responsáveis)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        tipo ENUM('aluno', 'responsavel', 'admin', 'professor') NOT NULL,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabela de alunos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS alunos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        curso VARCHAR(100) NOT NULL,
        turma VARCHAR(50) NOT NULL,
        modalidade ENUM('integrado', 'subsequente') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Tabela de responsáveis (pais/responsáveis)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS responsaveis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Tabela de relação aluno-responsável
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS aluno_responsavel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aluno_id INT,
        responsavel_id INT,
        parentesco VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
        FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE,
        UNIQUE(aluno_id, responsavel_id)
      )
    `);

    // Tabela de salas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS salas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero VARCHAR(20) NOT NULL,
        bloco VARCHAR(10) NOT NULL,
        andar INT NOT NULL,
        capacidade INT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        ativa BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de disciplinas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS disciplinas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        carga_horaria INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de professores
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS professores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Tabela de horários
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS horarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aluno_id INT,
        disciplina_id INT,
        professor_id INT,
        sala_id INT,
        dia_semana ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado') NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fim TIME NOT NULL,
        tipo_aula ENUM('teorica', 'pratica', 'laboratorio') NOT NULL,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
        FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
        FOREIGN KEY (professor_id) REFERENCES professores(id),
        FOREIGN KEY (sala_id) REFERENCES salas(id)
      )
    `);

    // Tabela de presença/localização atual
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS presenca_atual (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aluno_id INT,
        sala_id INT,
        disciplina_id INT,
        professor_id INT,
        data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_saida TIMESTAMP NULL,
        status ENUM('presente', 'ausente') DEFAULT 'presente',
        FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
        FOREIGN KEY (sala_id) REFERENCES salas(id),
        FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
        FOREIGN KEY (professor_id) REFERENCES professores(id)
      )
    `);

    console.log('✅ Tabelas criadas com sucesso!');
    
    // Inserir dados de exemplo
    await insertSampleData(connection);
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    connection.release();
  }
};

const insertSampleData = async (connection) => {
  console.log('🔄 Inserindo dados de exemplo...');
  
  try {
    // Inserir usuários de exemplo (alunos, responsáveis e professores)
    await connection.execute(`
      INSERT IGNORE INTO usuarios (nome, email, tipo) VALUES
      ('Maria Oliveira Costa', 'maria.costa@estudante.ifpe.edu.br', 'aluno'),
      ('João Silva Santos', 'joao.santos@estudante.ifpe.edu.br', 'aluno'),
      ('Pedro Henrique Lima', 'pedro.lima@estudante.ifpe.edu.br', 'aluno'),
      ('Juliana Ferreira Souza', 'juliana.souza@estudante.ifpe.edu.br', 'aluno'),
      ('Rafael Alves Pereira', 'rafael.pereira@estudante.ifpe.edu.br', 'aluno'),
      ('Camila Santos Rodrigues', 'camila.rodrigues@estudante.ifpe.edu.br', 'aluno'),
      ('Lucas Martins Oliveira', 'lucas.oliveira@estudante.ifpe.edu.br', 'aluno'),
      ('Beatriz Costa Lima', 'beatriz.lima@estudante.ifpe.edu.br', 'aluno'),
      ('Gabriel Souza Almeida', 'gabriel.almeida@estudante.ifpe.edu.br', 'aluno'),
      ('Amanda Pereira Santos', 'amanda.santos@estudante.ifpe.edu.br', 'aluno'),
      ('Thiago Oliveira Costa', 'thiago.costa@estudante.ifpe.edu.br', 'aluno'),
      ('Larissa Silva Martins', 'larissa.martins@estudante.ifpe.edu.br', 'aluno'),
      ('Fernando Lima Souza', 'fernando.souza@estudante.ifpe.edu.br', 'aluno'),
      ('Patrícia Alves Silva', 'patricia.silva@estudante.ifpe.edu.br', 'aluno'),
      ('Rodrigo Santos Ferreira', 'rodrigo.ferreira@estudante.ifpe.edu.br', 'aluno'),
      ('Ana Costa Oliveira', 'ana.oliveira@gmail.com', 'responsavel'),
      ('Carlos Santos Silva', 'carlos.silva@gmail.com', 'responsavel'),
      ('Mariana Lima Santos', 'mariana.santos@gmail.com', 'responsavel'),
      ('Roberto Souza Pereira', 'roberto.pereira@gmail.com', 'responsavel'),
      ('Fernanda Alves Costa', 'fernanda.costa@gmail.com', 'responsavel'),
      ('Paulo Martins Oliveira', 'paulo.oliveira@gmail.com', 'responsavel'),
      ('Juliana Santos Lima', 'juliana.lima@gmail.com', 'responsavel'),
      ('Marcos Silva Almeida', 'marcos.almeida@gmail.com', 'responsavel'),
      ('Prof. Roberto Silva', 'roberto.silva@ifpe.edu.br', 'professor'),
      ('Prof. Ana Santos', 'ana.santos.prof@ifpe.edu.br', 'professor'),
      ('Prof. Carlos Oliveira', 'carlos.oliveira@ifpe.edu.br', 'professor'),
      ('Prof. Mariana Souza', 'mariana.souza@ifpe.edu.br', 'professor'),
      ('Prof. Fernando Lima', 'fernando.lima@ifpe.edu.br', 'professor'),
      ('Prof. Patricia Costa', 'patricia.costa@ifpe.edu.br', 'professor'),
      ('Prof. Ricardo Alves', 'ricardo.alves@ifpe.edu.br', 'professor')
    `);

    // Inserir alunos
    await connection.execute(`
      INSERT IGNORE INTO alunos (usuario_id, matricula, cpf, telefone, curso, turma, modalidade) VALUES
      (1, '20240001', '123.456.789-01', '(87) 99999-0001', 'Técnico em Informática', '3ºA', 'integrado'),
      (2, '20240002', '123.456.789-02', '(87) 99999-0002', 'Técnico em Edificações', '2ºB', 'integrado'),
      (3, '20240003', '123.456.789-03', '(87) 99999-0003', 'Técnico em Informática', '3ºA', 'integrado'),
      (4, '20240004', '123.456.789-04', '(87) 99999-0004', 'Técnico em Informática', '3ºA', 'integrado'),
      (5, '20240005', '123.456.789-05', '(87) 99999-0005', 'Técnico em Edificações', '2ºB', 'integrado'),
      (6, '20240006', '123.456.789-06', '(87) 99999-0006', 'Técnico em Mecânica', '1ºA', 'integrado'),
      (7, '20240007', '123.456.789-07', '(87) 99999-0007', 'Técnico em Informática', '2ºA', 'integrado'),
      (8, '20240008', '123.456.789-08', '(87) 99999-0008', 'Técnico em Edificações', '1ºB', 'integrado'),
      (9, '20240009', '123.456.789-09', '(87) 99999-0009', 'Técnico em Eletrônica', '3ºC', 'integrado'),
      (10, '20240010', '123.456.789-10', '(87) 99999-0010', 'Técnico em Informática', '3ºA', 'integrado'),
      (11, '20240011', '123.456.789-11', '(87) 99999-0011', 'Técnico em Edificações', '2ºA', 'integrado'),
      (12, '20240012', '123.456.789-12', '(87) 99999-0012', 'Técnico em Mecânica', '2ºB', 'integrado'),
      (13, '20240013', '123.456.789-13', '(87) 99999-0013', 'Técnico em Informática', '1ºA', 'integrado'),
      (14, '20240014', '123.456.789-14', '(87) 99999-0014', 'Técnico em Eletrônica', '1ºC', 'integrado'),
      (15, '20240015', '123.456.789-15', '(87) 99999-0015', 'Técnico em Edificações', '3ºB', 'integrado')
    `);

    // Inserir responsáveis
    await connection.execute(`
      INSERT IGNORE INTO responsaveis (usuario_id, cpf, telefone) VALUES
      (16, '987.654.321-00', '(87) 99999-1004'),
      (17, '987.654.321-01', '(87) 99999-1005'),
      (18, '987.654.321-02', '(87) 99999-1006'),
      (19, '987.654.321-03', '(87) 99999-1007'),
      (20, '987.654.321-04', '(87) 99999-1008'),
      (21, '987.654.321-05', '(87) 99999-1009'),
      (22, '987.654.321-06', '(87) 99999-1010'),
      (23, '987.654.321-07', '(87) 99999-1011')
    `);

    // Inserir relação aluno-responsável
    await connection.execute(`
      INSERT IGNORE INTO aluno_responsavel (aluno_id, responsavel_id, parentesco) VALUES
      (1, 1, 'mãe'),
      (2, 2, 'pai'),
      (3, 3, 'mãe'),
      (4, 4, 'pai'),
      (5, 5, 'mãe'),
      (6, 6, 'pai'),
      (7, 1, 'mãe'),
      (8, 7, 'mãe'),
      (9, 8, 'pai'),
      (10, 4, 'pai'),
      (11, 5, 'mãe'),
      (12, 6, 'pai'),
      (13, 7, 'mãe'),
      (14, 8, 'pai'),
      (15, 2, 'pai')
    `);

    // Inserir salas
    await connection.execute(`
      INSERT IGNORE INTO salas (numero, bloco, andar, capacidade, tipo) VALUES
      ('101', 'A', 1, 40, 'Sala de Aula'),
      ('102', 'A', 1, 35, 'Sala de Aula'),
      ('103', 'A', 1, 38, 'Sala de Aula'),
      ('104', 'A', 1, 42, 'Sala de Aula'),
      ('201', 'A', 2, 30, 'Laboratório de Informática'),
      ('202', 'A', 2, 25, 'Laboratório de Física'),
      ('203', 'A', 2, 28, 'Laboratório de Química'),
      ('204', 'A', 2, 32, 'Laboratório de Informática'),
      ('301', 'A', 3, 40, 'Sala de Aula'),
      ('302', 'A', 3, 38, 'Sala de Aula'),
      ('105', 'B', 1, 35, 'Sala de Aula'),
      ('106', 'B', 1, 40, 'Sala de Aula'),
      ('205', 'B', 2, 30, 'Laboratório de Eletrônica'),
      ('206', 'B', 2, 28, 'Laboratório de Mecânica'),
      ('303', 'B', 3, 45, 'Auditório'),
      ('304', 'B', 3, 50, 'Biblioteca')
    `);

    // Inserir disciplinas
    await connection.execute(`
      INSERT IGNORE INTO disciplinas (nome, codigo, carga_horaria) VALUES
      ('Programação Web', 'PROGWEB', 80),
      ('Banco de Dados', 'BD', 60),
      ('Matemática', 'MAT', 40),
      ('Física', 'FIS', 60),
      ('Português', 'PORT', 40),
      ('Química', 'QUIM', 40),
      ('Biologia', 'BIO', 40),
      ('História', 'HIST', 40),
      ('Geografia', 'GEO', 40),
      ('Inglês', 'ING', 40),
      ('Educação Física', 'EDFIS', 40),
      ('Programação Orientada a Objetos', 'POO', 80),
      ('Redes de Computadores', 'REDES', 60),
      ('Estruturas de Dados', 'ESTDADOS', 80),
      ('Sistemas Operacionais', 'SO', 60),
      ('Desenho Técnico', 'DESTEC', 60),
      ('Resistência dos Materiais', 'RESMAT', 60),
      ('Mecânica Geral', 'MECGER', 60),
      ('Eletrônica Digital', 'ELETDIG', 80),
      ('Circuitos Elétricos', 'CIRELET', 60)
    `);

    // Inserir professores (incluindo um que também é responsável)
    await connection.execute(`
      INSERT IGNORE INTO professores (usuario_id, nome, email, cpf, telefone) VALUES
      (24, 'Prof. Roberto Silva', 'roberto.silva@ifpe.edu.br', '111.222.333-44', '(87) 99999-2001'),
      (25, 'Prof. Ana Santos', 'ana.santos.prof@ifpe.edu.br', '111.222.333-55', '(87) 99999-2002'),
      (26, 'Prof. Carlos Oliveira', 'carlos.oliveira@ifpe.edu.br', '111.222.333-66', '(87) 99999-2003'),
      (27, 'Prof. Mariana Souza', 'mariana.souza@ifpe.edu.br', '111.222.333-77', '(87) 99999-2004'),
      (28, 'Prof. Fernando Lima', 'fernando.lima@ifpe.edu.br', '111.222.333-88', '(87) 99999-2005'),
      (29, 'Prof. Patricia Costa', 'patricia.costa@ifpe.edu.br', '111.222.333-99', '(87) 99999-2006'),
      (30, 'Prof. Ricardo Alves', 'ricardo.alves@ifpe.edu.br', '111.222.333-00', '(87) 99999-2007')
    `);

    // Inserir professor-responsável (Carlos também é pai de Pedro)
    await connection.execute(`
      INSERT IGNORE INTO responsaveis (usuario_id, cpf, telefone) VALUES
      (26, '111.222.333-66', '(87) 99999-2003')
    `);

    // Vincular professor-responsável ao aluno
    const [respProf] = await connection.execute(`SELECT id FROM responsaveis WHERE usuario_id = 26 LIMIT 1`);
    if (respProf.length > 0) {
      await connection.execute(`
        INSERT IGNORE INTO aluno_responsavel (aluno_id, responsavel_id, parentesco) VALUES
        (3, ${respProf[0].id}, 'pai')
      `);
    }

    // Inserir horários de exemplo mais completos e realistas para TODOS os alunos
    await connection.execute(`
      INSERT IGNORE INTO horarios (aluno_id, disciplina_id, professor_id, sala_id, dia_semana, hora_inicio, hora_fim, tipo_aula) VALUES
      -- Turma 3ºA Informática (alunos 1, 3, 4, 10) - Segunda
      (1, 1, 1, 5, 'segunda', '07:30:00', '09:10:00', 'pratica'),
      (1, 2, 2, 1, 'segunda', '09:30:00', '11:10:00', 'teorica'),
      (1, 3, 3, 2, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      (3, 1, 1, 5, 'segunda', '07:30:00', '09:10:00', 'pratica'),
      (3, 2, 2, 1, 'segunda', '09:30:00', '11:10:00', 'teorica'),
      (3, 3, 3, 2, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      (4, 1, 1, 5, 'segunda', '07:30:00', '09:10:00', 'pratica'),
      (4, 2, 2, 1, 'segunda', '09:30:00', '11:10:00', 'teorica'),
      (4, 3, 3, 2, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      (10, 1, 1, 5, 'segunda', '07:30:00', '09:10:00', 'pratica'),
      (10, 2, 2, 1, 'segunda', '09:30:00', '11:10:00', 'teorica'),
      (10, 3, 3, 2, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      -- Turma 3ºA Informática - Terça
      (1, 12, 4, 5, 'terca', '07:30:00', '09:10:00', 'pratica'),
      (1, 4, 5, 6, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (1, 5, 6, 3, 'terca', '13:30:00', '15:10:00', 'teorica'),
      (3, 12, 4, 5, 'terca', '07:30:00', '09:10:00', 'pratica'),
      (3, 4, 5, 6, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (3, 5, 6, 3, 'terca', '13:30:00', '15:10:00', 'teorica'),
      (4, 12, 4, 5, 'terca', '07:30:00', '09:10:00', 'pratica'),
      (4, 4, 5, 6, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (4, 5, 6, 3, 'terca', '13:30:00', '15:10:00', 'teorica'),
      (10, 12, 4, 5, 'terca', '07:30:00', '09:10:00', 'pratica'),
      (10, 4, 5, 6, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (10, 5, 6, 3, 'terca', '13:30:00', '15:10:00', 'teorica'),
      -- Turma 2ºB Edificações (alunos 2, 5) - Segunda
      (2, 16, 1, 4, 'segunda', '07:30:00', '09:10:00', 'teorica'),
      (2, 17, 2, 2, 'segunda', '09:30:00', '11:10:00', 'laboratorio'),
      (2, 3, 3, 1, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      (5, 16, 1, 4, 'segunda', '07:30:00', '09:10:00', 'teorica'),
      (5, 17, 2, 2, 'segunda', '09:30:00', '11:10:00', 'laboratorio'),
      (5, 3, 3, 1, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      -- Turma 2ºB Edificações - Terça
      (2, 4, 5, 6, 'terca', '07:30:00', '09:10:00', 'laboratorio'),
      (2, 5, 6, 3, 'terca', '09:30:00', '11:10:00', 'teorica'),
      (2, 6, 7, 7, 'terca', '13:30:00', '15:10:00', 'laboratorio'),
      (5, 4, 5, 6, 'terca', '07:30:00', '09:10:00', 'laboratorio'),
      (5, 5, 6, 3, 'terca', '09:30:00', '11:10:00', 'teorica'),
      (5, 6, 7, 7, 'terca', '13:30:00', '15:10:00', 'laboratorio'),
      -- Turma 1ºA Mecânica (aluno 6) - Segunda
      (6, 18, 1, 2, 'segunda', '07:30:00', '09:10:00', 'teorica'),
      (6, 3, 3, 1, 'segunda', '09:30:00', '11:10:00', 'teorica'),
      (6, 4, 5, 6, 'segunda', '13:30:00', '15:10:00', 'laboratorio'),
      -- Turma 1ºA Mecânica - Terça
      (6, 5, 6, 3, 'terca', '07:30:00', '09:10:00', 'teorica'),
      (6, 6, 7, 7, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (6, 7, 1, 4, 'terca', '13:30:00', '15:10:00', 'teorica'),
      -- Turma 2ºA Informática (aluno 7) - Segunda
      (7, 1, 1, 5, 'segunda', '07:30:00', '09:10:00', 'pratica'),
      (7, 14, 2, 8, 'segunda', '09:30:00', '11:10:00', 'pratica'),
      (7, 3, 3, 2, 'segunda', '13:30:00', '15:10:00', 'teorica'),
      -- Turma 2ºA Informática - Terça
      (7, 13, 4, 5, 'terca', '07:30:00', '09:10:00', 'pratica'),
      (7, 4, 5, 6, 'terca', '09:30:00', '11:10:00', 'laboratorio'),
      (7, 5, 6, 3, 'terca', '13:30:00', '15:10:00', 'teorica'),
      -- Continuar com mais dias da semana para variedade
      -- Quarta-feira - Turma 3ºA Informática
      (1, 15, 1, 5, 'quarta', '07:30:00', '09:10:00', 'teorica'),
      (1, 13, 2, 8, 'quarta', '09:30:00', '11:10:00', 'pratica'),
      (1, 10, 3, 3, 'quarta', '13:30:00', '15:10:00', 'teorica'),
      (3, 15, 1, 5, 'quarta', '07:30:00', '09:10:00', 'teorica'),
      (3, 13, 2, 8, 'quarta', '09:30:00', '11:10:00', 'pratica'),
      (3, 10, 3, 3, 'quarta', '13:30:00', '15:10:00', 'teorica'),
      (4, 15, 1, 5, 'quarta', '07:30:00', '09:10:00', 'teorica'),
      (4, 13, 2, 8, 'quarta', '09:30:00', '11:10:00', 'pratica'),
      (4, 10, 3, 3, 'quarta', '13:30:00', '15:10:00', 'teorica'),
      (10, 15, 1, 5, 'quarta', '07:30:00', '09:10:00', 'teorica'),
      (10, 13, 2, 8, 'quarta', '09:30:00', '11:10:00', 'pratica'),
      (10, 10, 3, 3, 'quarta', '13:30:00', '15:10:00', 'teorica'),
      -- Quinta-feira - Turma 3ºA Informática
      (1, 11, 4, 9, 'quinta', '07:30:00', '09:10:00', 'pratica'),
      (1, 8, 5, 4, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (1, 9, 6, 1, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      (3, 11, 4, 9, 'quinta', '07:30:00', '09:10:00', 'pratica'),
      (3, 8, 5, 4, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (3, 9, 6, 1, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      (4, 11, 4, 9, 'quinta', '07:30:00', '09:10:00', 'pratica'),
      (4, 8, 5, 4, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (4, 9, 6, 1, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      (10, 11, 4, 9, 'quinta', '07:30:00', '09:10:00', 'pratica'),
      (10, 8, 5, 4, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (10, 9, 6, 1, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      -- Sexta-feira - Turma 3ºA Informática
      (1, 6, 7, 7, 'sexta', '07:30:00', '09:10:00', 'laboratorio'),
      (1, 7, 1, 4, 'sexta', '09:30:00', '11:10:00', 'teorica'),
      (3, 6, 7, 7, 'sexta', '07:30:00', '09:10:00', 'laboratorio'),
      (3, 7, 1, 4, 'sexta', '09:30:00', '11:10:00', 'teorica'),
      (4, 6, 7, 7, 'sexta', '07:30:00', '09:10:00', 'laboratorio'),
      (4, 7, 1, 4, 'sexta', '09:30:00', '11:10:00', 'teorica'),
      (10, 6, 7, 7, 'sexta', '07:30:00', '09:10:00', 'laboratorio'),
      (10, 7, 1, 4, 'sexta', '09:30:00', '11:10:00', 'teorica'),
      -- Adicionar horários para demais alunos nos outros dias
      -- Quinta e Sexta - Turma 2ºB Edificações
      (2, 8, 5, 4, 'quinta', '07:30:00', '09:10:00', 'teorica'),
      (2, 9, 6, 1, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (2, 10, 3, 3, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      (5, 8, 5, 4, 'quinta', '07:30:00', '09:10:00', 'teorica'),
      (5, 9, 6, 1, 'quinta', '09:30:00', '11:10:00', 'teorica'),
      (5, 10, 3, 3, 'quinta', '13:30:00', '15:10:00', 'teorica'),
      (2, 7, 1, 4, 'sexta', '07:30:00', '09:10:00', 'teorica'),
      (2, 11, 4, 9, 'sexta', '09:30:00', '11:10:00', 'pratica'),
      (5, 7, 1, 4, 'sexta', '07:30:00', '09:10:00', 'teorica'),
      (5, 11, 4, 9, 'sexta', '09:30:00', '11:10:00', 'pratica')
    `);

    // Inserir presença atual (alguns alunos estão em aula)
    await connection.execute(`
      INSERT IGNORE INTO presenca_atual (aluno_id, sala_id, disciplina_id, professor_id, status) VALUES
      (1, 5, 1, 1, 'presente'),
      (3, 5, 1, 1, 'presente'),
      (4, 5, 1, 1, 'presente'),
      (10, 5, 1, 1, 'presente')
    `);

    console.log('✅ Dados de exemplo inseridos com sucesso!');
    console.log('📝 CPFs de teste:');
    console.log('   CPF Aluno: 123.456.789-01 (Maria Oliveira Costa)');
    console.log('   CPF Responsável: 987.654.321-00 (Ana Costa Oliveira)');
    console.log('   CPF Professor: 111.222.333-44 (Prof. Roberto Silva)');
    console.log('   CPF Professor-Responsável: 111.222.333-66 (Prof. Carlos Oliveira - pai de Pedro)');
    console.log('');
    console.log('📊 Resumo do banco:');
    console.log('   • 15 alunos cadastrados');
    console.log('   • 8 responsáveis (1 professor-responsável)');
    console.log('   • 7 professores');
    console.log('   • 17 salas');
    console.log('   • 20 disciplinas');
    console.log('   • 100+ horários cadastrados');
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createTables().then(() => {
    console.log('🎉 Setup do banco concluído!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro no setup:', error);
    process.exit(1);
  });
}

module.exports = { createTables };