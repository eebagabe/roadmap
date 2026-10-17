# CI/CD e Qualidade Contínua: Apostila Prática

Roadmap QA · Semanas 14 e 15

## Comece por aqui

Teste automatizado que só roda na máquina do QA, quando ele lembra, vale pouco. O valor aparece quando os testes rodam **sozinhos a cada mudança**, dão resposta em minutos e **impedem** que código quebrado chegue em produção. Esta apostila fecha o roadmap com pipeline, estratégia e o papel do QA moderno.

### Por que isso vale ouro no mercado

- Vagas de QA pleno e sênior pedem "integrar testes ao CI/CD" quase sempre.
- QAs que pensam em **estratégia** (o que testar, onde e como) viram referência no time e chegam a cargos como QA Lead e SDET.
- Empresas que fazem vários deploys por dia dependem de testes automatizados confiáveis.

### Como esta apostila funciona

1. Use os projetos das etapas anteriores (Playwright e testes de API) num repositório no GitHub.
2. Vamos construir um pipeline no **GitHub Actions** (gratuito para repositórios públicos).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** pipeline falhando? Abra o log do passo que falhou e leia de **baixo para cima** até a primeira mensagem de erro real. Rode o mesmo comando localmente.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 14 | Tema 1: Testes no pipeline |
| 15 | Tema 2: Estratégia e o QA moderno + projeto final |

## Tema 1: Testes no pipeline

**Objetivo:** rodar testes automaticamente, em paralelo, com relatórios e regras de bloqueio.

### 1.1 CI/CD

- **CI (Integração Contínua):** a cada push ou pull request, o código é compilado e testado automaticamente.
- **CD (Entrega/Implantação Contínua):** o que passou no CI é publicado em um ambiente (homologação, produção) automaticamente.

Um pipeline típico:

```
push/PR → build → testes de unidade → testes de API → deploy em homologação → E2E + smoke → (aprovação) → produção → smoke em produção
```

Testes **rápidos primeiro**: se a unidade falhar, nem gaste tempo com E2E. Isso é **feedback rápido**.

### 1.2 GitHub Actions

Workflows ficam em `.github/workflows/*.yml`.

```yaml
name: testes
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '0 9 * * 1-5'      # também roda de segunda a sexta às 9h (UTC)

jobs:
  api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright test tests/api
        env:
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_SENHA: ${{ secrets.ADMIN_SENHA }}

  e2e:
    needs: api                   # só roda se a API passou
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test tests/e2e --project=chromium
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}  # publica o relatório mesmo se os testes falharem
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

Segredos (senhas, tokens) ficam em **Settings > Secrets and variables > Actions**, nunca no YAML.

### 1.3 Docker para QA

Docker resolve o "na minha máquina funciona": o ambiente de teste é o mesmo em todo lugar.

```bash
# subir a API de estudo localmente
docker run -p 3000:3000 paulogoncalvesbh/serverest:latest

# rodar os testes Playwright dentro da imagem oficial (navegadores já instalados)
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.49.0-noble npx playwright test
```

Com **Docker Compose** você sobe sistema + banco + testes juntos:

```yaml
services:
  api:
    image: paulogoncalvesbh/serverest:latest
    ports: ["3000:3000"]
  testes:
    image: mcr.microsoft.com/playwright:v1.49.0-noble
    working_dir: /work
    volumes: [".:/work"]
    environment:
      BASE_URL: http://api:3000
    command: npx playwright test tests/api
    depends_on: [api]
```

> **Na prática:** a versão da imagem do Playwright deve ser a **mesma** da dependência `@playwright/test` do `package.json`.

### 1.4 Execução paralela

Suítes grandes ficam lentas. Opções:

- **Workers:** o Playwright roda arquivos em paralelo na mesma máquina (`workers` no config).
- **Sharding:** divide a suíte entre várias máquinas.

```yaml
  e2e:
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      # ...
      - run: npx playwright test --shard=${{ matrix.shard }}
