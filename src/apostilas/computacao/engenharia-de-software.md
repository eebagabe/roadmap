# Engenharia de Software e Projeto em Grupo: Apostila Prática

Roadmap Ciência da Computação · Semanas 95 a 98

## Comece por aqui

Até aqui, quase tudo foi feito por você, sozinho, em programas que cabem na cabeça de uma pessoa. Software de verdade é diferente: dezenas de pessoas, centenas de milhares de linhas, anos de vida, requisitos que mudam no meio do caminho e clientes que nem sempre sabem o que querem. **Engenharia de software** é o conjunto de práticas para construir e manter esse tipo de sistema com qualidade e previsibilidade. Em Oxford, o segundo ano tem o *Group Design Practical*: equipes de alunos desenvolvem um projeto para um cliente real, muitas vezes uma empresa. Esta etapa prepara você para isso, e o projeto dela é exatamente esse.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSI-28 Fundamentos de Engenharia de Software; CSI-29 Gerenciamento de Projetos de Software |
| MIT | 6.1020 Software Construction; 6.1040 Software Design |
| Harvard | CS 1100 Foundations of Data Science and Engineering (partes); CS 1610 (projeto em grupo) |
| Oxford | Group Design Practical (2º ano) |

### Como esta apostila funciona

1. Forme uma equipe de 3 a 5 pessoas **já na primeira semana** (outros estudantes da trilha, colegas de faculdade, comunidades online). A etapa inteira gira em torno do projeto em grupo.
2. Cada tema tem atividades individuais curtas e um **entregável** do projeto.
3. Use ferramentas reais: GitHub (repositório, *issues*, *pull requests*, *Actions*), um quadro de tarefas (GitHub Projects, Trello) e um canal de conversa.
4. Gabarito na outra aba: aqui ele traz respostas-modelo e critérios de avaliação, já que muitas respostas dependem do seu projeto.

> **Regra dos 20 minutos:** a equipe travou numa decisão? Escreva as opções num documento curto (contexto, opções, prós e contras, decisão), marque um prazo para decidir e siga. Decisões reversíveis devem ser rápidas; só as caras de desfazer merecem debate longo.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 95 | Tema 1: Requisitos e processos |
| 96 | Tema 2: Arquitetura e design de APIs |
| 97 | Tema 3: Qualidade |
| 98 | Tema 4: Equipe e manutenção + entrega do projeto |

Na prática, o projeto em grupo costuma levar mais que 4 semanas: use estas 4 semanas para o ciclo completo de uma primeira versão e continue depois, em paralelo com as próximas etapas.

## Tema 1: Requisitos e processos

**Objetivo:** descobrir o que construir e organizar o trabalho para construir.

### 1.1 Requisitos

A causa mais comum de fracasso de projetos de software não é técnica: é construir **a coisa errada**. **Engenharia de requisitos** é descobrir, registrar e validar o que o sistema precisa fazer.

- **Requisitos funcionais:** o que o sistema faz. "O aluno pode se inscrever numa turma com vaga."
- **Requisitos não funcionais** (atributos de qualidade): **como** ele faz. Desempenho ("responde em menos de 300 ms para 95% das requisições"), disponibilidade, segurança, usabilidade, acessibilidade, custo, manutenibilidade.

Técnicas para descobrir: **entrevistas** com usuários reais (pergunte sobre o trabalho e os problemas deles, não "que funcionalidades você quer"), **observação** do trabalho atual, análise de sistemas e documentos existentes, **protótipos** (de papel ou clicáveis) para validar cedo.

Formato comum em equipes ágeis, a **história de usuário**:

> **Como** coordenadora de curso, **quero** ver as turmas com mais de 90% das vagas ocupadas, **para** abrir turmas extras antes da matrícula fechar.

Com **critérios de aceitação** verificáveis:

> **Dado** que uma turma tem 40 vagas e 37 inscritos, **quando** a coordenadora abre o painel, **então** a turma aparece na lista de quase lotadas.

Bons requisitos são **testáveis**: "o sistema deve ser rápido" não é; "a busca responde em menos de 1 s com 10 mil cursos" é.

### 1.2 Especificação

Para partes críticas, documente com mais precisão:

