# Trilha Ciência da Computação: plano completo

> Status: **disponível**. As 25 etapas têm apostila, gabarito e dados no roadmap. Este documento registra o plano que guiou a produção; o checklist no fim do arquivo está completo.

## Por que esta trilha existe

Conteúdo bom e gratuito de Ciência da Computação existe, mas está espalhado: cursos do MIT em inglês, aulas de Harvard no edX, notas de Oxford em PDF, o catálogo do ITA com ementas curtas. Quem está começando não sabe por onde ir, em que ordem estudar, nem o que de fato importa. A proposta é **unificar o núcleo comum das melhores universidades do mundo** numa trilha única, em português, com linguagem simples, apostila e gabarito por etapa, projetos práticos e progresso salvo, do zero até o nível de formado.

## Fontes pesquisadas

### Universidades de referência

| Universidade | Programa | O que aproveitamos |
|---|---|---|
| **ITA** | Engenharia de Computação (catálogo de graduação) | Rigor matemático, sequência CES-10 → CES-11 → CTC-12/CES-23, lógica e estruturas discretas (CMC-14), autômatos (CTC-34), compiladores (CTC-41), sistemas (CSC-33, CSC-35, CSC-27), segurança e IA |
| **MIT** | Course 6-3, Computer Science and Engineering | Núcleo moderno: 6.100A/6.1010 (programação), 6.1020 (construção de software), 6.1200 (matemática para CS), 6.1210/6.1220 (algoritmos), 6.1400 (computabilidade e complexidade), 6.1903/6.1910 (C, assembly e estruturas de computação), 6.1800/6.1810 (sistemas e SO), 6.5840 (sistemas distribuídos), 6.172 (engenharia de desempenho), 18.06 (álgebra linear) |
| **Harvard** | Concentração em Computer Science | Estrutura por competências: programação (CS 50, CS 32, CS 51, CS 61), raciocínio formal (CS 20, CS 1200/1210, CS 1240), sistemas, "computação e o mundo", IA, matemática (álgebra linear, probabilidade Stat 110) |
| **Oxford** | BA/MCompSci Computer Science | Primeiro ano com Programação Funcional (Haskell), Programação Imperativa, Matemática Discreta, Introdução a Sistemas de Prova, Projeto e Análise de Algoritmos, Sistemas Digitais, Álgebra Linear, Matemática Contínua e Probabilidade; segundo ano com Algoritmos e Estruturas de Dados, Compiladores, Programação Concorrente, Modelos de Computação e o Group Design Practical |

### Referência curricular internacional

**ACM/IEEE-CS/AAAI CS2023** (diretrizes curriculares de Ciência da Computação), com 17 áreas de conhecimento: Artificial Intelligence (AI), Algorithmic Foundations (AL), Architecture and Organization (AR), Data Management (DM), Foundations of Programming Languages (FPL), Graphics and Interactive Techniques (GIT), Human-Computer Interaction (HCI), Mathematical and Statistical Foundations (MSF), Networking and Communication (NC), Operating Systems (OS), Parallel and Distributed Computing (PDC), Software Development Fundamentals (SDF), Software Engineering (SE), Security (SEC), Society, Ethics, and the Profession (SEP), Systems Fundamentals (SF) e Specialized Platform Development (SPD). Usamos a lista para **conferir que nenhuma área ficou de fora** (tabela de cobertura mais abaixo).

### Material gratuito que cada etapa vai indicar

- **MIT OpenCourseWare** (aulas, notas, listas e provas de 6.100A, 6.1200/6.042J, 6.006, 6.046J, 6.004, 6.033, 6.1810/6.S081, 6.5840/6.824, 6.172, 18.01, 18.02, 18.06).
- **Harvard CS50** (CS50x, CS50P, CS50 AI, CS50 SQL, gratuitos no edX e no YouTube) e **Stat 110** (Probabilidade, Joe Blitzstein, aulas e livro gratuitos).
- **Oxford**: notas e listas de exercícios públicas de vários cursos do departamento.
- **ITA**: catálogo de graduação e páginas públicas de professores (ex.: material de CES-11).
- Clássicos abertos e complementares: *Structure and Interpretation of Computer Programs* (SICP) e o curso CS 61A de Berkeley, *Nand2Tetris* (do NAND ao computador), *Computer Systems: A Programmer's Perspective* (CMU 15-213), *Operating Systems: Three Easy Pieces* (gratuito), *Crafting Interpreters* (gratuito online), CMU 15-445 (bancos de dados), *Mathematics for Computer Science* (Lehman, Leighton e Meyer, gratuito), *The Missing Semester of Your CS Education* (MIT), e roteiros comunitários como OSSU e Teach Yourself CS.

