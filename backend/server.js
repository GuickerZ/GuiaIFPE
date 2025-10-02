const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const roomRoutes = require('./routes/rooms');
const teacherRoutes = require('./routes/teachers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configurado para o frontend
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://guiaifpe.vercel.app',
      'http://localhost:3000'
    ];

    if (!origin) return callback(null, true); // permite requests tipo curl/postman

    // liberar todos subdomínios do ngrok
    if (/https:\/\/.*\.ngrok-free\.app/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));



// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/teachers', teacherRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload muito grande' });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 API disponível em: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('\n📝 Para testar a API:');
        console.log('   POST /api/auth/login');
        console.log('   GET  /api/students/accessible/list');
        console.log('   GET  /api/rooms');
        console.log('\n🔑 Usuário de teste:');
        console.log('   Email: maria.costa@estudante.ifpe.edu.br');
        console.log('   Senha: 123456');
      }
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT. Encerrando servidor...');
  process.exit(0);
});

startServer();