- **Casos de uso:** atores, fluxo principal e fluxos alternativos e de erro.
- **Modelos:** diagramas de estados (o ciclo de vida de um pedido), de sequência (quem chama quem numa operação), de domínio (as entidades e relacionamentos; a etapa de Bancos de Dados).
- **Especificações de interface:** contratos de APIs (Tema 2), com pré e pós-condições (a etapa de OO).

O nível de detalhe depende do risco: software médico, aeronáutico e financeiro exige especificações formais e rastreabilidade (cada requisito ligado ao código e aos testes); um aplicativo interno pode viver de histórias de usuário e conversa.

**Priorização:** nem tudo cabe. O método **MoSCoW** classifica em *Must* (obrigatório), *Should* (importante), *Could* (desejável) e *Won't* (fica de fora desta vez). Defina um **MVP** (produto mínimo viável): a menor versão que entrega valor real e permite aprender com usuários.

### 1.3 Métodos ágeis

O **Manifesto Ágil** (2001) valoriza: indivíduos e interações mais que processos e ferramentas; software funcionando mais que documentação abrangente; colaboração com o cliente mais que negociação de contratos; responder a mudanças mais que seguir um plano.

**Scrum**, o framework ágil mais usado:

- Trabalho em ciclos curtos de duração fixa (**sprints**, de 1 a 4 semanas), cada um entregando um incremento **funcionando**.
- Papéis: **Product Owner** (prioriza o *backlog*, representa o cliente), **Scrum Master** (facilita e remove impedimentos), **time de desenvolvimento**.
- Eventos: **planejamento** da sprint, **reunião diária** curta (o que fiz, o que vou fazer, o que me impede), **revisão** com o cliente (demonstração do que foi feito) e **retrospectiva** (como melhorar o processo).
- Artefatos: *backlog* do produto (lista priorizada), *backlog* da sprint, incremento.

**Kanban:** fluxo contínuo em vez de sprints. Um quadro com colunas (A fazer, Fazendo, Revisão, Feito) e **limites de trabalho em andamento** (no máximo 3 cartões em "Fazendo"), que forçam a terminar antes de começar coisas novas. Mede-se o **tempo de ciclo** de cada tarefa.

**Estimativa:** prever prazos de software é notoriamente difícil. Técnicas: pontos relativos (*story points*), planejamento com cartas (*planning poker*), e a mais honesta, **medir o histórico** da equipe e usar faixas ("entre 3 e 5 semanas") em vez de datas exatas. Quebrar tarefas grandes em pequenas (menos de 2 dias cada) melhora muito as estimativas.

> **Cuidado! Cai na entrevista:** "ágil" não é ausência de planejamento nem de documentação: é planejar em ciclos curtos e ajustar com feedback real. E adicionar pessoas a um projeto atrasado o atrasa ainda mais (**lei de Brooks**, de *O Mítico Homem-Mês*): os novos precisam aprender, e os canais de comunicação crescem como n(n − 1)/2.

### 1.4 Cascata e quando usar

O modelo em **cascata** segue fases em sequência: requisitos, projeto, implementação, testes, implantação. Cada fase termina antes da próxima.

| Cascata faz sentido quando | Ágil faz sentido quando |
|---|---|
| Requisitos estáveis e bem conhecidos | Requisitos incertos ou que mudam |
| Mudanças tardias são caríssimas (hardware, satélites, contratos públicos com escopo fixo) | Mudanças são baratas (software web) |
| Exigências regulatórias de documentação prévia | Feedback rápido do usuário é possível |

Na prática, a maioria das organizações usa **híbridos**: planejamento de alto nível e marcos fixos, com execução iterativa. O que importa é reduzir **risco**: atacar primeiro o que é mais incerto (a integração com o sistema legado, o algoritmo que talvez não seja rápido o bastante), em vez do que é mais fácil.

### Atividades de fixação do Tema 1

1. Escreva 5 histórias de usuário com critérios de aceitação para um sistema de agendamento de consultas numa clínica pequena.
2. Classifique em funcional ou não funcional e reescreva as vagas de forma testável: (a) "o sistema deve ser seguro"; (b) "o usuário pode exportar relatórios"; (c) "o aplicativo deve ser fácil de usar"; (d) "o sistema deve aguentar a Black Friday".
3. Aplique MoSCoW às suas 5 histórias e defina o MVP.
4. Uma equipe de 4 pessoas leva 10 semanas para um projeto. O gerente propõe dobrar a equipe para terminar em 5. Explique por que provavelmente não funciona.
5. **Projeto:** com a sua equipe, escolha um cliente (uma ONG, um pequeno comércio, um professor, um projeto da sua universidade; ou um cliente fictício interpretado por alguém de fora da equipe). Faça ao menos uma entrevista, escreva o documento de visão (problema, usuários, objetivos, fora do escopo) e o *backlog* inicial priorizado.