## Princípios de desenho

1. **Português e linguagem simples**, com o mesmo formato das apostilas atuais: "Comece por aqui", teoria com analogias, quadros "Cuidado! Cai na prova/entrevista", código, atividades de fixação, gabarito separado, projeto da etapa e resumão.
2. **Ordem por dependência**: nada aparece antes do que é necessário para entender. Matemática anda em paralelo com programação, como nas universidades.
3. **Tema N = Semana N** dentro de cada etapa (regra técnica do site: progresso, links de tópicos e marca-página).
4. **Cada etapa indica a disciplina equivalente** no ITA, MIT, Harvard e Oxford, mais os materiais gratuitos para aprofundar. A apostila é autossuficiente; os links são para quem quiser ir além.
5. **Pré-requisito único: ensino médio.** A Fase 0 revisa a matemática necessária.
6. **Prática obrigatória**: toda etapa tem projeto. Ao final, um TCC/projeto final de verdade.
7. **Linguagens**: Python para começar (como 6.100A e CS50P), Haskell para pensar funcionalmente (como Oxford), C para entender a máquina (como 6.1903/CS 61/CES), e Java ou TypeScript para software orientado a objetos.
8. **Duração**: pouco mais de **2 anos** estudando de 10 a 15 horas por semana (cerca de 116 semanas). É o núcleo de um bacharelado, sem as disciplinas de outras áreas.

## Visão geral

| Fase | Etapas | Semanas |
|---|---|---|
| 0. Preparação | Matemática essencial; Ferramentas do programador | 6 |
| 1. Programação | Introdução à Computação; Programação Funcional; Programação Imperativa e Orientada a Objetos | 18 |
| 2. Matemática para Computação | Matemática Discreta e Lógica; Cálculo; Álgebra Linear; Probabilidade e Estatística | 22 |
| 3. Algoritmos e Teoria | Estruturas de Dados; Projeto e Análise de Algoritmos; Teoria da Computação | 18 |
| 4. Sistemas | Sistemas Digitais e Arquitetura; Sistemas Operacionais; Redes de Computadores; Concorrência, Paralelismo e Sistemas Distribuídos; Bancos de Dados; Compiladores e Linguagens | 30 |
| 5. Engenharia de Software | Engenharia de Software e Projeto em Grupo | 4 |
| 6. IA e Dados | Inteligência Artificial; Aprendizado de Máquina | 8 |
| 7. Áreas avançadas | Segurança e Criptografia; Computação Gráfica e IHC; Computação, Ética e Sociedade | 6 |
| 8. Conclusão | Projeto Final (TCC) | 4 (ou mais) |
| **Total** | **25 etapas** | **~116 semanas** |

> Nota: o total assume as cargas propostas abaixo; quem já domina a Fase 0 pode pular direto para a Fase 1.

## Detalhamento das etapas

Formato de cada etapa: **id** (usado no código), equivalências, semanas e tópicos (cada semana vira um card no mapa e um "Tema" na apostila), projeto e materiais gratuitos.

---

### Fase 0. Preparação

#### 0.1 Matemática essencial (`matematica-essencial`) · 4 semanas

Equivalências: revisão do ensino médio; pré-requisito de 18.01 (MIT), Math Ma/Mb (Harvard), vestibular do ITA.

1. **Números e álgebra:** frações e potências, notação científica, logaritmos, equações e inequações, sistemas lineares simples.
2. **Funções:** domínio e imagem, afim e quadrática, exponencial e logarítmica, composição e inversa, gráficos.
3. **Somatórios, sequências e combinatória básica:** PA e PG, notação Σ, princípio multiplicativo, permutações e combinações.
4. **Trigonometria e geometria analítica:** seno, cosseno, círculo trigonométrico, vetores no plano, distância e retas.

Projeto: caderno de exercícios resolvidos em Python (plotar funções, calcular somatórios).
Materiais: Khan Academy em português, OBMEP (Portal da Matemática).

#### 0.2 Ferramentas do programador (`ferramentas`) · 2 semanas

Equivalências: MIT *The Missing Semester*; primeiras semanas de CS50.

1. **Terminal e sistema:** shell, arquivos e permissões, processos, variáveis de ambiente, editor de código, WSL no Windows.
2. **Git e fluxo de trabalho:** commits, branches, merge e rebase, GitHub, pull requests, escrevendo um bom README; depuração básica e leitura de mensagens de erro.

Projeto: repositório pessoal da trilha, onde ficarão todos os projetos.

