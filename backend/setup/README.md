# 🎓 Scripts de Configuração do Banco de Dados

Este diretório contém scripts para configurar e popular o banco de dados do sistema Localiza IF.

## 📋 Scripts Disponíveis

### 1. `createTables.js`
Cria todas as tabelas necessárias no banco de dados.

```bash
node backend/setup/createTables.js
```

### 2. `addMapCoordinates.js`
Adiciona as colunas de coordenadas do mapa nas salas (mapa_x, mapa_y, mapa_bloco_id).

```bash
node backend/setup/addMapCoordinates.js
```

### 3. `productionData.js`
Popula o banco com dados realistas para produção:
- 150 alunos
- 100 responsáveis  
- 15 professores
- 60+ salas com coordenadas no mapa (incluindo todas as áreas do campus)
- 29 disciplinas
- Milhares de horários
- Presenças simuladas

```bash
node backend/setup/productionData.js
```

### 4. `setupProduction.js` ⭐ **RECOMENDADO**
Script completo que executa tudo automaticamente:
1. Adiciona coordenadas do mapa
2. Popula com dados de produção

```bash
node backend/setup/setupProduction.js
```

### 5. `resetDatabase.js`
**⚠️ CUIDADO**: Remove TODOS os dados e recria as tabelas vazias.

```bash
node backend/setup/resetDatabase.js
```

## 🚀 Configuração Rápida

Para configurar o ambiente de produção do zero:

```bash
# 1. Certifique-se de que o MySQL está rodando e configurado no .env

# 2. Crie as tabelas (se ainda não existem)
node backend/setup/createTables.js

# 3. Configure com dados de produção
node backend/setup/setupProduction.js
```

## 📍 Estrutura das Salas com Coordenadas

O script de produção cria salas distribuídas pelos blocos:

### Bloco A (Administrativo)
- Salas 1-4
- Sala dos Professores
- Mini Auditório
- Sala de Convivência de Servidores

### Bloco B (Informática)
- Laboratórios 1-5 de Informática
- Sala de Pesquisa

### Bloco C (Salas de Aula)
- Salas 5-11

### Bloco D (Eletroeletrônica e Meio Ambiente)
- Laboratórios 6-12 de Eletroeletrônica
- Laboratórios 13-14 de Meio Ambiente
- Sala 12

### Bloco E (Atividades Especiais)
- Salas 13-14
- Centro de Línguas
- Sala de Música
- Sala de Educação Física
- Sala Multiuso
- Laboratório 15 de Meio Ambiente

### Biblioteca
- Acervo Principal
- 4 Salas de Estudo em Grupo
- 14 Cabines de Estudo Individual

### Banheiros
- Masculino, Feminino e Acessível

## 🗺️ Coordenadas do Mapa

Cada sala possui:
- `mapa_x`: Coordenada X no mapa (0-100%, baseado na posição horizontal)
- `mapa_y`: Coordenada Y no mapa (0-100%, baseado na posição vertical)  
- `mapa_bloco_id`: ID da área interativa no mapa (`bloco-a`, `bloco-b`, etc.)

Essas coordenadas são usadas para:
1. Destacar salas no mapa interativo
2. Permitir navegação "Ver no Mapa"
3. Visualização precisa da localização

## 👥 Usuários de Teste

Após executar `productionData.js`, você terá:

### Alunos
- CPF: `100.200.300-01` até `100.200.449-00`
- Matriculas: `20240001` até `20240150`
- Cursos: Técnico em Informática, Eletroeletrônica, Meio Ambiente
- Modalidades: Integrado e Subsequente

### Professores
- CPF: `111.222.333-44` (Prof. Roberto Silva)
- CPF: `111.222.333-45` (Prof. Ana Santos)
- CPF: `111.222.333-46` (Prof. Carlos Oliveira)
- ... até `111.222.333-58`

### Responsáveis
- CPF: `400.500.600-01` até `400.500.699-00`

## 📊 Dados Gerados

- **Alunos**: 150 estudantes distribuídos em 3 cursos e 6 turmas
- **Responsáveis**: 100 responsáveis vinculados aos alunos
- **Professores**: 15 professores de diversas disciplinas
- **Salas**: 60+ espaços incluindo salas, laboratórios, biblioteca e áreas especiais
- **Disciplinas**: 29 disciplinas (Informática, Eletroeletrônica, Meio Ambiente e Gerais)
- **Horários**: Grade completa para os primeiros 30 alunos (4 aulas/dia, 5 dias/semana)
- **Presenças**: 20 alunos simulados em aulas no momento

## 🔧 Troubleshooting

### Erro: "Table already exists"
Execute o reset do banco:
```bash
node backend/setup/resetDatabase.js
```

### Erro: "Column already exists" ao adicionar coordenadas
As coordenadas já foram adicionadas. Prossiga com a população de dados.

### Erro de conexão com MySQL
Verifique:
1. MySQL está rodando
2. Configurações do `.env` estão corretas
3. Usuário tem permissões necessárias

## 📝 Notas

- Os scripts são idempotentes quando possível (usam `INSERT IGNORE` e `IF NOT EXISTS`)
- Dados de exemplo seguem padrões realistas do IFPE
- As coordenadas do mapa são calibradas para a imagem do campus IFPE Garanhuns