## Tema 2: Arquitetura e design de APIs

**Objetivo:** organizar o sistema em partes com responsabilidades claras e interfaces bem projetadas.

### 2.1 Arquitetura de software

A **arquitetura** são as decisões estruturais difíceis de mudar depois: como o sistema se divide em partes, como elas se comunicam, onde ficam os dados, como o sistema é implantado. Ela é guiada principalmente pelos **requisitos não funcionais** (escala, disponibilidade, segurança, prazo, tamanho da equipe).

Estilos comuns:

| Estilo | Ideia | Bom para |
|---|---|---|
| Camadas | Apresentação → regras de negócio → dados; cada uma só fala com a de baixo | Aplicações de negócio em geral |
| Monólito modular | Uma aplicação implantada inteira, mas dividida em módulos com fronteiras claras | A maioria dos sistemas, especialmente no início |
| Microsserviços | Serviços pequenos, implantados e escalados independentemente, comunicando-se pela rede | Organizações grandes, com muitas equipes autônomas |
| Orientada a eventos | Componentes publicam e consomem eventos (filas, Kafka) | Integrações, processamento assíncrono |
| Hexagonal (portas e adaptadores) | O núcleo de regras de negócio não depende de banco, web ou frameworks; adaptadores fazem a ponte | Lógica de negócio rica e testável |
| Cliente-servidor, par a par, pipeline | | |

> **Cuidado! Cai na entrevista:** microsserviços resolvem um problema **organizacional** (muitas equipes trabalhando sem pisar umas nas outras) ao custo de complexidade de **sistemas distribuídos** (rede, falhas parciais, consistência, monitoramento). Para uma equipe pequena, um monólito bem modularizado quase sempre é a melhor escolha.

**Registros de decisão de arquitetura** (ADRs): documentos curtos com contexto, decisão e consequências de cada escolha importante. Daqui a dois anos, ninguém lembrará **por que** escolheram aquele banco.

**Lei de Conway:** organizações projetam sistemas que copiam a sua estrutura de comunicação. Três equipes produzem um sistema de três partes. Use isso a seu favor.

### 2.2 Modularidade

Um **módulo** bem projetado (David Parnas, 1972) **esconde uma decisão** que pode mudar (o formato de um arquivo, o banco usado, um algoritmo) atrás de uma interface estável. Dois critérios:

- **Alta coesão:** o que está dentro do módulo está relacionado e muda junto.
- **Baixo acoplamento:** os módulos dependem pouco uns dos outros, e só das interfaces.

Princípios úteis (alguns do conjunto **SOLID**):

- **Responsabilidade única:** um módulo deve ter um único motivo para mudar.
- **Aberto/fechado:** estender sem modificar (polimorfismo, etapa de OO).
- **Inversão de dependência:** módulos de alto nível (regras de negócio) não dependem de detalhes (banco, framework); ambos dependem de abstrações. Na prática, o núcleo define uma interface `RepositorioDeAlunos`, e o código do PostgreSQL a implementa.
- **DRY** (não se repita), com moderação: duplicar um pouco é melhor que uma abstração errada.
- **YAGNI** (você não vai precisar disso): não construa flexibilidade para requisitos imaginários.
- **Complexidade é o inimigo:** módulos **profundos** (interface simples, muita funcionalidade escondida) são melhores que muitos módulos rasos (*A Philosophy of Software Design*, John Ousterhout).

### 2.3 Design de APIs

Uma **API** é a interface que um módulo ou serviço oferece a outros. Ela é muito mais difícil de mudar que a implementação, porque outros já dependem dela.

Princípios gerais:

- **Fácil de usar certo e difícil de usar errado.** Nomes claros, tipos que impedem erros (um tipo `Email` em vez de `String`), padrões seguros.
- **Consistência:** mesmas convenções de nomes, formatos e erros em toda a API.
- **Mínima:** cada coisa a mais é algo a manter para sempre. "Na dúvida, deixe de fora" (Joshua Bloch).
- **Erros informativos:** códigos e mensagens que dizem o que deu errado e como corrigir.

