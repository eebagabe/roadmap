# Java Backend — Apostila Prática

Roadmap Java Backend · Semanas 13 a 18

## Comece por aqui

Agora sim: Java a fundo e o ecossistema que o mercado usa, o **Spring Boot**. A ordem importa. Quem pula direto para o Spring sem entender orientação a objetos, collections e concorrência vira "copiador de tutorial" e trava no primeiro bug estranho.

### Por que isso vale ouro no mercado

- Spring Boot é o framework de backend mais pedido em vagas Java no Brasil, de bancos a fintechs.
- Perguntas clássicas de entrevista Java: `equals`/`hashCode`, `HashMap` por dentro, Streams, `@Transactional`, problema N+1, Garbage Collector.
- Java 21 (LTS) trouxe Virtual Threads, records e pattern matching. Conhecer o Java moderno destaca você.

### Como esta apostila funciona

1. Cada tema tem teoria curta e código para digitar.
2. Crie um projeto Maven só para os exercícios (`java-estudos`) e um repositório no GitHub.
3. Atividades no fim de cada tema; o gabarito fica na outra aba.

> **Regra dos 20 minutos:** travou? Leia a mensagem de erro inteira (de verdade), procure a primeira linha do stack trace que é **do seu código**. Só depois de 20 minutos abra o gabarito.

### Preparando o ambiente

- JDK 21 ou mais novo (`sdk install java 21-tem` com SDKMAN, ou o pacote do seu SO).
- IntelliJ IDEA Community (gratuito).
- Docker para PostgreSQL e Testcontainers.
- Gerar projetos Spring em start.spring.io.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 13 | Tema 1 — Java essencial e orientação a objetos |
| 14 | Tema 2 — Collections, Generics e Streams |
| 15 | Tema 3 — Concorrência e JVM |
| 16 | Tema 4 — Spring Boot |
| 17 | Tema 5 — Persistência com JPA |
| 18 | Tema 6 — Testes, segurança e deploy + projeto |

## Tema 1 — Java essencial e orientação a objetos

**Objetivo:** escrever Java idiomático e explicar os pilares da orientação a objetos.

### 1.1 JVM, JDK e JRE

| Sigla | O que é |
|---|---|
| **JVM** | A máquina virtual que executa bytecode |
| **JRE** | JVM + bibliotecas padrão: o necessário para **rodar** |
| **JDK** | JRE + ferramentas (`javac`, `jshell`, `jcmd`): o necessário para **desenvolver** |

Use `jshell` para testar trechos rápidos sem criar classe.

### 1.2 Tipos primitivos e referências

Primitivos: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`. Guardam o valor direto. Todo o resto é **referência** para um objeto no heap.

```java
int a = 5;
int b = a;      // copia o valor
b++;            // a continua 5

int[] x = {1};
int[] y = x;    // copia a referência: x e y apontam para o MESMO array
y[0] = 99;      // x[0] também vira 99
```

> **Cuidado! Cai na entrevista:** "Java é passagem por valor ou por referência?" **Sempre por valor.** Para objetos, o valor copiado é a referência. Por isso dá para alterar o objeto dentro do método, mas reatribuir o parâmetro não muda nada fora.

Compare objetos com `equals`, não com `==` (que compara referência):

```java
Integer i1 = 1000, i2 = 1000;
System.out.println(i1 == i2);       // false! (cache de Integer vai só de -128 a 127)
System.out.println(i1.equals(i2));  // true
```

### 1.3 Os quatro pilares

- **Encapsulamento:** esconda o estado, exponha comportamento. Campos `private`, métodos que garantem regras.
- **Herança:** uma classe reaproveita outra (`extends`). Use com moderação.
- **Polimorfismo:** o mesmo método se comporta diferente conforme o objeto real.
- **Abstração:** trabalhe com o "o quê" (interface), não com o "como".

```java
public class Conta {
    private BigDecimal saldo = BigDecimal.ZERO;   // encapsulado