---

### Fase 1. Programação

#### 1.1 Introdução à Computação e Programação (`introducao-programacao`) · 8 semanas

Equivalências: **ITA CES-10** (Introdução à Computação), **MIT 6.100A/6.1000 e 6.1010**, **Harvard CS 50/CS 32**, **Oxford** (parte de Imperative Programming). Linguagem: Python.

1. O que é computação; algoritmos; como um programa executa; variáveis, tipos e expressões.
2. Controle de fluxo: condicionais e laços; depuração; pensamento computacional.
3. Funções, escopo, decomposição e abstração; testes com assert.
4. Estruturas de dados nativas: listas, tuplas, dicionários, conjuntos; mutabilidade e aliasing.
5. Recursão: casos base, pilha de chamadas, recursão vs iteração.
6. Arquivos, exceções, módulos; introdução a classes e objetos.
7. Eficiência: contando operações, noção intuitiva de Big O, busca linear e binária, ordenação simples.
8. Simulação e computação com dados: aleatoriedade, Monte Carlo, gráficos; introdução a C para ver a diferença (como na semana de C do CS50).

Projeto: um jogo de terminal (forca, campo minado) e um simulador simples (fila de banco, epidemia).
Materiais: CS50x, CS50P, MIT 6.100A no OCW, *Think Python* (gratuito).

#### 1.2 Programação Funcional (`programacao-funcional`) · 5 semanas

Equivalências: **Oxford Functional Programming** (Haskell), **Harvard CS 51** (abstração e design, OCaml), Berkeley CS 61A/SICP. Linguagem: Haskell.

1. Expressões, tipos e funções puras; avaliação; por que funcional.
2. Listas, recursão e casamento de padrões; compreensões de lista.
3. Funções de ordem superior: map, filter, fold; currying e composição.
4. Tipos algébricos, classes de tipos, Maybe e Either; raciocínio equacional e provas por indução sobre programas.
5. Avaliação preguiçosa, I/O e um primeiro contato com mônadas; aplicando as ideias em Python e JavaScript.

Projeto: interpretador de expressões aritméticas com tipos algébricos.
Materiais: notas públicas de Oxford, *Learn You a Haskell* (gratuito), SICP.

#### 1.3 Programação Imperativa e Orientada a Objetos (`programacao-oo`) · 5 semanas

Equivalências: **Oxford Imperative Programming**, **ITA CSI-22** (Programação Orientada a Objetos), **MIT 6.1020** (Software Construction, parte inicial). Linguagem: Java (ou TypeScript).

1. Invariantes, pré e pós-condições; raciocínio sobre laços; especificações.
2. Tipos abstratos de dados; encapsulamento; interfaces bem definidas.
3. Classes, herança, interfaces, polimorfismo; composição vs herança.
4. Padrões de projeto essenciais (Strategy, Observer, Factory, Iterator); imutabilidade.
5. Testes unitários, testes baseados em propriedades, refatoração.

Projeto: biblioteca de coleções própria (lista, conjunto, mapa) com especificações e testes.

---

### Fase 2. Matemática para Computação

#### 2.1 Matemática Discreta e Lógica (`matematica-discreta`) · 8 semanas

Equivalências: **ITA CMC-14** (Lógica Matemática e Estruturas Discretas), **MIT 6.1200/6.042J** (Mathematics for Computer Science), **Harvard CS 20**, **Oxford Discrete Mathematics e Introduction to Proof Systems**.

1. Lógica proposicional: conectivos, tabelas-verdade, equivalências, formas normais.
2. Lógica de predicados e quantificadores; técnicas de prova: direta, contrapositiva, contradição, casos.
3. Indução e indução forte; boa ordenação; invariantes de estado.
4. Conjuntos, relações e funções; relações de equivalência e ordens parciais; cardinalidade.
5. Teoria dos números: divisibilidade, MDC, aritmética modular, primos; base do RSA.
6. Grafos: caminhos, conectividade, árvores, coloração, emparelhamento, grafos planares.
7. Contagem: princípios, bijeções, permutações, combinações, inclusão e exclusão, pombos; recorrências e funções geradoras básicas.
8. Sistemas de prova: dedução natural, corretude e completude (visão), introdução a assistentes de prova (Lean, como curiosidade).

Projeto: provador de tautologias (tabelas-verdade e SAT simples) em Python.
Materiais: *Mathematics for Computer Science* (gratuito), MIT OCW 6.042J.

#### 2.2 Cálculo (`calculo`) · 6 semanas

