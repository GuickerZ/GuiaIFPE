const { pool } = require('../config/database');

/**
 * Script para adicionar coordenadas do mapa às salas
 * As coordenadas são em percentual (0-100) baseadas na imagem do mapa
 */
const addMapCoordinates = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Adicionando coordenadas do mapa...');

    // Adicionar colunas de coordenadas se não existirem
    // MySQL não suporta IF NOT EXISTS em ADD COLUMN, então verificamos se já existem
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'salas' 
        AND COLUMN_NAME IN ('mapa_bloco_id')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    if (!existingColumns.includes('mapa_x')) {
      await connection.execute(`ALTER TABLE salas ADD COLUMN mapa_x DECIMAL(5,2) DEFAULT NULL COMMENT 'Coordenada X no mapa (percentual)'`);
      console.log('✅ Coluna mapa_x adicionada');
    } else {
      console.log('ℹ️  Coluna mapa_x já existe');
    }
    
    if (!existingColumns.includes('mapa_y')) {
      await connection.execute(`ALTER TABLE salas ADD COLUMN mapa_y DECIMAL(5,2) DEFAULT NULL COMMENT 'Coordenada Y no mapa (percentual)'`);
      console.log('✅ Coluna mapa_y adicionada');
    } else {
      console.log('ℹ️  Coluna mapa_y já existe');
    }
    
    if (!existingColumns.includes('mapa_bloco_id')) {
      await connection.execute(`ALTER TABLE salas ADD COLUMN mapa_bloco_id VARCHAR(50) DEFAULT NULL COMMENT 'ID da área interativa no mapa'`);
      console.log('✅ Coluna mapa_bloco_id adicionada');
    } else {
      console.log('ℹ️  Coluna mapa_bloco_id já existe');
    }

    console.log('✅ Colunas de coordenadas adicionadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar coordenadas:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  addMapCoordinates().then(() => {
    console.log('🎉 Coordenadas adicionadas!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { addMapCoordinates };