**APIs REST** sobre HTTP (a etapa de Redes):

```
GET    /turmas?semestre=2025.1        lista (com filtros e paginação)
GET    /turmas/42                     uma turma
POST   /turmas                        cria  → 201 Created + Location: /turmas/43
PATCH  /turmas/42                     altera parte
DELETE /turmas/42                     remove → 204 No Content
POST   /turmas/42/inscricoes          inscreve um aluno (sub-recurso)
```

- Recursos com **substantivos** no plural; a ação vem do método HTTP.
- Códigos de status corretos: 400 (pedido inválido), 401 (não autenticado), 403 (sem permissão), 404, 409 (conflito: turma lotada), 422 (dados inválidos), 429 (excesso de pedidos).
- **Paginação** em listas (por cursor, de preferência, para dados que mudam), filtros e ordenação.
- **Versionamento** (`/v1/...` ou por cabeçalho) e regras para evoluir **sem quebrar** clientes: adicionar campos opcionais é seguro; remover ou mudar o significado não é.
- **Idempotência** para operações que podem ser repetidas (a etapa de Distribuídos).

Alternativas: **GraphQL** (o cliente escolhe exatamente os campos que quer, numa consulta), **gRPC** (RPC binário e tipado com Protocol Buffers, muito usado entre serviços internos).

### 2.4 Documentação

Documentação útil responde a perguntas diferentes para públicos diferentes:

| Tipo | Para quem | Exemplo |
|---|---|---|
| README | Quem chega ao projeto | O que é, como instalar, rodar e testar |
| Tutoriais e guias | Usuários e novos desenvolvedores | "Como adicionar um novo tipo de relatório" |
| Referência da API | Quem integra | Especificação **OpenAPI** gerada do código, com exemplos |
| Arquitetura | O time | Diagramas (o modelo **C4**: contexto, contêineres, componentes, código) e ADRs |
| Comentários no código | Quem lê o código | O **porquê** de decisões não óbvias, não o que o código já diz |

Documentação desatualizada é pior que nenhuma: mantenha-a **perto do código** (no mesmo repositório), revise junto nos pull requests e gere o que der para gerar automaticamente.

### Atividades de fixação do Tema 2

1. Desenhe o diagrama de contexto e o de contêineres (modelo C4) do sistema da clínica.
2. Para o sistema da clínica, compare um monólito modular e microsserviços em: custo de operação, facilidade de testar, tempo até a primeira versão e escala. Qual você escolheria? Escreva um ADR.
3. Identifique os problemas de design nesta API e proponha uma versão melhor: `GET /getConsultas`, `POST /deleteConsulta?id=5`, `POST /consultas/criar` (que responde sempre 200 com `{"erro": "..."}` quando falha).
4. Aplique a inversão de dependência a um serviço de "agendar consulta" que hoje chama diretamente o banco e envia e-mail com uma biblioteca específica. Como fica testável?
5. **Projeto:** escreva o documento de arquitetura da sua equipe (diagrama C4 de contexto e contêineres, tecnologias escolhidas com justificativa, dois ADRs) e a especificação da API principal (OpenAPI ou equivalente).

## Tema 3: Qualidade

**Objetivo:** construir qualidade no processo com revisões, testes em vários níveis e automação.

### 3.1 Revisão de código

**Revisão de código** (pelo pull request) é uma das práticas de qualidade mais eficazes: encontra defeitos, espalha conhecimento pelo time e mantém o código consistente.

Para quem **envia**: PRs **pequenos** (menos de 400 linhas mudadas; acima disso a qualidade da revisão despenca), com descrição do quê, por quê e como testar, e commits atômicos.

Para quem **revisa**:

- Primeiro o **desenho** (a abordagem faz sentido?), depois os detalhes.
- Correção, casos de borda, segurança, testes, legibilidade, nomes.
- Comentários **sobre o código, não sobre a pessoa**; perguntas em vez de ordens ("o que acontece se a lista vier vazia?"); separe o que é obrigatório do que é sugestão.
- Estilo e formatação ficam para ferramentas automáticas (formatadores e *linters*), não para humanos.

### 3.2 Níveis de teste

A **pirâmide de testes**:

```
         /  E2E  \          poucos: lentos, frágeis, mas testam o sistema inteiro
        /─────────\
       / integração \       alguns: módulos juntos, com banco e serviços reais (ou em containers)
      /─────────────\
     /   unitários    \     muitos: rápidos, isolados, milhares em segundos
    /─────────────────\
```

