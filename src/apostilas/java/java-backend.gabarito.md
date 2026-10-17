# Gabarito: Java Backend

Abra só depois de tentar.

## Tema 1

1. Exemplo: a JVM é o tocador de música; o JRE é o tocador mais as músicas básicas que vêm com ele (bibliotecas), o suficiente para ouvir; o JDK é o estúdio inteiro, com tocador, músicas e equipamento para compor (compilador e ferramentas).
2. Imprime `oi!`. O método recebe uma cópia da referência: `append` altera o objeto original. Depois `sb = new StringBuilder("novo")` só muda a cópia local da referência; a variável do `main` continua apontando para o objeto original.
3. ```java
   public interface Frete { BigDecimal calcular(BigDecimal pesoKg, String cep); }
   public class Sedex implements Frete {
       public BigDecimal calcular(BigDecimal peso, String cep) { return new BigDecimal("25").add(peso.multiply(new BigDecimal("4"))); }
   }
   public class Pac implements Frete {
       public BigDecimal calcular(BigDecimal peso, String cep) { return new BigDecimal("15").add(peso.multiply(new BigDecimal("2"))); }
   }
   public class RetiradaLoja implements Frete {
       public BigDecimal calcular(BigDecimal peso, String cep) { return BigDecimal.ZERO; }
   }
   ```
   Quem calcula recebe um `Frete` e não precisa de `if/else` por tipo. Nova modalidade = nova classe, sem mexer no código existente (princípio aberto/fechado).
4. ```java
   public record Cliente(String nome, String email) {
       public Cliente {
           if (email == null || email.isBlank()) throw new IllegalArgumentException("E-mail obrigatório");
       }
   }
   ```
5. Checked quando quem chama **pode e deve** reagir (ex.: arquivo de configuração opcional não existe). Unchecked para erros de programação ou de negócio que vão subir até um tratador central. O Spring prefere unchecked porque checked "polui" todas as assinaturas com `throws` e porque o `@Transactional` faz rollback automático em unchecked; o tratamento fica centralizado no `@RestControllerAdvice`.

## Tema 2

1. (a) `ArrayDeque` como pilha; (b) `LinkedHashSet`; (c) `TreeMap`/`TreeSet` com comparador por pontos (ou `PriorityQueue` se só precisar do topo); (d) `HashMap` (ou `ConcurrentHashMap` se acessado por várias threads).
2. Com a classe sem `equals/hashCode`, `size()` é **2**: os objetos são considerados diferentes (comparação por identidade). Com o record, `size()` é **1**, porque o record gera `equals` e `hashCode` a partir dos campos.
3. ```java
   Optional<Pedido> maior = pedidos.stream()
       .filter(p -> p.status().equals("PAGO"))
       .max(Comparator.comparing(Pedido::total));

   Map<String, Long> porStatus = pedidos.stream()
       .collect(Collectors.groupingBy(Pedido::status, Collectors.counting()));

   BigDecimal somaPaga = pedidos.stream()
       .filter(p -> p.status().equals("PAGO"))
       .map(Pedido::total)
       .reduce(BigDecimal.ZERO, BigDecimal::add);
   ```
4. ```java
   return repo.buscar(id)
       .flatMap(Cliente::endereco)
       .map(Endereco::cidade)
       .orElse("Desconhecida");
   ```
   `flatMap` porque `endereco()` já devolve um `Optional`.
5. As operações intermediárias só montam o "plano"; os elementos passam um a um pela cadeia quando a operação terminal pede. Exemplo: `lista.stream().filter(caro).map(converter).findFirst()` para no primeiro elemento que passa no filtro, sem converter a lista inteira. Também é por isso que `Stream.iterate(1, x -> x + 1).filter(...).limit(10)` funciona com uma sequência infinita.

## Tema 3

1. O resultado fica abaixo de 2.000.000 e muda a cada execução. Correções: `synchronized` no método ou `AtomicInteger`.
2. ```java
   // Deadlock possível
   void transferir(Conta a, Conta b, BigDecimal v) {
       synchronized (a) { synchronized (b) { a.debitar(v); b.creditar(v); } }
   }
   // Thread 1: transferir(x, y); Thread 2: transferir(y, x)  -> cada uma segura uma e espera a outra

   // Correção: sempre travar na mesma ordem (pelo id)
   void transferir(Conta a, Conta b, BigDecimal v) {
       Conta primeira = a.id() < b.id() ? a : b;
       Conta segunda  = a.id() < b.id() ? b : a;
       synchronized (primeira) { synchronized (segunda) { a.debitar(v); b.creditar(v); } }
   }
   ```