    public void depositar(BigDecimal valor) {
        if (valor.signum() <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        saldo = saldo.add(valor);
    }

    public BigDecimal getSaldo() { return saldo; }
}
```

### 1.4 Interfaces e polimorfismo

```java
public interface MeioPagamento {
    Recibo pagar(BigDecimal valor);
}

public class Pix implements MeioPagamento {
    public Recibo pagar(BigDecimal valor) { /* chama o banco central */ return new Recibo("PIX", valor); }
}

public class Cartao implements MeioPagamento {
    public Recibo pagar(BigDecimal valor) { /* chama a adquirente */ return new Recibo("CARTAO", valor); }
}

// Quem usa não sabe (nem precisa saber) qual é:
void finalizar(Pedido p, MeioPagamento meio) { meio.pagar(p.total()); }
```

> **Na prática:** prefira **composição a herança**. Herança acopla muito (mudou a classe pai, quebrou as filhas). Interfaces + composição são a base de tudo no Spring.

### 1.5 Records

Classes que só carregam dados (DTOs) viram uma linha. O compilador gera construtor, getters, `equals`, `hashCode` e `toString`.

```java
public record Recibo(String tipo, BigDecimal valor) {
    public Recibo {                                  // construtor compacto para validar
        Objects.requireNonNull(tipo);
        if (valor.signum() < 0) throw new IllegalArgumentException();
    }
}
```

Records são **imutáveis**: ótimo para concorrência e para evitar bugs.

### 1.6 Exceções

| Tipo | Exemplo | Obriga tratar? |
|---|---|---|
| Checked (`Exception`) | `IOException` | Sim (`throws` ou `try/catch`) |
| Unchecked (`RuntimeException`) | `NullPointerException`, `IllegalArgumentException` | Não |
| `Error` | `OutOfMemoryError` | Não trate |

```java
try (var leitor = Files.newBufferedReader(Path.of("dados.txt"))) {   // try-with-resources fecha sozinho
    return leitor.readLine();
} catch (IOException e) {
    throw new UncheckedIOException("Falha ao ler dados.txt", e);    // mantém a causa!
}
```

Boas práticas: nunca `catch (Exception e) {}` vazio; sempre passe a causa original; crie exceções de negócio (`EstoqueInsuficienteException extends RuntimeException`).

### Atividades de fixação — Tema 1

1. Explique a diferença entre JDK, JRE e JVM para alguém que nunca programou.
2. O que imprime? Explique.
   ```java
   static void mudar(StringBuilder sb) { sb.append("!"); sb = new StringBuilder("novo"); }
   public static void main(String[] a) { var sb = new StringBuilder("oi"); mudar(sb); System.out.println(sb); }
   ```
3. Modele com interface e polimorfismo um cálculo de frete com três opções: Sedex, PAC e Retirada na loja (grátis).
4. Converta para record e adicione validação de e-mail não vazio: uma classe `Cliente` com `nome`, `email` e getters.
5. Quando você usaria uma exceção checked e quando uma unchecked? Por que o Spring prefere unchecked?

## Tema 2 — Collections, Generics e Streams

**Objetivo:** escolher a coleção certa e escrever transformações de dados com Streams.

### 2.1 List, Set e Map

| Interface | Implementação comum | Característica |
|---|---|---|
| `List` | `ArrayList` | Ordem de inserção, permite duplicados, acesso por índice |
| `Set` | `HashSet` / `LinkedHashSet` / `TreeSet` | Sem duplicados; sem ordem / ordem de inserção / ordenado |
| `Map` | `HashMap` / `LinkedHashMap` / `TreeMap` | Chave → valor; idem acima |
| `Deque` | `ArrayDeque` | Pilha e fila |

Coleções imutáveis: `List.of(...)`, `Set.of(...)`, `Map.of(...)`. Tentar alterar lança `UnsupportedOperationException`.

### 2.2 equals e hashCode

O contrato: **se `a.equals(b)`, então `a.hashCode() == b.hashCode()`**. O contrário não precisa valer (colisões existem). Quebrar o contrato faz `HashSet` e `HashMap` se comportarem errado.

> **Cuidado! Cai na entrevista:** não use campos **mutáveis** no `hashCode` de um objeto que vai ser chave de `HashMap`. Se o campo mudar depois de inserir, o objeto "some" do map.

### 2.3 Generics

Permitem escrever código que funciona para vários tipos com segurança de compilação.

```java
public class Resultado<T> {
    private final T valor;
    private final String erro;
    // ...
}

static <T extends Comparable<T>> T maior(List<T> lista) { return Collections.max(lista); }
```

Coringas: `List<? extends Number>` (posso **ler** como Number), `List<? super Integer>` (posso **escrever** Integer). Regra mnemônica: **PECS** (Producer Extends, Consumer Super).

### 2.4 Lambdas e Stream API

Lambda é uma função anônima: `(a, b) -> a + b`. Funciona onde se espera uma **interface funcional** (`Function`, `Predicate`, `Consumer`, `Supplier`, `Comparator`).

```java
record Pedido(String cliente, String status, BigDecimal total) {}

List<Pedido> pedidos = List.of(
    new Pedido("Ana", "PAGO", new BigDecimal("150")),
    new Pedido("Bruno", "PAGO", new BigDecimal("300")),
    new Pedido("Ana", "CANCELADO", new BigDecimal("80")));

// Total pago por cliente
Map<String, BigDecimal> totalPorCliente = pedidos.stream()
    .filter(p -> p.status().equals("PAGO"))
    .collect(Collectors.groupingBy(Pedido::cliente,
             Collectors.reducing(BigDecimal.ZERO, Pedido::total, BigDecimal::add)));

// Nomes únicos, ordenados
List<String> clientes = pedidos.stream().map(Pedido::cliente).distinct().sorted().toList();
```

Operações **intermediárias** (`filter`, `map`, `sorted`) são preguiçosas; nada roda até uma operação **terminal** (`toList`, `collect`, `count`, `forEach`).

### 2.5 Optional

`Optional<T>` deixa explícito que o valor pode não existir. Use como **retorno** de método, não como campo ou parâmetro.

```java
Optional<Cliente> buscar(String email) { ... }

String nome = buscar("ana@ex.com")
    .map(Cliente::nome)
    .orElse("Visitante");

Cliente c = buscar(email).orElseThrow(() -> new ClienteNaoEncontradoException(email));
```

Evite `optional.get()` sem checar: é um `NullPointerException` com outro nome.

### Atividades de fixação — Tema 2

1. Qual coleção usar: (a) histórico de navegação com "voltar"; (b) tags únicas de um post, na ordem em que foram adicionadas; (c) ranking de jogadores sempre ordenado por pontos; (d) cache de produto por ID.
2. Crie a classe `Produto(id, nome)` sem `equals/hashCode`, coloque dois iguais num `HashSet` e mostre o `size()`. Depois converta para record e repita.
3. Com a lista de pedidos acima, usando Streams: (a) o maior pedido pago; (b) quantidade de pedidos por status; (c) a soma de tudo que foi pago.
4. Reescreva sem `if (x != null)`: `Cliente c = repo.buscar(id); if (c != null && c.endereco() != null) return c.endereco().cidade(); return "Desconhecida";` (considere que `buscar` e `endereco()` retornam `Optional`).
5. Explique o que significa dizer que streams são "preguiçosos" e dê um exemplo em que isso faz diferença.

## Tema 3 — Concorrência e JVM

**Objetivo:** escrever código concorrente sem bugs bobos e entender a memória da JVM.

### 3.1 Threads e condição de corrida

```java
class Contador {
    private int valor = 0;
    void incrementar() { valor++; }   // NÃO é atômico: ler, somar, escrever
}
```

Duas threads incrementando 1 milhão de vezes cada raramente chegam a 2 milhões. Isso é uma **condição de corrida** (race condition).

Soluções:

```java
synchronized void incrementar() { valor++; }        // trava (lock) no objeto
// ou
private final AtomicInteger valor = new AtomicInteger();
void incrementar() { valor.incrementAndGet(); }     // operação atômica sem lock
```

Outras ferramentas: `ReentrantLock` (lock com mais controle), `ConcurrentHashMap` (map seguro para várias threads), `volatile` (garante **visibilidade**, não atomicidade).

> **Cuidado! Cai na entrevista:** **deadlock** acontece quando a thread A segura o lock 1 e espera o 2, e a thread B segura o 2 e espera o 1. Evite adquirindo locks sempre **na mesma ordem**.

### 3.2 ExecutorService e CompletableFuture

Não crie `new Thread()` à mão em produção. Use um **pool**:

```java
try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
    Future<Integer> f = pool.submit(() -> calcular());
    System.out.println(f.get());
}
```

`CompletableFuture` compõe operações assíncronas, por exemplo chamar duas APIs em paralelo:

```java
CompletableFuture<Cliente> cliente = CompletableFuture.supplyAsync(() -> clienteApi.buscar(id));
CompletableFuture<List<Pedido>> pedidos = CompletableFuture.supplyAsync(() -> pedidoApi.listar(id));