Equivalências: **ITA MAT** (Cálculo I e II do Curso Fundamental), **MIT 18.01/18.02**, **Harvard Math 1a/1b**, **Oxford Continuous Mathematics** (parte).

1. Limites e continuidade; derivada como taxa de variação.
2. Regras de derivação; otimização; aproximações lineares; método de Newton.
3. Integral; teorema fundamental; técnicas de integração; integrais numéricas.
4. Séries e aproximações (Taylor); por que importam em computação numérica.
5. Funções de várias variáveis: derivadas parciais, gradiente, máximos e mínimos.
6. Gradiente descendente e otimização: a ponte para aprendizado de máquina.

Projeto: biblioteca de cálculo numérico (derivadas, integrais, Newton, gradiente descendente) com gráficos.
Materiais: MIT 18.01SC/18.02SC no OCW, 3Blue1Brown (Essência do Cálculo).

#### 2.3 Álgebra Linear (`algebra-linear`) · 4 semanas

Equivalências: **MIT 18.06** (Gilbert Strang), **Oxford Linear Algebra**, **Harvard Math 21b/22a**, **ITA MAT** (Álgebra Linear).

1. Vetores, matrizes e sistemas lineares; eliminação de Gauss; LU.
2. Espaços vetoriais, base, dimensão, posto; os quatro subespaços fundamentais.
3. Ortogonalidade, projeções, mínimos quadrados; determinantes.
4. Autovalores e autovetores, diagonalização, SVD; aplicações (PageRank, compressão de imagens, PCA).

Projeto: compressão de imagem com SVD e regressão linear "na mão" com NumPy.
Materiais: MIT 18.06SC no OCW, *Linear Algebra* (Strang), 3Blue1Brown (Essência da Álgebra Linear).

#### 2.4 Probabilidade e Estatística (`probabilidade`) · 4 semanas

Equivalências: **Harvard Stat 110**, **MIT 6.3700/18.05**, **Oxford Probability**, **ITA MOQ-13**.

1. Espaço amostral, probabilidade condicional, independência, Bayes.
2. Variáveis aleatórias discretas e contínuas; esperança, variância; distribuições principais.
3. Lei dos grandes números, teorema central do limite, desigualdades (Markov, Chebyshev, Chernoff).
4. Estatística: estimação, intervalos de confiança, testes de hipótese; probabilidade em algoritmos (randomização, hashing).

Projeto: simulações de Monte Carlo e análise de um teste A/B.
Materiais: Stat 110 (aulas e livro gratuitos), MIT 18.05 no OCW.

---

### Fase 3. Algoritmos e Teoria

#### 3.1 Estruturas de Dados (`estruturas-de-dados`) · 6 semanas

Equivalências: **ITA CES-11** (Algoritmos e Estruturas de Dados), **MIT 6.1210** (primeira metade), **Oxford Algorithms and Data Structures**, **Harvard CS 1240** (partes).

1. Análise assintótica rigorosa: O, Ω, Θ; análise de laços e recursões; teorema mestre.
2. Listas, pilhas, filas, deques; análise amortizada (array dinâmico).
3. Tabelas hash: funções de hash, colisões, hashing universal.
4. Árvores binárias de busca e árvores balanceadas (AVL, rubro-negra); heaps e filas de prioridade.
5. Ordenação: merge, quick, heap; limite inferior de comparação; counting e radix.
6. Grafos: representações, BFS, DFS, ordenação topológica, componentes; union-find.

Projeto: biblioteca de estruturas em C ou Java com testes e benchmarks contra a biblioteca padrão.
Materiais: MIT 6.006 no OCW, material público de CES-11 do ITA, *Algorithms* (Jeff Erickson, gratuito).

#### 3.2 Projeto e Análise de Algoritmos (`algoritmos`) · 6 semanas

Equivalências: **ITA CTC-12 e CES-23**, **MIT 6.1210 (segunda metade) e 6.1220/6.046J**, **Harvard CS 1240**, **Oxford Design and Analysis of Algorithms**.

1. Caminhos mínimos (Dijkstra, Bellman-Ford, Floyd-Warshall); árvores geradoras mínimas.
2. Dividir e conquistar avançado; multiplicação rápida; FFT (visão).
3. Algoritmos gulosos e provas de corretude (troca, argumento de "estar à frente").
4. Programação dinâmica: modelagem de subproblemas, problemas clássicos.
5. Fluxo em redes e emparelhamento; programação linear (visão).
6. Algoritmos randomizados e de aproximação; introdução a algoritmos online e em fluxo de dados.

