import type { Roadmap } from '../types'

export const java: Roadmap = {
  id: 'java',
  title: 'Roadmap Java Backend',
  short: 'Java Backend',
  icon: '☕',
  accent: '#e76f00',
  status: 'disponivel',
  objective:
    'Construir fundamentos sólidos para entrevistas de Java Backend, com foco em LeetCode, perguntas técnicas e System Design.',
  intro:
    'Java é a linguagem que roda dentro dos bancos, das fintechs e de boa parte do e-commerce do Brasil. É estável, tem muita vaga e paga bem. A ideia aqui é simples: primeiro você entende como o computador funciona, depois treina lógica para entrevistas e só então entra em Spring, microsserviços e arquitetura. Sem pular etapa.',
  sections: [
    {
      id: 'fundamentos',
      title: 'Fundamentos',
      summary: 'Como o computador, o sistema operacional e a internet funcionam por baixo dos panos.',
      weeks: [
        {
          id: 'computadores',
          title: 'Como computadores executam programas',
          topics: ['CPU', 'RAM', 'Código fonte e código de máquina', 'Compilação', 'Preprocessing, compiling, assembling e linking', 'Endereços de memória', 'Stack', 'Heap', 'Call Stack'],
        },
        {
          id: 'sistema-operacional',
          title: 'Sistema operacional, processos e memória',
          topics: ['Sistema operacional', 'Processo', 'Thread', 'Process vs Thread', 'Context Switch', 'Virtual Memory', 'Address Space', 'Paging', 'I/O'],
        },
        {
          id: 'redes',
          title: 'Redes e internet',
          topics: ['IP e portas', 'DNS', 'TCP vs UDP', 'HTTP e HTTPS', 'TLS', 'Latência e banda', 'O que acontece ao digitar uma URL'],
        },
      ],
    },
    {
      id: 'leetcode',
      title: 'LeetCode',
      summary: 'Estruturas de dados e algoritmos: o que mais derruba candidato em entrevista técnica.',
      weeks: [
        {
          id: 'big-o',
          title: 'Big O e estruturas de dados fundamentais',
          topics: ['Time Complexity', 'Space Complexity', 'Big O', 'Array', 'Dynamic Array', 'Linked List', 'Stack', 'Queue', 'Deque'],
        },
        {
          id: 'hash-trees',
          title: 'Hash Tables, Trees, Heaps e Graphs',
          topics: ['Hash Table', 'HashMap', 'HashSet', 'Tree', 'Binary Tree', 'Binary Search Tree', 'Heap', 'Priority Queue', 'Graph'],
        },
        {
          id: 'algoritmos',
          title: 'Algoritmos fundamentais',
          topics: ['Linear Search', 'Binary Search', 'Sorting', 'Merge Sort', 'Quick Sort', 'Recursion', 'Divide and Conquer'],
        },
        {
          id: 'arrays-strings',
          title: 'Arrays e Strings',
          topics: ['Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Sliding Window', 'Prefix Sum'],
        },
        {
          id: 'trees-graphs',
          title: 'Trees, Graphs e problemas recursivos',
          topics: ['Trees', 'DFS', 'BFS', 'Graphs', 'Backtracking', 'Topological Sort', 'Union-Find'],
        },
        {
          id: 'dp-padroes',
          title: 'Programação dinâmica e padrões de entrevista',
          topics: ['Memoization', 'Tabulation', 'Greedy', 'Intervals', 'Monotonic Stack', 'Como falar durante a entrevista'],
        },
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      summary: 'O que todo backend precisa saber, independente da linguagem: HTTP, banco e segurança.',
      weeks: [
        {
          id: 'web-apis',
          title: 'Como a web funciona e APIs',
          topics: ['HTTP', 'Métodos e status codes', 'REST', 'JSON', 'Headers', 'Cookies', 'CORS', 'Design de API'],
        },
        {
          id: 'bancos',
          title: 'Banco de dados',
          topics: ['SQL', 'Modelagem', 'Normalização', 'Joins', 'Índices', 'Transações', 'ACID', 'NoSQL'],
        },
        {
          id: 'seguranca',
          title: 'Segurança e boas práticas',
          topics: ['Autenticação vs Autorização', 'Sessão vs JWT', 'OAuth2', 'Hash de senha', 'OWASP Top 10', 'Logs', 'Variáveis de ambiente', 'Pirâmide de testes'],
        },
      ],
    },
    {
      id: 'java-backend',
      title: 'Java Backend',
      summary: 'A linguagem Java a fundo e o ecossistema Spring que o mercado usa.',
      weeks: [
        {
          id: 'java-essencial',
          title: 'Java essencial e orientação a objetos',
          topics: ['JVM, JDK e JRE', 'Tipos primitivos', 'Classes e objetos', 'Encapsulamento', 'Herança', 'Polimorfismo', 'Interfaces', 'Records', 'Exceções'],
        },
        {
          id: 'collections-streams',
          title: 'Collections, Generics e Streams',
          topics: ['List', 'Set', 'Map', 'equals e hashCode', 'Generics', 'Lambdas', 'Stream API', 'Optional'],
        },
        {
          id: 'concorrencia-jvm',
          title: 'Concorrência e JVM',
          topics: ['Threads', 'ExecutorService', 'CompletableFuture', 'synchronized e locks', 'Virtual Threads', 'Garbage Collector', 'Memória da JVM'],
        },
        {
          id: 'spring-boot',
          title: 'Spring Boot',
          topics: ['Injeção de dependência', 'Spring Boot', 'Controllers REST', 'Bean Validation', 'Tratamento de erros', 'Profiles e configuração', 'Maven e Gradle'],
        },
        {
          id: 'persistencia',
          title: 'Persistência com JPA',
          topics: ['JDBC', 'JPA e Hibernate', 'Spring Data JPA', 'Relacionamentos', 'Problema N+1', 'Migrations com Flyway', '@Transactional'],
        },
        {
          id: 'qualidade-deploy',
          title: 'Testes, segurança e deploy',
          topics: ['JUnit 5', 'Mockito', 'Testcontainers', 'Spring Security', 'Docker', 'Actuator e observabilidade', 'CI/CD'],
        },
      ],
    },
    {
      id: 'sistemas-distribuidos',
      title: 'Sistemas Distribuídos',
      summary: 'Quando um servidor só não dá conta: vários serviços conversando e falhando.',
      weeks: [
        {
          id: 'fundamentos-distribuidos',
          title: 'Fundamentos de sistemas distribuídos',
          topics: ['O que é um sistema distribuído', 'Falhas parciais', 'Teorema CAP', 'Consistência eventual', 'Idempotência', 'Timeouts e retries'],
        },
        {
          id: 'comunicacao',
          title: 'Comunicação entre serviços',
          topics: ['Síncrono vs assíncrono', 'REST vs gRPC', 'Mensageria', 'Kafka', 'RabbitMQ', 'Event-Driven', 'Outbox Pattern'],
        },
        {
          id: 'microsservicos',
          title: 'Microsserviços e resiliência',
          topics: ['Monolito vs microsserviços', 'API Gateway', 'Service Discovery', 'Circuit Breaker', 'Saga', 'Rate Limiting', 'Tracing distribuído'],
        },
      ],
    },
    {
      id: 'system-design',
      title: 'System Design',
      summary: 'Desenhar sistemas grandes e defender suas escolhas, como pedem as entrevistas sênior.',
      weeks: [
        {
          id: 'blocos',
          title: 'Blocos de construção',
          topics: ['Escalabilidade vertical e horizontal', 'Load Balancer', 'Cache', 'CDN', 'Replicação', 'Sharding', 'Filas'],
        },
        {
          id: 'metodo',
          title: 'Método para a entrevista',
          topics: ['Requisitos funcionais e não funcionais', 'Estimativas de capacidade', 'Design da API', 'Modelo de dados', 'Diagrama de alto nível', 'Gargalos e trade-offs'],
        },
        {
          id: 'cases',
          title: 'Cases clássicos',
          topics: ['Encurtador de URL', 'Rate Limiter', 'Feed de notícias', 'Chat em tempo real', 'Sistema de pagamentos'],
        },
      ],
    },
  ],
  companiesTitle: 'Empresas que usam Java',
  companies: [
    { name: 'Itaú Unibanco', how: 'Sistemas bancários e APIs internas, muitos em Java com Spring.' },
    { name: 'Bradesco', how: 'Serviços de backend do banco digital e integrações.' },
    { name: 'Banco do Brasil', how: 'Plataformas internas e canais digitais.' },
    { name: 'Santander', how: 'Microsserviços dos canais digitais.' },
    { name: 'Mercado Livre', how: 'Parte grande dos microsserviços do marketplace e do Mercado Pago.' },
    { name: 'iFood', how: 'Backend de pedidos e logística, com Java e Kotlin.' },
    { name: 'PicPay', how: 'Serviços da carteira digital, com Java e Kotlin.' },
    { name: 'Netflix', how: 'Backend de streaming; criou bibliotecas Java famosas como Eureka e Hystrix.' },
    { name: 'Amazon', how: 'Muitos serviços internos e da AWS são escritos em Java.' },
    { name: 'Uber', how: 'Serviços de backend de alta escala.' },
    { name: 'LinkedIn', how: 'Backend da rede social; berço do Kafka, que roda na JVM.' },
    { name: 'Spotify', how: 'Boa parte dos serviços de backend.' },
  ],
  projects: [
    {
      id: 'task-tracker',
      title: 'Gerenciador de tarefas no terminal',
      level: 'Iniciante',
      description: 'Um programa de linha de comando para adicionar, listar, concluir e apagar tarefas, salvando tudo num arquivo JSON.',
      skills: ['Java puro', 'Collections', 'Leitura e escrita de arquivos', 'Exceções'],
    },
    {
      id: 'expense-tracker',
      title: 'Controle de gastos',
      level: 'Iniciante',
      description: 'Registre gastos com categoria e data, e gere um resumo por mês. Bom para treinar Streams.',
      skills: ['Records', 'Stream API', 'LocalDate', 'Testes com JUnit'],
    },
    {
      id: 'blog-api',
      title: 'API de blog',
      level: 'Intermediário',
      description: 'CRUD de posts e comentários com Spring Boot, PostgreSQL, validação e paginação.',
      skills: ['Spring Boot', 'Spring Data JPA', 'PostgreSQL', 'Flyway', 'Bean Validation'],
    },
    {
      id: 'url-shortener',
      title: 'Encurtador de URL',
      level: 'Intermediário',
      description: 'Gere links curtos, redirecione e conte acessos. Depois coloque um cache Redis na frente.',
      skills: ['REST', 'Redis', 'Índices', 'Docker Compose'],
    },
    {
      id: 'todo-auth',
      title: 'Lista de tarefas com login',
      level: 'Intermediário',
      description: 'API com cadastro, login com JWT e cada usuário vendo só as próprias tarefas.',
      skills: ['Spring Security', 'JWT', 'BCrypt', 'Testes de integração'],
    },
    {
      id: 'ecommerce',
      title: 'API de e-commerce',
      level: 'Avançado',
      description: 'Produtos, carrinho, pedidos e pagamento simulado. Controle de estoque sem vender o mesmo item duas vezes.',
      skills: ['Transações', 'Locks otimistas', 'Testcontainers', 'Arquitetura em camadas'],
    },
    {
      id: 'reservas',
      title: 'Reserva de assentos de cinema',
      level: 'Avançado',
      description: 'Muitas pessoas tentando o mesmo assento ao mesmo tempo. Garanta que só uma consiga.',
      skills: ['Concorrência', 'Virtual Threads', 'Locks no banco', 'Testes de carga'],
    },
    {
      id: 'pedidos-kafka',
      title: 'Microsserviços de pedidos com Kafka',
      level: 'Avançado',
      description: 'Serviço de pedidos publica eventos; pagamentos e estoque consomem. Use Outbox e Saga para não perder nada.',
      skills: ['Kafka', 'Outbox Pattern', 'Saga', 'Idempotência', 'Observabilidade'],
    },
  ],
}
