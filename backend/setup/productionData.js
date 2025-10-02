const { pool } = require('../config/database');

/**
 * Script para popular o banco com dados realistas de produção
 * Baseado na estrutura real do IFPE Garanhuns
 */
const insertProductionData = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Inserindo dados de produção...');

    // Limpar dados antigos
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

    // === USUÁRIOS ===
    console.log('📝 Inserindo usuários...');
    
    // Alunos
    const alunosData = [];
    for (let i = 1; i <= 150; i++) {
      alunosData.push(`('Aluno ${i} Silva', 'aluno${i}@estudante.ifpe.edu.br', 'aluno')`);
    }
    
    // Responsáveis
    const responsaveisData = [];
    for (let i = 1; i <= 100; i++) {
      responsaveisData.push(`('Responsável ${i} Santos', 'resp${i}@gmail.com', 'responsavel')`);
    }
    
    // Professores
    const professoresData = [
      "('Prof. Roberto Silva', 'roberto.silva@ifpe.edu.br', 'professor')",
      "('Prof. Ana Santos', 'ana.santos.prof@ifpe.edu.br', 'professor')",
      "('Prof. Carlos Oliveira', 'carlos.oliveira@ifpe.edu.br', 'professor')",
      "('Prof. Mariana Souza', 'mariana.souza@ifpe.edu.br', 'professor')",
      "('Prof. Fernando Lima', 'fernando.lima@ifpe.edu.br', 'professor')",
      "('Prof. Patricia Costa', 'patricia.costa@ifpe.edu.br', 'professor')",
      "('Prof. Ricardo Alves', 'ricardo.alves@ifpe.edu.br', 'professor')",
      "('Prof. Juliana Ferreira', 'juliana.ferreira@ifpe.edu.br', 'professor')",
      "('Prof. Paulo Henrique', 'paulo.henrique@ifpe.edu.br', 'professor')",
      "('Prof. Beatriz Costa', 'beatriz.costa@ifpe.edu.br', 'professor')",
      "('Prof. Gabriel Martins', 'gabriel.martins@ifpe.edu.br', 'professor')",
      "('Prof. Larissa Oliveira', 'larissa.oliveira@ifpe.edu.br', 'professor')",
      "('Prof. Thiago Almeida', 'thiago.almeida@ifpe.edu.br', 'professor')",
      "('Prof. Amanda Rodrigues', 'amanda.rodrigues@ifpe.edu.br', 'professor')",
      "('Prof. Lucas Pereira', 'lucas.pereira@ifpe.edu.br', 'professor')"
    ];

    await connection.execute(`
      INSERT INTO usuarios (nome, email, tipo) VALUES
      ${[...alunosData, ...responsaveisData, ...professoresData].join(',\n      ')}
    `);

    // === SALAS COM COORDENADAS DO MAPA ===
    console.log('🏫 Inserindo salas com coordenadas...');
    
    const salasData = [
      // BLOCO B - Laboratórios de Informática (meio superior)
      "('Laboratório 1', 'B', 1, 30, 'Laboratório de Informática', true, 42, 28, 'bloco-b')",
      "('Laboratório 2', 'B', 1, 30, 'Laboratório de Informática', true, 44, 30, 'bloco-b')",
      "('Laboratório 3', 'B', 1, 30, 'Laboratório de Informática', true, 46, 32, 'bloco-b')",
      "('Laboratório 4', 'B', 2, 30, 'Laboratório de Informática', true, 42, 33, 'bloco-b')",
      "('Laboratório 5', 'B', 2, 30, 'Laboratório de Informática', true, 44, 35, 'bloco-b')",
      "('Sala de Pesquisa', 'B', 2, 25, 'Pesquisa', true, 45, 29, 'bloco-b')",
      
      // BLOCO C - Salas de Aula (lado esquerdo meio)
      "('Sala 1', 'C', 1, 40, 'Sala de Aula', true, 17, 45, 'bloco-c')",
      "('Sala 2', 'C', 1, 40, 'Sala de Aula', true, 19, 47, 'bloco-c')",
      "('Sala 3', 'C', 1, 40, 'Sala de Aula', true, 21, 49, 'bloco-c')",
      "('Sala 4', 'C', 1, 40, 'Sala de Aula', true, 23, 51, 'bloco-c')",
      "('Sala 5', 'C', 2, 40, 'Sala de Aula', true, 17, 50, 'bloco-c')",
      "('Sala 6', 'C', 2, 40, 'Sala de Aula', true, 19, 52, 'bloco-c')",
      "('Sala 7', 'C', 2, 40, 'Sala de Aula', true, 21, 54, 'bloco-c')",
      
      // BLOCO D - Laboratórios de Eletroeletrônica e Meio Ambiente (lado direito meio)
      "('Laboratório 6', 'D', 1, 25, 'Laboratório de Eletroeletrônica', true, 67, 45, 'bloco-d')",
      "('Laboratório 7', 'D', 1, 25, 'Laboratório de Eletroeletrônica', true, 69, 47, 'bloco-d')",
      "('Laboratório 8', 'D', 1, 25, 'Laboratório de Eletroeletrônica', true, 71, 49, 'bloco-d')",
      "('Laboratório 9', 'D', 1, 25, 'Laboratório de Eletroeletrônica', true, 73, 51, 'bloco-d')",
      "('Laboratório 10', 'D', 2, 25, 'Laboratório de Eletroeletrônica', true, 67, 50, 'bloco-d')",
      "('Laboratório 11', 'D', 2, 25, 'Laboratório de Eletroeletrônica', true, 69, 52, 'bloco-d')",
      "('Laboratório 12', 'D', 2, 25, 'Laboratório de Eletroeletrônica', true, 71, 54, 'bloco-d')",
      "('Laboratório 13', 'D', 1, 20, 'Laboratório de Meio Ambiente', true, 70, 48, 'bloco-d')",
      "('Laboratório 14', 'D', 2, 20, 'Laboratório de Meio Ambiente', true, 72, 53, 'bloco-d')",
      "('Sala 8', 'D', 1, 35, 'Sala de Aula', true, 68, 46, 'bloco-d')",
      
      // BLOCO E - Atividades Especiais (lado direito inferior)
      "('Sala 9', 'E', 1, 40, 'Sala de Aula', true, 68, 75, 'bloco-e')",
      "('Sala 10', 'E', 1, 40, 'Sala de Aula', true, 70, 77, 'bloco-e')",
      "('Centro de Línguas', 'E', 1, 30, 'Centro de Línguas', true, 72, 79, 'bloco-e')",
      "('Sala de Música', 'E', 1, 25, 'Sala de Música', true, 69, 76, 'bloco-e')",
      "('Sala de Educação Física', 'E', 1, 35, 'Educação Física', true, 71, 78, 'bloco-e')",
      "('Sala Multiuso', 'E', 2, 50, 'Sala Multiuso', true, 68, 80, 'bloco-e')",
      "('Laboratório 15', 'E', 2, 20, 'Laboratório de Meio Ambiente', true, 70, 74, 'bloco-e')",
      
      // BIBLIOTECA (lado direito superior - rotacionada)
      "('Biblioteca', 'Biblioteca', 1, 100, 'Biblioteca', true, 65, 18, 'biblioteca')",
      "('Estudo Grupo 1', 'Biblioteca', 1, 8, 'Sala de Estudo', true, 63, 16, 'biblioteca')",
      "('Estudo Grupo 2', 'Biblioteca', 1, 8, 'Sala de Estudo', true, 67, 20, 'biblioteca')",
      "('Estudo Grupo 3', 'Biblioteca', 2, 8, 'Sala de Estudo', true, 64, 19, 'biblioteca')",
      "('Estudo Grupo 4', 'Biblioteca', 2, 8, 'Sala de Estudo', true, 66, 17, 'biblioteca')",
      "('Cabine 1', 'Biblioteca', 1, 1, 'Cabine Individual', true, 62, 15, 'biblioteca')",
      "('Cabine 2', 'Biblioteca', 1, 1, 'Cabine Individual', true, 68, 21, 'biblioteca')",
      "('Cabine 3', 'Biblioteca', 1, 1, 'Cabine Individual', true, 63, 18, 'biblioteca')",
      "('Cabine 4', 'Biblioteca', 1, 1, 'Cabine Individual', true, 67, 19, 'biblioteca')",
      "('Cabine 5', 'Biblioteca', 2, 1, 'Cabine Individual', true, 64, 16, 'biblioteca')",
      "('Cabine 6', 'Biblioteca', 2, 1, 'Cabine Individual', true, 66, 20, 'biblioteca')",
      "('Cabine 7', 'Biblioteca', 2, 1, 'Cabine Individual', true, 65, 17, 'biblioteca')",
      "('Cabine 8', 'Biblioteca', 2, 1, 'Cabine Individual', true, 63, 19, 'biblioteca')",
      "('Cabine 9', 'Biblioteca', 2, 1, 'Cabine Individual', true, 67, 18, 'biblioteca')",
      "('Cabine 10', 'Biblioteca', 2, 1, 'Cabine Individual', true, 64, 20, 'biblioteca')",
      "('Cabine 11', 'Biblioteca', 2, 1, 'Cabine Individual', true, 66, 16, 'biblioteca')",
      "('Cabine 12', 'Biblioteca', 2, 1, 'Cabine Individual', true, 62, 17, 'biblioteca')",
      "('Cabine 13', 'Biblioteca', 2, 1, 'Cabine Individual', true, 68, 19, 'biblioteca')",
      "('Cabine 14', 'Biblioteca', 2, 1, 'Cabine Individual', true, 65, 21, 'biblioteca')",
      
      // BANHEIROS (centro)
      "('Banheiro Masc.', 'Banheiros', 1, 15, 'Banheiro', true, 50, 56, 'banheiros')",
      "('Banheiro Fem.', 'Banheiros', 1, 15, 'Banheiro', true, 52, 58, 'banheiros')",
      "('Banheiro Acess.', 'Banheiros', 1, 5, 'Banheiro Acessível', true, 51, 57, 'banheiros')"
    ];

    await connection.execute(`
      INSERT INTO salas (numero, bloco, andar, capacidade, tipo, ativa, mapa_bloco_id) VALUES
      ${salasData.join(',\n      ')}
    `);

    // === DISCIPLINAS ===
    console.log('📚 Inserindo disciplinas...');
    
    const disciplinasData = [
      // Informática
      "('Programação Web', 'INFO101', 80)",
      "('Banco de Dados', 'INFO102', 80)",
      "('Redes de Computadores', 'INFO103', 80)",
      "('Engenharia de Software', 'INFO104', 60)",
      "('Algoritmos', 'INFO105', 80)",
      "('Sistemas Operacionais', 'INFO106', 60)",
      "('Desenvolvimento Mobile', 'INFO107', 60)",
      "('Inteligência Artificial', 'INFO108', 60)",
      
      // Eletroeletrônica
      "('Circuitos Elétricos', 'ELET101', 80)",
      "('Eletrônica Digital', 'ELET102', 80)",
      "('Eletrônica Analógica', 'ELET103', 80)",
      "('Sistemas Embarcados', 'ELET104', 60)",
      "('Automação Industrial', 'ELET105', 60)",
      "('Instalações Elétricas', 'ELET106', 60)",
      
      // Meio Ambiente
      "('Gestão Ambiental', 'MAMB101', 60)",
      "('Química Ambiental', 'MAMB102', 80)",
      "('Tratamento de Efluentes', 'MAMB103', 60)",
      "('Educação Ambiental', 'MAMB104', 40)",
      
      // Gerais
      "('Matemática', 'MAT101', 80)",
      "('Física', 'FIS101', 80)",
      "('Química', 'QUI101', 80)",
      "('Português', 'PORT101', 60)",
      "('Inglês', 'ING101', 60)",
      "('História', 'HIST101', 60)",
      "('Geografia', 'GEO101', 60)",
      "('Filosofia', 'FIL101', 40)",
      "('Sociologia', 'SOC101', 40)",
      "('Educação Física', 'EDFIS101', 40)",
      "('Arte', 'ART101', 40)"
    ];

    await connection.execute(`
      INSERT INTO disciplinas (nome, codigo, carga_horaria) VALUES
      ${disciplinasData.join(',\n      ')}
    `);

    // === PROFESSORES ===
    console.log('👨‍🏫 Inserindo professores...');
    
    const profIds = [];
    for (let i = 151; i <= 165; i++) {
      profIds.push(i);
    }

    const professoresInsert = [
      `(${profIds[0]}, 'Prof. Roberto Silva', 'roberto.silva@ifpe.edu.br', '111.222.333-44', '(87) 98888-0001', true)`,
      `(${profIds[1]}, 'Prof. Ana Santos', 'ana.santos.prof@ifpe.edu.br', '111.222.333-45', '(87) 98888-0002', true)`,
      `(${profIds[2]}, 'Prof. Carlos Oliveira', 'carlos.oliveira@ifpe.edu.br', '111.222.333-46', '(87) 98888-0003', true)`,
      `(${profIds[3]}, 'Prof. Mariana Souza', 'mariana.souza@ifpe.edu.br', '111.222.333-47', '(87) 98888-0004', true)`,
      `(${profIds[4]}, 'Prof. Fernando Lima', 'fernando.lima@ifpe.edu.br', '111.222.333-48', '(87) 98888-0005', true)`,
      `(${profIds[5]}, 'Prof. Patricia Costa', 'patricia.costa@ifpe.edu.br', '111.222.333-49', '(87) 98888-0006', true)`,
      `(${profIds[6]}, 'Prof. Ricardo Alves', 'ricardo.alves@ifpe.edu.br', '111.222.333-50', '(87) 98888-0007', true)`,
      `(${profIds[7]}, 'Prof. Juliana Ferreira', 'juliana.ferreira@ifpe.edu.br', '111.222.333-51', '(87) 98888-0008', true)`,
      `(${profIds[8]}, 'Prof. Paulo Henrique', 'paulo.henrique@ifpe.edu.br', '111.222.333-52', '(87) 98888-0009', true)`,
      `(${profIds[9]}, 'Prof. Beatriz Costa', 'beatriz.costa@ifpe.edu.br', '111.222.333-53', '(87) 98888-0010', true)`,
      `(${profIds[10]}, 'Prof. Gabriel Martins', 'gabriel.martins@ifpe.edu.br', '111.222.333-54', '(87) 98888-0011', true)`,
      `(${profIds[11]}, 'Prof. Larissa Oliveira', 'larissa.oliveira@ifpe.edu.br', '111.222.333-55', '(87) 98888-0012', true)`,
      `(${profIds[12]}, 'Prof. Thiago Almeida', 'thiago.almeida@ifpe.edu.br', '111.222.333-56', '(87) 98888-0013', true)`,
      `(${profIds[13]}, 'Prof. Amanda Rodrigues', 'amanda.rodrigues@ifpe.edu.br', '111.222.333-57', '(87) 98888-0014', true)`,
      `(${profIds[14]}, 'Prof. Lucas Pereira', 'lucas.pereira@ifpe.edu.br', '111.222.333-58', '(87) 98888-0015', true)`
    ];

    await connection.execute(`
      INSERT INTO professores (usuario_id, nome, email, cpf, telefone, ativo) VALUES
      ${professoresInsert.join(',\n      ')}
    `);

    // === ALUNOS ===
    console.log('👨‍🎓 Inserindo alunos...');
    
    const cursos = [
      'Técnico em Informática',
      'Técnico em Eletroeletrônica',
      'Técnico em Meio Ambiente'
    ];
    
    const turmas = ['1ºA', '1ºB', '2ºA', '2ºB', '3ºA', '3ºB'];
    const modalidades = ['integrado', 'subsequente'];
    
    const alunosInsert = [];
    for (let i = 1; i <= 150; i++) {
      const usuarioId = i;
      const matricula = `2024${String(i).padStart(4, '0')}`;
      const cpf = `${String(100 + i).padStart(3, '0')}.${String(200 + i).padStart(3, '0')}.${String(300 + i).padStart(3, '0')}-${String(i % 100).padStart(2, '0')}`;
      const telefone = `(87) 99${String(1000 + i).padStart(4, '0')}-${String(i).padStart(4, '0')}`;
      const curso = cursos[i % 3];
      const turma = turmas[i % 6];
      const modalidade = modalidades[i % 2];
      
      alunosInsert.push(`(${usuarioId}, '${matricula}', '${cpf}', '${telefone}', '${curso}', '${turma}', '${modalidade}')`);
    }

    await connection.execute(`
      INSERT INTO alunos (usuario_id, matricula, cpf, telefone, curso, turma, modalidade) VALUES
      ${alunosInsert.join(',\n      ')}
    `);

    // === RESPONSÁVEIS ===
    console.log('👪 Inserindo responsáveis...');
    
    const responsaveisInsert = [];
    for (let i = 1; i <= 100; i++) {
      const usuarioId = 150 + i;
      const cpf = `${String(400 + i).padStart(3, '0')}.${String(500 + i).padStart(3, '0')}.${String(600 + i).padStart(3, '0')}-${String(i % 100).padStart(2, '0')}`;
      const telefone = `(87) 98${String(2000 + i).padStart(4, '0')}-${String(i).padStart(4, '0')}`;
      
      responsaveisInsert.push(`(${usuarioId}, '${cpf}', '${telefone}')`);
    }

    await connection.execute(`
      INSERT INTO responsaveis (usuario_id, cpf, telefone) VALUES
      ${responsaveisInsert.join(',\n      ')}
    `);

    // === RELAÇÃO ALUNO-RESPONSÁVEL ===
    console.log('🔗 Vinculando alunos e responsáveis...');
    
    const vinculosInsert = [];
    for (let i = 1; i <= 100; i++) {
      // Cada responsável tem 1-2 alunos
      vinculosInsert.push(`(${i}, ${i}, 'Pai/Mãe')`);
      if (i <= 50) {
        vinculosInsert.push(`(${i + 50}, ${i}, 'Pai/Mãe')`);
      }
    }

    await connection.execute(`
      INSERT INTO aluno_responsavel (aluno_id, responsavel_id, parentesco) VALUES
      ${vinculosInsert.join(',\n      ')}
    `);

    // === HORÁRIOS ===
    console.log('📅 Criando grade horária...');
    
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const horariosAula = [
      ['07:00:00', '08:40:00'],
      ['08:40:00', '10:20:00'],
      ['10:40:00', '12:20:00'],
      ['13:30:00', '15:10:00'],
      ['15:10:00', '16:50:00'],
      ['16:50:00', '18:30:00']
    ];

    const horariosInsert = [];
    
    // Criar horários para algumas turmas
    for (let aluno = 1; aluno <= 30; aluno++) {
      const disciplinaBase = ((aluno - 1) % 10) + 1;
      const professorBase = ((aluno - 1) % 15) + 1;
      const salaBase = ((aluno - 1) % 20) + 1;
      
      for (let dia = 0; dia < 5; dia++) {
        for (let horario = 0; horario < 4; horario++) {
          const disciplinaId = disciplinaBase + horario;
          const professorId = professorBase;
          const salaId = salaBase + (horario % 10);
          const tipoAula = horario % 2 === 0 ? 'teorica' : 'pratica';
          
          horariosInsert.push(
            `(${aluno}, ${disciplinaId}, ${professorId}, ${salaId}, '${diasSemana[dia]}', '${horariosAula[horario][0]}', '${horariosAula[horario][1]}', '${tipoAula}', true)`
          );
        }
      }
    }

    await connection.execute(`
      INSERT INTO horarios (aluno_id, disciplina_id, professor_id, sala_id, dia_semana, hora_inicio, hora_fim, tipo_aula, ativo) VALUES
      ${horariosInsert.join(',\n      ')}
    `);

    // === PRESENÇA ATUAL (simulando aulas acontecendo agora) ===
    console.log('📍 Registrando presenças atuais...');
    
    const presencaInsert = [];
    const agora = new Date();
    const diaSemanaAtual = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][agora.getDay()];
    
    // Simular alguns alunos presentes em aulas
    for (let i = 1; i <= 20; i++) {
      presencaInsert.push(`(${i}, ${(i % 20) + 1}, ${(i % 10) + 1}, ${(i % 15) + 1}, NOW(), NULL, 'presente')`);
    }

    if (presencaInsert.length > 0) {
      await connection.execute(`
        INSERT INTO presenca_atual (aluno_id, sala_id, disciplina_id, professor_id, data_entrada, data_saida, status) VALUES
        ${presencaInsert.join(',\n        ')}
      `);
    }

    console.log('✅ Dados de produção inseridos com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - ${150} alunos`);
    console.log(`   - ${100} responsáveis`);
    console.log(`   - ${15} professores`);
    console.log(`   - ${salasData.length} salas com coordenadas no mapa`);
    console.log(`   - ${disciplinasData.length} disciplinas`);
    console.log(`   - ${horariosInsert.length} horários cadastrados`);
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  insertProductionData().then(() => {
    console.log('🎉 Dados de produção carregados!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { insertProductionData };
