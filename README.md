# GUIA IFPE — Sistema de Localização Interna (Campus Garanhuns)

Guia IFPE é um sistema web desenvolvido para auxiliar estudantes, professores e demais usuários a se orientarem dentro do Campus Garanhuns do IFPE. O sistema oferece consultas rápidas sobre turmas, disciplinas e professores, ajudando a reduzir atrasos e otimizar o deslocamento no campus. O front-end foi implementado em **React com Vite**, garantindo desempenho e interatividade, enquanto o back-end usa **Node.js (JavaScript)** integrado a um banco de dados **MySQL**.  

A versão pública de demonstração está disponível em: **https://guiaifpe.vercel.app/**

---

## Funcionalidades Principais

- **Login seguro por CPF:** Autenticação via CPF do aluno ou professor, garantindo acesso seguro.
- **Tela inicial personalizada:** Exibe dados acadêmicos do usuário (matrícula, curso, turma etc.).
- **Consulta completa de aluno:**  
  1. Aula atual (disciplina, professor, horário, sala)  
  2. Dados pessoais (CPF, e-mail, telefone, matrícula)  
  3. Dados acadêmicos (curso e turma)
- **Calendário acadêmico unificado:** Exibe horários de cursos integrados, subsequentes e superiores.
- **Grade horária semanal:** Mostra toda a programação semanal do aluno.
- **Mapa interativo do campus:**  
  - Visualização dos blocos  
  - Capacidade das salas  
  - Status livre/ocupada  
  - Tipo de sala (laboratório, sala comum, etc.)
- **Segurança reforçada:** JWT + middlewares de proteção + controle de acesso por papéis.

---

## Tecnologias Utilizadas

- **React + Vite**
- **Node.js (JavaScript)**
- **MySQL**
- **JWT (JSON Web Tokens)**
- **TypeScript** (opcional no front-end)
- **Express**, **dotenv**, entre outras dependências.

---

## Instalação e Uso

### 1. Clonar o repositório

```bash
git clone https://github.com/GuickerZ/GuiaIFPE.git
cd GuiaIFPE
```

### 2. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar ambiente

Crie um arquivo `.env` no backend:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=guia_ifpe
JWT_SECRET=uma_chave_muito_segura
PORT=3000
```

Opcional no frontend:

```
VITE_API_URL=http://localhost:3000
```

Configure o banco MySQL criando o schema e importando o SQL (se aplicável).

### 4. Executar o projeto

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
npm run dev
```

Acesse em:  
**http://localhost:3000** (ou porta configurada)

---

## Capturas de Tela

```markdown
![Tela de Login](/assets/screenshots/login.png)
![Dashboard](/assets/screenshots/dashboard.png)
![Consulta de Aluno](/assets/screenshots/consulta.png)
![Calendário Acadêmico](/assets/screenshots/calendario.png)
![Grade Semanal](/assets/screenshots/grade.png)
![Mapa Interativo](/assets/screenshots/mapa.png)
```

---

## Agradecimentos

Agradecimento especial ao corpo docente envolvido na avaliação e orientação do trabalho, assim como às contribuições institucionais durante o desenvolvimento do projeto.  

---

## Licença

Este projeto é licenciado sob a **MIT License**.

---