3. ```java
   record Cotacao(String transportadora, BigDecimal valor) {}

   Cotacao maisBarata() {
       var futuros = Stream.of("Correios", "Jadlog", "Loggi")
           .map(t -> CompletableFuture.supplyAsync(() -> cotar(t)))
           .toList();
       return futuros.stream()
           .map(CompletableFuture::join)
           .min(Comparator.comparing(Cotacao::valor))
           .orElseThrow();
   }
   ```
   O `toList()` antes do `join` é essencial: sem ele, a stream preguiçosa criaria e esperaria um futuro por vez, em sequência.
4. Com 100 threads de plataforma: 10.000 / 100 = 100 lotes de 1 s ≈ **100 s**. Com virtual threads: ≈ **1 s**, porque cada tarefa tem sua thread leve e o sono não ocupa thread do SO.
5. (1) **Vazamento de memória:** a lista estática cresce para sempre e nunca é coletada, até `OutOfMemoryError`. (2) **Não é thread-safe:** várias requisições adicionam ao mesmo `ArrayList` ao mesmo tempo, o que pode corromper a lista ou lançar exceções.

## Tema 4

1. Analogia: um restaurante onde o cozinheiro não sai para comprar ingredientes; o gerente entrega o que ele precisa. Se amanhã o fornecedor mudar, o cozinheiro não muda nada. Nos testes, você entrega ingredientes "de mentira" (mocks) pelo construtor, sem banco, sem rede e sem subir o Spring.
2. Esboço:
   ```java
   @Service
   public class ProdutoService {
       private final Map<Long, Produto> dados = new ConcurrentHashMap<>();
       private final AtomicLong seq = new AtomicLong();
       public Produto criar(ProdutoRequest r) { long id = seq.incrementAndGet(); var p = new Produto(id, r.nome(), r.preco()); dados.put(id, p); return p; }
       public Produto buscar(long id) { return Optional.ofNullable(dados.get(id)).orElseThrow(() -> new ProdutoNaoEncontradoException(id)); }
       public List<Produto> listar() { return List.copyOf(dados.values()); }
       public void remover(long id) { if (dados.remove(id) == null) throw new ProdutoNaoEncontradoException(id); }
   }
   ```
3. `public record ProdutoRequest(@NotBlank String nome, @NotNull @Positive BigDecimal preco) {}` com `@Valid` no parâmetro do controller. Um `curl -X POST ... -d '{"nome":"","preco":-1}'` deve voltar **400** listando os dois campos.
4. ```java
   @RestControllerAdvice
   class ErrosHandler {
       @ExceptionHandler(ProdutoNaoEncontradoException.class)
       ProblemDetail naoEncontrado(ProdutoNaoEncontradoException e) {
           var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
           pd.setTitle("Produto não encontrado");
           return pd;
       }
   }
   ```
5. (1) Vaza campos internos ou sensíveis (hash de senha, flags internas) e amarra o contrato da API ao modelo do banco: mudou a tabela, quebrou o cliente. (2) Relacionamentos LAZY causam `LazyInitializationException` ou N+1 na serialização, e relacionamentos bidirecionais geram recursão infinita no JSON.

## Tema 5

1. `Pedido` tem `@ManyToOne Cliente cliente` (dono da FK `cliente_id`) e `Cliente` pode ter `@OneToMany(mappedBy = "cliente")`. `ItemPedido` tem `@ManyToOne Pedido pedido` (dono da FK `pedido_id`) e `Pedido` tem `@OneToMany(mappedBy = "pedido", cascade = ALL, orphanRemoval = true)`. O dono é sempre o lado com a chave estrangeira, o `@ManyToOne`.
2. Com 10 pedidos: 1 query de pedidos + 10 de itens = 11. Com `join fetch`: 1 query. (Se buscar duas coleções com `join fetch` ao mesmo tempo, o Hibernate pode reclamar de `MultipleBagFetchException`; use `Set` ou faça em duas consultas.)
3. ```sql
   -- V1__cria_clientes.sql
   CREATE TABLE clientes (id BIGSERIAL PRIMARY KEY, nome VARCHAR(120) NOT NULL, email VARCHAR(200) NOT NULL UNIQUE);

   -- V2__cria_pedidos.sql
   CREATE TABLE pedidos (
     id BIGSERIAL PRIMARY KEY,
     cliente_id BIGINT NOT NULL REFERENCES clientes(id),
     status VARCHAR(30) NOT NULL,
     criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   CREATE TABLE itens_pedido (
     id BIGSERIAL PRIMARY KEY,
     pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
     produto_id BIGINT NOT NULL,
     quantidade INT NOT NULL CHECK (quantidade > 0),
     preco_unitario NUMERIC(12,2) NOT NULL
   );
   CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
   CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
   ```
