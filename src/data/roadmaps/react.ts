import type { Roadmap } from '../types'

export const react: Roadmap = {
  id: 'react',
  title: 'Roadmap Frontend React',
  short: 'Frontend React',
  icon: '⚛️',
  accent: '#0ea5e9',
  status: 'disponivel',
  objective:
    'Sair do zero até construir interfaces profissionais com React, TypeScript e Tailwind CSS, prontas para entrevista e produção.',
  intro:
    'Frontend é a parte do sistema que as pessoas veem e usam. React é a biblioteca mais pedida em vagas de front no Brasil, e o Tailwind virou o jeito mais comum de estilizar projetos novos. O caminho é: primeiro a base da web (HTML, CSS e JavaScript), depois React, depois o ecossistema. Quem pula a base sofre com bugs que não entende.',
  sections: [
    {
      id: 'fundamentos-web',
      title: 'Fundamentos da Web',
      summary: 'Como o navegador funciona, HTML semântico e CSS de verdade.',
      weeks: [
        {
          id: 'como-web-funciona',
          title: 'Como a web e o navegador funcionam',
          topics: ['HTTP e HTTPS', 'DNS', 'O que o navegador faz', 'DOM', 'Critical Rendering Path', 'DevTools', 'Git e GitHub'],
        },
        {
          id: 'html',
          title: 'HTML semântico e acessibilidade',
          topics: ['Estrutura de um documento', 'Tags semânticas', 'Formulários', 'Links e imagens', 'Acessibilidade (a11y)', 'ARIA', 'SEO básico'],
        },
        {
          id: 'css',
          title: 'CSS e layouts',
          topics: ['Seletores e especificidade', 'Box Model', 'Display e position', 'Flexbox', 'Grid', 'Responsividade', 'Unidades (rem, %, vh)', 'Variáveis CSS'],
        },
      ],
    },
    {
      id: 'javascript',
      title: 'JavaScript e TypeScript',
      summary: 'A linguagem do navegador a fundo, e o TypeScript que o mercado exige.',
      weeks: [
        {
          id: 'js-essencial',
          title: 'JavaScript essencial',
          topics: ['Tipos e coerção', 'let, const e escopo', 'Funções e arrow functions', 'Objetos e arrays', 'map, filter e reduce', 'Desestruturação e spread', 'Closures', 'this'],
        },
        {
          id: 'js-assincrono',
          title: 'Assíncrono e o navegador',
          topics: ['Event Loop', 'Callbacks', 'Promises', 'async/await', 'fetch e APIs', 'Manipulação do DOM', 'Eventos', 'Módulos ES'],
        },
        {
          id: 'typescript',
          title: 'TypeScript',
          topics: ['Tipos básicos', 'Interfaces e types', 'Union e narrowing', 'Generics', 'Utility types', 'tsconfig'],
        },
      ],
    },
    {
      id: 'react',
      title: 'React',
      summary: 'Componentes, estado e hooks: o coração do frontend moderno.',
      weeks: [
        {
          id: 'componentes',
          title: 'Componentes, JSX e props',
          topics: ['Por que React', 'Vite', 'JSX', 'Componentes', 'Props', 'Renderização condicional', 'Listas e key'],
        },
        {
          id: 'estado',
          title: 'Estado, eventos e efeitos',
          topics: ['useState', 'Eventos', 'Estado imutável', 'Levantar estado', 'useEffect', 'Ciclo de renderização', 'Strict Mode'],
        },
        {
          id: 'hooks',
          title: 'Hooks e padrões',
          topics: ['useRef', 'useMemo', 'useCallback', 'useReducer', 'Context API', 'Custom hooks', 'Composição de componentes'],
        },
        {
          id: 'rotas-forms',
          title: 'Rotas e formulários',
          topics: ['React Router', 'Rotas dinâmicas', 'Formulários controlados', 'React Hook Form', 'Validação com Zod', 'Tratamento de erros'],
        },
      ],
    },
    {
      id: 'tailwind',
      title: 'Tailwind CSS',
      summary: 'Estilizar rápido e consistente, do jeito que os projetos novos fazem.',
      weeks: [
        {
          id: 'tailwind-base',
          title: 'Tailwind na prática',
          topics: ['Utility-first', 'Instalação com Vite', 'Espaçamento e tipografia', 'Cores', 'Flex e Grid no Tailwind', 'Responsivo (sm, md, lg)', 'Estados (hover, focus)', 'Dark mode'],
        },
        {
          id: 'design-system',
          title: 'Componentes e design system',
          topics: ['Tema e design tokens', 'Componentes reutilizáveis', 'clsx e tailwind-merge', 'shadcn/ui', 'Acessibilidade em componentes', 'Animações e transições'],
        },
      ],
    },
    {
      id: 'ecossistema',
      title: 'Ecossistema React',
      summary: 'Buscar dados, gerenciar estado, testar e usar Next.js.',
      weeks: [
        {
          id: 'dados',
          title: 'Dados do servidor',
          topics: ['Estado do servidor vs do cliente', 'TanStack Query', 'Cache e revalidação', 'Mutations', 'Loading e erro', 'Paginação e scroll infinito'],
        },
        {
          id: 'estado-global',
          title: 'Estado global',
          topics: ['Quando usar estado global', 'Context com reducer', 'Zustand', 'Estado na URL', 'Persistência no localStorage'],
        },
        {
          id: 'testes',
          title: 'Testes no frontend',
          topics: ['Vitest', 'Testing Library', 'Testar comportamento', 'Mock de API com MSW', 'Playwright (E2E)'],
        },
        {
          id: 'nextjs',
          title: 'Next.js',
          topics: ['Por que um framework', 'App Router', 'Server Components', 'SSR, SSG e ISR', 'Server Actions', 'SEO e metadata'],
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance e Arquitetura',
      summary: 'Apps rápidos, bem organizados e prontos para produção.',
      weeks: [
        {
          id: 'web-vitals',
          title: 'Performance',
          topics: ['Core Web Vitals', 'Lighthouse', 'Re-renders e React.memo', 'Code splitting e lazy', 'Imagens otimizadas', 'Listas grandes (virtualização)'],
        },
        {
          id: 'arquitetura',
          title: 'Arquitetura e deploy',
          topics: ['Organização de pastas', 'Variáveis de ambiente', 'ESLint e Prettier', 'CI com GitHub Actions', 'Deploy na Vercel', 'Frontend System Design'],
        },
      ],
    },
  ],
  companiesTitle: 'Empresas que usam React',
  companies: [
    { name: 'Meta', how: 'Criou o React. Usa no Facebook, Instagram web e em ferramentas internas.' },
    { name: 'Netflix', how: 'Interfaces web e ferramentas internas.' },
    { name: 'Airbnb', how: 'Site principal; também lançou guias de estilo de JavaScript e React muito usados.' },
    { name: 'Mercado Livre', how: 'Frontends web do marketplace, com framework interno baseado em React.' },
    { name: 'iFood', how: 'Aplicações web para clientes, restaurantes e entregadores.' },
    { name: 'QuintoAndar', how: 'Plataforma web de aluguel e venda de imóveis.' },
    { name: 'Magalu', how: 'Frontends do e-commerce e ferramentas internas.' },
    { name: 'Itaú Unibanco', how: 'Canais digitais e plataformas internas.' },
    { name: 'Shopify', how: 'Painel de lojistas e o design system Polaris, em React.' },
    { name: 'Discord', how: 'Aplicativo web e desktop.' },
    { name: 'Vercel', how: 'Mantém o Next.js; o site usa React e Tailwind CSS.' },
    { name: 'GitHub', how: 'Partes cada vez maiores da interface usam React.' },
  ],
  projects: [
    {
      id: 'landing-page',
      title: 'Landing page responsiva',
      level: 'Iniciante',
      description: 'Uma página de produto que funciona bem no celular e no desktop, só com HTML e Tailwind.',
      skills: ['HTML semântico', 'Tailwind CSS', 'Responsividade', 'Acessibilidade'],
    },
    {
      id: 'todo',
      title: 'Lista de tarefas',
      level: 'Iniciante',
      description: 'Adicionar, concluir, filtrar e apagar tarefas, com tudo salvo no localStorage.',
      skills: ['useState', 'Listas e key', 'Formulários', 'localStorage'],
    },
    {
      id: 'clima',
      title: 'App de clima',
      level: 'Iniciante',
      description: 'Busque uma cidade e mostre a previsão consumindo uma API pública, com loading e erro.',
      skills: ['fetch', 'useEffect', 'Tratamento de erro', 'TypeScript'],
    },
    {
      id: 'quiz',
      title: 'Quiz com placar',
      level: 'Intermediário',
      description: 'Perguntas de múltipla escolha com timer, placar final e histórico de partidas.',
      skills: ['useReducer', 'Custom hooks', 'React Router', 'Testes com Vitest'],
    },
    {
      id: 'kanban',
      title: 'Quadro Kanban',
      level: 'Intermediário',
      description: 'Colunas e cartões com arrastar e soltar, dark mode e atalhos de teclado.',
      skills: ['Zustand', 'Drag and drop', 'Dark mode', 'Acessibilidade'],
    },
    {
      id: 'github-dashboard',
      title: 'Dashboard do GitHub',
      level: 'Intermediário',
      description: 'Busque um usuário e mostre repositórios, linguagens e gráficos, com cache e paginação.',
      skills: ['TanStack Query', 'Gráficos', 'Paginação', 'Estado na URL'],
    },
    {
      id: 'ecommerce-next',
      title: 'Loja virtual com Next.js',
      level: 'Avançado',
      description: 'Catálogo com SEO, carrinho, checkout simulado e páginas geradas no servidor.',
      skills: ['Next.js', 'Server Components', 'Server Actions', 'Playwright'],
    },
    {
      id: 'design-system',
      title: 'Design system próprio',
      level: 'Avançado',
      description: 'Biblioteca de componentes acessíveis (botão, modal, select, toast) documentada no Storybook.',
      skills: ['Tailwind', 'Acessibilidade', 'Storybook', 'Testes de componentes'],
    },
  ],
}