- **Unitários:** uma função ou classe, isolada (a etapa de OO). Dependências externas substituídas por **dublês** (*mocks*, *stubs*, *fakes*), mas sem exagero: mocks demais testam a implementação, não o comportamento.
- **Integração:** as partes funcionando juntas: a aplicação com um banco real (com **Testcontainers**, por exemplo), um serviço chamando outro.
- **Ponta a ponta (E2E):** o sistema inteiro pelo caminho do usuário, por exemplo com Playwright ou Cypress num navegador.
- **Contrato:** garante que provedor e consumidor de uma API concordam com o formato, sem precisar subir os dois.
- **Testes de desempenho e carga** (k6, Gatling, JMeter), **segurança** (análise estática, varredura de dependências) e **acessibilidade**.
- **Testes exploratórios** feitos por pessoas, que acham o que ninguém pensou em automatizar.

**TDD** (desenvolvimento guiado por testes): escreva um teste que falha, escreva o mínimo de código para passar, refatore. Repita. Força a pensar na interface antes da implementação e produz código testável.

Bons testes são **determinísticos**. Testes "intermitentes" (*flaky*), que às vezes falham sem mudança no código, destroem a confiança na suíte: conserte ou remova, não ignore.

### 3.3 Integração contínua

**Integração contínua** (CI): todos integram o seu trabalho na branch principal com frequência (pelo menos diariamente), e **cada mudança** dispara automaticamente: compilação, *linters*, testes, análise de segurança. Se quebrar, consertar é prioridade.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  testes:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: teste }
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: ruff check .
      - run: pytest --cov
