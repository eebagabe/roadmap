# Bancos de Dados: Apostila Prática

Roadmap Ciência da Computação · Semanas 87 a 90

## Comece por aqui

Quase todo software guarda dados, e quase todo dado importante mora num **banco de dados**: contas bancárias, pedidos, prontuários, notas de alunos. Um sistema gerenciador de banco de dados (SGBD) resolve, de uma vez, problemas difíceis que cada aplicação teria que resolver sozinha: guardar dados de forma organizada, consultá-los com uma linguagem declarativa, permitir que milhares de usuários leiam e escrevam ao mesmo tempo sem bagunça, e não perder nada se a energia cair. Esta etapa tem duas metades: **usar** bem um banco (modelo relacional, SQL, modelagem) e **entender por dentro** como ele funciona (armazenamento, índices, execução de consultas, transações), seguindo o excelente curso CMU 15-445.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSI-30 Técnicas de Banco de Dados |
| MIT | 6.5831 (antiga 6.830) Database Systems |
| Harvard | CS 1650 Data Systems |
| Oxford | Databases (2º ano) |
| CMU | 15-445 Database Systems |

### Como esta apostila funciona

1. Instale o **PostgreSQL** (ou use o **SQLite**, que já vem com o Python). Os exemplos usam SQL padrão.
2. Use um conjunto de dados real para praticar (os dados abertos do governo, ou bases como o Chinook e o Pagila).
3. Para cada consulta lenta, rode `EXPLAIN ANALYZE` e leia o plano.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** consulta SQL dando resultado errado? Rode-a por partes: primeiro só o `FROM` e os `JOIN`s com `SELECT *` e `LIMIT 20`, depois acrescente o `WHERE`, depois o `GROUP BY`. Quase sempre o problema é um `JOIN` que multiplicou linhas ou um `NULL` inesperado.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 87 | Tema 1: Modelo relacional e SQL |
| 88 | Tema 2: Modelagem e normalização |
| 89 | Tema 3: Por dentro do banco |
| 90 | Tema 4: Transações e NoSQL + projeto |

## Tema 1: Modelo relacional e SQL

**Objetivo:** entender o modelo relacional e escrever consultas SQL completas.

### 1.1 Modelo relacional

Proposto por Edgar Codd em 1970, o **modelo relacional** organiza os dados em **relações** (tabelas): cada relação tem um **esquema** (nome e atributos com tipos) e um conjunto de **tuplas** (linhas). É a ideia de relação da Matemática Discreta: um subconjunto do produto cartesiano dos domínios.

```
aluno(id, nome, curso_id)
curso(id, nome, departamento)
matricula(aluno_id, disciplina_id, semestre, nota)
```

Conceitos:

- **Chave primária:** atributo(s) que identificam unicamente cada tupla (`aluno.id`).
- **Chave estrangeira:** atributo que referencia a chave primária de outra relação (`aluno.curso_id` → `curso.id`), garantindo a **integridade referencial**.
- Relações são **conjuntos**: sem ordem e (na teoria) sem duplicatas.

A grande ideia de Codd: **independência de dados**. A aplicação diz **o que** quer (declarativamente), e o banco decide **como** buscar: com ou sem índice, em que ordem fazer as junções. Se a organização física mudar, as consultas continuam funcionando.

### 1.2 Álgebra relacional

A **álgebra relacional** é o conjunto de operações sobre relações que está por trás do SQL (e de como o banco executa as consultas):

| Operação | Símbolo | Faz | SQL |
|---|---|---|---|
| Seleção | σ | Filtra linhas | `WHERE` |
| Projeção | π | Escolhe colunas | `SELECT colunas` |
| Junção | ⋈ | Combina linhas de duas relações que satisfazem uma condição | `JOIN ... ON` |
| União, diferença, interseção | ∪, −, ∩ | Operações de conjuntos | `UNION`, `EXCEPT`, `INTERSECT` |
| Produto cartesiano | × | Todas as combinações | `CROSS JOIN` |
| Renomeação | ρ | Muda nomes | `AS` |
| Agregação | γ | Agrupa e resume | `GROUP BY` |

"Nomes dos alunos de Computação": π_nome(σ_curso.nome='Computação'(aluno ⋈_aluno.curso_id=curso.id curso)).