Projeto: planejador de rotas com dados reais de mapas abertos (OpenStreetMap).
Materiais: MIT 6.046J no OCW, *Algorithm Design* (Kleinberg e Tardos), treino no LeetCode/Codeforces.

#### 3.3 Teoria da Computação (`teoria-computacao`) · 6 semanas

Equivalências: **ITA CTC-34 (Autômatos e Linguagens Formais) e CTC-23 (Análise de Algoritmos e Complexidade Computacional)**, **MIT 6.1400** (Computability and Complexity Theory), **Harvard CS 1210/CS 121**, **Oxford Models of Computation**.

1. Linguagens e autômatos finitos; DFA, NFA e equivalência.
2. Expressões regulares; lema do bombeamento; minimização.
3. Gramáticas livres de contexto e autômatos de pilha; parsing (ponte para compiladores).
4. Máquinas de Turing; tese de Church-Turing; decidibilidade; problema da parada; reduções.
5. Complexidade: P, NP, NP-completude, redução de Cook-Levin (visão), problemas NP-completos clássicos.
6. Além de NP: PSPACE, aleatoriedade, aproximação e um olhar sobre computação quântica.

Projeto: simulador de autômatos e de máquina de Turing com visualização.
Materiais: *Introduction to the Theory of Computation* (Sipser), MIT 18.404J no OCW, *Introduction to Theoretical Computer Science* (Boaz Barak, gratuito, base do CS 121 de Harvard).

---

### Fase 4. Sistemas

#### 4.1 Sistemas Digitais e Arquitetura de Computadores (`arquitetura`) · 6 semanas

Equivalências: **ITA EEA-21 (Circuitos Digitais) e EEA-25**, **MIT 6.1903 e 6.1910** (Computation Structures), **Harvard CS 61** (parte), **Oxford Digital Systems**.

1. Bits, portas lógicas, álgebra booleana, circuitos combinacionais.
2. Circuitos sequenciais: flip-flops, registradores, máquinas de estado, memória.
3. Representação de dados: inteiros com sinal, ponto flutuante IEEE 754, caracteres.
4. Arquitetura de conjunto de instruções (RISC-V); programação em assembly; chamadas de função e pilha.
5. Processador: caminho de dados, controle, pipeline, hazards.
6. Hierarquia de memória: caches, memória virtual (visão), desempenho.

Projeto: construir um computador do NAND ao Tetris (Nand2Tetris, partes 1 e 2) ou um processador RISC-V num simulador.
Materiais: Nand2Tetris (gratuito), MIT 6.004 no OCW, *Computer Organization and Design RISC-V Edition*.

#### 4.2 Sistemas Operacionais (`sistemas-operacionais`) · 6 semanas

Equivalências: **ITA CSC-33**, **MIT 6.1810** (Operating System Engineering, xv6) e **6.1800**, **Harvard CS 61 e CS 1610**.

1. Programação de sistemas em C: ponteiros, memória, ferramentas (gdb, valgrind, sanitizers).
2. Processos, chamadas de sistema, modo usuário e kernel.
3. Escalonamento de CPU; threads.
4. Memória virtual: paginação, TLB, substituição de páginas.
5. Concorrência no kernel: locks, condições de corrida, deadlocks.
6. Sistemas de arquivos, E/S, journaling; virtualização e containers.

Projeto: laboratórios do xv6 (chamadas de sistema, alocador, threads) ou um shell próprio com pipes e redirecionamento.
Materiais: *Operating Systems: Three Easy Pieces* (gratuito), MIT 6.S081/6.1810 (laboratórios públicos), CSAPP.

#### 4.3 Redes de Computadores (`redes`) · 4 semanas

Equivalências: **ITA CSC-35** (Redes de Computadores e Internet), MIT 6.1800 (parte de redes), Harvard CS 1450, Stanford CS 144.

1. Arquitetura em camadas; como a internet funciona; medindo latência e banda.
2. Camada de aplicação (HTTP, DNS, e-mail) e programação com sockets.
3. Transporte: UDP, TCP, controle de congestionamento.
4. Rede e enlace: IP, roteamento, NAT, Ethernet, Wi-Fi; segurança em redes (TLS, visão).

Projeto: servidor HTTP próprio e um chat cliente-servidor; captura e análise de tráfego com Wireshark.
Materiais: *Computer Networking: A Top-Down Approach* (Kurose e Ross), Stanford CS 144 (laboratórios públicos).

#### 4.4 Concorrência, Paralelismo e Sistemas Distribuídos (`distribuidos`) · 6 semanas