Perfil perfil = cliente.thenCombine(pedidos, Perfil::new).join();
```

### 3.3 Virtual Threads (Java 21)

Threads de plataforma são caras (uma thread do SO cada). **Virtual threads** são leves, gerenciadas pela JVM: dá para ter **milhões**. Quando uma virtual thread bloqueia em I/O, a JVM libera a thread do SO para outra.

```java
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> exec.submit(() -> {
        Thread.sleep(Duration.ofSeconds(1));   // simula I/O
        return i;
    }));
}   // 10 mil tarefas de 1s terminam em ~1s
```

No Spring Boot 3.2+: `spring.threads.virtual.enabled=true`.

> **Na prática:** virtual threads ajudam em código **I/O bound** (a maioria dos backends). Para código CPU bound não há ganho: o limite continua sendo o número de núcleos.

### 3.4 Memória da JVM e Garbage Collector

| Área | Guarda |
|---|---|
| Heap | Objetos. Dividida em geração jovem (objetos novos) e velha (que sobreviveram) |
| Stack (por thread) | Frames de métodos e variáveis locais |
| Metaspace | Metadados das classes |

O **Garbage Collector** libera objetos que ninguém mais referencia. A maioria dos objetos morre jovem, então o GC limpa a geração jovem com frequência (rápido) e a velha raramente.

Coletores: **G1** (padrão, equilibrado), **ZGC** (pausas de milissegundos, heaps enormes), Parallel (throughput).

```bash
java -Xms512m -Xmx512m -XX:+UseG1GC -jar app.jar
jcmd <PID> GC.heap_info
```

Vazamento de memória em Java existe: objeto que ninguém usa mas alguém ainda referencia (ex.: um `static Map` que só cresce).

### Atividades de fixação — Tema 3

1. Rode o `Contador` sem sincronização com duas threads de 1 milhão de incrementos cada. Qual resultado deu? Corrija de duas formas.
2. Escreva um exemplo de código que pode dar deadlock e depois corrija.
3. Use `CompletableFuture` para buscar 3 cotações de frete em paralelo (simule com `Thread.sleep`) e retornar a mais barata.
4. Compare: crie 10 mil tarefas com `Thread.sleep(1s)` num `newFixedThreadPool(100)` e num executor de virtual threads. Meça o tempo dos dois.
5. Um serviço tem `private static final List<Evento> HISTORICO = new ArrayList<>();` e adiciona um evento a cada requisição. Qual o problema? (São dois.)

## Tema 4 — Spring Boot

**Objetivo:** criar uma API REST profissional com Spring Boot.

### 4.1 Injeção de dependência

Em vez de a classe criar suas dependências (`new`), ela as **recebe**. O Spring cria os objetos (**beans**) e entrega para quem precisa.

```java
@Service
public class PedidoService {
    private final PedidoRepository repo;
    private final MeioPagamento pagamento;