Como as operações recebem e devolvem relações, elas se **compõem**, e expressões equivalentes podem ter custos muito diferentes. Fazer a seleção **antes** da junção (empurrar filtros para baixo) costuma economizar muito trabalho: o otimizador de consultas (Tema 3) faz essas transformações automaticamente.

### 1.3 SQL

**Definição de dados (DDL):**

```sql
CREATE TABLE curso (
    id           SERIAL PRIMARY KEY,
    nome         TEXT NOT NULL UNIQUE,
    departamento TEXT NOT NULL
);

CREATE TABLE aluno (
    id        SERIAL PRIMARY KEY,
    nome      TEXT NOT NULL,
    email     TEXT UNIQUE,
    curso_id  INTEGER REFERENCES curso(id),
    ingresso  DATE NOT NULL DEFAULT CURRENT_DATE
);
```

**Manipulação (DML):**

```sql
INSERT INTO curso (nome, departamento) VALUES ('Computação', 'Exatas');
UPDATE aluno SET curso_id = 2 WHERE id = 10;
DELETE FROM matricula WHERE semestre < '2020.1';
```

**Consulta**, com a ordem **lógica** de execução (diferente da ordem em que se escreve):

```sql
SELECT   c.nome, COUNT(*) AS alunos, AVG(m.nota) AS media   -- 5. escolhe colunas
FROM     aluno a                                              -- 1. tabelas
JOIN     curso c      ON c.id = a.curso_id                    --    e junções
JOIN     matricula m  ON m.aluno_id = a.id
WHERE    m.semestre = '2025.1'                                -- 2. filtra linhas
GROUP BY c.nome                                               -- 3. agrupa
HAVING   COUNT(*) >= 10                                       -- 4. filtra grupos
ORDER BY media DESC                                           -- 6. ordena
LIMIT    5;                                                   -- 7. limita
```

Por causa dessa ordem, um apelido criado no `SELECT` não pode ser usado no `WHERE`, e para filtrar por um agregado usa-se `HAVING`, não `WHERE`.

**NULL** representa valor desconhecido e segue uma **lógica de três valores**: `NULL = NULL` não é verdadeiro, é desconhecido. Use `IS NULL`. Agregações como `AVG` ignoram NULLs; `COUNT(*)` conta linhas, `COUNT(coluna)` conta valores não nulos.

> **Cuidado! Cai na entrevista:** `WHERE x NOT IN (SELECT y FROM t)` não devolve **nenhuma** linha se a subconsulta tiver um único `NULL`. Prefira `NOT EXISTS`.

### 1.4 Junções e agregações

| Junção | Devolve |
|---|---|
| `INNER JOIN` | Só os pares que satisfazem a condição |
| `LEFT JOIN` | Todas as linhas da esquerda; colunas da direita viram NULL se não houver par |
| `RIGHT JOIN` | O simétrico |
| `FULL JOIN` | Todas de ambos os lados |
| `CROSS JOIN` | Produto cartesiano |

"Cursos sem nenhum aluno" (padrão anti-junção):

```sql
SELECT c.nome
FROM curso c
LEFT JOIN aluno a ON a.curso_id = c.id
WHERE a.id IS NULL;
```

Recursos mais avançados, muito úteis:

```sql
-- subconsulta correlacionada: alunos com nota acima da média da própria disciplina
SELECT m.aluno_id, m.disciplina_id, m.nota
FROM matricula m
WHERE m.nota > (SELECT AVG(m2.nota) FROM matricula m2 WHERE m2.disciplina_id = m.disciplina_id);

-- CTE (WITH) e função de janela: ranking por curso
WITH medias AS (
    SELECT a.curso_id, a.nome, AVG(m.nota) AS media
    FROM aluno a JOIN matricula m ON m.aluno_id = a.id
    GROUP BY a.id, a.curso_id, a.nome
)
SELECT curso_id, nome, media,
       RANK() OVER (PARTITION BY curso_id ORDER BY media DESC) AS posicao
FROM medias;
```

**Funções de janela** (`OVER`) calculam sobre um grupo de linhas **sem colapsá-las** como o `GROUP BY` faz: rankings, totais acumulados, média móvel, comparação com a linha anterior (`LAG`). CTEs recursivas (`WITH RECURSIVE`) percorrem hierarquias e grafos.