Equivalências: **Oxford Concurrent Programming**, **ITA CSC-64 (Programação Paralela) e CSC-27 (Processamento Distribuído)**, **MIT 6.172 e 6.5840** (Distributed Systems).

1. Modelos de concorrência: threads, memória compartilhada, troca de mensagens; condições de corrida.
2. Sincronização: locks, semáforos, monitores; canais (estilo CSP/Go); deadlock e livelock.
3. Paralelismo e desempenho: lei de Amdahl, vetorização, cache, programação paralela (OpenMP, fork-join).
4. Sistemas distribuídos: falhas, tempo e relógios lógicos, RPC, MapReduce.
5. Replicação e consenso: Raft (e Paxos em visão), tolerância a falhas.
6. Consistência, CAP, transações distribuídas; estudos de caso (GFS, Spanner, Dynamo).

Projeto: implementar o Raft (laboratórios do 6.5840) ou um armazenamento chave-valor replicado.
Materiais: MIT 6.5840 (aulas e laboratórios públicos), *Designing Data-Intensive Applications*.

#### 4.5 Bancos de Dados (`bancos-de-dados`) · 4 semanas

Equivalências: **ITA CSI-30** (Técnicas de Banco de Dados), **MIT 6.5831** (Database Systems), Harvard CS 1650, **Oxford Databases**, CMU 15-445.

1. Modelo relacional, álgebra relacional, SQL completo.
2. Modelagem e normalização; restrições e integridade.
3. Por dentro do banco: armazenamento, índices (B+tree, hash), execução e otimização de consultas.
4. Transações: ACID, controle de concorrência, recuperação; NoSQL e sistemas distribuídos de dados.

Projeto: mini banco de dados com B+tree e um executor de consultas simples (estilo CMU 15-445 BusTub).
Materiais: CMU 15-445 (aulas públicas), CS50 SQL.

#### 4.6 Compiladores e Linguagens de Programação (`compiladores`) · 4 semanas

Equivalências: **ITA CTC-41** (Compiladores), **Oxford Compilers**, **MIT 6.1100** (Computer Language Engineering), Harvard CS 1530.

1. Visão geral de um compilador; análise léxica.
2. Análise sintática: gramáticas, parsers descendentes e ascendentes, árvore sintática.
3. Análise semântica e sistemas de tipos; semântica de linguagens (visão).
4. Geração de código, representação intermediária, otimizações; interpretadores e máquinas virtuais.

Projeto: interpretador e compilador para uma linguagem pequena (seguindo *Crafting Interpreters*).
Materiais: *Crafting Interpreters* (gratuito online), notas de Oxford Compilers.

---

### Fase 5. Engenharia de Software

#### 5.1 Engenharia de Software e Projeto em Grupo (`engenharia-de-software`) · 4 semanas

Equivalências: **ITA CSI-28 e CSI-29**, **MIT 6.1020**, **Oxford Group Design Practical**, Harvard CS 1100.

1. Requisitos, especificação e processos (ágil, cascata, quando cada um serve).
2. Arquitetura de software, modularidade, design de APIs, documentação.
3. Qualidade: revisão de código, testes em vários níveis, integração e entrega contínuas.
4. Trabalho em equipe, gestão de projetos, manutenção, software livre.

Projeto: projeto em grupo (3 a 5 pessoas) com cliente real ou fictício, do requisito à entrega.

---

### Fase 6. Inteligência Artificial e Dados

#### 6.1 Inteligência Artificial (`inteligencia-artificial`) · 4 semanas

Equivalências: **ITA CMC-15** (Inteligência Artificial), Harvard CS 1820 e **CS50 AI**, MIT 6.4100, **Oxford Artificial Intelligence**.

1. Agentes e busca: busca cega e heurística, A*, busca adversarial (minimax, alfa-beta).
2. Conhecimento e raciocínio: lógica, satisfação de restrições.
3. Incerteza: redes bayesianas, cadeias de Markov, decisão sob incerteza.
4. Aprendizado por reforço (visão); ética e segurança em IA.

Projeto: agente que joga um jogo de tabuleiro e um resolvedor de restrições (sudoku, horários).

#### 6.2 Aprendizado de Máquina (`aprendizado-de-maquina`) · 4 semanas

Equivalências: MIT 6.3900 (Introduction to Machine Learning), **Oxford Machine Learning**, Harvard CS 1810, **ITA CMC-13 (Introdução à Ciência de Dados) e CMC-19 (Processamento de Linguagem Natural)**, Stanford CS 229.

