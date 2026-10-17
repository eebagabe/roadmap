import type { Roadmap } from '../types'

export const computacao: Roadmap = {
  id: 'computacao',
  title: 'Roadmap Ciência da Computação',
  short: 'Ciência da Computação',
  icon: '🎓',
  accent: '#4f46e5',
  status: 'disponivel',
  objective:
    'Do primeiro programa ao projeto final: o núcleo de Ciência da Computação de ITA, MIT, Harvard e Oxford numa trilha só, em português e gratuita.',
  intro:
    'Ciência da Computação é o estudo do que pode ser calculado, de como calcular bem e de como construir as máquinas e os sistemas que fazem isso. Esta trilha une o núcleo comum de quatro das melhores escolas do mundo (ITA, MIT, Harvard e Oxford) e confere a cobertura com as diretrizes internacionais da ACM e do IEEE (CS2023). São nove fases: preparação, programação, matemática, algoritmos e teoria, sistemas, engenharia de software, IA e dados, áreas avançadas e o projeto final. A matemática anda junto com a programação, como numa graduação de verdade. O único pré-requisito é o ensino médio; se você já domina a Fase 0, pule direto para a Fase 1. Estudando de 10 a 15 horas por semana, são pouco mais de dois anos. Cada etapa mostra a disciplina equivalente em cada universidade e os materiais gratuitos para ir além.',
  sections: [
    {
      id: 'matematica-essencial',
      title: 'Fase 0 · Matemática essencial',
      summary: 'A matemática do ensino médio que a computação usa o tempo todo, revisada do jeito certo.',
      weeks: [
        {
          id: 'numeros-algebra',
          title: 'Números e álgebra',
          topics: ['Frações e potências', 'Notação científica', 'Logaritmos', 'Equações e inequações', 'Sistemas lineares simples'],
        },
        {
          id: 'funcoes',
          title: 'Funções',
          topics: ['Domínio e imagem', 'Função afim e quadrática', 'Exponencial e logarítmica', 'Composição e inversa', 'Gráficos de funções'],
        },
        {
          id: 'somatorios-contagem',
          title: 'Somatórios, sequências e contagem',
          topics: ['PA e PG', 'Notação de somatório', 'Princípio multiplicativo', 'Permutações e combinações'],
        },
        {
          id: 'trigonometria-geometria',
          title: 'Trigonometria e geometria analítica',
          topics: ['Seno e cosseno', 'Círculo trigonométrico', 'Vetores no plano', 'Distância e retas'],
        },
      ],
    },
    {
      id: 'ferramentas',
      title: 'Fase 0 · Ferramentas do programador',
      summary: 'Terminal, editor e Git: as ferramentas que você vai usar em todas as outras etapas.',
      weeks: [
        {
          id: 'terminal',
          title: 'Terminal e sistema',
          topics: ['Shell e comandos básicos', 'Arquivos e permissões', 'Processos', 'Variáveis de ambiente', 'Editor de código', 'WSL no Windows'],
        },
        {
          id: 'git',
          title: 'Git e fluxo de trabalho',
          topics: ['Commits', 'Branches, merge e rebase', 'GitHub e pull requests', 'Um bom README', 'Depuração e mensagens de erro'],
        },
      ],
    },
    {
      id: 'introducao-programacao',
      title: 'Fase 1 · Introdução à Computação e Programação',
      summary: 'Pensar como programador em Python: o equivalente a CES-10, 6.100A e CS50.',
      weeks: [
        {
          id: 'primeiros-programas',
          title: 'Computação, variáveis e tipos',
          topics: ['O que é computação', 'Algoritmos', 'Como um programa executa', 'Variáveis e tipos', 'Expressões'],
        },
        {
          id: 'controle-fluxo',
          title: 'Controle de fluxo',
          topics: ['Condicionais', 'Laços', 'Depuração', 'Pensamento computacional'],
        },
        {
          id: 'funcoes-abstracao',
          title: 'Funções e abstração',
          topics: ['Funções', 'Escopo', 'Decomposição e abstração', 'Testes com assert'],
        },
        {
          id: 'colecoes',
          title: 'Estruturas de dados nativas',
          topics: ['Listas e tuplas', 'Dicionários', 'Conjuntos', 'Mutabilidade e aliasing'],
        },
        {
          id: 'recursao-intro',
          title: 'Recursão',
          topics: ['Caso base e passo recursivo', 'Pilha de chamadas', 'Recursão vs iteração'],
        },
        {
          id: 'arquivos-objetos',
          title: 'Arquivos, exceções e objetos',
          topics: ['Arquivos', 'Exceções', 'Módulos', 'Classes e objetos'],
        },
        {
          id: 'eficiencia-intro',
          title: 'Eficiência',
          topics: ['Contando operações', 'Big O intuitivo', 'Busca linear e binária', 'Ordenação simples'],
        },
        {
          id: 'simulacao-c',
          title: 'Simulação, dados e um pouco de C',
          topics: ['Aleatoriedade', 'Monte Carlo', 'Gráficos', 'Primeiro contato com C'],
        },
      ],
    },
    {
      id: 'programacao-funcional',
      title: 'Fase 1 · Programação Funcional',
      summary: 'Haskell como em Oxford: funções puras, tipos e provas sobre programas.',
      weeks: [
        {
          id: 'funcional-base',
          title: 'Expressões, tipos e funções puras',
          topics: ['Por que funcional', 'Expressões e avaliação', 'Tipos', 'Funções puras'],
        },
        {
          id: 'listas-padroes',
          title: 'Listas e casamento de padrões',
          topics: ['Listas', 'Recursão em listas', 'Casamento de padrões', 'Compreensões de lista'],
        },
        {
          id: 'ordem-superior',
          title: 'Funções de ordem superior',
          topics: ['map e filter', 'fold', 'Currying', 'Composição'],
        },
        {
          id: 'tipos-algebricos',
          title: 'Tipos algébricos e raciocínio',
          topics: ['Tipos algébricos', 'Classes de tipos', 'Maybe e Either', 'Raciocínio equacional', 'Indução sobre programas'],
        },
        {
          id: 'preguica-monadas',
          title: 'Avaliação preguiçosa e mônadas',
          topics: ['Avaliação preguiçosa', 'Entrada e saída', 'Mônadas', 'Ideias funcionais em Python e JavaScript'],
        },
      ],
    },
    {
      id: 'programacao-oo',
      title: 'Fase 1 · Programação Imperativa e Orientada a Objetos',
      summary: 'Especificar, encapsular e testar: construir software que outras pessoas conseguem usar.',
      weeks: [
        {
          id: 'especificacoes',
          title: 'Especificações e invariantes',
          topics: ['Pré e pós-condições', 'Invariantes de laço', 'Raciocínio sobre laços', 'Especificações'],
        },
        {
          id: 'tads',
          title: 'Tipos abstratos de dados',
          topics: ['Tipos abstratos de dados', 'Encapsulamento', 'Invariante de representação', 'Interfaces bem definidas'],
        },
        {
          id: 'poo',
          title: 'Classes, herança e polimorfismo',
          topics: ['Classes', 'Herança', 'Interfaces', 'Polimorfismo', 'Composição vs herança'],
        },
        {
          id: 'padroes-projeto',
          title: 'Padrões de projeto',
          topics: ['Strategy', 'Observer', 'Factory', 'Iterator', 'Imutabilidade'],
        },
        {
          id: 'testes-refatoracao',
          title: 'Testes e refatoração',
          topics: ['Testes unitários', 'Testes baseados em propriedades', 'Cobertura', 'Refatoração'],
        },
      ],
    },
    {
      id: 'matematica-discreta',
      title: 'Fase 2 · Matemática Discreta e Lógica',
      summary: 'A matemática da computação: lógica, provas, grafos e contagem.',
      weeks: [
        {
          id: 'logica-proposicional',
          title: 'Lógica proposicional',
          topics: ['Conectivos', 'Tabelas-verdade', 'Equivalências lógicas', 'Formas normais'],
        },
        {
          id: 'predicados-provas',
          title: 'Predicados e técnicas de prova',
          topics: ['Quantificadores', 'Prova direta', 'Contrapositiva', 'Prova por contradição', 'Prova por casos'],
        },
        {
          id: 'inducao',
          title: 'Indução e invariantes',
          topics: ['Indução', 'Indução forte', 'Boa ordenação', 'Invariantes de estado'],
        },
        {
          id: 'conjuntos-relacoes',
          title: 'Conjuntos, relações e funções',
          topics: ['Conjuntos', 'Relações', 'Equivalência e ordens parciais', 'Funções', 'Cardinalidade'],
        },
        {
          id: 'teoria-numeros',
          title: 'Teoria dos números',
          topics: ['Divisibilidade e MDC', 'Aritmética modular', 'Primos', 'Inverso modular e RSA'],
        },
        {
          id: 'grafos-discreta',
          title: 'Grafos',
          topics: ['Caminhos e conectividade', 'Árvores', 'Coloração', 'Emparelhamento', 'Grafos planares'],
        },
        {
          id: 'contagem',
          title: 'Contagem e recorrências',
          topics: ['Bijeções', 'Permutações e combinações', 'Inclusão e exclusão', 'Princípio das casas dos pombos', 'Recorrências', 'Funções geradoras'],
        },
        {
          id: 'sistemas-prova',
          title: 'Sistemas de prova',
          topics: ['Dedução natural', 'Corretude e completude', 'Assistentes de prova'],
        },
      ],
    },
    {
      id: 'calculo',
      title: 'Fase 2 · Cálculo',
      summary: 'Variação e acumulação: a base da computação numérica e do aprendizado de máquina.',
      weeks: [
        {
          id: 'limites',
          title: 'Limites e derivada',
          topics: ['Limites', 'Continuidade', 'Derivada como taxa de variação'],
        },
        {
          id: 'derivacao',
          title: 'Regras de derivação e aplicações',
          topics: ['Regras de derivação', 'Otimização', 'Aproximação linear', 'Método de Newton'],
        },
        {
          id: 'integral',
          title: 'Integral',
          topics: ['Integral', 'Teorema fundamental do cálculo', 'Técnicas de integração', 'Integração numérica'],
        },
        {
          id: 'series',
          title: 'Séries e aproximações',
          topics: ['Sequências e séries', 'Série de Taylor', 'Erro de aproximação', 'Ponto flutuante e computação numérica'],
        },
        {
          id: 'varias-variaveis',
          title: 'Várias variáveis',
          topics: ['Funções de várias variáveis', 'Derivadas parciais', 'Gradiente', 'Máximos e mínimos'],
        },
        {
          id: 'gradiente-descendente',
          title: 'Gradiente descendente e otimização',
          topics: ['Gradiente descendente', 'Taxa de aprendizado', 'Regra da cadeia', 'Ponte para aprendizado de máquina'],
        },
      ],
    },
    {
      id: 'algebra-linear',
      title: 'Fase 2 · Álgebra Linear',
      summary: 'Vetores e matrizes: a linguagem de gráficos, dados e IA.',
      weeks: [
        {
          id: 'matrizes-sistemas',
          title: 'Matrizes e sistemas lineares',
          topics: ['Vetores e matrizes', 'Produto de matrizes', 'Eliminação de Gauss', 'Fatoração LU', 'Matriz inversa'],
        },
        {
          id: 'espacos-vetoriais',
          title: 'Espaços vetoriais',
          topics: ['Espaços e subespaços', 'Independência linear', 'Base e dimensão', 'Posto', 'Os quatro subespaços fundamentais'],
        },
        {
          id: 'ortogonalidade',
          title: 'Ortogonalidade e determinantes',
          topics: ['Ortogonalidade', 'Projeções', 'Mínimos quadrados', 'Gram-Schmidt', 'Determinantes'],
        },
        {
          id: 'autovalores',
          title: 'Autovalores e SVD',
          topics: ['Autovalores e autovetores', 'Diagonalização', 'SVD', 'PageRank', 'PCA e compressão'],
        },
      ],
    },
    {
      id: 'probabilidade',
      title: 'Fase 2 · Probabilidade e Estatística',
      summary: 'Raciocinar sob incerteza: de algoritmos randomizados a testes A/B.',
      weeks: [
        {
          id: 'probabilidade-base',
          title: 'Probabilidade e Bayes',
          topics: ['Espaço amostral', 'Probabilidade condicional', 'Independência', 'Teorema de Bayes'],
        },
        {
          id: 'variaveis-aleatorias',
          title: 'Variáveis aleatórias',
          topics: ['Variáveis discretas e contínuas', 'Esperança', 'Variância', 'Distribuições principais'],
        },
        {
          id: 'limites-probabilidade',
          title: 'Teoremas limite e desigualdades',
          topics: ['Lei dos grandes números', 'Teorema central do limite', 'Desigualdades de Markov e Chebyshev', 'Limite de Chernoff'],
        },
        {
          id: 'estatistica',
          title: 'Estatística e probabilidade em algoritmos',
          topics: ['Estimação', 'Intervalos de confiança', 'Testes de hipótese', 'Algoritmos randomizados e hashing'],
        },
      ],
    },
    {
      id: 'estruturas-de-dados',
      title: 'Fase 3 · Estruturas de Dados',
      summary: 'Organizar dados para que as operações certas fiquem rápidas.',
      weeks: [
        {
          id: 'analise-assintotica',
          title: 'Análise assintótica',
          topics: ['Notações O, Ω e Θ', 'Análise de laços', 'Recorrências', 'Teorema mestre'],
        },
        {
          id: 'lineares',
          title: 'Estruturas lineares',
          topics: ['Listas ligadas', 'Pilhas', 'Filas e deques', 'Array dinâmico', 'Análise amortizada'],
        },
        {
          id: 'hashing',
          title: 'Tabelas hash',
          topics: ['Funções de hash', 'Colisões', 'Endereçamento aberto', 'Hashing universal'],
        },
        {
          id: 'arvores',
          title: 'Árvores e heaps',
          topics: ['Árvores binárias de busca', 'Árvores AVL', 'Árvores rubro-negras', 'Heaps', 'Filas de prioridade'],
        },
        {
          id: 'ordenacao',
          title: 'Ordenação',
          topics: ['Merge sort', 'Quick sort', 'Heap sort', 'Limite inferior da comparação', 'Counting sort e radix sort'],
        },
        {
          id: 'grafos-estruturas',
          title: 'Grafos e union-find',
          topics: ['Representações de grafos', 'BFS', 'DFS', 'Ordenação topológica', 'Componentes', 'Union-find'],
        },
      ],
    },
    {
      id: 'algoritmos',
      title: 'Fase 3 · Projeto e Análise de Algoritmos',
      summary: 'Técnicas para inventar algoritmos e provar que funcionam.',
      weeks: [
        {
          id: 'caminhos-minimos',
          title: 'Caminhos mínimos e árvores geradoras',
          topics: ['Dijkstra', 'Bellman-Ford', 'Floyd-Warshall', 'Árvore geradora mínima'],
        },
        {
          id: 'dividir-conquistar',
          title: 'Dividir e conquistar',
          topics: ['Dividir e conquistar', 'Multiplicação rápida', 'Mediana em tempo linear', 'FFT'],
        },
        {
          id: 'gulosos',
          title: 'Algoritmos gulosos',
          topics: ['Escolha gulosa', 'Argumento de troca', 'Estar à frente', 'Códigos de Huffman'],
        },
        {
          id: 'programacao-dinamica',
          title: 'Programação dinâmica',
          topics: ['Subproblemas e memoização', 'Mochila', 'Maior subsequência comum', 'Distância de edição', 'Programação dinâmica em grafos'],
        },
        {
          id: 'fluxo',
          title: 'Fluxo em redes',
          topics: ['Fluxo máximo', 'Corte mínimo', 'Emparelhamento bipartido', 'Programação linear'],
        },
        {
          id: 'randomizados',
          title: 'Randomização e aproximação',
          topics: ['Algoritmos randomizados', 'Algoritmos de aproximação', 'Algoritmos online', 'Fluxo de dados'],
        },
      ],
    },
    {
      id: 'teoria-computacao',
      title: 'Fase 3 · Teoria da Computação',
      summary: 'O que computadores conseguem e não conseguem fazer, e a que custo.',
      weeks: [
        {
          id: 'automatos',
          title: 'Autômatos finitos',
          topics: ['Linguagens formais', 'DFA', 'NFA', 'Equivalência entre DFA e NFA'],
        },
        {
          id: 'regulares',
          title: 'Expressões regulares',
          topics: ['Expressões regulares', 'Lema do bombeamento', 'Minimização de autômatos'],
        },
        {
          id: 'gramaticas',
          title: 'Gramáticas e autômatos de pilha',
          topics: ['Gramáticas livres de contexto', 'Árvores de derivação', 'Autômatos de pilha', 'Parsing'],
        },
        {
          id: 'turing',
          title: 'Máquinas de Turing e decidibilidade',
          topics: ['Máquinas de Turing', 'Tese de Church-Turing', 'Decidibilidade', 'Problema da parada', 'Reduções'],
        },
        {
          id: 'complexidade',
          title: 'P e NP',
          topics: ['Classe P', 'Classe NP', 'NP-completude', 'Teorema de Cook-Levin', 'Problemas NP-completos clássicos'],
        },
        {
          id: 'alem-np',
          title: 'Além de NP',
          topics: ['PSPACE', 'Classes randomizadas', 'Inaproximabilidade', 'Computação quântica'],
        },
      ],
    },
    {
      id: 'arquitetura',
      title: 'Fase 4 · Sistemas Digitais e Arquitetura de Computadores',
      summary: 'Do transistor ao processador: como o hardware executa o seu código.',
      weeks: [
        {
          id: 'logica-digital',
          title: 'Portas lógicas e circuitos combinacionais',
          topics: ['Bits e portas lógicas', 'Álgebra booleana', 'Circuitos combinacionais', 'Somadores e multiplexadores'],
        },
        {
          id: 'sequenciais',
          title: 'Circuitos sequenciais',
          topics: ['Flip-flops', 'Registradores', 'Máquinas de estado', 'Memória'],
        },
        {
          id: 'representacao',
          title: 'Representação de dados',
          topics: ['Inteiros com sinal', 'Ponto flutuante IEEE 754', 'Caracteres e Unicode', 'Endianness'],
        },
        {
          id: 'isa',
          title: 'Conjunto de instruções e assembly',
          topics: ['Arquitetura de conjunto de instruções', 'RISC-V', 'Programação em assembly', 'Chamadas de função e pilha'],
        },
        {
          id: 'processador',
          title: 'O processador',
          topics: ['Caminho de dados', 'Unidade de controle', 'Pipeline', 'Hazards'],
        },
        {
          id: 'memoria',
          title: 'Hierarquia de memória',
          topics: ['Localidade', 'Caches', 'Memória virtual', 'Desempenho'],
        },
      ],
    },
    {
      id: 'sistemas-operacionais',
      title: 'Fase 4 · Sistemas Operacionais',
      summary: 'O programa que gerencia todos os outros: processos, memória e arquivos.',
      weeks: [
        {
          id: 'c-sistemas',
          title: 'Programação de sistemas em C',
          topics: ['Ponteiros', 'Memória em C', 'gdb', 'Valgrind e sanitizers'],
        },
        {
          id: 'processos',
          title: 'Processos e chamadas de sistema',
          topics: ['Processos', 'Chamadas de sistema', 'Modo usuário e kernel', 'fork e exec'],
        },
        {
          id: 'escalonamento',
          title: 'Escalonamento e threads',
          topics: ['Escalonamento de CPU', 'Políticas de escalonamento', 'Threads', 'Troca de contexto'],
        },
        {
          id: 'memoria-virtual',
          title: 'Memória virtual',
          topics: ['Espaço de endereçamento', 'Paginação', 'TLB', 'Substituição de páginas'],
        },
        {
          id: 'concorrencia-kernel',
          title: 'Concorrência',
          topics: ['Condições de corrida', 'Locks', 'Variáveis de condição', 'Deadlocks'],
        },
        {
          id: 'arquivos-virtualizacao',
          title: 'Sistemas de arquivos e virtualização',
          topics: ['Sistemas de arquivos', 'Entrada e saída', 'Journaling', 'Virtualização', 'Containers'],
        },
      ],
    },
    {
      id: 'redes',
      title: 'Fase 4 · Redes de Computadores',
      summary: 'Como bilhões de máquinas conversam: das camadas ao TCP.',
      weeks: [
        {
          id: 'camadas',
          title: 'Arquitetura da internet',
          topics: ['Arquitetura em camadas', 'Como a internet funciona', 'Latência e banda', 'Comutação de pacotes'],
        },
        {
          id: 'aplicacao',
          title: 'Camada de aplicação e sockets',
          topics: ['HTTP', 'DNS', 'E-mail', 'Programação com sockets'],
        },
        {
          id: 'transporte',
          title: 'Camada de transporte',
          topics: ['UDP', 'TCP', 'Transmissão confiável', 'Controle de congestionamento'],
        },
        {
          id: 'rede-enlace',
          title: 'Rede e enlace',
          topics: ['IP e endereçamento', 'Roteamento', 'NAT', 'Ethernet e Wi-Fi', 'TLS'],
        },
      ],
    },
    {
      id: 'distribuidos',
      title: 'Fase 4 · Concorrência, Paralelismo e Sistemas Distribuídos',
      summary: 'Muitas coisas ao mesmo tempo, em uma máquina ou em milhares.',
      weeks: [
        {
          id: 'modelos-concorrencia',
          title: 'Modelos de concorrência',
          topics: ['Threads e memória compartilhada', 'Troca de mensagens', 'Condições de corrida', 'Modelos de memória'],
        },
        {
          id: 'sincronizacao',
          title: 'Sincronização',
          topics: ['Locks', 'Semáforos', 'Monitores', 'Canais estilo CSP', 'Deadlock e livelock'],
        },
        {
          id: 'paralelismo',
          title: 'Paralelismo e desempenho',
          topics: ['Lei de Amdahl', 'Fork-join', 'Vetorização', 'Cache e falso compartilhamento', 'OpenMP'],
        },
        {
          id: 'distribuidos-base',
          title: 'Fundamentos de sistemas distribuídos',
          topics: ['Falhas', 'Relógios lógicos', 'RPC', 'MapReduce'],
        },
        {
          id: 'consenso',
          title: 'Replicação e consenso',
          topics: ['Replicação', 'Raft', 'Paxos', 'Tolerância a falhas'],
        },
        {
          id: 'consistencia',
          title: 'Consistência e estudos de caso',
          topics: ['Modelos de consistência', 'Teorema CAP', 'Transações distribuídas', 'GFS, Spanner e Dynamo'],
        },
      ],
    },
    {
      id: 'bancos-de-dados',
      title: 'Fase 4 · Bancos de Dados',
      summary: 'Guardar e consultar dados com segurança, do SQL às entranhas do banco.',
      weeks: [
        {
          id: 'relacional',
          title: 'Modelo relacional e SQL',
          topics: ['Modelo relacional', 'Álgebra relacional', 'SQL', 'Junções e agregações'],
        },
        {
          id: 'modelagem',
          title: 'Modelagem e normalização',
          topics: ['Modelo entidade-relacionamento', 'Dependências funcionais', 'Formas normais', 'Restrições de integridade'],
        },
        {
          id: 'internos',
          title: 'Por dentro do banco',
          topics: ['Armazenamento em páginas', 'Índices B+tree', 'Índices hash', 'Execução de consultas', 'Otimização de consultas'],
        },
        {
          id: 'transacoes',
          title: 'Transações e NoSQL',
          topics: ['ACID', 'Controle de concorrência', 'Recuperação', 'NoSQL'],
        },
      ],
    },
    {
      id: 'compiladores',
      title: 'Fase 4 · Compiladores e Linguagens de Programação',
      summary: 'Como texto vira programa executável, e como projetar linguagens.',
      weeks: [
        {
          id: 'lexica',
          title: 'Visão geral e análise léxica',
          topics: ['Fases de um compilador', 'Tokens', 'Análise léxica', 'Autômatos na prática'],
        },
        {
          id: 'sintatica',
          title: 'Análise sintática',
          topics: ['Gramáticas', 'Parser descendente recursivo', 'Parsers ascendentes', 'Árvore sintática'],
        },
        {
          id: 'semantica',
          title: 'Análise semântica e tipos',
          topics: ['Tabela de símbolos', 'Escopo', 'Sistemas de tipos', 'Semântica de linguagens'],
        },
        {
          id: 'geracao-codigo',
          title: 'Geração de código e interpretadores',
          topics: ['Representação intermediária', 'Geração de código', 'Otimizações', 'Interpretadores e máquinas virtuais'],
        },
      ],
    },
    {
      id: 'engenharia-de-software',
      title: 'Fase 5 · Engenharia de Software e Projeto em Grupo',
      summary: 'Construir software grande, em equipe, para alguém de verdade.',
      weeks: [
        {
          id: 'requisitos',
          title: 'Requisitos e processos',
          topics: ['Requisitos', 'Especificação', 'Métodos ágeis', 'Cascata e quando usar'],
        },
        {
          id: 'arquitetura-software',
          title: 'Arquitetura e design de APIs',
          topics: ['Arquitetura de software', 'Modularidade', 'Design de APIs', 'Documentação'],
        },
        {
          id: 'qualidade',
          title: 'Qualidade',
          topics: ['Revisão de código', 'Níveis de teste', 'Integração contínua', 'Entrega contínua'],
        },
        {
          id: 'equipe',
          title: 'Equipe e manutenção',
          topics: ['Trabalho em equipe', 'Gestão de projetos', 'Manutenção', 'Software livre'],
        },
      ],
    },
    {
      id: 'inteligencia-artificial',
      title: 'Fase 6 · Inteligência Artificial',
      summary: 'Agentes que buscam, raciocinam e decidem sob incerteza.',
      weeks: [
        {
          id: 'busca',
          title: 'Agentes e busca',
          topics: ['Agentes', 'Busca cega', 'Busca heurística e A*', 'Minimax', 'Poda alfa-beta'],
        },
        {
          id: 'conhecimento',
          title: 'Conhecimento e raciocínio',
          topics: ['Lógica para IA', 'Inferência', 'Satisfação de restrições', 'Backtracking com heurísticas'],
        },
        {
          id: 'incerteza',
          title: 'Incerteza',
          topics: ['Redes bayesianas', 'Cadeias de Markov', 'Modelos ocultos de Markov', 'Decisão sob incerteza'],
        },
        {
          id: 'reforco',
          title: 'Aprendizado por reforço e ética',
          topics: ['Processos de decisão de Markov', 'Q-learning', 'Ética em IA', 'Segurança em IA'],
        },
      ],
    },
    {
      id: 'aprendizado-de-maquina',
      title: 'Fase 6 · Aprendizado de Máquina',
      summary: 'Programas que aprendem padrões a partir de dados.',
      weeks: [
        {
          id: 'supervisionado',
          title: 'Aprendizado supervisionado',
          topics: ['Regressão', 'Classificação', 'Funções de perda', 'Generalização', 'Regularização'],
        },
        {
          id: 'modelos-classicos',
          title: 'Modelos clássicos',
          topics: ['Árvores e florestas', 'SVM', 'k-means', 'PCA', 'Validação cruzada'],
        },
        {
          id: 'redes-neurais',
          title: 'Redes neurais',
          topics: ['Perceptron e camadas', 'Retropropagação', 'Redes convolucionais', 'Treinamento na prática'],
        },
        {
          id: 'transformers',
          title: 'Modelos de linguagem',
          topics: ['Embeddings', 'Atenção e transformers', 'Modelos de linguagem', 'Viés e privacidade'],
        },
      ],
    },
    {
      id: 'seguranca',
      title: 'Fase 7 · Segurança e Criptografia',
      summary: 'Proteger dados e sistemas contra quem quer quebrá-los.',
      weeks: [
        {
          id: 'criptografia',
          title: 'Criptografia',
          topics: ['Criptografia simétrica', 'Funções de hash', 'Criptografia assimétrica', 'Assinaturas e certificados'],
        },
        {
          id: 'seguranca-sistemas',
          title: 'Segurança de sistemas',
          topics: ['Vulnerabilidades de memória', 'Segurança web', 'Autenticação', 'Modelagem de ameaças'],
        },
      ],
    },
    {
      id: 'grafica-ihc',
      title: 'Fase 7 · Computação Gráfica e IHC',
      summary: 'Desenhar imagens com código e projetar sistemas para pessoas.',
      weeks: [
        {
          id: 'grafica',
          title: 'Computação gráfica',
          topics: ['Pipeline gráfico', 'Transformações', 'Rasterização', 'Ray tracing'],
        },
        {
          id: 'ihc',
          title: 'Interação humano-computador',
          topics: ['Usabilidade', 'Acessibilidade', 'Prototipação', 'Avaliação com usuários'],
        },
      ],
    },
    {
      id: 'etica',
      title: 'Fase 7 · Computação, Ética e Sociedade',
      summary: 'O impacto do que você constrói e a responsabilidade de quem constrói.',
      weeks: [
        {
          id: 'privacidade-vies',
          title: 'Privacidade, vieses e sociedade',
          topics: ['Privacidade e LGPD', 'Vigilância', 'Viés algorítmico', 'Automação e trabalho'],
        },
        {
          id: 'profissao',
          title: 'A profissão',
          topics: ['Propriedade intelectual', 'Licenças de software livre', 'Responsabilidade profissional', 'Sustentabilidade'],
        },
      ],
    },
    {
      id: 'projeto-final',
      title: 'Fase 8 · Projeto Final',
      summary: 'O seu TCC: um problema real, resolvido, avaliado e apresentado.',
      weeks: [
        {
          id: 'proposta',
          title: 'Problema e proposta',
          topics: ['Escolha do problema', 'Revisão do estado da arte', 'Proposta'],
        },
        {
          id: 'desenvolvimento',
          title: 'Desenvolvimento',
          topics: ['Marcos', 'Diário de bordo', 'Riscos'],
        },
        {
          id: 'avaliacao',
          title: 'Avaliação',
          topics: ['Avaliação experimental', 'Comparação com alternativas', 'Reprodutibilidade'],
        },
        {
          id: 'escrita',
          title: 'Escrita e apresentação',
          topics: ['Relatório em formato de artigo', 'Apresentação pública', 'Publicação do código'],
        },
      ],
    },
  ],
  companiesTitle: 'Onde essa formação leva',
  companiesSubtitle: 'Caminhos que se abrem com uma base sólida em Ciência da Computação.',
  companies: [
    { name: 'Big techs', how: 'Google, Microsoft, Amazon e Meta contratam no Brasil e fora; entrevistas cobram exatamente algoritmos e sistemas.' },
    { name: 'Bancos e fintechs', how: 'Itaú, Nubank, BTG e Mercado Pago: sistemas distribuídos, segurança e dados em escala.' },
    { name: 'Startups', how: 'Times pequenos onde quem entende a pilha inteira, do banco ao front, faz diferença.' },
    { name: 'Indústria e engenharia', how: 'Embraer, WEG, Petrobras e montadoras: software embarcado, simulação e otimização.' },
    { name: 'Pesquisa e laboratórios', how: 'Universidades, institutos (IMPA, LNCC, CESAR, Eldorado) e laboratórios de P&D de empresas.' },
    { name: 'Pós-graduação', how: 'Mestrado e doutorado no Brasil (ITA, USP, Unicamp, UFMG) ou no exterior, com base sólida em teoria e matemática.' },
    { name: 'IA e dados', how: 'Times de aprendizado de máquina e LLMs, que exigem probabilidade, álgebra linear e engenharia.' },
    { name: 'Setor público', how: 'Serpro, Dataprev, Banco Central e tribunais: sistemas críticos para milhões de pessoas.' },
    { name: 'Software livre', how: 'Contribuir com Linux, Python, PostgreSQL e outros projetos abre portas no mundo todo.' },
  ],
  projects: [
    {
      id: 'jogo-terminal',
      title: 'Jogo de terminal e simulador',
      level: 'Iniciante',
      description: 'Campo minado ou forca no terminal e um simulador de fila de banco com Monte Carlo, tudo em Python e com testes.',
      skills: ['Python', 'Decomposição', 'Testes', 'Simulação'],
    },
    {
      id: 'interpretador-expressoes',
      title: 'Interpretador de expressões em Haskell',
      level: 'Iniciante',
      description: 'Avaliador de expressões aritméticas com tipos algébricos, casamento de padrões e tratamento de erros com Either.',
      skills: ['Haskell', 'Tipos algébricos', 'Recursão', 'Either'],
    },
    {
      id: 'provador-tautologias',
      title: 'Provador de tautologias',
      level: 'Iniciante',
      description: 'Lê fórmulas lógicas, monta a tabela-verdade, converte para forma normal e resolve por um SAT simples (DPLL).',
      skills: ['Lógica', 'Parsing', 'Recursão', 'SAT'],
    },
    {
      id: 'compressao-svd',
      title: 'Compressão de imagem com SVD',
      level: 'Intermediário',
      description: 'Comprima fotos mantendo os k maiores valores singulares e meça a qualidade; faça também uma regressão linear à mão com NumPy.',
      skills: ['Álgebra linear', 'NumPy', 'SVD', 'Mínimos quadrados'],
    },
    {
      id: 'planejador-rotas',
      title: 'Planejador de rotas com OpenStreetMap',
      level: 'Intermediário',
      description: 'Carregue o mapa de uma cidade, calcule rotas com Dijkstra e A* e compare tempos e caminhos.',
      skills: ['Grafos', 'Dijkstra', 'A*', 'Estruturas de dados'],
    },
    {
      id: 'shell',
      title: 'Shell próprio',
      level: 'Intermediário',
      description: 'Um shell em C com pipes, redirecionamento, processos em segundo plano e sinais.',
      skills: ['C', 'fork e exec', 'Pipes', 'Sinais'],
    },
    {
      id: 'servidor-http',
      title: 'Servidor HTTP do zero',
      level: 'Intermediário',
      description: 'Servidor que entende HTTP/1.1 sobre sockets, serve arquivos e atende várias conexões ao mesmo tempo.',
      skills: ['Sockets', 'HTTP', 'Concorrência', 'Redes'],
    },
    {
      id: 'nand2tetris',
      title: 'Computador do NAND ao Tetris',
      level: 'Avançado',
      description: 'Construa portas, ALU, CPU, assembler, máquina virtual e compilador, até rodar um jogo no computador que você montou.',
      skills: ['Lógica digital', 'Arquitetura', 'Assembly', 'Compiladores'],
    },
    {
      id: 'mini-banco',
      title: 'Mini banco de dados',
      level: 'Avançado',
      description: 'Gerenciador de buffer, índice B+tree e um executor de consultas simples, no estilo do BusTub da CMU.',
      skills: ['B+tree', 'Armazenamento', 'Consultas', 'Concorrência'],
    },
    {
      id: 'raft',
      title: 'Chave-valor replicado com Raft',
      level: 'Avançado',
      description: 'Implemente o Raft e um armazenamento chave-valor tolerante a falhas sobre ele, seguindo os laboratórios do MIT 6.5840.',
      skills: ['Raft', 'Sistemas distribuídos', 'Testes de falha', 'Go'],
    },
    {
      id: 'compilador',
      title: 'Compilador para uma linguagem pequena',
      level: 'Avançado',
      description: 'Lexer, parser, verificação de tipos e geração de bytecode para uma máquina virtual própria, seguindo Crafting Interpreters.',
      skills: ['Parsing', 'Tipos', 'Máquina virtual', 'Otimizações'],
    },
    {
      id: 'classificador',
      title: 'Classificador do zero ao PyTorch',
      level: 'Avançado',
      description: 'Rede neural com retropropagação escrita em NumPy e depois em PyTorch, com relatório de avaliação e análise de viés.',
      skills: ['Aprendizado de máquina', 'Retropropagação', 'PyTorch', 'Avaliação'],
    },
  ],
}