    public PedidoService(PedidoRepository repo, MeioPagamento pagamento) {  // injeção por construtor
        this.repo = repo;
        this.pagamento = pagamento;
    }
}
```

Por que? Baixo acoplamento e **testes fáceis**: no teste você passa um mock no construtor.

> **Cuidado! Cai na entrevista:** prefira injeção **por construtor** (campos `final`, dependências explícitas, testável sem Spring) em vez de `@Autowired` em campo.

Estereótipos: `@Component` (genérico), `@Service` (regra de negócio), `@Repository` (acesso a dados), `@RestController` (HTTP), `@Configuration` + `@Bean` (criar beans manualmente).

### 4.2 Spring Boot

O Spring Boot traz **autoconfiguração** e **starters**: coloque `spring-boot-starter-web` no `pom.xml` e você ganha um Tomcat embutido e o Jackson configurado para JSON.

Estrutura em camadas típica:

```
controller  → recebe HTTP, valida entrada, devolve status
service     → regras de negócio, transações
repository  → acesso ao banco
domain/model→ entidades
dto         → records de entrada e saída da API
```

### 4.3 Controllers REST e Bean Validation

```java
public record CriarPedidoRequest(
    @NotNull Long produtoId,
    @Positive int quantidade) {}

public record PedidoResponse(Long id, String status, BigDecimal total) {}

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    private final PedidoService service;
    public PedidoController(PedidoService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@RequestBody @Valid CriarPedidoRequest req) {
        PedidoResponse criado = service.criar(req);
        return ResponseEntity.created(URI.create("/pedidos/" + criado.id())).body(criado);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id) { return service.buscar(id); }
}
```

> **Na prática:** nunca exponha a entidade JPA direto no controller. Use DTOs (records). Assim você não vaza campos internos e não amarra a API ao banco.

### 4.4 Tratamento de erros

```java
@RestControllerAdvice
public class ErrosHandler {
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ProblemDetail naoEncontrado(RecursoNaoEncontradoException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalido(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Dados inválidos");
        pd.setProperty("campos", e.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, f -> String.valueOf(f.getDefaultMessage()), (a, b) -> a)));
        return pd;
    }
}
```

### 4.5 Profiles e configuração

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/loja
    username: postgres
    password: ${DB_PASSWORD}
---
spring:
  config.activate.on-profile: prod
  jpa.show-sql: false
```