1. Aprendizado supervisionado: regressão, classificação, funções de perda, gradiente descendente, generalização e regularização.
2. Modelos clássicos: árvores, florestas, SVM, k-means, PCA; avaliação e validação cruzada.
3. Redes neurais e deep learning: retropropagação, redes convolucionais, treinamento na prática.
4. Modelos de linguagem e transformers (visão); viés, privacidade e uso responsável. Ponte para a trilha de LLMs e Agents.

Projeto: classificador do zero com NumPy e depois com PyTorch, com relatório de avaliação.
Materiais: MIT 6.036/6.3900 no OCW, Stanford CS 229 e CS 231n (aulas públicas), *Dive into Deep Learning* (gratuito).

---

### Fase 7. Áreas avançadas

#### 7.1 Segurança e Criptografia (`seguranca`) · 2 semanas

Equivalências: **ITA CTC-42 (Introdução à Criptografia) e CSC-07 (Fundamentos de Segurança Cibernética)**, MIT 6.5660 (Computer Systems Security), **Oxford Computer Security**, Harvard CS 1260.

1. Criptografia: simétrica, hash, assimétrica (RSA, curvas elípticas em visão), assinaturas e certificados.
2. Segurança de sistemas: vulnerabilidades de memória, web (injeção, XSS), autenticação, modelagem de ameaças.

Projeto: implementar RSA didático (e entender por que não usar em produção) e explorar um laboratório de segurança web.

#### 7.2 Computação Gráfica e Interação Humano-Computador (`grafica-ihc`) · 2 semanas

Equivalências: **ITA CMC-30** (Fundamentos de Computação Gráfica), MIT 6.4400, Harvard CS 1750, Oxford Computer Graphics e Human-Computer Interaction.

1. Pipeline gráfico, transformações, rasterização, ray tracing básico.
2. Princípios de IHC: usabilidade, acessibilidade, prototipação e avaliação com usuários.

Projeto: ray tracer simples (*Ray Tracing in One Weekend*, gratuito) e avaliação de usabilidade de um app.

#### 7.3 Computação, Ética e Sociedade (`etica`) · 2 semanas

Equivalências: Harvard Embedded EthiCS, MIT (SERC), Oxford Ethics of Computing, CS2023 SEP.

1. Privacidade, LGPD, vigilância, viés algorítmico, impacto social da automação.
2. Profissão: propriedade intelectual, software livre, responsabilidade profissional, acessibilidade, sustentabilidade.

Projeto: ensaio de análise ética de um sistema real (recomendação, reconhecimento facial).

---

### Fase 8. Conclusão

#### 8.1 Projeto Final (`projeto-final`) · 4 semanas (ou mais)

Equivalências: TG do ITA, Senior Thesis de Harvard, MEng/UROP do MIT, Part C project de Oxford.

1. Escolha do problema, revisão do estado da arte, proposta.
2. Desenvolvimento orientado por marcos.
3. Avaliação experimental e comparação com alternativas.
4. Escrita (relatório no formato de artigo) e apresentação pública (vídeo ou palestra).

Sugestões de temas: um sistema distribuído tolerante a falhas, um compilador para uma linguagem própria, um otimizador de rotas, um modelo de ML aplicado a um problema brasileiro, contribuição relevante para um projeto de software livre.

---

## Cobertura das áreas do CS2023

| Área CS2023 | Etapas da trilha |
|---|---|
| AI (Artificial Intelligence) | 6.1, 6.2 |
| AL (Algorithmic Foundations) | 1.1, 3.1, 3.2, 3.3 |
| AR (Architecture and Organization) | 4.1 |
| DM (Data Management) | 4.5 |
| FPL (Foundations of Programming Languages) | 1.2, 1.3, 4.6 |
| GIT (Graphics and Interactive Techniques) | 7.2 |
| HCI (Human-Computer Interaction) | 7.2 |
| MSF (Mathematical and Statistical Foundations) | 0.1, 2.1, 2.2, 2.3, 2.4 |
| NC (Networking and Communication) | 4.3 |
| OS (Operating Systems) | 4.2 |
| PDC (Parallel and Distributed Computing) | 4.4 |
| SDF (Software Development Fundamentals) | 0.2, 1.1, 1.3 |
| SE (Software Engineering) | 1.3, 5.1 |
| SEC (Security) | 7.1 (e tópicos em 4.2, 4.3) |
| SEP (Society, Ethics, and the Profession) | 7.3 (e quadros de ética espalhados) |
| SF (Systems Fundamentals) | 4.1, 4.2, 4.4 |
| SPD (Specialized Platform Development) | Trilhas existentes: Frontend React, Embarcados, Dados |

## Decisões técnicas para a implementação