```

Paralelismo só funciona com **testes independentes** (dados próprios, sem ordem). É aqui que as boas práticas das etapas anteriores se pagam.

### 1.5 Relatórios

- **HTML do Playwright:** detalhado, com trace e vídeo das falhas.
- **Allure:** relatório bonito com histórico, categorias de falha, passos e anexos; funciona com Playwright, JUnit, REST Assured, Cypress.
- **JUnit XML:** formato que quase toda ferramenta de CI entende (mostra os testes na interface do pipeline).

```ts
// playwright.config.ts
reporter: [['html'], ['junit', { outputFile: 'results/junit.xml' }], ['allure-playwright']]
```

Um bom relatório responde em segundos: **o que falhou, onde e por quê** (com evidência).

### 1.6 Quality gates

Regras que **bloqueiam** o avanço se a qualidade não atingir um mínimo:

- Pull request só pode ser mergeado com o CI verde (branch protection).
- Cobertura de testes de unidade não pode cair.
- Nenhuma vulnerabilidade crítica nas dependências.
- Thresholds de performance do k6 atendidos.
- Nenhuma violação crítica de acessibilidade.

Ferramentas como **SonarQube/SonarCloud** reúnem cobertura, bugs, code smells e vulnerabilidades com um "gate" de aprovado/reprovado.

> **Cuidado! Cai na entrevista:** "O pipeline está vermelho por causa de um teste flaky e o time quer desligar o teste. O que você faz?" Resposta: move o teste para **quarentena** (roda, mas não bloqueia), abre uma tarefa com prazo para corrigir, investiga a causa com trace/vídeo e devolve à suíte principal quando estabilizar. Nunca simplesmente apagar ou ignorar.

### Atividades de fixação do Tema 1

1. Desenhe o pipeline ideal para um time que faz deploy diário de uma API e um front-end. Onde entra cada tipo de teste?
2. Crie o workflow do exemplo para o seu repositório de testes e faça-o rodar num pull request.
3. Configure o upload do relatório HTML como artifact, mesmo em caso de falha. Force uma falha e baixe o relatório.
4. Divida a suíte E2E em 2 shards. Quanto tempo diminuiu?
5. Configure a branch `main` para exigir o CI verde antes do merge.

## Tema 2: Estratégia e o QA moderno

**Objetivo:** decidir onde investir esforço de teste e entender para onde a carreira caminha.

### 2.1 Pirâmide e troféu de testes

**Pirâmide** (clássica):

```
        /\         E2E/UI: poucos, lentos, caros
       /  \
      /----\       Integração/API: quantidade média
     /      \
    /--------\     Unidade: muitos, rápidos, baratos
