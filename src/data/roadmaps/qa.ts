import type { Roadmap } from '../types'

export const qa: Roadmap = {
  id: 'qa',
  title: 'Roadmap QA',
  short: 'QA',
  icon: '🧪',
  accent: '#16a34a',
  status: 'disponivel',
  objective:
    'Formar um QA completo: do teste manual bem feito à automação de interface, API e performance rodando no pipeline.',
  intro:
    'QA (Quality Assurance) é quem garante que o software funciona do jeito certo antes de chegar no cliente. Não é "quem clica até achar bug": é quem entende o negócio, pensa nos cenários que ninguém pensou e automatiza o que se repete. O caminho aqui é: fundamentos de teste, teste manual bem documentado, depois automação (web, API, performance) e por fim qualidade contínua no pipeline.',
  sections: [
    {
      id: 'fundamentos-qa',
      title: 'Fundamentos de Teste',
      summary: 'O que é qualidade, como pensar testes e como o QA trabalha no time ágil.',
      weeks: [
        {
          id: 'qualidade',
          title: 'Qualidade e o papel do QA',
          topics: ['QA vs QC vs Teste', 'Erro, defeito e falha', 'Os 7 princípios do teste', 'Verificação vs validação', 'Ciclo de vida do software', 'Níveis de teste', 'ISTQB CTFL'],
        },
        {
          id: 'tecnicas',
          title: 'Tipos e técnicas de teste',
          topics: ['Funcional vs não funcional', 'Caixa preta e caixa branca', 'Partição de equivalência', 'Análise de valor limite', 'Tabela de decisão', 'Transição de estados', 'Teste exploratório', 'Regressão e smoke'],
        },
        {
          id: 'agil',
          title: 'QA no time ágil',
          topics: ['Scrum e Kanban', 'Critérios de aceite', 'BDD', 'Gherkin', 'Shift-left', 'Definition of Done', 'Three Amigos'],
        },
      ],
    },
    {
      id: 'testes-manuais',
      title: 'Testes Manuais',
      summary: 'Planejar, documentar e reportar bugs de um jeito que o time agradece.',
      weeks: [
        {
          id: 'planejamento',
          title: 'Planejamento e documentação',
          topics: ['Estratégia vs plano de teste', 'Cenários e casos de teste', 'Massa de dados', 'Matriz de rastreabilidade', 'Checklists', 'Priorização por risco'],
        },
        {
          id: 'bugs',
          title: 'Bugs e gestão de testes',
          topics: ['Ciclo de vida do bug', 'Severidade vs prioridade', 'Relatório de bug', 'Jira', 'Evidências', 'Métricas de qualidade', 'DevTools para QA'],
        },
      ],
    },
    {
      id: 'automacao-web',
      title: 'Automação Web',
      summary: 'Automatizar o que se repete, com código que não quebra toda semana.',
      weeks: [
        {
          id: 'programacao',
          title: 'Programação para QA',
          topics: ['Lógica de programação', 'JavaScript e TypeScript', 'Node e npm', 'Git e GitHub', 'Async/await', 'Terminal'],
        },
        {
          id: 'seletores',
          title: 'DOM e seletores',
          topics: ['HTML e DOM', 'Seletores CSS', 'XPath', 'Locators por papel e texto', 'data-testid', 'Esperas'],
        },
        {
          id: 'playwright',
          title: 'Playwright',
          topics: ['Instalação e estrutura', 'Locators e actions', 'Assertions', 'Fixtures', 'Trace Viewer', 'Codegen', 'Múltiplos navegadores'],
        },
        {
          id: 'padroes',
          title: 'Cypress, Selenium e padrões',
          topics: ['Cypress', 'Selenium WebDriver', 'Page Object Model', 'Dados de teste', 'Testes flaky', 'Cucumber'],
        },
      ],
    },
    {
      id: 'testes-api',
      title: 'Testes de API',
      summary: 'Testar o backend direto: mais rápido, mais estável e acha bug mais cedo.',
      weeks: [
        {
          id: 'http-postman',
          title: 'HTTP e Postman',
          topics: ['HTTP e REST', 'Status codes', 'JSON', 'Postman', 'Variáveis e ambientes', 'Scripts de teste', 'Newman'],
        },
        {
          id: 'automacao-api',
          title: 'Automação de API',
          topics: ['Testes de API no Playwright', 'REST Assured', 'Validação de schema', 'Autenticação nos testes', 'Contract testing', 'SQL para QA'],
        },
      ],
    },
    {
      id: 'performance-seguranca',
      title: 'Performance e Segurança',
      summary: 'Aguenta a Black Friday? É seguro? É acessível? Também é qualidade.',
      weeks: [
        {
          id: 'performance',
          title: 'Testes de performance',
          topics: ['Carga, estresse, pico e resistência', 'Métricas (p95, RPS, erros)', 'k6', 'JMeter', 'Thresholds', 'Analisar resultados'],
        },
        {
          id: 'seguranca-a11y',
          title: 'Segurança, acessibilidade e mobile',
          topics: ['OWASP Top 10 para QA', 'OWASP ZAP', 'Testes de acessibilidade', 'axe-core', 'Testes mobile', 'Appium'],
        },
      ],
    },
    {
      id: 'qualidade-continua',
      title: 'CI/CD e Qualidade Contínua',
      summary: 'Testes rodando sozinhos a cada mudança, com relatórios que o time entende.',
      weeks: [
        {
          id: 'cicd',
          title: 'Testes no pipeline',
          topics: ['CI/CD', 'GitHub Actions', 'Docker para QA', 'Execução paralela', 'Relatórios (Allure, HTML)', 'Quality gates'],
        },
        {
          id: 'estrategia',
          title: 'Estratégia e o QA moderno',
          topics: ['Pirâmide e troféu de testes', 'Estratégia de automação', 'Testes em produção', 'Observabilidade para QA', 'IA nos testes', 'Carreira em QA'],
        },
      ],
    },
  ],
  companiesTitle: 'Empresas que contratam QA',
  companies: [
    { name: 'Mercado Livre', how: 'Times de qualidade com automação de web, mobile e API em escala.' },
    { name: 'Itaú Unibanco', how: 'QA em squads ágeis, com foco em automação e testes de API.' },
    { name: 'iFood', how: 'Engenharia de qualidade para app, web e serviços de backend.' },
    { name: 'PicPay', how: 'Automação de testes mobile e de API na carteira digital.' },
    { name: 'Stone', how: 'Qualidade de sistemas de pagamento e maquininhas.' },
    { name: 'Globo', how: 'Testes do Globoplay e dos portais, incluindo performance em grandes eventos.' },
    { name: 'CI&T', how: 'Consultoria que aloca QAs em projetos de grandes clientes.' },
    { name: 'Zup', how: 'Engenharia de qualidade em projetos de tecnologia do grupo Itaú.' },
    { name: 'Thoughtworks', how: 'Consultoria conhecida por práticas de testes e entrega contínua.' },
    { name: 'Microsoft', how: 'Criou e mantém o Playwright, uma das ferramentas de automação mais usadas.' },
    { name: 'Google', how: 'Engenheiros de teste e ferramentas como o Lighthouse e o Puppeteer.' },
    { name: 'Spotify', how: 'Qualidade em times autônomos, com muita automação no pipeline.' },
  ],
  projects: [
    {
      id: 'plano-teste',
      title: 'Plano e casos de teste de um e-commerce',
      level: 'Iniciante',
      description: 'Escolha um site de loja real e escreva o plano, os cenários em Gherkin e os casos de teste do fluxo de compra.',
      skills: ['Técnicas de teste', 'Gherkin', 'Priorização por risco', 'Documentação'],
    },
    {
      id: 'bug-hunting',
      title: 'Caça a bugs no Sauce Demo',
      level: 'Iniciante',
      description: 'Faça teste exploratório no saucedemo.com com os usuários problemáticos e reporte os bugs com evidências.',
      skills: ['Teste exploratório', 'Relatório de bug', 'Severidade e prioridade', 'DevTools'],
    },
    {
      id: 'postman-serverest',
      title: 'Coleção Postman da ServeRest',
      level: 'Iniciante',
      description: 'Teste a API de estudos ServeRest com coleção, ambientes, scripts de validação e execução via Newman.',
      skills: ['Postman', 'HTTP', 'Variáveis', 'Newman'],
    },
    {
      id: 'playwright-e2e',
      title: 'Automação E2E com Playwright',
      level: 'Intermediário',
      description: 'Automatize login, carrinho e checkout do Sauce Demo com Page Objects, fixtures e relatório HTML.',
      skills: ['Playwright', 'TypeScript', 'Page Object', 'Fixtures'],
    },
    {
      id: 'rest-assured',
      title: 'Framework de API com REST Assured',
      level: 'Intermediário',
      description: 'Testes da ServeRest em Java com REST Assured, JUnit 5, validação de schema e dados gerados.',
      skills: ['Java', 'REST Assured', 'JSON Schema', 'JUnit 5'],
    },
    {
      id: 'k6-carga',
      title: 'Teste de carga com k6',
      level: 'Intermediário',
      description: 'Simule usuários comprando ao mesmo tempo, defina thresholds e escreva um relatório com o que encontrou.',
      skills: ['k6', 'Métricas', 'Thresholds', 'Análise'],
    },
    {
      id: 'pipeline',
      title: 'Pipeline de testes no GitHub Actions',
      level: 'Avançado',
      description: 'Rode testes de API, E2E e acessibilidade em paralelo a cada pull request, com relatório Allure publicado.',
      skills: ['GitHub Actions', 'Paralelismo', 'Allure', 'Quality gates'],
    },
    {
      id: 'framework-completo',
      title: 'Framework de testes completo',
      level: 'Avançado',
      description: 'Um repositório com testes de UI, API, visual, acessibilidade e performance, rodando em Docker e no CI.',
      skills: ['Arquitetura de testes', 'Docker', 'Testes visuais', 'axe-core', 'k6'],
    },
  ],
}