- **id da trilha:** `computacao`; título "Roadmap Ciência da Computação"; ícone 🎓; status `disponivel` desde a conclusão das 25 etapas.
- **Seções no código** = as 25 etapas acima (o mapa agrupa por etapa; as fases aparecem no texto "Antes de começar" e no README). Se a página ficar longa demais, considerar um seletor de fase no topo do mapa.
- **Cada etapa terá:** `src/apostilas/computacao/<id>.md` e `<id>.gabarito.md`, com `## Tema N` = semana N.
- **Novo campo opcional** nas apostilas: um quadro "Equivalências" no "Comece por aqui" (ITA, MIT, Harvard, Oxford) e "Para ir além" (links gratuitos) no fim.
- **Empresas:** em vez de "empresas que usam", a seção pode virar "Onde essa formação leva" (big techs, bancos, pesquisa, startups, pós-graduação no Brasil e no exterior).
- **Projetos:** um por etapa, mais o Projeto Final.
- **Commits:** um commit por etapa (apostila e gabarito juntos), mais commits separados para dados do roadmap e ajustes de interface.

## Checklist de produção

Legenda: **A** = apostila, **G** = gabarito, **R** = dados no roadmap (semanas e tópicos).

### Estrutura
- [x] Dados do roadmap (`src/data/roadmaps/computacao.ts`) com as 25 etapas, empresas/destinos e projetos
- [x] Trocar o banner "em breve" da home pelo card normal quando a primeira fase estiver pronta
- [x] README atualizado

### Fase 0. Preparação
- [x] 0.1 Matemática essencial: A · G · R
- [x] 0.2 Ferramentas do programador: A · G · R

### Fase 1. Programação
- [x] 1.1 Introdução à Computação e Programação: A · G · R
- [x] 1.2 Programação Funcional: A · G · R
- [x] 1.3 Programação Imperativa e Orientada a Objetos: A · G · R

### Fase 2. Matemática para Computação
- [x] 2.1 Matemática Discreta e Lógica: A · G · R
- [x] 2.2 Cálculo: A · G · R
- [x] 2.3 Álgebra Linear: A · G · R
- [x] 2.4 Probabilidade e Estatística: A · G · R

### Fase 3. Algoritmos e Teoria
- [x] 3.1 Estruturas de Dados: A · G · R
- [x] 3.2 Projeto e Análise de Algoritmos: A · G · R
- [x] 3.3 Teoria da Computação: A · G · R

### Fase 4. Sistemas
- [x] 4.1 Sistemas Digitais e Arquitetura de Computadores: A · G · R
- [x] 4.2 Sistemas Operacionais: A · G · R
- [x] 4.3 Redes de Computadores: A · G · R
- [x] 4.4 Concorrência, Paralelismo e Sistemas Distribuídos: A · G · R
- [x] 4.5 Bancos de Dados: A · G · R
- [x] 4.6 Compiladores e Linguagens de Programação: A · G · R

### Fase 5. Engenharia de Software
- [x] 5.1 Engenharia de Software e Projeto em Grupo: A · G · R

### Fase 6. IA e Dados
- [x] 6.1 Inteligência Artificial: A · G · R
- [x] 6.2 Aprendizado de Máquina: A · G · R

### Fase 7. Áreas avançadas
- [x] 7.1 Segurança e Criptografia: A · G · R
- [x] 7.2 Computação Gráfica e IHC: A · G · R
- [x] 7.3 Computação, Ética e Sociedade: A · G · R

### Fase 8. Conclusão
- [x] 8.1 Projeto Final: A · G · R

## Referências

- ITA, Divisão de Ciência da Computação: [Catálogo do curso de Engenharia de Computação](https://comp.ita.br/assets/pdfs/Catalogo.pdf) e [Projeto Pedagógico](https://comp.ita.br/ensino/projetoPedagogico.html)
- MIT: [Computer Science and Engineering (Course 6-3)](https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/), [MIT OpenCourseWare](https://ocw.mit.edu), [6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/)
- Harvard: [CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/), [CS50](https://cs50.harvard.edu)
- Oxford: [Preliminary Examinations (1º ano)](https://www.cs.ox.ac.uk/teaching/bacompsci/PreliminaryExaminations/index.html), [Part A (2º ano)](https://www.cs.ox.ac.uk/teaching/bacompsci/PartA/index.html)
- ACM/IEEE-CS/AAAI: [CS2023 Computer Science Curricula](https://csed.acm.org/)

As grades das universidades mudam de ano para ano; antes de escrever cada apostila, conferir o catálogo vigente da disciplina equivalente.
