const { resetAndRecreate } = require('./resetDatabase');
const { insertRealisticData } = require('./realisticData');

/**
 * Script para configurar banco de dados com dados REALISTAS
 */
const setupRealistic = async () => {
  try {
    console.log('🚀 Iniciando configuração com dados REALISTAS...\n');
    
    // Passo 1: Resetar e recriar tabelas
    console.log('📏 Resetando banco de dados...');
    await resetAndRecreate();
    console.log('');
    
    // Passo 2: Inserir dados realistas
    console.log('📝 Inserindo dados realistas...');
    await insertRealisticData();
    console.log('');
    
    console.log('🎉 Configuração com dados REALISTAS concluída!');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS PARA SUA APRESENTAÇÃO:');
    console.log('   1. Inicie o backend: npm run dev (na pasta backend)');
    console.log('   2. Use os CPFs acima para demonstrar cada tipo de usuário');
    console.log('   3. Todos os alunos possuem horários COMPLETOS (segunda a sexta)');
    console.log('   4. Cada professor tem múltiplas turmas e disciplinas');
    console.log('   5. Responsáveis estão vinculados aos alunos menores de idade');
    console.log('');
    console.log('🎯 DICA: Teste com Amanda (INFO3A) para ver grade completa!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  }
};

setupRealistic();
