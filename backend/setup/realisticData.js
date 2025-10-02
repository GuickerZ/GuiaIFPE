const { pool } = require('../config/database');

/**
 * Script para popular o banco com dados REALISTAS de produção
 * Baseado na estrutura real do IFPE Garanhuns
 */
const insertRealisticData = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🚀 Inserindo dados REALISTAS de produção IFPE Garanhuns...\n');

    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE presenca_atual');
    await connection.execute('TRUNCATE TABLE horarios');
    await connection.execute('TRUNCATE TABLE aluno_responsavel');
    await connection.execute('TRUNCATE TABLE alunos');
    await connection.execute('TRUNCATE TABLE responsaveis');
    await connection.execute('TRUNCATE TABLE professores');
    await connection.execute('TRUNCATE TABLE disciplinas');
    await connection.execute('TRUNCATE TABLE salas');
    await connection.execute('TRUNCATE TABLE usuarios');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Dados limpos\n');

    // 1. USUÁRIOS
    console.log('👥 Inserindo usuários...');
    
    const usuarios = [
      // === ALUNOS - INFO3A (Informática Integrado - 3º Ano) ===
      { nome: 'Amanda Cristina Silva', email: 'amanda.silva@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'Bruno Henrique Santos', email: 'bruno.santos@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'Carolina Ferreira Lima', email: 'carolina.lima@aluno.ifpe.edu.br', tipo: 'aluno' },
      
      // === ALUNOS - EDIF2B (Edificações Integrado - 2º Ano) ===
      { nome: 'Daniel Oliveira Costa', email: 'daniel.costa@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'Eduarda Martins Pereira', email: 'eduarda.pereira@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'Felipe Rodrigues Souza', email: 'felipe.souza@aluno.ifpe.edu.br', tipo: 'aluno' },
      
      // === ALUNOS - MEC4C (Mecânica Subsequente - 4º Módulo) ===
      { nome: 'Gabriela Alves Nascimento', email: 'gabriela.nascimento@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'Henrique Silva Barbosa', email: 'henrique.barbosa@aluno.ifpe.edu.br', tipo: 'aluno' },
      
      // === ALUNOS - INFO1A (Informática Integrado - 1º Ano) ===
      { nome: 'Isabela Costa Mendes', email: 'isabela.mendes@aluno.ifpe.edu.br', tipo: 'aluno' },
      { nome: 'João Pedro Ferreira', email: 'joao.ferreira@aluno.ifpe.edu.br', tipo: 'aluno' },
      
      // === RESPONSÁVEIS (nomes realistas de pais/mães) ===
      { nome: 'Ana Paula Silva Rodrigues', email: 'ana.rodrigues@gmail.com', tipo: 'responsavel' },
      { nome: 'Carlos Eduardo Santos', email: 'carlos.santos@outlook.com', tipo: 'responsavel' },
      { nome: 'Débora Ferreira Lima', email: 'debora.lima@hotmail.com', tipo: 'responsavel' },
      { nome: 'Eduardo Oliveira Costa', email: 'eduardo.costa@gmail.com', tipo: 'responsavel' },
      { nome: 'Fernanda Martins Pereira', email: 'fernanda.pereira@yahoo.com', tipo: 'responsavel' },
      { nome: 'Gustavo Rodrigues Souza', email: 'gustavo.souza@gmail.com', tipo: 'responsavel' },
      { nome: 'Helena Alves Nascimento', email: 'helena.nascimento@outlook.com', tipo: 'responsavel' },
      { nome: 'Igor Silva Barbosa', email: 'igor.barbosa@gmail.com', tipo: 'responsavel' },
      { nome: 'Juliana Costa Mendes', email: 'juliana.mendes@hotmail.com', tipo: 'responsavel' },
      
      // === PROFESSORES (nomes com titulação) ===
      { nome: 'Prof. Dr. Roberto Carlos Silva', email: 'roberto.silva@ifpe.edu.br', tipo: 'professor' },
      { nome: 'Profa. Ma. Carla Regina Mendes', email: 'carla.mendes@ifpe.edu.br', tipo: 'professor' },
      { nome: 'Prof. Esp. José Antônio Andrade', email: 'jose.andrade@ifpe.edu.br', tipo: 'professor' },
      { nome: 'Profa. Dra. Maria Eduarda Santos', email: 'maria.santos@ifpe.edu.br', tipo: 'professor' },
      { nome: 'Prof. Me. Fernando Luís Oliveira', email: 'fernando.oliveira@ifpe.edu.br', tipo: 'professor' },
      { nome: 'Profa. Esp. Patrícia Sousa Lima', email: 'patricia.lima@ifpe.edu.br', tipo: 'professor' },
      
      // === PROFESSOR-RESPONSÁVEL (Professor que também é pai de aluno) ===
      { nome: 'Prof. Me. Lucas Pedro Ferreira', email: 'lucas.ferreira@ifpe.edu.br', tipo: 'professor' }, // Também será responsável por João Pedro
    ];

    for (const user of usuarios) {
      await connection.execute(
        'INSERT INTO usuarios (nome, email, tipo, ativo) VALUES (?, ?, ?, 1)',
        [user.nome, user.email, user.tipo]
      );
    }
    console.log(`✅ ${usuarios.length} usuários inseridos\n`);

    // 2. SALAS (sem Bloco A - Biblioteca ao invés)
    console.log('🏫 Inserindo salas...');
    
    const salas = [
      // Biblioteca (ao invés do Bloco A)
      { numero: 'BIB', bloco: 'Biblioteca', andar: 1, capacidade: 150, tipo: 'Biblioteca' },
      
      // Bloco B - Salas de Aula
      { numero: 'B101', bloco: 'B', andar: 1, capacidade: 40, tipo: 'Sala de Aula' },
      { numero: 'B102', bloco: 'B', andar: 1, capacidade: 40, tipo: 'Sala de Aula' },
      { numero: 'B103', bloco: 'B', andar: 1, capacidade: 40, tipo: 'Sala de Aula' },
      { numero: 'B104', bloco: 'B', andar: 1, capacidade: 40, tipo: 'Sala de Aula' },
      { numero: 'B201', bloco: 'B', andar: 2, capacidade: 35, tipo: 'Sala de Aula' },
      { numero: 'B202', bloco: 'B', andar: 2, capacidade: 35, tipo: 'Sala de Aula' },
      { numero: 'B203', bloco: 'B', andar: 2, capacidade: 35, tipo: 'Sala de Aula' },
      
      // Bloco C - Laboratórios de Informática
      { numero: 'C101', bloco: 'C', andar: 1, capacidade: 30, tipo: 'Laboratório de Informática' },
      { numero: 'C102', bloco: 'C', andar: 1, capacidade: 30, tipo: 'Laboratório de Informática' },
      { numero: 'C201', bloco: 'C', andar: 2, capacidade: 25, tipo: 'Laboratório de Informática' },
      
      // Bloco D - Laboratórios de Ciências
      { numero: 'D101', bloco: 'D', andar: 1, capacidade: 25, tipo: 'Laboratório de Física' },
      { numero: 'D102', bloco: 'D', andar: 1, capacidade: 25, tipo: 'Laboratório de Química' },
      { numero: 'D103', bloco: 'D', andar: 1, capacidade: 25, tipo: 'Laboratório de Biologia' },
      
      // Bloco E - Oficinas
      { numero: 'E101', bloco: 'E', andar: 1, capacidade: 20, tipo: 'Oficina de Mecânica' },
      { numero: 'E102', bloco: 'E', andar: 1, capacidade: 20, tipo: 'Oficina de Eletrotécnica' },
      { numero: 'E103', bloco: 'E', andar: 1, capacidade: 20, tipo: 'Oficina de Construção Civil' },
      
      // Bloco F - Auditórios e Salas Especiais
      { numero: 'F101', bloco: 'F', andar: 1, capacidade: 100, tipo: 'Auditório' },
      { numero: 'F201', bloco: 'F', andar: 2, capacidade: 50, tipo: 'Sala de Reuniões' },
    ];

    for (const sala of salas) {
      await connection.execute(
        'INSERT INTO salas (numero, bloco, andar, capacidade, tipo, ativa) VALUES (?, ?, ?, ?, ?, 1)',
        [sala.numero, sala.bloco, sala.andar, sala.capacidade, sala.tipo]
      );
    }
    console.log(`✅ ${salas.length} salas inseridas\n`);

    // 3. DISCIPLINAS
    console.log('📚 Inserindo disciplinas...');
    
    const disciplinas = [
      // Informática
      { nome: 'Programação Web', codigo: 'INFO301', carga_horaria: 80 },
      { nome: 'Banco de Dados', codigo: 'INFO302', carga_horaria: 80 },
      { nome: 'Desenvolvimento Mobile', codigo: 'INFO303', carga_horaria: 60 },
      
      // Edificações
      { nome: 'Desenho Técnico', codigo: 'EDIF201', carga_horaria: 60 },
      { nome: 'Materiais de Construção', codigo: 'EDIF202', carga_horaria: 80 },
      { nome: 'Topografia', codigo: 'EDIF203', carga_horaria: 60 },
      
      // Mecânica
      { nome: 'Mecânica Geral', codigo: 'MEC401', carga_horaria: 80 },
      { nome: 'Processos de Fabricação', codigo: 'MEC402', carga_horaria: 60 },
      
      // Gerais
      { nome: 'Matemática', codigo: 'MAT101', carga_horaria: 80 },
      { nome: 'Física', codigo: 'FIS101', carga_horaria: 80 },
      { nome: 'Português', codigo: 'PORT101', carga_horaria: 60 },
      { nome: 'Inglês', codigo: 'ING101', carga_horaria: 40 },
      { nome: 'História', codigo: 'HIST101', carga_horaria: 40 },
      { nome: 'Biologia', codigo: 'BIO101', carga_horaria: 60 },
    ];

    for (const disc of disciplinas) {
      await connection.execute(
        'INSERT INTO disciplinas (nome, codigo, carga_horaria) VALUES (?, ?, ?)',
        [disc.nome, disc.codigo, disc.carga_horaria]
      );
    }
    console.log(`✅ ${disciplinas.length} disciplinas inseridas\n`);

    // 4. PROFESSORES (incluindo professor-responsável)
    console.log('👨‍🏫 Inserindo professores...');
    
    const professores = [
      { usuario_id: 20, nome: 'Prof. Dr. Roberto Carlos Silva', email: 'roberto.silva@ifpe.edu.br', cpf: '111.222.333-44', telefone: '(87) 98888-1001' },
      { usuario_id: 21, nome: 'Profa. Ma. Carla Regina Mendes', email: 'carla.mendes@ifpe.edu.br', cpf: '222.333.444-55', telefone: '(87) 98888-1002' },
      { usuario_id: 22, nome: 'Prof. Esp. José Antônio Andrade', email: 'jose.andrade@ifpe.edu.br', cpf: '333.444.555-66', telefone: '(87) 98888-1003' },
      { usuario_id: 23, nome: 'Profa. Dra. Maria Eduarda Santos', email: 'maria.santos@ifpe.edu.br', cpf: '444.555.666-77', telefone: '(87) 98888-1004' },
      { usuario_id: 24, nome: 'Prof. Me. Fernando Luís Oliveira', email: 'fernando.oliveira@ifpe.edu.br', cpf: '555.666.777-88', telefone: '(87) 98888-1005' },
      { usuario_id: 25, nome: 'Profa. Esp. Patrícia Sousa Lima', email: 'patricia.lima@ifpe.edu.br', cpf: '666.777.888-99', telefone: '(87) 98888-1006' },
      { usuario_id: 26, nome: 'Prof. Me. Lucas Pedro Ferreira', email: 'lucas.ferreira@ifpe.edu.br', cpf: '777.888.999-00', telefone: '(87) 98888-1007' },
    ];

    for (const prof of professores) {
      await connection.execute(
        'INSERT INTO professores (usuario_id, nome, email, cpf, telefone) VALUES (?, ?, ?, ?, ?)',
        [prof.usuario_id, prof.nome, prof.email, prof.cpf, prof.telefone]
      );
    }
    console.log(`✅ ${professores.length} professores inseridos\n`);

    // 5. ALUNOS
    console.log('🎓 Inserindo alunos...');
    
    const alunos = [
      // INFO3A
      { usuario_id: 1, matricula: '20220001', cpf: '100.200.300-01', telefone: '(87) 99000-0001', curso: 'Informática', turma: 'INFO3A', modalidade: 'integrado' },
      { usuario_id: 2, matricula: '20220002', cpf: '100.200.300-02', telefone: '(87) 99000-0002', curso: 'Informática', turma: 'INFO3A', modalidade: 'integrado' },
      { usuario_id: 3, matricula: '20220003', cpf: '100.200.300-03', telefone: '(87) 99000-0003', curso: 'Informática', turma: 'INFO3A', modalidade: 'integrado' },
      
      // EDIF2B
      { usuario_id: 4, matricula: '20230001', cpf: '100.200.300-04', telefone: '(87) 99000-0004', curso: 'Edificações', turma: 'EDIF2B', modalidade: 'integrado' },
      { usuario_id: 5, matricula: '20230002', cpf: '100.200.300-05', telefone: '(87) 99000-0005', curso: 'Edificações', turma: 'EDIF2B', modalidade: 'integrado' },
      { usuario_id: 6, matricula: '20230003', cpf: '100.200.300-06', telefone: '(87) 99000-0006', curso: 'Edificações', turma: 'EDIF2B', modalidade: 'integrado' },
      
      // MEC4C
      { usuario_id: 7, matricula: '20240001', cpf: '100.200.300-07', telefone: '(87) 99000-0007', curso: 'Mecânica', turma: 'MEC4C', modalidade: 'subsequente' },
      { usuario_id: 8, matricula: '20240002', cpf: '100.200.300-08', telefone: '(87) 99000-0008', curso: 'Mecânica', turma: 'MEC4C', modalidade: 'subsequente' },
      
      // INFO1A
      { usuario_id: 9, matricula: '20250001', cpf: '100.200.300-09', telefone: '(87) 99000-0009', curso: 'Informática', turma: 'INFO1A', modalidade: 'integrado' },
      { usuario_id: 10, matricula: '20250002', cpf: '100.200.300-10', telefone: '(87) 99000-0010', curso: 'Informática', turma: 'INFO1A', modalidade: 'integrado' },
    ];

    for (const aluno of alunos) {
      await connection.execute(
        'INSERT INTO alunos (usuario_id, matricula, cpf, telefone, curso, turma, modalidade) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [aluno.usuario_id, aluno.matricula, aluno.cpf, aluno.telefone, aluno.curso, aluno.turma, aluno.modalidade]
      );
    }
    console.log(`✅ ${alunos.length} alunos inseridos\n`);

    // 6. RESPONSÁVEIS (incluindo professor-responsável)
    console.log('👪 Inserindo responsáveis...');
    
    const responsaveis = [
      { usuario_id: 11, cpf: '200.300.400-01', telefone: '(87) 98000-0001' },
      { usuario_id: 12, cpf: '200.300.400-02', telefone: '(87) 98000-0002' },
      { usuario_id: 13, cpf: '200.300.400-03', telefone: '(87) 98000-0003' },
      { usuario_id: 14, cpf: '200.300.400-04', telefone: '(87) 98000-0004' },
      { usuario_id: 15, cpf: '200.300.400-05', telefone: '(87) 98000-0005' },
      { usuario_id: 16, cpf: '200.300.400-06', telefone: '(87) 98000-0006' },
      { usuario_id: 17, cpf: '200.300.400-07', telefone: '(87) 98000-0007' },
      { usuario_id: 18, cpf: '200.300.400-08', telefone: '(87) 98000-0008' },
      { usuario_id: 19, cpf: '200.300.400-09', telefone: '(87) 98000-0009' },
      // Professor Lucas também é responsável (pai de João Pedro - aluno id 10)
      { usuario_id: 26, cpf: '777.888.999-00', telefone: '(87) 98888-1007' },
    ];

    for (const resp of responsaveis) {
      await connection.execute(
        'INSERT INTO responsaveis (usuario_id, cpf, telefone) VALUES (?, ?, ?)',
        [resp.usuario_id, resp.cpf, resp.telefone]
      );
    }
    console.log(`✅ ${responsaveis.length} responsáveis inseridos\n`);

    // 7. VÍNCULOS ALUNO-RESPONSÁVEL
    console.log('🔗 Criando vínculos aluno-responsável...');
    
    const vinculos = [
      { responsavel_id: 1, aluno_id: 1, parentesco: 'Mãe' },
      { responsavel_id: 2, aluno_id: 2, parentesco: 'Pai' },
      { responsavel_id: 3, aluno_id: 3, parentesco: 'Mãe' },
      { responsavel_id: 4, aluno_id: 4, parentesco: 'Pai' },
      { responsavel_id: 5, aluno_id: 5, parentesco: 'Mãe' },
      { responsavel_id: 6, aluno_id: 6, parentesco: 'Pai' },
      { responsavel_id: 7, aluno_id: 7, parentesco: 'Mãe' },
      { responsavel_id: 8, aluno_id: 8, parentesco: 'Pai' },
      { responsavel_id: 9, aluno_id: 9, parentesco: 'Mãe' },
      { responsavel_id: 10, aluno_id: 10, parentesco: 'Pai' }, // Professor Lucas é pai de João Pedro
    ];

    for (const vinculo of vinculos) {
      await connection.execute(
        'INSERT INTO aluno_responsavel (responsavel_id, aluno_id, parentesco) VALUES (?, ?, ?)',
        [vinculo.responsavel_id, vinculo.aluno_id, vinculo.parentesco]
      );
    }
    console.log(`✅ ${vinculos.length} vínculos criados\n`);

    // 8. HORÁRIOS COMPLETOS
    console.log('📅 Criando horários de aulas completos...');
    
    const horarios = [
      // ========== INFO3A (Amanda, Bruno, Carolina) - SEGUNDA-FEIRA ==========
      { professor_id: 1, disciplina_id: 1, aluno_id: 1, sala_id: 9, dia_semana: 'segunda', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C101 Lab Info
      { professor_id: 1, disciplina_id: 1, aluno_id: 2, sala_id: 9, dia_semana: 'segunda', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      { professor_id: 1, disciplina_id: 1, aluno_id: 3, sala_id: 9, dia_semana: 'segunda', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 5, disciplina_id: 9, aluno_id: 1, sala_id: 2, dia_semana: 'segunda', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B101
      { professor_id: 5, disciplina_id: 9, aluno_id: 2, sala_id: 2, dia_semana: 'segunda', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      { professor_id: 5, disciplina_id: 9, aluno_id: 3, sala_id: 2, dia_semana: 'segunda', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      
      { professor_id: 6, disciplina_id: 11, aluno_id: 1, sala_id: 3, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },  // B102
      { professor_id: 6, disciplina_id: 11, aluno_id: 2, sala_id: 3, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },
      { professor_id: 6, disciplina_id: 11, aluno_id: 3, sala_id: 3, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO3A - TERÇA-FEIRA ==========
      { professor_id: 2, disciplina_id: 2, aluno_id: 1, sala_id: 10, dia_semana: 'terca', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C102 Lab Info
      { professor_id: 2, disciplina_id: 2, aluno_id: 2, sala_id: 10, dia_semana: 'terca', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      { professor_id: 2, disciplina_id: 2, aluno_id: 3, sala_id: 10, dia_semana: 'terca', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 4, disciplina_id: 10, aluno_id: 1, sala_id: 12, dia_semana: 'terca', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },  // D101 Lab Física
      { professor_id: 4, disciplina_id: 10, aluno_id: 2, sala_id: 12, dia_semana: 'terca', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },
      { professor_id: 4, disciplina_id: 10, aluno_id: 3, sala_id: 12, dia_semana: 'terca', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 12, aluno_id: 1, sala_id: 4, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },  // B103
      { professor_id: 6, disciplina_id: 12, aluno_id: 2, sala_id: 4, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },
      { professor_id: 6, disciplina_id: 12, aluno_id: 3, sala_id: 4, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO3A - QUARTA-FEIRA ==========
      { professor_id: 1, disciplina_id: 3, aluno_id: 1, sala_id: 11, dia_semana: 'quarta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C201 Lab Info
      { professor_id: 1, disciplina_id: 3, aluno_id: 2, sala_id: 11, dia_semana: 'quarta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      { professor_id: 1, disciplina_id: 3, aluno_id: 3, sala_id: 11, dia_semana: 'quarta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 5, disciplina_id: 9, aluno_id: 1, sala_id: 2, dia_semana: 'quarta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B101
      { professor_id: 5, disciplina_id: 9, aluno_id: 2, sala_id: 2, dia_semana: 'quarta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      { professor_id: 5, disciplina_id: 9, aluno_id: 3, sala_id: 2, dia_semana: 'quarta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO3A - QUINTA-FEIRA ==========
      { professor_id: 2, disciplina_id: 2, aluno_id: 1, sala_id: 10, dia_semana: 'quinta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C102 Lab Info
      { professor_id: 2, disciplina_id: 2, aluno_id: 2, sala_id: 10, dia_semana: 'quinta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      { professor_id: 2, disciplina_id: 2, aluno_id: 3, sala_id: 10, dia_semana: 'quinta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 13, aluno_id: 1, sala_id: 5, dia_semana: 'quinta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B104
      { professor_id: 6, disciplina_id: 13, aluno_id: 2, sala_id: 5, dia_semana: 'quinta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      { professor_id: 6, disciplina_id: 13, aluno_id: 3, sala_id: 5, dia_semana: 'quinta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO3A - SEXTA-FEIRA ==========
      { professor_id: 1, disciplina_id: 1, aluno_id: 1, sala_id: 9, dia_semana: 'sexta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C101 Lab Info
      { professor_id: 1, disciplina_id: 1, aluno_id: 2, sala_id: 9, dia_semana: 'sexta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      { professor_id: 1, disciplina_id: 1, aluno_id: 3, sala_id: 9, dia_semana: 'sexta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 4, disciplina_id: 14, aluno_id: 1, sala_id: 14, dia_semana: 'sexta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },  // D103 Lab Biologia
      { professor_id: 4, disciplina_id: 14, aluno_id: 2, sala_id: 14, dia_semana: 'sexta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },
      { professor_id: 4, disciplina_id: 14, aluno_id: 3, sala_id: 14, dia_semana: 'sexta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },
      
      // ========== EDIF2B (Daniel, Eduarda, Felipe) - SEGUNDA-FEIRA ==========
      { professor_id: 3, disciplina_id: 4, aluno_id: 4, sala_id: 6, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },  // B201
      { professor_id: 3, disciplina_id: 4, aluno_id: 5, sala_id: 6, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      { professor_id: 3, disciplina_id: 4, aluno_id: 6, sala_id: 6, dia_semana: 'segunda', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 5, disciplina_id: 9, aluno_id: 4, sala_id: 7, dia_semana: 'segunda', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },  // B202
      { professor_id: 5, disciplina_id: 9, aluno_id: 5, sala_id: 7, dia_semana: 'segunda', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      { professor_id: 5, disciplina_id: 9, aluno_id: 6, sala_id: 7, dia_semana: 'segunda', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      
      // ========== EDIF2B - TERÇA-FEIRA ==========
      { professor_id: 3, disciplina_id: 5, aluno_id: 4, sala_id: 17, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },  // E103 Oficina Construção
      { professor_id: 3, disciplina_id: 5, aluno_id: 5, sala_id: 17, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      { professor_id: 3, disciplina_id: 5, aluno_id: 6, sala_id: 17, dia_semana: 'terca', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 11, aluno_id: 4, sala_id: 8, dia_semana: 'terca', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },  // B203
      { professor_id: 6, disciplina_id: 11, aluno_id: 5, sala_id: 8, dia_semana: 'terca', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      { professor_id: 6, disciplina_id: 11, aluno_id: 6, sala_id: 8, dia_semana: 'terca', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      
      // ========== EDIF2B - QUARTA-FEIRA ==========
      { professor_id: 3, disciplina_id: 6, aluno_id: 4, sala_id: 6, dia_semana: 'quarta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },  // B201
      { professor_id: 3, disciplina_id: 6, aluno_id: 5, sala_id: 6, dia_semana: 'quarta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      { professor_id: 3, disciplina_id: 6, aluno_id: 6, sala_id: 6, dia_semana: 'quarta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 4, disciplina_id: 10, aluno_id: 4, sala_id: 12, dia_semana: 'quarta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'pratica' },  // D101 Lab Física
      { professor_id: 4, disciplina_id: 10, aluno_id: 5, sala_id: 12, dia_semana: 'quarta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'pratica' },
      { professor_id: 4, disciplina_id: 10, aluno_id: 6, sala_id: 12, dia_semana: 'quarta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'pratica' },
      
      // ========== EDIF2B - QUINTA-FEIRA ==========
      { professor_id: 3, disciplina_id: 4, aluno_id: 4, sala_id: 6, dia_semana: 'quinta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },  // B201
      { professor_id: 3, disciplina_id: 4, aluno_id: 5, sala_id: 6, dia_semana: 'quinta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      { professor_id: 3, disciplina_id: 4, aluno_id: 6, sala_id: 6, dia_semana: 'quinta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 13, aluno_id: 4, sala_id: 7, dia_semana: 'quinta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },  // B202
      { professor_id: 6, disciplina_id: 13, aluno_id: 5, sala_id: 7, dia_semana: 'quinta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },  // B202
      { professor_id: 6, disciplina_id: 13, aluno_id: 6, sala_id: 7, dia_semana: 'quinta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      
      // ========== EDIF2B - SEXTA-FEIRA ==========
      { professor_id: 3, disciplina_id: 5, aluno_id: 4, sala_id: 17, dia_semana: 'sexta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },  // E103 Oficina Construção
      { professor_id: 3, disciplina_id: 5, aluno_id: 5, sala_id: 17, dia_semana: 'sexta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      { professor_id: 3, disciplina_id: 5, aluno_id: 6, sala_id: 17, dia_semana: 'sexta', hora_inicio: '13:30:00', hora_fim: '15:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 5, disciplina_id: 9, aluno_id: 4, sala_id: 6, dia_semana: 'sexta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },  // B201
      { professor_id: 5, disciplina_id: 9, aluno_id: 5, sala_id: 6, dia_semana: 'sexta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      { professor_id: 5, disciplina_id: 9, aluno_id: 6, sala_id: 6, dia_semana: 'sexta', hora_inicio: '15:30:00', hora_fim: '17:10:00', tipo_aula: 'teorica' },
      
      // ========== MEC4C (Gabriela, Henrique) - SEGUNDA-FEIRA ==========
      { professor_id: 4, disciplina_id: 7, aluno_id: 7, sala_id: 15, dia_semana: 'segunda', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },  // E101 Oficina Mecânica
      { professor_id: 4, disciplina_id: 7, aluno_id: 8, sala_id: 15, dia_semana: 'segunda', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },
      
      { professor_id: 4, disciplina_id: 8, aluno_id: 7, sala_id: 15, dia_semana: 'segunda', hora_inicio: '20:50:00', hora_fim: '22:30:00', tipo_aula: 'pratica' },  // E101 Oficina Mecânica
      { professor_id: 4, disciplina_id: 8, aluno_id: 8, sala_id: 15, dia_semana: 'segunda', hora_inicio: '20:50:00', hora_fim: '22:30:00', tipo_aula: 'pratica' },
      
      // ========== MEC4C - TERÇA-FEIRA ==========
      { professor_id: 5, disciplina_id: 9, aluno_id: 7, sala_id: 5, dia_semana: 'terca', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },  // B104
      { professor_id: 5, disciplina_id: 9, aluno_id: 8, sala_id: 5, dia_semana: 'terca', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },
      
      // ========== MEC4C - QUARTA-FEIRA ==========
      { professor_id: 4, disciplina_id: 7, aluno_id: 7, sala_id: 15, dia_semana: 'quarta', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },  // E101 Oficina Mecânica
      { professor_id: 4, disciplina_id: 7, aluno_id: 8, sala_id: 15, dia_semana: 'quarta', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },
      
      { professor_id: 4, disciplina_id: 8, aluno_id: 7, sala_id: 15, dia_semana: 'quarta', hora_inicio: '20:50:00', hora_fim: '22:30:00', tipo_aula: 'pratica' },  // E101 Oficina Mecânica
      { professor_id: 4, disciplina_id: 8, aluno_id: 8, sala_id: 15, dia_semana: 'quarta', hora_inicio: '20:50:00', hora_fim: '22:30:00', tipo_aula: 'pratica' },
      
      // ========== MEC4C - QUINTA-FEIRA ==========
      { professor_id: 5, disciplina_id: 9, aluno_id: 7, sala_id: 5, dia_semana: 'quinta', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },  // B104
      { professor_id: 5, disciplina_id: 9, aluno_id: 8, sala_id: 5, dia_semana: 'quinta', hora_inicio: '19:00:00', hora_fim: '20:40:00', tipo_aula: 'teorica' },
      
      // ========== INFO1A (Isabela, João Pedro) - SEGUNDA-FEIRA ==========
      { professor_id: 5, disciplina_id: 9, aluno_id: 9, sala_id: 3, dia_semana: 'segunda', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'teorica' },  // B102
      { professor_id: 5, disciplina_id: 9, aluno_id: 10, sala_id: 3, dia_semana: 'segunda', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'teorica' },
      
      { professor_id: 6, disciplina_id: 11, aluno_id: 9, sala_id: 4, dia_semana: 'segunda', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B103
      { professor_id: 6, disciplina_id: 11, aluno_id: 10, sala_id: 4, dia_semana: 'segunda', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO1A - TERÇA-FEIRA ==========
      { professor_id: 4, disciplina_id: 10, aluno_id: 9, sala_id: 12, dia_semana: 'terca', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // D101 Lab Física
      { professor_id: 4, disciplina_id: 10, aluno_id: 10, sala_id: 12, dia_semana: 'terca', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 1, disciplina_id: 1, aluno_id: 9, sala_id: 9, dia_semana: 'terca', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },  // C101 Lab Info
      { professor_id: 1, disciplina_id: 1, aluno_id: 10, sala_id: 9, dia_semana: 'terca', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'pratica' },
      
      // ========== INFO1A - QUARTA-FEIRA ==========
      { professor_id: 5, disciplina_id: 9, aluno_id: 9, sala_id: 3, dia_semana: 'quarta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'teorica' },  // B102
      { professor_id: 5, disciplina_id: 9, aluno_id: 10, sala_id: 3, dia_semana: 'quarta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'teorica' },
      
      { professor_id: 6, disciplina_id: 12, aluno_id: 9, sala_id: 4, dia_semana: 'quarta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B103
      { professor_id: 6, disciplina_id: 12, aluno_id: 10, sala_id: 4, dia_semana: 'quarta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
      
      // ========== INFO1A - QUINTA-FEIRA ==========
      { professor_id: 4, disciplina_id: 14, aluno_id: 9, sala_id: 14, dia_semana: 'quinta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // D103 Lab Biologia
      { professor_id: 4, disciplina_id: 14, aluno_id: 10, sala_id: 14, dia_semana: 'quinta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 13, aluno_id: 9, sala_id: 5, dia_semana: 'quinta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B104
      { professor_id: 6, disciplina_id: 13, aluno_id: 10, sala_id: 5, dia_semana: 'quinta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B104
      
      // ========== INFO1A - SEXTA-FEIRA ==========
      { professor_id: 1, disciplina_id: 1, aluno_id: 9, sala_id: 9, dia_semana: 'sexta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },  // C101 Lab Info
      { professor_id: 1, disciplina_id: 1, aluno_id: 10, sala_id: 9, dia_semana: 'sexta', hora_inicio: '07:30:00', hora_fim: '09:10:00', tipo_aula: 'pratica' },
      
      { professor_id: 6, disciplina_id: 11, aluno_id: 9, sala_id: 4, dia_semana: 'sexta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },  // B103
      { professor_id: 6, disciplina_id: 11, aluno_id: 10, sala_id: 4, dia_semana: 'sexta', hora_inicio: '09:30:00', hora_fim: '11:10:00', tipo_aula: 'teorica' },
    ];

    for (const horario of horarios) {
      await connection.execute(
        'INSERT INTO horarios (professor_id, disciplina_id, aluno_id, sala_id, dia_semana, hora_inicio, hora_fim, tipo_aula) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [horario.professor_id, horario.disciplina_id, horario.aluno_id, horario.sala_id, horario.dia_semana, horario.hora_inicio, horario.hora_fim, horario.tipo_aula]
      );
    }
    console.log(`✅ ${horarios.length} horários criados\n`);

    // 9. PRESENÇA ATUAL (exemplo)
    console.log('📍 Criando registros de presença...');
    
    // Aluno 1 está em aula de Programação Web
    await connection.execute(
      'INSERT INTO presenca_atual (aluno_id, disciplina_id, sala_id, data_entrada, status) VALUES (?, ?, ?, NOW(), ?)',
      [1, 1, 5, 'presente']
    );
    console.log('✅ 1 registro de presença criado\n');

    // Resumo
    console.log('\n📊 RESUMO DOS DADOS INSERIDOS:');
    console.log(`   👥 Usuários: ${usuarios.length}`);
    console.log(`   🏫 Salas: ${salas.length}`);
    console.log(`   📚 Disciplinas: ${disciplinas.length}`);
    console.log(`   👨‍🏫 Professores: ${professores.length}`);
    console.log(`   🎓 Alunos: ${alunos.length}`);
    console.log(`   👪 Responsáveis: ${responsaveis.length}`);
    console.log(`   🔗 Vínculos: ${vinculos.length}`);
    console.log(`   📅 Horários: ${horarios.length}`);
    console.log(`   📍 Presenças: 1`);
    
    console.log('\n🎉 Dados COMPLETOS para apresentação inseridos com sucesso!');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📝 CREDENCIAIS PARA DEMONSTRAÇÃO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n👨‍🏫 PROFESSORES:');
    console.log('   CPF: 111.222.333-44 → Prof. Dr. Roberto Carlos Silva');
    console.log('   CPF: 222.333.444-55 → Profa. Ma. Carla Regina Mendes');
    console.log('   CPF: 333.444.555-66 → Prof. Esp. José Antônio Andrade');
    console.log('   CPF: 444.555.666-77 → Profa. Dra. Maria Eduarda Santos');
    console.log('   CPF: 555.666.777-88 → Prof. Me. Fernando Luís Oliveira');
    console.log('   CPF: 666.777.888-99 → Profa. Esp. Patrícia Sousa Lima');
    console.log('   CPF: 777.888.999-00 → Prof. Me. Lucas Pedro Ferreira ⭐ (também é responsável)');
    console.log('\n🎓 ALUNOS:');
    console.log('   INFO3A (3º Ano Informática - Manhã):');
    console.log('     CPF: 100.200.300-01 → Amanda Cristina Silva');
    console.log('     CPF: 100.200.300-02 → Bruno Henrique Santos');
    console.log('     CPF: 100.200.300-03 → Carolina Ferreira Lima');
    console.log('\n   EDIF2B (2º Ano Edificações - Tarde):');
    console.log('     CPF: 100.200.300-04 → Daniel Oliveira Costa');
    console.log('     CPF: 100.200.300-05 → Eduarda Martins Pereira');
    console.log('     CPF: 100.200.300-06 → Felipe Rodrigues Souza');
    console.log('\n   MEC4C (Mecânica Subsequente - Noite):');
    console.log('     CPF: 100.200.300-07 → Gabriela Alves Nascimento');
    console.log('     CPF: 100.200.300-08 → Henrique Silva Barbosa');
    console.log('\n   INFO1A (1º Ano Informática - Manhã):');
    console.log('     CPF: 100.200.300-09 → Isabela Costa Mendes');
    console.log('     CPF: 100.200.300-10 → João Pedro Ferreira');
    console.log('\n👪 RESPONSÁVEIS:');
    console.log('   CPF: 200.300.400-01 → Ana Paula (mãe de Amanda)');
    console.log('   CPF: 200.300.400-02 → Carlos Eduardo (pai de Bruno)');
    console.log('   CPF: 200.300.400-03 → Débora Ferreira (mãe de Carolina)');
    console.log('   CPF: 200.300.400-04 → Eduardo Oliveira (pai de Daniel)');
    console.log('   CPF: 200.300.400-05 → Fernanda Martins (mãe de Eduarda)');
    console.log('   CPF: 200.300.400-06 → Gustavo Rodrigues (pai de Felipe)');
    console.log('   CPF: 200.300.400-07 → Helena Alves (mãe de Gabriela)');
    console.log('   CPF: 200.300.400-08 → Igor Silva (pai de Henrique)');
    console.log('   CPF: 200.300.400-09 → Juliana Costa (mãe de Isabela)');
    console.log('   CPF: 777.888.999-00 → Prof. Lucas Pedro (pai de João Pedro) ⭐ PROFESSOR-RESPONSÁVEL');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ Banco de dados pronto para apresentação do TCC!');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  insertRealisticData().then(() => {
    console.log('\n✅ Processo concluído!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro no processo:', error);
    process.exit(1);
  });
}

module.exports = { insertRealisticData };