Ative com `SPRING_PROFILES_ACTIVE=prod`. Para configurações próprias use `@ConfigurationProperties` com um record.

### 4.6 Maven e Gradle

Ambos baixam dependências e constroem o projeto. Maven usa `pom.xml` (XML, convencional, mais comum em bancos); Gradle usa `build.gradle(.kts)` (mais flexível e rápido). Comandos que você vai usar todo dia:

```bash
./mvnw spring-boot:run      ./gradlew bootRun
./mvnw test                 ./gradlew test
./mvnw package              ./gradlew build
```

### Atividades de fixação — Tema 4

1. Explique injeção de dependência com uma analogia e diga por que ela facilita testes.
2. Crie em start.spring.io um projeto com Web, Validation e DevTools. Faça um CRUD de `Produto` em memória (um `ConcurrentHashMap` no service).
3. Adicione validação: nome obrigatório, preço positivo. Teste com `curl` enviando dados inválidos e veja a resposta.
4. Crie um `@RestControllerAdvice` que transforma `ProdutoNaoEncontradoException` em 404 com `ProblemDetail`.
5. Por que não devolver a entidade JPA direto no controller? Cite duas razões.

## Tema 5 — Persistência com JPA

**Objetivo:** usar JPA sem cair nas armadilhas clássicas.

### 5.1 JDBC, JPA e Hibernate

