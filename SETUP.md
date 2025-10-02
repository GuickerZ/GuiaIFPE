# 🚀 Como Rodar o Localiza IF Completo no seu PC

Este guia mostra como configurar e executar todo o sistema Localiza IF (frontend + backend + MySQL) no seu computador.

## 📋 O que você precisa instalar

### 1. Node.js
- **Baixe**: https://nodejs.org/
- **Versão**: 16 ou superior
- **Teste**: Abra o terminal e digite `node --version`

### 2. MySQL
- **Windows**: https://dev.mysql.com/downloads/installer/
- **Mac**: https://dev.mysql.com/downloads/mysql/
- **Linux**: `sudo apt install mysql-server` (Ubuntu/Debian)

### 3. Git (opcional, para baixar o código)
- **Baixe**: https://git-scm.com/

## 🗄️ Configuração do Banco de Dados

### 1. Inicie o MySQL
```bash
# No Windows (como administrador)
net start mysql

# No Mac/Linux
sudo systemctl start mysql
```

### 2. Acesse o MySQL
```bash
mysql -u root -p
```

### 3. Crie o banco e usuário
```sql
CREATE DATABASE localiza_if;
CREATE USER 'localiza_user'@'localhost' IDENTIFIED BY 'MinhaSenh@123';
GRANT ALL PRIVILEGES ON localiza_if.* TO 'localiza_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🔧 Configuração do Backend

### 1. Navegue até a pasta backend
```bash
cd backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

**Arquivo `.env` (edite com suas configurações):**
```env
DB_HOST=localhost
DB_USER=localiza_user
DB_PASSWORD=MinhaSenh@123
DB_NAME=localiza_if
DB_PORT=3306

JWT_SECRET=minha_chave_jwt_super_secreta_e_longa_123456789
PORT=3001
NODE_ENV=development
```

### 4. Crie as tabelas e dados de exemplo
```bash
npm run setup
```

**⚠️ IMPORTANTE**: Se você já havia executado o setup antes das alterações, resete o banco:
```bash
npm run reset:db
```

### 5. Inicie o servidor backend
```bash
npm run dev
```

✅ **Backend rodando em:** `http://localhost:3001`

## 🎨 Configuração do Frontend

### 1. Em outro terminal, navegue para a pasta raiz do projeto
```bash
cd ..  # Voltar para a pasta raiz
```

### 2. Instale as dependências do frontend
```bash
npm install
```

### 3. Inicie o frontend
```bash
npm run dev
```

✅ **Frontend rodando em:** `http://localhost:5173`

## 🧪 Teste o Sistema

### 1. Acesse o frontend
Abra `http://localhost:5173` no seu navegador

### 2. Faça login com os CPFs de teste
- **CPF de Aluno:** `123.456.789-01` (Maria Oliveira Costa)
- **CPF de Responsável:** `987.654.321-00` (Ana Costa Oliveira - mãe da Maria)

**📝 Nota:** O sistema usa apenas CPF para login, sem necessidade de senha.

### 3. Teste as funcionalidades
- ✅ Login/logout
- ✅ Busca de alunos (apenas admin vê todos)
- ✅ Visualização de horários
- ✅ Localização atual do aluno
- ✅ Busca de salas
- ✅ Controle de acesso (aluno só vê próprios dados)

## 🛡️ Sistema de Segurança Implementado

### 1. Controle de Acesso por Tipo de Usuário:

**👨‍🎓 Aluno:**
- Só pode ver seus próprios dados
- Acesso ao seu horário e localização atual

**👨‍👩‍👧‍👦 Responsável:**
- Pode ver dados apenas dos alunos que está responsável
- Acesso aos horários e localização dos seus dependentes

**👨‍💼 Admin:**
- Pode ver todos os dados do sistema
- Acesso completo para administração

### 2. Autenticação JWT:
- Tokens seguros com expiração
- Middleware de autenticação em todas as rotas
- Autenticação por CPF (sem necessidade de senha)

### 3. Validação de Dados:
- Todas as requisições são validadas
- Proteção contra SQL injection
- Rate limiting para prevenir ataques

## 🐛 Resolução de Problemas

### MySQL não conecta:
```bash
# Verifique se o MySQL está rodando
sudo systemctl status mysql  # Linux/Mac
net start mysql              # Windows

# Teste a conexão
mysql -u localiza_user -p localiza_if
```

### Erro de porta ocupada:
```bash
# Verifique qual processo está usando a porta
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Mate o processo se necessário
taskkill /PID <número_do_pid> /F  # Windows
kill -9 <número_do_pid>           # Mac/Linux
```

### Dependências não instalam:
```bash
# Limpe o cache do npm
npm cache clean --force
rm -rf node_modules
npm install
```

## 📂 Estrutura Final dos Arquivos

```
seu-projeto/
├── backend/               # API Node.js + MySQL
│   ├── config/           # Configuração do banco
│   ├── middleware/       # Autenticação e segurança
│   ├── routes/          # Rotas da API
│   ├── setup/           # Scripts de instalação
│   ├── .env             # Suas configurações (NÃO compartilhe)
│   ├── server.js        # Servidor principal
│   └── package.json     # Dependências do backend
├── src/                 # Frontend React
│   ├── components/      # Componentes React
│   ├── services/        # Comunicação com API
│   ├── contexts/        # Contexto de autenticação
│   └── ...
├── SETUP.md            # Este arquivo
└── package.json        # Dependências do frontend
```

## 🎉 Pronto!

Agora você tem um sistema completo e seguro rodando no seu PC:

- 🔒 **Seguro**: Controle total de acesso
- 📱 **Responsivo**: Funciona em celular e desktop  
- 🗄️ **Persistente**: Dados salvos no MySQL
- 🔧 **Customizável**: Código fonte completo

### Próximos Passos:
1. **Adicione mais usuários** diretamente no banco de dados
2. **Customize o design** editando os componentes React
3. **Adicione novas funcionalidades** nas rotas da API
4. **Configure backup** automático do banco de dados

**Dúvidas?** Verifique os logs no terminal onde rodou `npm run dev`