```

**Troféu** (popular no front-end): pouca unidade "pura", **muita integração** (componentes com suas dependências reais ou mockadas na borda), alguns E2E, e uma base de **análise estática** (TypeScript, ESLint).

O anti-padrão é o **cone de sorvete**: muitos testes manuais e E2E, quase nenhum de unidade ou API. Suíte lenta, frágil e cara.

> **Na prática:** a forma exata importa menos do que o princípio: **teste cada coisa no nível mais baixo (mais rápido e estável) que consegue encontrar aquele bug**. Regra de cálculo de frete? Unidade ou API. O botão de comprar leva ao pagamento? Um E2E.

### 2.2 Estratégia de automação

Perguntas para decidir **o que automatizar**:

| Automatize | Não automatize (ou deixe para depois) |
|---|---|
| Regressão de fluxos críticos | Funcionalidade que ainda está mudando toda semana |
| Testes repetidos a cada release | Teste executado uma única vez |
| Muitas combinações de dados | Avaliação de usabilidade e visual subjetivo |
| Pré-condições de outros testes (dados via API) | Cenários raros com setup muito caro |

Métricas da automação: tempo total da suíte, taxa de flaky, bugs encontrados pela automação, tempo de manutenção. Uma suíte de 2 horas que ninguém olha vale menos que uma de 10 minutos confiável.

### 2.3 Testes em produção (shift-right)

Nem tudo dá para reproduzir em homologação. Práticas:

- **Smoke test pós-deploy:** verificações rápidas dos fluxos críticos logo após publicar.
- **Monitoramento sintético:** um teste (ex.: login + busca) roda a cada 5 minutos em produção e alerta se falhar.
- **Feature flags:** liberar a funcionalidade para 1%, 10%, 100% dos usuários, observando os indicadores.
- **Canary release:** nova versão para uma fração do tráfego antes de todos.
- **Testes A/B:** comparar versões com usuários reais.

Cuidado com dados: testes em produção usam contas de teste identificadas e nunca fazem compras ou transferências reais (ou têm estorno automático).

### 2.4 Observabilidade para QA

Saber ler **logs, métricas e traces** ajuda o QA a investigar bugs sem depender do dev:

- **Logs** (Kibana, Grafana Loki, Datadog): buscar pelo ID do pedido ou pelo horário do teste.
- **Métricas** (Grafana, Datadog): a taxa de erro subiu depois do deploy?
- **Traces** (Jaeger, Tempo): por quais serviços a requisição passou e onde demorou.
- **Ferramentas de erro do front** (Sentry): quantos usuários viram o erro, em qual navegador.

Um relatório de bug com "veja o trace X, o serviço de frete retornou 500 às 14:32" economiza horas.

### 2.5 IA nos testes

Ferramentas de IA já ajudam o QA a:

- Gerar ideias de cenários e casos a partir de uma história (sempre revise: elas inventam regras).
- Gerar massa de dados.
- Escrever e refatorar código de automação, e explicar erros.
- Analisar falhas e agrupar testes que falham pela mesma causa.
- Testes "autocorretivos" (self-healing) que se adaptam a pequenas mudanças de seletor.

E testar **sistemas com IA** é uma área nova: respostas não determinísticas, alucinações, viés, segurança contra prompt injection. O QA que entende isso tem espaço crescente.

> **Na prática:** IA acelera, mas a responsabilidade continua sua. Nunca cole dados reais de clientes ou segredos em ferramentas externas, e revise todo código e caso gerado.

### 2.6 Carreira em QA

Caminhos comuns:

| Caminho | Foco |
|---|---|
| **QA Analyst** | Testes manuais, casos, exploratório, negócio |
| **QA Automation / SDET** | Automação, frameworks, pipeline; perfil muito técnico |
| **QA Lead / Quality Manager** | Estratégia, processos, pessoas, métricas |
| **Performance / Security Tester** | Especializações técnicas |
| **Quality Engineer** | Qualidade em todo o ciclo, junto dos devs (shift-left e shift-right) |

Para o portfólio: projetos públicos no GitHub com README caprichado (como rodar, estratégia, prints do relatório), pipeline verde e um texto explicando suas decisões. A certificação ISTQB CTFL ajuda a passar em filtros de RH.

### Atividades de fixação do Tema 2

1. Para cada teste, diga o nível ideal (unidade, API/integração, E2E): (a) cálculo de juros do parcelamento; (b) usuário consegue completar uma compra do início ao fim; (c) endpoint de cadastro valida e-mail duplicado; (d) formatação de CPF; (e) botão "pagar" aparece desabilitado sem forma de pagamento.
2. Uma empresa tem 600 testes E2E (3 horas), 20 de API e nenhum de unidade. Descreva o problema e um plano de 3 meses para melhorar.
3. Escreva a estratégia de testes (1 página) para um app de delivery que faz deploy duas vezes por semana.
4. Proponha 3 monitoramentos sintéticos para um e-commerce em produção.
5. Use uma ferramenta de IA para gerar casos de teste a partir de uma história de usuário. Liste o que estava bom, o que estava errado e o que faltou.

## Projeto da etapa: projeto final do roadmap

**Framework de testes completo, num único repositório:**

1. Testes de **API** (ServeRest local via Docker) e **E2E** (Sauce Demo) com Playwright ou Java.
2. Teste de **acessibilidade** com axe-core e de **performance** com k6 (smoke no PR, carga agendada).
3. **Pipeline** no GitHub Actions: API → E2E em 2 shards → relatório publicado como artifact (ou no GitHub Pages).
4. **Quality gate:** branch protegida exigindo o pipeline verde.
5. **Docker Compose** para rodar tudo localmente com um comando.
6. **README** com a estratégia (pirâmide, o que foi automatizado e por quê), como rodar e prints do relatório.

Esse é o projeto que você mostra na entrevista de QA.

## Resumão

- CI roda testes a cada mudança; CD publica o que passou. Testes rápidos primeiro.
- GitHub Actions: workflows em YAML, segredos em Secrets, artifacts com relatórios.
- Docker deixa o ambiente igual em todo lugar.
- Paralelismo e sharding exigem testes independentes.
- Quality gates bloqueiam o que não atinge o mínimo; flaky vai para quarentena, não para o lixo.
- Teste cada coisa no nível mais baixo possível. Evite o cone de sorvete.
- Shift-right: smoke pós-deploy, monitoramento sintético, feature flags.
- IA acelera, mas a responsabilidade é sua.
