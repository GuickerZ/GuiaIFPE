const { pool } = require('../config/database');

/**
 * Script para expandir a coluna 'numero' da tabela salas
 */
const expandRoomNumberColumn = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Expandindo coluna numero da tabela salas...');

    await connection.execute(`
      ALTER TABLE salas 
      MODIFY COLUMN numero VARCHAR(100) NOT NULL
    `);

    console.log('✅ Coluna numero expandida para VARCHAR(100)');
    
  } catch (error) {
    console.error('❌ Erro ao expandir coluna:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  expandRoomNumberColumn().then(() => {
    console.log('🎉 Coluna expandida com sucesso!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { expandRoomNumberColumn };