- **JDBC:** API de baixo nível para falar SQL com o banco.
- **JPA:** especificação de mapeamento objeto-relacional (ORM): classes viram tabelas.
- **Hibernate:** a implementação de JPA mais usada.
- **Spring Data JPA:** cria repositórios automaticamente sobre a JPA.

### 5.2 Entidades e Spring Data

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    protected Pedido() {}  // exigido pela JPA
}

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByStatus(StatusPedido status);                 // query derivada do nome

    @Query("select p from Pedido p join fetch p.itens where p.cliente.id = :clienteId")
    List<Pedido> buscarComItens(Long clienteId);
}
```

### 5.3 Relacionamentos e o problema N+1

`@ManyToOne` e `@OneToOne` são **EAGER** por padrão (carregam junto). `@OneToMany` e `@ManyToMany` são **LAZY** (carregam quando acessados). Regra prática: deixe **tudo LAZY** e busque o que precisa explicitamente.

**N+1:** você busca 100 pedidos (1 query) e, num loop, acessa `pedido.getItens()`: o Hibernate faz mais 100 queries.

```java
List<Pedido> pedidos = repo.findAll();                 // 1 query
pedidos.forEach(p -> p.getItens().size());             // +N queries!
```

Soluções: `join fetch` na JPQL, `@EntityGraph(attributePaths = "itens")`, ou uma consulta de projeção (DTO) só com os campos necessários.

> **Cuidado! Cai na entrevista:** "O que é o problema N+1 e como resolver?" é das perguntas mais comuns em vaga Java. Ative `spring.jpa.show-sql=true` para ver acontecendo.

### 5.4 Migrations com Flyway

Nunca deixe o Hibernate criar tabelas em produção (`ddl-auto=update`). Versione o banco como código:

```
src/main/resources/db/migration/
  V1__cria_clientes.sql
  V2__cria_pedidos.sql
  V3__adiciona_indice_status.sql
```

O Flyway aplica na ordem e registra o que já rodou. Use `spring.jpa.hibernate.ddl-auto=validate`.

### 5.5 @Transactional

```java
@Service
public class TransferenciaService {
    @Transactional
    public void transferir(Long origem, Long destino, BigDecimal valor) {
        Conta o = contas.findById(origem).orElseThrow();
        Conta d = contas.findById(destino).orElseThrow();
        o.debitar(valor);
        d.creditar(valor);
        // sem save(): entidades gerenciadas são salvas no commit (dirty checking)
    }
}
```

Armadilhas:

- `@Transactional` funciona por **proxy**: chamar um método transacional de **dentro da mesma classe** (`this.metodo()`) não abre transação.
- Por padrão só faz rollback em **unchecked** (`RuntimeException`). Para checked: `@Transactional(rollbackFor = Exception.class)`.
- Use `@Transactional(readOnly = true)` em consultas.
- Concorrência: para evitar que dois pedidos comprem a última unidade, use `@Version` (lock otimista) ou `@Lock(PESSIMISTIC_WRITE)`.

### Atividades de fixação — Tema 5

1. Mapeie `Cliente` 1:N `Pedido` e `Pedido` 1:N `ItemPedido`. Quais lados são donos do relacionamento?
2. Provoque um N+1 com `show-sql` ligado e conte as queries. Depois resolva com `join fetch` e conte de novo.
3. Escreva as migrations Flyway V1 e V2 para as tabelas do exercício 1.
4. Por que esta transação não funciona? `public void processarTodos() { lista.forEach(this::processar); } @Transactional public void processar(Pedido p) {...}`
5. Explique lock otimista com `@Version` e o que acontece quando duas transações alteram a mesma linha.

## Tema 6 — Testes, segurança e deploy

**Objetivo:** entregar código testado, seguro e pronto para rodar em container.

### 6.1 JUnit 5 e Mockito

```java
class PedidoServiceTest {
    PedidoRepository repo = mock(PedidoRepository.class);
    EstoqueClient estoque = mock(EstoqueClient.class);
    PedidoService service = new PedidoService(repo, estoque);