### Atividades de fixação do Tema 1

Use o esquema de exemplo (aluno, curso, disciplina, matricula):

1. Escreva em álgebra relacional e em SQL: os nomes das disciplinas que o aluno de id 7 cursou em 2025.1.
2. Liste, para cada curso, o número de alunos, incluindo cursos com zero alunos.
3. Encontre os alunos que **nunca** tiveram nota abaixo de 5 (com `NOT EXISTS`).
4. Para cada disciplina, mostre a maior nota e o nome de quem a tirou (cuidado com empates).
5. Calcule, para cada aluno e semestre, a média do semestre e a diferença em relação ao semestre anterior (`LAG`).
6. Explique a diferença de resultado entre `COUNT(*)`, `COUNT(nota)` e `COUNT(DISTINCT aluno_id)` numa tabela de matrículas com notas nulas.

## Tema 2: Modelagem e normalização

**Objetivo:** projetar esquemas que representam bem o problema e evitam redundância e anomalias.

### 2.1 Modelo entidade-relacionamento

Antes das tabelas, o modelo **conceitual**. O **modelo entidade-relacionamento** (ER) descreve:

- **Entidades:** coisas com identidade (Aluno, Disciplina, Professor).
- **Atributos:** propriedades (nome, e-mail); um ou mais formam o identificador.
- **Relacionamentos:** associações entre entidades (Aluno *cursa* Disciplina), com **cardinalidade**: um para um (1:1), um para muitos (1:N), muitos para muitos (N:M).

Tradução para tabelas:

| Situação | Tabela |
|---|---|
| Entidade | Uma tabela com chave primária |
| Relacionamento 1:N | Chave estrangeira no lado N (aluno.curso_id) |
| Relacionamento N:M | Tabela de associação com as duas chaves estrangeiras (matricula) e os atributos do relacionamento (nota, semestre) |
| Relacionamento 1:1 | Chave estrangeira única num dos lados (ou fundir as tabelas) |
| Atributo multivalorado (vários telefones) | Tabela separada |

### 2.2 Dependências funcionais

Uma **dependência funcional** X → Y diz que o valor de X **determina** o de Y: duas linhas com o mesmo X têm o mesmo Y. Ex.: `cep → cidade`, `aluno_id → nome`, `(aluno_id, disciplina_id, semestre) → nota`.

Uma **chave candidata** é um conjunto mínimo de atributos que determina todos os outros.

Dependências funcionais vêm do **significado** dos dados, não de uma amostra: só porque, na tabela atual, todos com o mesmo nome têm o mesmo e-mail, não quer dizer que nome → e-mail.

### 2.3 Formas normais

Uma tabela mal projetada gera **anomalias**. Exemplo:

```
matricula(aluno_id, aluno_nome, disciplina_id, disciplina_nome, professor, nota)
```

- **Redundância:** o nome da disciplina e o professor se repetem em cada matrícula.
- **Anomalia de atualização:** trocar o professor exige mudar muitas linhas; esquecer uma deixa os dados contraditórios.
- **Anomalia de inserção:** não dá para cadastrar uma disciplina sem nenhum aluno.
- **Anomalia de remoção:** apagar o último aluno de uma disciplina apaga a informação da disciplina.

**Normalizar** é decompor a tabela em outras, guiado pelas dependências funcionais:

| Forma normal | Exige |
|---|---|
| 1FN | Valores atômicos (sem listas dentro de uma célula) |
| 2FN | 1FN, e nenhum atributo não chave depende de **parte** de uma chave composta |
| 3FN | 2FN, e nenhum atributo não chave depende de **outro atributo não chave** (sem dependências transitivas) |
| BCNF | Para toda dependência X → Y não trivial, X é uma superchave |

Resumo informal da 3FN: cada atributo depende "da chave, da chave inteira e de nada além da chave".

No exemplo: `disciplina_id → disciplina_nome, professor` e `aluno_id → aluno_nome` violam a 2FN (dependem de parte da chave). Decomposição:

```
aluno(aluno_id, aluno_nome)
disciplina(disciplina_id, disciplina_nome, professor)
matricula(aluno_id, disciplina_id, semestre, nota)
```