```

Proteja a branch principal: só aceita PRs com CI passando e pelo menos uma aprovação.

Branches de vida curta (horas a poucos dias) evitam integrações dolorosas; trabalho incompleto pode ir para a branch principal escondido atrás de uma **chave de funcionalidade** (*feature flag*).

### 3.4 Entrega contínua

**Entrega contínua** (CD): toda mudança que passa no CI está **pronta para ir à produção**, com um clique. **Implantação contínua**: vai sozinha. Exige automação de todo o caminho: construir a imagem (um container, a etapa de Sistemas Operacionais), implantar em ambientes de teste e de produção, migrar o banco, verificar.

Práticas que tornam implantar seguro e chato (no bom sentido):

- **Infraestrutura como código** (Terraform, Ansible): o ambiente descrito em arquivos versionados, reproduzível.
- **Implantação gradual:** *canary* (a versão nova recebe 5% do tráfego primeiro), *blue-green* (dois ambientes e troca instantânea), com **reversão** rápida.
- **Migrações de banco compatíveis** com a versão anterior do código (expandir, migrar, contrair).
- **Observabilidade:** **logs** estruturados, **métricas** (latência, taxa de erro, saturação) e **rastreamento distribuído**; **alertas** sobre o que importa ao usuário (SLOs, objetivos de nível de serviço, como "99,9% das requisições bem-sucedidas em 30 dias").

As métricas **DORA** medem o desempenho de entrega de uma equipe: frequência de implantação, tempo entre o commit e a produção, taxa de falha das mudanças e tempo para restaurar o serviço. Equipes de elite implantam várias vezes por dia **com menos** falhas: velocidade e estabilidade andam juntas quando o processo é automatizado.

### Atividades de fixação do Tema 3

1. Revise um pull request de um colega (ou um PR aberto de um projeto de software livre) e escreva pelo menos 5 comentários construtivos, classificando cada um em obrigatório ou sugestão.
2. Para a funcionalidade "agendar consulta", liste os testes unitários, de integração e E2E que você escreveria.
3. Escreva com TDD uma função que calcula o horário de término de uma consulta considerando o horário de almoço da clínica (12h às 13h). Mostre a sequência de testes.
4. Explique por que um teste intermitente é perigoso e liste três causas comuns (tempo, ordem de execução, dependências externas).
5. **Projeto:** configure no repositório da equipe: proteção da branch principal, modelo de PR, CI com *linter* e testes rodando em cada PR, e implantação automática de um ambiente de demonstração (por exemplo, Render, Fly.io, Vercel ou um servidor da universidade).

## Tema 4: Equipe e manutenção

**Objetivo:** trabalhar bem em equipe, gerenciar o projeto e cuidar do software depois da primeira versão.

### 4.1 Trabalho em equipe

Equipes de software eficazes têm, acima de tudo, **segurança psicológica**: as pessoas se sentem à vontade para perguntar, admitir erros e discordar sem medo (o projeto **Aristotle** do Google apontou isso como o principal fator de times de alto desempenho).

Práticas que ajudam:

- **Acordos explícitos** desde o início: horários, canais (o que é urgente e o que pode esperar), como decidir, o que significa "pronto" (*definition of done*: código revisado, testado, documentado, implantado).
- **Programação em par** e em grupo (*mob programming*) para problemas difíceis e para espalhar conhecimento.
- **Comunicação assíncrona** escrita (as decisões documentadas sobrevivem às pessoas), e reuniões curtas, com pauta e conclusão registrada.
- **Retrospectivas sem culpa** (*blameless*): quando algo dá errado, pergunte "que falha no processo permitiu isso?", não "quem errou?". O mesmo vale para **pós-mortems** de incidentes em produção.
- **Fator ônibus:** quantas pessoas precisam sair para o projeto parar? Se a resposta é 1, espalhe o conhecimento.

### 4.2 Gestão de projetos

Gerir um projeto é equilibrar **escopo, prazo, custo e qualidade**. Se o prazo é fixo e o time também, o que se ajusta é o **escopo** (por isso a priorização do Tema 1).

- **Quebre o trabalho** em tarefas pequenas e visíveis no quadro.
- **Gerencie riscos:** liste o que pode dar errado, a probabilidade, o impacto e o que fazer. Ataque os maiores riscos cedo.
- **Acompanhe com dados:** tarefas concluídas por semana, gráfico de *burndown*, tempo de ciclo.
- **Comunique cedo e com honestidade:** um atraso anunciado com três semanas de antecedência é um ajuste de plano; anunciado no dia é uma crise.
- **Dívida técnica:** atalhos que aceleram agora e cobram juros depois (código sem testes, gambiarras, dependências desatualizadas). É uma ferramenta legítima quando assumida conscientemente e **paga** depois; vira um problema quando é invisível e acumula.

### 4.3 Manutenção

A maior parte do custo de um software (frequentemente estimada em mais de 60%) vem **depois** da primeira versão. Tipos de manutenção:

- **Corretiva:** consertar defeitos.
- **Adaptativa:** acompanhar mudanças do ambiente (nova versão do sistema operacional, de uma API externa, de uma lei).
- **Perfectiva:** novas funcionalidades e melhorias.
- **Preventiva:** refatorar e atualizar para evitar problemas futuros.

**Código legado** é código sem testes (definição de Michael Feathers). Para mudá-lo com segurança: escreva **testes de caracterização** (que registram o comportamento atual, mesmo que estranho), depois refatore em passos pequenos. Para substituir um sistema antigo aos poucos, use o padrão **estrangulador** (*strangler fig*): o novo sistema assume uma funcionalidade de cada vez, até o antigo poder ser desligado. Reescrever tudo do zero de uma vez é uma das apostas mais arriscadas da engenharia de software.

**Gestão de dependências:** fixe versões (arquivos de *lock*), atualize com frequência e de forma automática (Dependabot, Renovate) e acompanhe vulnerabilidades conhecidas. **Versionamento semântico** (MAJOR.MINOR.PATCH): MAJOR quebra compatibilidade, MINOR adiciona sem quebrar, PATCH corrige.

### 4.4 Software livre

**Software livre** dá aos usuários as liberdades de executar, estudar, modificar e redistribuir o programa. Quase toda a infraestrutura da computação é livre: Linux, Git, Python, PostgreSQL, Kubernetes, LLVM, os navegadores (Chromium, Firefox).

Licenças (aprofundadas na etapa de Ética):

- **Permissivas** (MIT, BSD, Apache 2.0): permitem quase tudo, inclusive usar em software fechado, desde que se mantenha o aviso de direitos autorais.
- ***Copyleft*** (GPL, AGPL): obras derivadas distribuídas precisam manter a mesma licença e ter o código aberto.

Contribuir com software livre é uma das melhores formas de aprender engenharia de software de verdade (código grande, revisão exigente, colaboração assíncrona com gente do mundo todo) e de construir um portfólio público. Comece pequeno: melhore a documentação, reproduza um *bug* relatado, procure *issues* marcadas como `good first issue`, leia o `CONTRIBUTING.md` e siga as convenções do projeto.

### Atividades de fixação do Tema 4

1. Escreva o acordo de trabalho da sua equipe (canais, horários, como decidir, definição de pronto).
2. Faça uma retrospectiva da primeira sprint do projeto no formato "o que foi bem, o que pode melhorar, o que vamos tentar" e registre as ações.
3. Liste três dívidas técnicas do seu projeto, com o "juro" que cada uma cobra e quando pretendem pagá-las.
4. Uma biblioteca que você usa passou da versão 2.7.3 para 3.0.0. O que esse número indica? Que cuidados tomar antes de atualizar?
5. Encontre um projeto de software livre que você usa, leia o guia de contribuição e faça uma contribuição pequena (documentação, teste, correção). Registre o processo.

## Projeto da etapa

**Projeto em grupo (3 a 5 pessoas) com cliente real ou fictício, do requisito à entrega:**

1. **Descoberta:** entrevista com o cliente, documento de visão, histórias de usuário com critérios de aceitação, MVP priorizado.
2. **Processo:** sprints de 1 semana (ou Kanban com limites), quadro de tarefas público, reuniões curtas registradas, retrospectiva a cada ciclo.
3. **Arquitetura:** diagrama C4, ADRs, especificação da API.
4. **Engenharia:** repositório com branch principal protegida, PRs pequenos revisados por pelo menos uma pessoa, CI com *linter* e testes (unitários, integração e pelo menos um E2E), implantação automática num ambiente de demonstração.
5. **Entrega:** demonstração para o cliente ao fim de cada ciclo, com o feedback registrado e incorporado ao *backlog*.
6. **Encerramento:** documentação de usuário e de desenvolvedor, um relatório individual curto (o que você fez, o que aprendeu, o que faria diferente) e uma apresentação final de 15 minutos com demonstração ao vivo.

Critérios de avaliação sugeridos: o cliente usou e valorizou o que foi entregue; qualidade do código e dos testes; uso real do processo (não só no papel); distribuição equilibrada das contribuições (visível no histórico do Git e nos PRs); qualidade da documentação e da apresentação.

## Para ir além

- *The Pragmatic Programmer* (Hunt e Thomas): hábitos de bons engenheiros de software.
- *A Philosophy of Software Design* (John Ousterhout): como reduzir complexidade (é o livro do curso de Stanford CS 190).
- *O Mítico Homem-Mês* (Fred Brooks): ensaios clássicos sobre projetos de software, ainda atuais.
- *Software Engineering at Google* (gratuito online): práticas de engenharia em escala.
- *Accelerate* (Forsgren, Humble e Kim): a pesquisa por trás das métricas DORA.
- *Working Effectively with Legacy Code* (Michael Feathers).
- **MIT 6.1020** (notas públicas) e o **Group Design Practical** de Oxford (relatos e projetos de anos anteriores no site do departamento).

## Resumão

- Construir a coisa errada é o maior risco. Requisitos funcionais e não funcionais, sempre testáveis.
- Histórias de usuário com critérios de aceitação. MoSCoW e MVP para priorizar.
- Ágil: ciclos curtos, software funcionando, feedback real. Scrum (sprints, papéis, cerimônias) ou Kanban (fluxo e limites).
- Lei de Brooks: mais gente num projeto atrasado o atrasa mais. Cascata quando mudar tarde é caro.
- Arquitetura: decisões difíceis de mudar, guiadas por requisitos não funcionais. Monólito modular antes de microsserviços. Registre decisões em ADRs.
- Módulos escondem decisões: alta coesão, baixo acoplamento, inversão de dependência, interfaces simples e profundas.
- APIs: fáceis de usar certo, consistentes, mínimas, versionadas, com erros informativos e códigos HTTP corretos.
- Revisão de código em PRs pequenos. Pirâmide de testes: muitos unitários, alguns de integração, poucos E2E. Sem testes intermitentes.
- CI: cada mudança integrada e testada automaticamente. CD: sempre pronto para produção, com implantação gradual e observabilidade.
- Equipes: segurança psicológica, acordos explícitos, retrospectivas sem culpa. Escopo é o que se ajusta.
- A maior parte do custo vem depois: manutenção. Legado é código sem testes; substitua aos poucos.
- Software livre: licenças permissivas e copyleft; contribuir é a melhor escola de engenharia.