    @Test
    void recusaPedidoSemEstoque() {
        when(estoque.disponivel(42L)).thenReturn(1);

        assertThatThrownBy(() -> service.criar(new CriarPedidoRequest(42L, 2)))
            .isInstanceOf(EstoqueInsuficienteException.class);

        verify(repo, never()).save(any());
    }
}
```

Padrão **Arrange, Act, Assert** (prepara, executa, verifica). Um comportamento por teste, nome que descreve o comportamento.

### 6.2 Testes de integração e Testcontainers

Testcontainers sobe um PostgreSQL **de verdade** em Docker durante o teste. Nada de H2 se comportando diferente do banco real.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class PedidoApiIT {
    @Container @ServiceConnection
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");

    @Autowired TestRestTemplate http;

    @Test
    void criaPedido() {
        var resp = http.postForEntity("/pedidos", new CriarPedidoRequest(1L, 1), PedidoResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

### 6.3 Spring Security

Spring Security é uma **cadeia de filtros** que roda antes do controller.

```java
@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain filtros(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())    // API stateless com token
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/produtos/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
            .build();
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
```

### 6.4 Docker

```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

Build em dois estágios: a imagem final só tem o JRE e o jar. `MaxRAMPercentage` faz a heap respeitar o limite de memória do container.

### 6.5 Actuator, observabilidade e CI/CD

- **Actuator:** `/actuator/health` (o Kubernetes usa para saber se o app está vivo), `/actuator/metrics`, `/actuator/prometheus`.
- **Três pilares da observabilidade:** logs (o que aconteceu), métricas (quanto, com que frequência), traces (por onde a requisição passou). Micrometer + Prometheus + Grafana é o combo comum.
- **CI/CD:** a cada push, um pipeline (GitHub Actions, GitLab CI) compila, roda testes, gera a imagem e faz o deploy.

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 21, cache: maven }
      - run: ./mvnw -B verify
```

### Atividades de fixação — Tema 6

1. Escreva 3 testes unitários com Mockito para um `TransferenciaService`: sucesso, saldo insuficiente, conta inexistente.
2. Por que preferir Testcontainers a H2 nos testes de integração?
3. Configure o Spring Security para: `GET /produtos` público, `POST /produtos` só para `ADMIN`, resto autenticado.
4. Escreva o Dockerfile da sua API e rode com `docker run -m 512m`. Confira com `docker stats`.
5. Monte um workflow do GitHub Actions que rode `./mvnw verify` em todo pull request.

## Projeto da etapa

**API de Pedidos completa.** Requisitos:

1. Spring Boot 3, Java 21, PostgreSQL, Flyway.
2. Cadastro de clientes e produtos; criação de pedido com itens; cancelamento.
3. Controle de estoque sem vender a mesma unidade duas vezes (`@Version`).
4. Login com JWT e papéis `CLIENTE` e `ADMIN`.
5. Erros com `ProblemDetail`, validação com Bean Validation.
6. Testes unitários (Mockito) e de integração (Testcontainers).
7. Dockerfile + `docker-compose.yml` (API + banco) e pipeline de CI.
8. README com como rodar, decisões e diagrama simples.

Esse projeto, bem feito, vale mais que dez CRUDs no portfólio.

## Resumão

- Java é sempre passagem por valor. Compare objetos com `equals`.
- Composição e interfaces acima de herança. Records para dados.
- `equals` e `hashCode` andam juntos. Streams para transformar coleções.
- Race condition se resolve com sincronização, atômicos ou imutabilidade. Virtual threads para I/O.
- Spring: injeção por construtor, DTOs na API, erros com `ProblemDetail`.
- JPA: tudo LAZY, cuidado com N+1, Flyway para o schema, `@Transactional` funciona por proxy.
- Testes com Mockito e Testcontainers; deploy em Docker com CI.
