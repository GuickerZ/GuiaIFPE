const { addMapCoordinates } = require('./addMapCoordinates');
const { insertProductionData } = require('./productionData');

/**
 * Script principal para configurar ambiente de produção
 */
const setupProduction = async () => {
  try {
    console.log('🚀 Iniciando configuração de produção...\n');
    
    // Passo 1: Expandir coluna numero
    console.log('📏 Expandindo coluna de número das salas...');
    const { expandRoomNumberColumn } = require('./expandRoomNumberColumn');
    await expandRoomNumberColumn();
    console.log('');
    
    // Passo 2: Adicionar coordenadas do mapa
    await addMapCoordinates();
    console.log('');
    
    // Passo 3: Popular com dados realistas
    await insertProductionData();
    console.log('');
    
    console.log('🎉 Configuração de produção concluída com sucesso!');
    console.log('');
    console.log('📝 Próximos passos:');
    console.log('   1. Verifique os dados no banco');
    console.log('   2. Teste o login com os usuários criados');
    console.log('   3. Verifique o mapa e as coordenadas');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  }
};

setupProduction();
