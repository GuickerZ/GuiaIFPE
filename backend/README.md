# Localiza IF - Backend

Sistema de localização e controle de acesso para estudantes do IFPE Garanhuns.

## 🔒 Características de Segurança

- **Controle de Acesso**: Apenas alunos, pais/responsáveis têm acesso aos dados
- **Autenticação JWT**: Sistema seguro de tokens com autenticação por CPF
- **Proteção de Dados**: Cada usuário só vê suas próprias informações
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de Dados**: Validação rigorosa de todas as entradas

## 🚀 Como Instalar e Rodar

### 1. Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **MySQL** (versão 8.0 ou superior)
- **npm** ou **yarn**

### 2. Configuração do MySQL

1. Instale o MySQL no seu PC
2. Crie um banco de dados:
```sql
CREATE DATABASE localiza_if;
CREATE USER 'localiza_user'@'localhost' IDENTIFIED BY 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON localiza_if.* TO 'localiza_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuração do Backend

1. **Navegue até a pasta backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

4. **Edite o arquivo `.env` com suas configurações:**
```env
DB_HOST=localhost
DB_USER=localiza_user
DB_PASSWORD=sua_senha_aqui
DB_NAME=localiza_if
DB_PORT=3306

JWT_SECRET=sua_chave_jwt_super_secreta_e_longa_aqui
PORT=3001
NODE_ENV=development
```

5. **Crie as tabelas e insira dados de exemplo:**
```bash
npm run setup
```

6. **Inicie o servidor:**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 👥 Sistema de Usuários

### Tipos de Usuário:

1. **Aluno**: Pode ver apenas seus próprios dados
2. **Responsável**: Pode ver dados dos alunos que está responsável
3. **Admin**: Pode ver todos os dados (para administração)

### Usuário de Teste:

- **CPF Aluno**: `123.456.789-01` (Maria Oliveira Costa)
- **CPF Responsável**: `987.654.321-00` (Ana Costa Oliveira - mãe da Maria)
- **Tipo**: Login por CPF apenas, sem senha

## 🛡️ Segurança Implementada

### 1. Controle de Acesso
- Cada usuário só acessa dados que tem permissão
- Responsáveis só veem alunos que estão sob sua responsabilidade
- Alunos só veem seus próprios dados

### 2. Autenticação
- JWT tokens com expiração de 24h
- Autenticação por CPF (sem necessidade de senha)
- Middleware de autenticação em todas as rotas protegidas

### 3. Validação
- Validação de entrada com express-validator
- Sanitização de dados
- Rate limiting para prevenir ataques

## 📡 APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Login por CPF
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Alunos
- `GET /api/students/accessible/list` - Listar alunos que o usuário pode acessar
- `GET /api/students/:id` - Dados específicos de um aluno
- `GET /api/students/:id/schedule` - Horários de um aluno

### Salas
- `GET /api/rooms` - Listar todas as salas com status
- `GET /api/rooms/:id` - Dados específicos de uma sala
- `GET /api/rooms/search/:query` - Buscar salas

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais:
- `usuarios` - Dados de login e perfil
- `alunos` - Informações específicas dos alunos
- `responsaveis` - Dados dos responsáveis
- `aluno_responsavel` - Relação entre alunos e responsáveis
- `salas` - Informações das salas
- `disciplinas` - Matérias
- `professores` - Dados dos professores
- `horarios` - Grade horária
- `presenca_atual` - Localização atual dos alunos

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento (com nodemon)
- `npm run setup` - Cria tabelas e insere dados de exemplo
- `npm run reset:db` - Reseta o banco de dados (dropa e recria todas as tabelas)

## 📁 Estrutura de Pastas

```
backend/
├── config/          # Configurações (banco de dados)
├── middleware/      # Middlewares (autenticação, etc.)
├── routes/          # Rotas da API
├── setup/           # Scripts de configuração inicial
├── .env.example     # Exemplo de variáveis de ambiente
├── server.js        # Arquivo principal do servidor
└── package.json     # Dependências e scripts
```

## 🚨 Importante

1. **Nunca commite o arquivo `.env`** - Ele contém informações sensíveis
2. **Use senhas fortes** para JWT_SECRET e banco de dados
3. **Em produção**, configure CORS apenas para domínios específicos
4. **Backup regular** do banco de dados é recomendado

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Verifique os logs do servidor no terminal