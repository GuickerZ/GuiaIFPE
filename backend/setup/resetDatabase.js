const { pool } = require('../config/database');
const { createTables } = require('./createTables');

const resetDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Resetando banco de dados...');

    // Desabilitar verificação de chaves estrangeiras
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Dropar todas as tabelas
    const tables = [
      'presenca_atual',
      'horarios', 
      'aluno_responsavel',
      'responsaveis',
      'alunos',
      'usuarios',
      'salas',
      'disciplinas',
      'professores'
    ];

    for (const table of tables) {
      await connection.execute(`DROP TABLE IF EXISTS ${table}`);
      console.log(`✅ Tabela ${table} removida`);
    }

    // Reabilitar verificação de chaves estrangeiras
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Banco resetado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const resetAndRecreate = async () => {
  try {
    await resetDatabase();
    await createTables();
    console.log('🎉 Banco resetado e recriado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no processo completo:', error);
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  resetAndRecreate().then(() => {
    console.log('🎉 Reset completo!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro no reset:', error);
    process.exit(1);
  });
}

module.exports = { resetDatabase, resetAndRecreate };