4. `this::processar` é uma chamada **interna** da classe e não passa pelo proxy do Spring, então o `@Transactional` é ignorado. Soluções: colocar `@Transactional` em `processarTodos`, ou mover `processar` para outro bean.
5. A entidade tem `@Version Long versao`. Cada `UPDATE` vira `UPDATE ... SET ..., versao = versao + 1 WHERE id = ? AND versao = ?`. Se duas transações leram a versão 3, a primeira grava e vira 4; a segunda não encontra a versão 3, atualiza 0 linhas e recebe `OptimisticLockException`. A aplicação então tenta de novo ou responde 409.

## Tema 6

1. ```java
   @Test void transfereComSucesso() {
       var a = new Conta(1L, new BigDecimal("100")); var b = new Conta(2L, BigDecimal.ZERO);
       when(repo.findById(1L)).thenReturn(Optional.of(a)); when(repo.findById(2L)).thenReturn(Optional.of(b));
       service.transferir(1L, 2L, new BigDecimal("40"));
       assertThat(a.saldo()).isEqualByComparingTo("60"); assertThat(b.saldo()).isEqualByComparingTo("40");
   }
   @Test void recusaSaldoInsuficiente() {
       when(repo.findById(1L)).thenReturn(Optional.of(new Conta(1L, BigDecimal.TEN)));
       when(repo.findById(2L)).thenReturn(Optional.of(new Conta(2L, BigDecimal.ZERO)));
       assertThatThrownBy(() -> service.transferir(1L, 2L, new BigDecimal("50"))).isInstanceOf(SaldoInsuficienteException.class);
   }
   @Test void recusaContaInexistente() {
       when(repo.findById(anyLong())).thenReturn(Optional.empty());
       assertThatThrownBy(() -> service.transferir(1L, 2L, BigDecimal.ONE)).isInstanceOf(NoSuchElementException.class);
   }
   ```
   Use `isEqualByComparingTo` com `BigDecimal`: `equals` considera a escala (`60` ≠ `60.00`).
2. O H2 tem outro dialeto SQL, outros tipos e outro comportamento de locks e constraints. Um teste pode passar no H2 e a query falhar no PostgreSQL de produção (ou o contrário). Testcontainers testa contra o mesmo banco e versão de produção.
3. ```java
   .authorizeHttpRequests(auth -> auth
       .requestMatchers(HttpMethod.GET, "/produtos/**").permitAll()
       .requestMatchers(HttpMethod.POST, "/produtos/**").hasRole("ADMIN")
       .anyRequest().authenticated())
   ```
   A ordem importa: a primeira regra que casa vence.
4. Resposta pessoal. Com `-m 512m` e `MaxRAMPercentage=75`, a heap máxima fica em torno de 384 MB, e o `docker stats` mostra o limite de 512 MiB.
5. ```yaml
   name: ci
   on:
     pull_request:
   jobs:
     verify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-java@v4
           with: { distribution: temurin, java-version: 21, cache: maven }
         - run: ./mvnw -B verify
   ```
   O runner do GitHub já tem Docker, então os testes com Testcontainers funcionam.

## Projeto da etapa

O que um avaliador olharia:

- Camadas separadas e DTOs na borda da API.
- Migrations Flyway e `ddl-auto=validate`.
- Teste de concorrência provando que o estoque não fica negativo (duas threads comprando a última unidade).
- Nenhum segredo no repositório; `.env.example` documentado.
- README que deixa qualquer pessoa rodar com `docker compose up`.
