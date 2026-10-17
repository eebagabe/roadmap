# Gabarito: Bancos de Dados

Abra só depois de tentar.

## Tema 1

1. Álgebra: π_disciplina.nome(σ_aluno_id=7 ∧ semestre='2025.1'(matricula) ⋈_disciplina_id=disciplina.id disciplina). Repare no filtro **antes** da junção.
   ```sql
   SELECT d.nome
   FROM matricula m
   JOIN disciplina d ON d.id = m.disciplina_id
   WHERE m.aluno_id = 7 AND m.semestre = '2025.1';
   ```
2. ```sql
   SELECT c.nome, COUNT(a.id) AS alunos      -- COUNT(a.id), não COUNT(*): conta 0 quando não há aluno
   FROM curso c
   LEFT JOIN aluno a ON a.curso_id = c.id
   GROUP BY c.id, c.nome
   ORDER BY alunos DESC;
   ```
3. ```sql
   SELECT a.id, a.nome
   FROM aluno a
   WHERE EXISTS (SELECT 1 FROM matricula m WHERE m.aluno_id = a.id)          -- cursou algo
     AND NOT EXISTS (SELECT 1 FROM matricula m WHERE m.aluno_id = a.id AND m.nota < 5);
   ```
   Sem a primeira condição, alunos sem nenhuma matrícula também apareceriam ("nunca tiveram nota abaixo de 5", tecnicamente verdade).
4. ```sql
   WITH ranking AS (
       SELECT m.disciplina_id, a.nome, m.nota,
              RANK() OVER (PARTITION BY m.disciplina_id ORDER BY m.nota DESC) AS pos
       FROM matricula m JOIN aluno a ON a.id = m.aluno_id
       WHERE m.nota IS NOT NULL
   )
   SELECT disciplina_id, nome, nota FROM ranking WHERE pos = 1;
   ```
   `RANK` mantém todos os empatados em primeiro lugar; `ROW_NUMBER` escolheria um arbitrariamente.
5. ```sql
   WITH por_semestre AS (
       SELECT aluno_id, semestre, AVG(nota) AS media
       FROM matricula
       GROUP BY aluno_id, semestre
   )
   SELECT aluno_id, semestre, media,
          media - LAG(media) OVER (PARTITION BY aluno_id ORDER BY semestre) AS variacao
   FROM por_semestre;
   ```
   No primeiro semestre de cada aluno, a variação é NULL (não há anterior). Ordenar por texto funciona aqui porque o formato "2025.1" ordena corretamente.
6. `COUNT(*)` conta **todas as linhas** (matrículas), inclusive as de nota nula. `COUNT(nota)` conta só as linhas com nota **não nula**. `COUNT(DISTINCT aluno_id)` conta **alunos diferentes** (um aluno com 5 matrículas conta 1). Com 10 matrículas de 4 alunos, 2 delas sem nota: 10, 8 e 4.

## Tema 2

1. ```
   livro(id PK, titulo, isbn UNIQUE, ano)
   autor(id PK, nome)
   livro_autor(livro_id FK, autor_id FK, PK(livro_id, autor_id))      -- N:M
   exemplar(id PK, livro_id FK, codigo_barras UNIQUE, estado)          -- 1:N com livro
   usuario(id PK, nome, email UNIQUE)
   emprestimo(id PK, exemplar_id FK, usuario_id FK,
              data_emprestimo, devolucao_prevista, devolucao_real NULL)
   ```
   O empréstimo é de um **exemplar** físico, não do livro. `devolucao_real` nula indica empréstimo em aberto; para impedir dois empréstimos abertos do mesmo exemplar, no PostgreSQL dá para criar um índice único parcial: `CREATE UNIQUE INDEX ON emprestimo (exemplar_id) WHERE devolucao_real IS NULL`.
2. Dependências: `cliente_id → cliente_nome, cliente_cidade`; `produto_id → produto_nome`; `pedido_id → cliente_id`; `(pedido_id, produto_id) → quantidade, preco_unitario` (o preço é guardado **por pedido**, porque o preço do produto muda com o tempo). Anomalias: o nome do cliente se repete em cada item de cada pedido (atualização); não dá para cadastrar um produto sem pedido (inserção); apagar o único pedido de um cliente apaga o cliente (remoção). Na 3FN:
   ```
   cliente(cliente_id, cliente_nome, cliente_cidade)
   produto(produto_id, produto_nome)
   pedido(pedido_id, cliente_id)
   item_pedido(pedido_id, produto_id, quantidade, preco_unitario)
   ```