Uma boa decomposição é **sem perda** (juntar as tabelas devolve exatamente a original) e, idealmente, **preserva as dependências**.

**Desnormalizar** de propósito (guardar dados redundantes) às vezes é a escolha certa para leituras muito frequentes, em relatórios e *data warehouses*: é uma troca consciente de consistência por desempenho.

### 2.4 Restrições de integridade

O banco é o último guardião dos dados: regras declaradas nele valem para **todas** as aplicações que o acessam.

```sql
CREATE TABLE matricula (
    aluno_id      INTEGER NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplina(id) ON DELETE RESTRICT,
    semestre      TEXT    NOT NULL CHECK (semestre ~ '^\d{4}\.[12]$'),
    nota          NUMERIC(4, 2) CHECK (nota BETWEEN 0 AND 10),
    PRIMARY KEY (aluno_id, disciplina_id, semestre)
);
```

- `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `CHECK`.
- `FOREIGN KEY` com o que fazer ao apagar o referenciado: `RESTRICT` (proíbe), `CASCADE` (apaga junto), `SET NULL`.
- **Gatilhos** (*triggers*) para regras mais complexas, usados com moderação.

> **Cuidado! Cai na prática:** validar só na aplicação não basta: duas requisições simultâneas podem passar pela validação de "e-mail ainda não cadastrado" e as duas inserirem. Uma restrição `UNIQUE` no banco resolve de forma atômica.

### Atividades de fixação do Tema 2

1. Faça o modelo ER de uma biblioteca: livros (com vários autores), exemplares físicos, usuários e empréstimos (com data de devolução prevista e real). Traduza para tabelas com chaves.
2. Dada `pedido(pedido_id, cliente_id, cliente_nome, cliente_cidade, produto_id, produto_nome, preco_unitario, quantidade)` com chave (pedido_id, produto_id), liste as dependências funcionais, as anomalias e normalize até a 3FN.
3. Em `endereco(cep, rua, cidade, estado)`, com chave `cep`, sabendo que `cidade → estado`, a tabela está na 3FN? Vale a pena normalizar?
4. Mostre uma decomposição **com perda**: duas tabelas cuja junção gera linhas que não existiam.
5. Escreva as restrições SQL para: preço positivo, e-mail único, data de devolução não anterior à de empréstimo.
6. Dê um exemplo em que desnormalizar é uma boa ideia e explique como manter a cópia redundante correta.

## Tema 3: Por dentro do banco

**Objetivo:** entender como o banco guarda os dados, usa índices e executa e otimiza consultas.

### 3.1 Armazenamento em páginas

O banco guarda as tabelas em **arquivos** divididos em **páginas** (blocos de 4 a 16 KB; 8 KB no PostgreSQL), a unidade de leitura e escrita no disco. Uma página guarda várias tuplas, num formato com **slots** (*slotted page*): um cabeçalho com um vetor de deslocamentos apontando para as tuplas, que ficam no fim da página e crescem em direção ao meio.

Uma tabela sem ordem é um **heap**: as tuplas ficam onde houver espaço.

O **gerenciador de buffer** (*buffer pool*) mantém um conjunto de páginas na memória, com uma política de substituição (LRU, relógio, como em Sistemas Operacionais). Bancos preferem gerenciar o próprio cache em vez de confiar só no do sistema operacional, porque sabem o que vão precisar (por exemplo, uma varredura sequencial grande não deveria expulsar as páginas "quentes").

**Linhas ou colunas:**

- **Orientado a linhas** (PostgreSQL, MySQL): cada tupla inteira junta. Ótimo para **OLTP** (transações curtas que leem e escrevem poucas linhas inteiras).
- **Orientado a colunas** (ClickHouse, BigQuery, DuckDB, Parquet): cada coluna guardada separadamente. Ótimo para **OLAP** (análises que leem poucas colunas de milhões de linhas), e comprime muito melhor (valores parecidos ficam juntos).

### 3.2 Índices B+tree

Sem índice, achar `WHERE email = 'ana@x.com'` exige ler a tabela inteira (**varredura sequencial**, O(n) páginas). Um **índice** é uma estrutura auxiliar que leva das chaves às tuplas.

A **B+tree** é o índice padrão de quase todos os bancos:

- Árvore **balanceada** com nós do tamanho de uma **página**: cada nó tem centenas de filhos (fator de ramificação alto). Com 500 filhos por nó, 3 níveis indexam 500³ = 125 milhões de chaves: qualquer busca lê ~3 a 4 páginas.
- Nós internos guardam só chaves de **roteamento**; **todas** as chaves (e os ponteiros para as tuplas) ficam nas **folhas**.
- As folhas são **ligadas** em ordem: depois de achar o início, uma consulta por intervalo (`BETWEEN`, `>`, `ORDER BY`) percorre as folhas sequencialmente.
- Inserção: se a folha enche, **divide** em duas e sobe uma chave para o pai (que também pode dividir). A árvore cresce pela raiz e continua balanceada.

Por que não uma árvore binária? Porque cada nível custa um acesso a disco (ou a página), e a B+tree tem altura log₅₀₀ n em vez de log₂ n.

**Índices compostos** em (a, b): servem para filtrar por `a`, ou por `a` e `b`, mas **não** só por `b` (como uma lista telefônica ordenada por sobrenome e depois por nome). **Índice de cobertura:** se o índice contém todas as colunas da consulta, nem é preciso ler a tabela.

Custo dos índices: espaço e escritas mais lentas (cada `INSERT` atualiza todos os índices da tabela). Indexe as colunas usadas em filtros, junções e ordenações frequentes, não tudo.

### 3.3 Índices hash

Um **índice hash** (tabela hash em disco, Estruturas de Dados) responde **igualdade** (`=`) em O(1) acessos, mas não serve para intervalos nem ordenação. **Hashing extensível** e **linear** permitem crescer sem refazer a tabela inteira.

Outros índices para casos específicos: **GIN** (texto completo, arrays, JSON; um índice invertido), **GiST** e **R-tree** (dados geográficos), **BRIN** (resumos por bloco para tabelas enormes e naturalmente ordenadas, como registros por data), e índices vetoriais para busca por similaridade (usados com *embeddings* em IA).

### 3.4 Execução de consultas

O banco transforma o SQL em um **plano**: uma árvore de **operadores** da álgebra relacional, cada um consumindo linhas dos filhos (modelo de **iteradores**, ou Volcano: cada operador tem `próximo()`, que pede linhas aos filhos sob demanda).

Algoritmos de **junção**, o operador mais importante:

| Algoritmo | Como funciona | Custo (páginas R, S) | Bom quando |
|---|---|---|---|
| Laços aninhados | Para cada linha de R, percorre S | R × S | Uma tabela é minúscula |
| Laços aninhados com índice | Para cada linha de R, busca no índice de S | R × (custo do índice) | Há índice na coluna de junção de S |
| Hash join | Constrói tabela hash da menor; percorre a maior procurando | ~3(R + S) | Igualdade, sem índice, uma tabela cabe na memória |
| Sort-merge join | Ordena ambas pela chave e intercala | Ordenação + (R + S) | Já ordenadas, ou desigualdades |

Quando os dados não cabem na memória, a ordenação é **externa** (intercalação de blocos, Estruturas de Dados) e o hash join particiona as duas tabelas pelo hash antes (*grace hash join*).

Bancos analíticos modernos processam **lotes** de valores por coluna (execução **vetorizada**, usando SIMD) ou **compilam** a consulta para código de máquina.

### 3.5 Otimização de consultas

Para uma mesma consulta há uma quantidade enorme de planos equivalentes (ordens de junção, algoritmos, índices). O **otimizador** escolhe o de menor custo estimado:

1. **Reescritas** pela álgebra: empurrar filtros e projeções para baixo, transformar subconsultas em junções.
2. **Estimativa de cardinalidade:** quantas linhas cada operador vai produzir, usando **estatísticas** (número de linhas, valores distintos, histogramas) coletadas pelo `ANALYZE`.
3. **Busca do plano:** programação dinâmica sobre os subconjuntos de tabelas (o otimizador do System R, de 1979, usado até hoje), avaliando ordens de junção.

```sql
EXPLAIN ANALYZE
SELECT a.nome FROM aluno a JOIN matricula m ON m.aluno_id = a.id WHERE m.nota > 9;
```

```
Hash Join  (cost=... rows=812) (actual time=... rows=790)
  Hash Cond: (m.aluno_id = a.id)
  ->  Seq Scan on matricula m  (rows=812) Filter: (nota > 9)
  ->  Hash
        ->  Seq Scan on aluno a
