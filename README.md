# interpretar-comunicados

## PWA inicial implementado

Este repositório agora contém uma versão inicial funcional do PWA em HTML/CSS/JavaScript puro, com:

- seleção de turmas monitoradas
- lista de próximos eventos
- tela **Mochila de Amanhã** com checklist persistido em `localStorage`
- notificações sugeridas
- `manifest.webmanifest` + `service worker` para instalação/offline

### Executar localmente

```bash
python3 -m http.server 4173
```

Depois, acesse `http://localhost:4173`.

---

## Descrição ampliada do sistema (com controle de itens da mochila)

A plataforma será composta por três pilares principais:

- automação e orquestração com n8n
- inteligência documental com Google NotebookLM + NotebookLM-MCP
- um PWA (Progressive Web App) para alunos, responsáveis, professores e coordenação escolar

O objetivo é transformar cada turma escolar em um “notebook inteligente”, capaz de interpretar comunicados, atividades e orientações pedagógicas e converter essas informações em ações organizadas, lembretes automáticos e notificações úteis para o dia a dia escolar.

Além de provas, tarefas e trabalhos, o sistema também ajudará na organização prática da rotina do aluno, incluindo os itens que precisam ser levados na mochila para a escola.

---

## Conceito principal

Cada turma da escola possuirá seu próprio notebook no Google NotebookLM.

Exemplos:

- 1º Ano A
- 1º Ano B
- 2º Ano A
- 3º Ano
- Ensino Fundamental II
- Pré-vestibular
- Turmas por disciplina

Cada notebook funcionará como a memória inteligente daquela turma, contendo:

- calendário de provas
- tarefas de casa
- trabalhos escolares
- atividades extracurriculares
- comunicados da escola
- reuniões de pais
- eventos e excursões
- entrega de documentos
- avisos urgentes
- lista de materiais necessários
- itens que devem ir na mochila em dias específicos

Exemplo:

- Levar jaleco para aula de laboratório
- Levar cartolina azul para atividade de artes
- Levar livro paradidático
- Levar autorização assinada
- Levar uniforme de educação física
- Levar flauta para aula de música
- Levar material reciclável para feira de ciências

---

## Entrada de informações

As informações poderão chegar por diversos canais:

- upload manual de PDF
- pasta no Google Drive
- e-mail institucional
- sistema acadêmico
- WhatsApp institucional
- secretaria escolar
- coordenação pedagógica
- professores

Sempre que um novo documento for recebido, o n8n identifica automaticamente e envia para o notebook correto da turma.

---

## Processamento inteligente

O documento será associado ao notebook da turma correspondente no Google NotebookLM.

O NotebookLM-MCP então fará consultas estruturadas para extrair:

- tipo da atividade
- disciplina
- data da prova
- data de entrega
- horário
- professor responsável
- local
- prioridade
- observações
- materiais necessários
- itens obrigatórios para mochila
- urgência
- nível de confiança da extração

Exemplo de extração:

- Prova de Matemática — 15/05
- Trabalho de História — entrega 20/05
- Levar atlas geográfico — 18/05
- Aula de laboratório — levar jaleco e óculos de proteção
- Feira de Ciências — levar maquete pronta

Tudo será convertido em JSON estruturado para processamento automático.

---

## Papel do PWA

O PWA será o aplicativo principal do aluno e dos responsáveis.

Ele funcionará como uma agenda escolar inteligente com:

- tarefas pendentes
- calendário de provas
- lista de trabalhos
- avisos importantes
- controle de prazos
- notificações push
- checklist da mochila
- acompanhamento por múltiplas turmas

O objetivo não será apenas lembrar datas, mas ajudar a evitar esquecimentos diários.

---

## Seleção de notebooks monitorados

O usuário poderá escolher quais notebooks deseja acompanhar.

Exemplo:

Um responsável pode ter:

- ☑ Filho no 1º Ano A
- ☑ Filha no 3º Ano
- ☐ Outro aluno no 2º Ano B

Assim, o sistema enviará notificações apenas das turmas selecionadas.

Isso permite uso por:

- pais
- responsáveis
- alunos
- professores
- coordenadores
- direção escolar

---

## Sistema de notificações Push

O PWA utilizará notificações Push inteligentes e configuráveis.

### Exemplos de notificações acadêmicas

- 🔔 Amanhã há prova de Química
- 🔔 Trabalho de História vence em 2 dias
- 🔔 Novo comunicado da coordenação
- 🔔 Reunião de pais na sexta-feira
- 🔔 Alteração no calendário escolar

---

## Notificações de mochila escolar

Essa será uma funcionalidade de alto valor prático.

### Exemplos

- 🎒 Amanhã levar jaleco para aula de Ciências
- 🎒 Não esquecer a cartolina azul para Artes
- 🎒 Levar autorização assinada para excursão
- 🎒 Quinta-feira: uniforme de Educação Física
- 🎒 Sexta-feira: levar livro paradidático
- 🎒 Amanhã: flauta para aula de Música

Essas notificações poderão ser agrupadas por dia.

Exemplo:

### Itens para amanhã

- 🎒 Jaleco
- 🎒 Livro de Matemática
- 🎒 Cartolina
- 🎒 Autorização assinada

Isso reduz significativamente esquecimentos e melhora a relação escola-família.

---

## Checklist da mochila

O PWA terá uma tela específica chamada **Mochila de Amanhã**.

Nela o responsável ou aluno verá uma checklist visual:

- ☐ Livro de Matemática
- ☐ Caderno de Ciências
- ☐ Jaleco
- ☐ Cartolina
- ☐ Lanche especial
- ☐ Assinatura da autorização

O usuário poderá marcar manualmente os itens preparados.

Isso cria uma rotina prática de organização escolar.

---

## Visualização em calendário

O sistema terá uma tela principal em calendário inteligente.

Visualizações:

- mensal
- semanal
- diária

Cada evento exibirá:

- disciplina
- tipo da atividade
- professor
- prioridade
- prazo
- anexos
- observações
- itens da mochila relacionados

Exemplo:

### 15 de Maio

- 📘 Matemática — Prova
- 🎒 Levar calculadora
- 📗 História — Entrega de trabalho
- 🎒 Levar cartolina

Ao clicar, o usuário verá todos os detalhes.

---

## Painel administrativo

A escola terá um painel para:

- cadastrar turmas
- vincular notebooks
- revisar extrações da IA
- validar notificações antes do envio
- corrigir informações
- reenviar push notifications
- controlar permissões
- acompanhar indicadores de uso

Isso garante maior confiabilidade.

---

## Stack recomendada

### Automação

n8n

### IA documental

Google NotebookLM + MCP

### Banco de dados

PostgreSQL

### Filas e cache

Redis

### Backend/API

Supabase ou NestJS

### Frontend PWA

Vue ou React

### Push Notifications

Firebase

### Infraestrutura

Docker + VPS + Traefik

---

## Resultado final

O sistema deixa de ser apenas uma agenda escolar e passa a ser um assistente inteligente da rotina acadêmica e familiar.

Ele organiza provas, tarefas e trabalhos, reduz esquecimentos, melhora a comunicação entre escola e família e ainda ajuda diretamente na preparação diária da mochila escolar, tornando o acompanhamento muito mais prático e eficiente.