3. **Não está na 3FN**: há uma dependência transitiva `cep → cidade → estado`. A rigor, a 3FN pede `cidade(cidade, estado)` separada. Na prática, como cidade e estado quase nunca mudam e a tabela é consultada junto, muitas vezes se mantém assim (e o nome da cidade nem identifica unicamente: há cidades com o mesmo nome em estados diferentes, o que mostra que a dependência `cidade → estado` nem é verdadeira no Brasil). É um bom exemplo de que as dependências vêm do significado dos dados.
4. Tabela original `(aluno, disciplina, professor)` com as linhas (Ana, BD, Silva) e (Bia, IA, Silva). Decompondo em `(aluno, professor)` e `(disciplina, professor)` e juntando por professor, aparecem (Ana, IA, Silva) e (Bia, BD, Silva), que **não existiam**: a decomposição perdeu informação (o atributo comum não é chave de nenhuma das partes). Decomposições sem perda exigem que o atributo comum determine uma das partes.
5. ```sql
   preco NUMERIC(10, 2) NOT NULL CHECK (preco > 0),
   email TEXT NOT NULL UNIQUE,
   CHECK (devolucao_real IS NULL OR devolucao_real >= data_emprestimo)
   ```
   (O `CHECK` com várias colunas vai como restrição da tabela.)
6. Exemplo: guardar `total_pedido` na tabela de pedidos, em vez de somar os itens toda vez que a lista de pedidos é exibida (milhões de vezes por dia). Para manter correto: atualizar o total **na mesma transação** que altera os itens (ou com um gatilho), e ter uma rotina periódica que confere a soma. Outro exemplo: contadores de curtidas, que toleram alguma defasagem e podem ser recalculados.

## Tema 3

1. Cada página de 8 KB guarda cerca de 8.192/200 ≈ **40 tuplas** (um pouco menos por causa dos cabeçalhos). 10⁷/40 = **250.000 páginas** (~2 GB). Varredura completa: **250.000 leituras**. B+tree com 400 chaves por nó: 400² = 160 mil < 10⁷ ≤ 400³ = 64 milhões, então **3 níveis** de índice mais 1 página de dados: **~4 leituras** (e a raiz e o segundo nível quase sempre estão no buffer, então na prática 1 ou 2 leituras de disco).
2. Com até 3 chaves por nó, dividindo uma folha cheia em duas (2 à esquerda, o resto à direita) e copiando a primeira chave da direita para o pai:
   ```
   5, 15, 25:    [5 15 25]
   + 35 (divide): [25]
                 /    \
           [5 15]    [25 35]
   + 45:         [25]
                 /    \
           [5 15]    [25 35 45]
   + 55 (divide): [25 45]
                 /   |    \
           [5 15] [25 35] [45 55]
   + 65:         [25 45]
                 /   |    \
           [5 15] [25 35] [45 55 65]
   ```
   As folhas são ligadas da esquerda para a direita. Repare que a árvore só ganha um nível quando a **raiz** se divide.
3. (a) **Sim**: prefixo do índice. (b) **Não** (de forma eficiente): `idade` não é o prefixo; no máximo uma varredura completa do índice. (c) **Sim**: igualdade na primeira coluna e intervalo na segunda, que fica contíguo dentro de "Recife". (d) **Sim**: o índice já entrega as linhas nessa ordem, dispensando a ordenação.
4. **Laços aninhados por bloco** com S (menor, 500 páginas) carregada inteira na memória (cabe em 600): lê S uma vez e R uma vez: **~1.500 leituras**. **Hash join:** como S cabe na memória, constrói a tabela hash com S e percorre R: também **~1.500**; se não coubesse, o *grace hash join* custaria ~3 × (1.000 + 500) = **4.500**. **Sort-merge:** ordenar R e S externamente (com 600 páginas de buffer, duas passadas de leitura e escrita cada) e depois intercalar: na ordem de **5.000 a 7.500** leituras e escritas. Conclusão: quando uma tabela cabe na memória, hash e laços por bloco ganham; sort-merge compensa se os dados já estiverem ordenados ou o resultado precisar sair ordenado.
5. Sem índice: `Seq Scan` lendo a tabela toda (dezenas de milissegundos). Com índice: `Index Scan` em frações de milissegundo. Para uma condição que devolve **50%** das linhas, o otimizador costuma **ignorar o índice** e fazer `Seq Scan`: buscar metade das linhas pelo índice exigiria saltar aleatoriamente por quase todas as páginas da tabela, mais caro que lê-las em sequência. Índices compensam para condições **seletivas** (poucas linhas).
6. O banco colunar lê só as colunas `ano` e `preco` (2 de 50: ~4% dos bytes), essas colunas comprimem muito (o ano tem poucos valores distintos, em sequência), muitos blocos são descartados sem ler graças a resumos por bloco (mínimo e máximo de `ano`), e a soma é feita em lotes com SIMD. Um banco por linhas leria todos os 50 campos de 1 bilhão de linhas. A diferença chega a 100 vezes ou mais.