```

Leia de baixo para cima e de dentro para fora. Compare **rows estimadas** com **actual rows**: estimativas muito erradas levam a planos ruins (e são a causa mais comum de consultas lentas "misteriosas").

> **Cuidado! Cai na prática:** o índice em `email` não é usado em `WHERE lower(email) = '...'` nem em `WHERE email LIKE '%@gmail.com'` (o curinga no início impede usar a ordem). Crie um índice na expressão (`CREATE INDEX ON aluno (lower(email))`) ou mude a consulta.

### Atividades de fixação do Tema 3

1. Uma tabela tem 10 milhões de linhas de 200 bytes em páginas de 8 KB. Quantas páginas? Quantas leituras de página para uma varredura completa e para uma busca por chave numa B+tree com 400 chaves por nó?
2. Insira as chaves 5, 15, 25, 35, 45, 55, 65 numa B+tree em que cada nó guarda no máximo 3 chaves. Desenhe a árvore após cada divisão.
3. Com um índice composto em (cidade, idade), quais consultas o usam bem? (a) `cidade = 'Recife'`; (b) `idade = 30`; (c) `cidade = 'Recife' AND idade > 30`; (d) `ORDER BY cidade, idade`.
4. Uma junção de R (1.000 páginas) com S (500 páginas) por igualdade, com memória de 600 páginas. Estime o custo de laços aninhados por bloco, hash join e sort-merge.
5. Crie uma tabela com 1 milhão de linhas no PostgreSQL e compare o `EXPLAIN ANALYZE` de uma busca por igualdade antes e depois de criar o índice. Depois teste uma busca que devolve 50% da tabela: o otimizador usa o índice? Por quê?
6. Por que um banco colunar é muito mais rápido para `SELECT AVG(preco) FROM vendas WHERE ano = 2025` numa tabela com 50 colunas e 1 bilhão de linhas?

## Tema 4: Transações e NoSQL

**Objetivo:** entender como o banco garante consistência com acessos simultâneos e falhas, e conhecer os bancos não relacionais.

### 4.1 ACID

Uma **transação** é uma sequência de operações tratada como uma unidade:

```sql
BEGIN;
UPDATE conta SET saldo = saldo - 100 WHERE id = 1;
UPDATE conta SET saldo = saldo + 100 WHERE id = 2;
COMMIT;      -- ou ROLLBACK para desfazer tudo
```

Garantias **ACID**:

- **Atomicidade:** tudo ou nada. Se cair a energia entre os dois `UPDATE`s, nenhum vale.
- **Consistência:** a transação leva o banco de um estado válido a outro (respeitando as restrições).
- **Isolamento:** transações simultâneas não interferem umas nas outras (cada uma "parece" rodar sozinha, em algum grau).
- **Durabilidade:** depois do `COMMIT`, o dado sobrevive a quedas.

### 4.2 Controle de concorrência

O ideal é a **serializabilidade**: o resultado de transações simultâneas é igual ao de **alguma** execução em série delas. Sem controle, surgem anomalias:

| Anomalia | O que acontece |
|---|---|
| Leitura suja | Ler dados de uma transação que ainda não confirmou (e pode desfazer) |
| Leitura não repetível | Ler a mesma linha duas vezes e ver valores diferentes |
| Fantasma | Repetir uma consulta e aparecerem linhas novas |
| Atualização perdida | Duas transações leem, calculam e escrevem; uma sobrescreve a outra |
| Distorção de escrita (*write skew*) | Cada uma lê dados que a outra altera; juntas violam uma regra (dois médicos de plantão saem ao mesmo tempo, cada um vendo o outro ainda escalado) |

Níveis de isolamento do SQL (do mais fraco ao mais forte): `READ UNCOMMITTED`, `READ COMMITTED` (padrão do PostgreSQL), `REPEATABLE READ` e `SERIALIZABLE`. Níveis mais fracos são mais rápidos e permitem mais anomalias.

Mecanismos:

- **Bloqueio em duas fases** (2PL): a transação adquire locks (compartilhados para ler, exclusivos para escrever) e, depois de liberar o primeiro, não adquire mais nenhum. Garante serializabilidade; pode gerar **deadlocks**, que o banco detecta (ciclo no grafo de espera) e resolve abortando uma das transações.
- **MVCC** (controle de concorrência multiversão; PostgreSQL, Oracle, MySQL InnoDB): cada escrita cria uma **nova versão** da linha; cada transação lê uma **fotografia** consistente do banco no seu início. **Leitores não bloqueiam escritores, e escritores não bloqueiam leitores.** Versões antigas são limpas depois (o `VACUUM` do PostgreSQL). Com detecção extra de conflitos (SSI), oferece serializabilidade.
- **Otimista** (OCC): executa sem locks e valida no fim; se houve conflito, aborta e repete.

> **Cuidado! Cai na entrevista:** `UPDATE estoque SET qtd = qtd - 1 WHERE id = 7 AND qtd > 0` é atômico e seguro; ler a quantidade na aplicação, testar e depois escrever (`SELECT`, depois `UPDATE` com o valor calculado) causa atualização perdida em `READ COMMITTED`. Use a operação atômica, `SELECT ... FOR UPDATE`, ou `SERIALIZABLE` com nova tentativa.

### 4.3 Recuperação

Como garantir atomicidade e durabilidade se a energia cair? **Registro prévio** (*write-ahead logging*, WAL), a mesma ideia do journaling (Sistemas Operacionais):

1. Toda alteração é registrada no **log** (sequencial, rápido de gravar) **antes** de a página alterada ir para o disco.
2. O `COMMIT` só retorna depois que o registro de commit do log está **no disco** (`fsync`). As páginas de dados podem ser gravadas depois, com calma.
3. Depois de uma queda, o algoritmo de recuperação (o clássico é o **ARIES**): **refaz** (*redo*) tudo do log para reconstruir o estado no momento da queda, e **desfaz** (*undo*) as transações que não tinham confirmado.

**Checkpoints** periódicos limitam quanto do log precisa ser relido. O mesmo log alimenta a **replicação** (réplicas recebem e aplicam o WAL) e a recuperação de um momento no passado (*point-in-time recovery*).

### 4.4 NoSQL

**NoSQL** ("não só SQL") é um nome guarda-chuva para bancos com modelos diferentes do relacional, que se popularizaram com a escala da web:

| Tipo | Modelo | Exemplos | Bom para |
|---|---|---|---|
| Chave-valor | Uma chave → um valor opaco | Redis, DynamoDB, etcd | Cache, sessões, configuração |
| Documentos | Documentos JSON aninhados | MongoDB, Couchbase | Dados com estrutura variável, leitura de agregados inteiros |
| Colunas largas | Linhas com colunas variáveis, particionadas por chave | Cassandra, HBase, Bigtable | Escritas massivas, séries temporais |
| Grafos | Vértices e arestas com propriedades | Neo4j | Relações profundas: redes sociais, recomendações, fraudes |
| Busca | Índice invertido de texto | Elasticsearch, OpenSearch | Busca textual e logs |

Em geral, trocam parte das garantias do modelo relacional (junções, transações entre muitos registros, esquema rígido) por **escala horizontal** (particionar os dados entre muitas máquinas), **disponibilidade** e flexibilidade, como você viu no Dynamo (etapa anterior).

A fronteira ficou difusa: o PostgreSQL guarda e indexa JSON (`jsonb`), bancos **NewSQL** (Spanner, CockroachDB, TiDB) oferecem SQL e transações ACID com escala horizontal, e o MongoDB passou a ter transações. A pergunta certa não é "SQL ou NoSQL?", mas "quais consultas e garantias minha aplicação precisa, e em que escala?". Para a maioria dos sistemas, um bom banco relacional é o ponto de partida mais seguro.

### Atividades de fixação do Tema 4

1. Abra duas sessões do PostgreSQL e reproduza uma **atualização perdida** em `READ COMMITTED` com o padrão "ler, calcular, escrever". Corrija de duas formas.
2. Reproduza a distorção de escrita dos médicos de plantão em `REPEATABLE READ` e mostre que `SERIALIZABLE` a impede (uma das transações falha e precisa ser repetida).
3. Duas transações em 2PL: T1 trava A e quer B; T2 trava B e quer A. O que o banco faz? Como a aplicação deve reagir?
4. Explique por que o WAL permite que o `COMMIT` seja rápido mesmo exigindo durabilidade.
5. Em MVCC, uma transação longa (horas) aberta pode degradar o banco inteiro. Por quê?
6. Para cada caso, escolha um tipo de banco e justifique: (a) carrinho de compras de um grande e-commerce; (b) sistema contábil; (c) "amigos de amigos que curtem jazz"; (d) busca de produtos por texto com erros de digitação; (e) cache de sessões de login.

## Projeto da etapa

**Mini banco de dados (estilo CMU 15-445 BusTub), em C++, Rust, Go ou Java:**

1. **Gerenciador de disco:** lê e grava páginas de tamanho fixo num arquivo.
2. **Gerenciador de buffer:** um conjunto fixo de molduras na memória, com política LRU-K ou relógio, contador de "pinos" (páginas em uso não podem sair) e marcação de páginas sujas.
3. **Páginas com slots** para tuplas de tamanho variável, e um heap de tabela.
4. **Índice B+tree** com inserção (com divisão de nós), busca, remoção (com junção ou empréstimo entre irmãos) e iterador para intervalos.
5. **Executor de consultas** no modelo de iteradores: varredura sequencial, varredura por índice, seleção, projeção, junção por laços aninhados e hash join, e agregação com `GROUP BY`. As consultas podem ser montadas à mão como árvores de operadores (sem parser de SQL).
6. Testes que comparam os resultados com o SQLite nas mesmas consultas, e um benchmark da B+tree contra a varredura sequencial.

**Alternativa mais curta:** modele o banco de dados de um sistema real (uma clínica, uma escola, um e-commerce) no PostgreSQL, com esquema normalizado, restrições, dados realistas gerados por script (1 milhão de linhas na tabela principal), 15 consultas de relatório (com junções, agregações e funções de janela) e um relatório de desempenho mostrando o efeito dos índices escolhidos com `EXPLAIN ANALYZE`.

## Para ir além

- **CMU 15-445/645 Database Systems** (Andy Pavlo): aulas gravadas no YouTube e os projetos do BusTub, públicos.
- *Database System Concepts* (Silberschatz, Korth e Sudarshan) e *Database Management Systems* (Ramakrishnan e Gehrke).
- **CS50 SQL** (Harvard, gratuito): SQL do zero, muito prático.
- *Designing Data-Intensive Applications* (Kleppmann), capítulos sobre armazenamento, transações e replicação.
- *Use The Index, Luke!* (gratuito online): índices e desempenho de SQL para desenvolvedores.
- O artigo clássico de Codd (*A Relational Model of Data for Large Shared Data Banks*, 1970) e o *Architecture of a Database System* (Hellerstein, Stonebraker e Hamilton).

## Resumão

- Modelo relacional: tabelas, chaves primárias e estrangeiras, independência de dados. SQL é declarativo.
- Álgebra relacional: σ (WHERE), π (SELECT), ⋈ (JOIN), γ (GROUP BY). Empurrar filtros para baixo economiza trabalho.
- Ordem lógica do SQL: FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. NULL tem lógica de três valores.
- LEFT JOIN + IS NULL acha "sem correspondência". Funções de janela calculam sem colapsar linhas.
- ER: entidades, atributos, relacionamentos. N:M vira tabela de associação.
- Dependências funcionais guiam a normalização. 3FN: depende da chave, da chave inteira e de nada além da chave.
- Restrições no banco valem para todas as aplicações e resolvem corridas que a aplicação não resolve.
- Páginas, buffer pool, linhas (OLTP) ou colunas (OLAP).
- B+tree: nós do tamanho de páginas, poucas leituras, folhas ligadas para intervalos. Índice composto: prefixo à esquerda.
- Junções: laços aninhados, com índice, hash, sort-merge. Otimizador usa estatísticas e PD; leia o EXPLAIN ANALYZE.
- ACID. Anomalias: leitura suja, não repetível, fantasma, atualização perdida, distorção de escrita.
- 2PL, MVCC (leitores e escritores não se bloqueiam), otimista. WAL: registre antes, confirme quando o log está no disco.
- NoSQL: chave-valor, documentos, colunas largas, grafos, busca. Escolha pelas consultas e garantias necessárias.