## Tema 4

1. Sessão 1: `BEGIN; SELECT qtd FROM estoque WHERE id = 7;` (vê 10). Sessão 2: o mesmo (vê 10). Sessão 1: `UPDATE estoque SET qtd = 9 WHERE id = 7; COMMIT;`. Sessão 2: `UPDATE estoque SET qtd = 9 WHERE id = 7; COMMIT;`. Duas vendas, estoque 9: uma venda **perdida**. Correções: (a) operação atômica `UPDATE estoque SET qtd = qtd - 1 WHERE id = 7 AND qtd > 0`; (b) `SELECT qtd FROM estoque WHERE id = 7 FOR UPDATE`, que trava a linha até o fim da transação, fazendo a segunda sessão esperar e ler o valor atualizado.
2. Tabela `plantao(medico, de_plantao)` com Ana e Bia de plantão; regra: pelo menos um de plantão. Em `REPEATABLE READ`, as duas sessões fazem `SELECT COUNT(*) FROM plantao WHERE de_plantao` (veem 2), e cada uma tira **a si mesma** do plantão (linhas diferentes: não há conflito de escrita). Ambas confirmam: ninguém de plantão. Em `SERIALIZABLE`, o PostgreSQL detecta a dependência perigosa e uma das transações recebe `ERROR: could not serialize access due to read/write dependencies among transactions`; a aplicação deve **repetir** a transação, que agora vê só um médico de plantão e não deixa sair.
3. É um **deadlock**: o banco detecta o ciclo no grafo de espera (no PostgreSQL, depois de `deadlock_timeout`, 1 s por padrão) e **aborta uma das transações** (`ERROR: deadlock detected`). A aplicação deve tratar esse erro **repetindo a transação**. Para evitar: acessar as linhas sempre na mesma ordem (por exemplo, por id crescente), a mesma técnica da ordem global de locks.
4. O log é gravado **sequencialmente** e só ele precisa ir para o disco no `COMMIT` (um `fsync` de alguns kilobytes, ou de vários *commits* juntos, o *group commit*). As páginas de dados alteradas, espalhadas pelo disco, são gravadas depois, em segundo plano. Se o sistema cair antes, a recuperação refaz as mudanças a partir do log. Escrita sequencial pequena é muito mais rápida que várias escritas aleatórias.
5. Em MVCC, versões antigas de linhas só podem ser removidas quando **nenhuma** transação ativa pode mais precisar delas. Uma transação aberta há horas "segura" todas as versões criadas desde o seu início: as tabelas incham (*bloat*), índices ficam maiores, consultas ficam mais lentas e o `VACUUM` não consegue limpar. Monitore e limite transações longas (e conexões "ociosas em transação").
6. (a) **Chave-valor/documentos** com alta disponibilidade (DynamoDB): acesso pela chave do usuário, escala enorme, nunca recusar escrita. (b) **Relacional** com ACID e `SERIALIZABLE` (PostgreSQL): integridade e transações acima de tudo. (c) **Grafos** (Neo4j): consultas de vários saltos, que no relacional viram muitas junções. (d) **Busca** (Elasticsearch/OpenSearch): índice invertido, relevância e tolerância a erros de digitação. (e) **Chave-valor em memória** com expiração (Redis): rápido e com TTL nativo.

## Projeto da etapa

Pontos de revisão:

- **Buffer pool:** uma página com contador de pinos maior que zero nunca pode ser escolhida para sair. Esquecer de "despinar" depois de usar faz o buffer encher e travar: teste com um buffer pequeno (10 molduras) para encontrar esses vazamentos cedo.
- **Página suja:** grave no disco antes de reutilizar a moldura; com WAL, a regra seria gravar primeiro o log até o LSN da página.
- **B+tree:** separe bem os casos de folha e de nó interno. Na divisão de folha, a chave **copiada** para o pai continua na folha; na divisão de nó interno, a chave do meio **sobe** e sai do nó. Escreva uma função que confere o RI da árvore (ordem, ocupação mínima, todas as folhas no mesmo nível, ponteiros entre folhas) e chame-a nos testes depois de cada operação.
- **Remoção na B+tree:** muitos sistemas reais simplificam e não juntam nós (deixam nós pouco ocupados), reconstruindo o índice de vez em quando. Se fizer a versão completa, teste milhares de inserções e remoções aleatórias comparando com um `std::map`/`TreeMap`.
- **Executor:** cada operador implementa `Init()` e `Next(&tupla) -> bool`. O hash join constrói a tabela no `Init` (consumindo o filho da esquerda inteiro) e produz resultados no `Next`.
- **Comparação com o SQLite:** gere os mesmos dados nos dois e compare os resultados como **multiconjuntos** (ordene antes de comparar), já que a ordem de saída não é garantida sem `ORDER BY`.
