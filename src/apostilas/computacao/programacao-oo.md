# Programação Imperativa e Orientada a Objetos: Apostila Prática

Roadmap Ciência da Computação · Semanas 20 a 24

## Comece por aqui

Nas etapas anteriores você aprendeu a fazer programas que funcionam. Agora o desafio muda: fazer programas que **outras pessoas** (e você daqui a seis meses) conseguem entender, usar e modificar sem quebrar. Em Oxford, *Imperative Programming* ensina a raciocinar sobre laços com invariantes; no MIT, *Software Construction* (6.1020) gira em torno de três objetivos: código **seguro contra bugs**, **fácil de entender** e **pronto para mudar**. Usaremos **Java**, linguagem com tipos estáticos e orientação a objetos explícita, usada em bancos, Android e grandes sistemas (TypeScript serve se preferir, as ideias são as mesmas).

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSI-22 Programação Orientada a Objetos; CES-22 (parte) |
| MIT | 6.1020 Software Construction (parte inicial) |
| Harvard | CS 32 e CS 51 (partes de abstração e design) |
| Oxford | Imperative Programming (1º ano) |

### Como esta apostila funciona

1. Instale o JDK 21 ou mais novo (por exemplo, Temurin) e use o IntelliJ IDEA Community ou o VS Code com a extensão de Java. Para arquivos únicos, `java Arquivo.java` compila e roda direto.
2. Use o **JUnit 5** para testes a partir do Tema 5 (crie o projeto com Maven ou Gradle).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** antes de escrever o código de um método, escreva a especificação (o que recebe, o que garante) e dois ou três testes. Se não conseguir escrever a especificação, você ainda não entendeu o problema.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 20 | Tema 1: Especificações e invariantes |
| 21 | Tema 2: Tipos abstratos de dados |
| 22 | Tema 3: Classes, herança e polimorfismo |
| 23 | Tema 4: Padrões de projeto |
| 24 | Tema 5: Testes e refatoração + projeto |

## Tema 1: Especificações e invariantes

**Objetivo:** descrever com precisão o que um método faz e provar que laços estão corretos.

### 1.1 Pré e pós-condições

Uma **especificação** é um contrato entre quem escreve e quem usa um método:

- **Pré-condição:** o que precisa ser verdade **antes** da chamada (obrigação de quem chama).
- **Pós-condição:** o que o método garante **depois** (obrigação de quem implementa).

```java
/**
 * Encontra a posição de um valor num array ordenado.
 *
 * @param a array em ordem crescente, sem elementos repetidos (pré-condição)
 * @param x valor procurado
 * @return índice i tal que a[i] == x, ou -1 se x não está em a (pós-condição)
 */
static int busca(int[] a, int x) { ... }
```

Se a pré-condição não é respeitada, o método pode fazer qualquer coisa. Quanto mais **forte** a pré-condição, mais fácil implementar e mais difícil usar; quanto mais forte a pós-condição, mais útil o método.

Boa prática: **falhar rápido**. Se for barato, verifique a pré-condição e lance uma exceção clara:

```java
if (a == null) throw new IllegalArgumentException("array nulo");
```

### 1.2 Invariantes de laço

Um **invariante de laço** é uma afirmação que é verdadeira **antes de cada volta** do laço. Com ele você prova que o laço está certo, em três passos (lembra indução? é exatamente isso):

1. **Inicialização:** o invariante vale antes da primeira volta.
2. **Manutenção:** se vale no início de uma volta, vale no início da próxima.
3. **Término:** quando o laço para, o invariante mais a condição de parada implicam o resultado desejado.

Exemplo, soma de um array:

```java
int soma = 0;
int i = 0;
// invariante: soma == a[0] + a[1] + ... + a[i-1]
while (i < a.length) {
    soma += a[i];
    i++;
}
// término: i == a.length, então soma == a[0] + ... + a[a.length-1]
```

### 1.3 Raciocínio sobre laços

Aplicando à busca binária (onde quase todo mundo erra os limites):

```java
static int busca(int[] a, int x) {
    int lo = 0, hi = a.length;           // intervalo semiaberto [lo, hi)
    // invariante: se x está em a, então está em a[lo..hi-1]
    while (lo < hi) {
        int meio = lo + (hi - lo) / 2;   // evita estouro de (lo + hi)
        if (a[meio] < x) lo = meio + 1;  // x não está em a[lo..meio]
        else if (a[meio] > x) hi = meio; // x não está em a[meio..hi-1]
        else return meio;
    }
    return -1;                            // lo == hi: intervalo vazio, x não está em a
}
```

Também precisamos provar que o laço **termina**: escolha uma **função de variante**, um número inteiro não negativo que diminui a cada volta. Aqui, `hi − lo` diminui sempre (o intervalo encolhe), então o laço para.

> **Cuidado! Cai na entrevista:** `(lo + hi) / 2` pode estourar o `int` quando lo e hi são grandes (bug que ficou anos na biblioteca padrão do Java, descoberto em 2006). Use `lo + (hi - lo) / 2`.

### 1.4 Especificações

Uma boa especificação é:

- **Declarativa:** diz **o que**, não **como** ("devolve o menor elemento", não "percorre o array comparando").
- **Completa para os casos de borda:** e se o array for vazio? E se houver repetidos?
- **Coerente com os tipos:** tipos são a parte da especificação que o compilador confere.

Compare duas especificações para `indexOf`:

- A: "devolve o índice de x em a" (ambígua: e se houver vários? e se não houver?).
- B: "devolve o **menor** índice i tal que a[i] == x, ou −1 se não houver".

B é **mais forte** que A: qualquer implementação de B satisfaz A, mas não o contrário. Trocar uma especificação por uma mais forte nunca quebra quem já usava o método.

### Atividades de fixação do Tema 1

1. Escreva pré e pós-condições para: (a) `raizInteira(int n)`; (b) `maximo(int[] a)`; (c) `remove(List<String> lista, String s)`.
2. Escreva o invariante e prove a correção (inicialização, manutenção, término) de um laço que calcula o máximo de um array.
3. Escreva um laço que inverte um array no lugar (trocando a[i] com a[n−1−i]). Qual o invariante? Qual a função de variante?
4. Ordene da mais fraca para a mais forte: (a) "devolve um elemento de a"; (b) "devolve o maior elemento de a"; (c) "devolve um elemento de a maior ou igual a a[0]".
5. Implemente a busca binária com intervalo fechado `[lo, hi]` e adapte o invariante. Teste com arrays de tamanho 0, 1 e 2.

## Tema 2: Tipos abstratos de dados

**Objetivo:** criar tipos definidos pelas operações, escondendo a representação.

### 2.1 Tipos abstratos de dados

Um **tipo abstrato de dados (TAD)** é definido pelo que dá para **fazer** com ele, não por como ele é guardado. `String` em Java é um TAD: você usa `length()`, `charAt()`, `substring()` sem saber se por dentro é um array de bytes, de chars ou outra coisa (e, de fato, isso mudou no Java 9 sem quebrar nenhum programa).

Operações de um TAD, por categoria:

| Categoria | Faz | Exemplo em `String` |
|---|---|---|
| Criadoras | Criam valores do zero | `"abc"`, `String.valueOf(3)` |
| Produtoras | Criam valores a partir de outros | `concat`, `substring` |
| Observadoras | Consultam sem mudar | `length`, `charAt` |
| Modificadoras | Alteram o objeto | (nenhuma: `String` é imutável) |

### 2.2 Encapsulamento

Encapsular é **esconder a representação** atrás da interface. Em Java: campos `private`, acesso só pelos métodos.

```java
public class Intervalo {
    private final int inicio;
    private final int fim;

    public Intervalo(int inicio, int fim) {
        if (inicio > fim) throw new IllegalArgumentException("inicio > fim");
        this.inicio = inicio;
        this.fim = fim;
    }

    public int tamanho() { return fim - inicio; }
    public boolean contem(int x) { return inicio <= x && x < fim; }
    public boolean sobrepoe(Intervalo outro) {
        return inicio < outro.fim && outro.inicio < fim;
    }
}
```

Se os campos fossem públicos, qualquer código poderia fazer `i.inicio = 10` com `fim = 5`, quebrando a regra. Com eles privados, a classe **garante** a regra sozinha.

### 2.3 Invariante de representação

O **invariante de representação** (RI) é a condição que os campos internos sempre satisfazem. A **função de abstração** (AF) diz qual valor abstrato cada representação significa.

```java
/**
 * Um conjunto de inteiros.
 *
 * Representação: lista ordenada sem repetições.
 * RI: elementos em ordem estritamente crescente.
 * AF: representa o conjunto { elementos[0], ..., elementos[n-1] }.
 */
public class ConjuntoOrdenado {
    private final List<Integer> elementos = new ArrayList<>();

    public void adiciona(int x) {
        int pos = Collections.binarySearch(elementos, x);
        if (pos < 0) elementos.add(-pos - 1, x);
        checaRep();
    }

    private void checaRep() {
        for (int i = 1; i < elementos.size(); i++)
            assert elementos.get(i - 1) < elementos.get(i);
    }
}
```

Todo construtor precisa **estabelecer** o RI, e todo método público precisa **preservá-lo**. Um método `checaRep()` chamado ao fim de cada operação pega bugs cedo (rode com `java -ea` para ativar os `assert`).

**Exposição da representação** é o vazamento clássico:

```java
public List<Integer> getElementos() { return elementos; }   // ERRADO
```

Quem recebe a lista pode fazer `add(...)` fora de ordem e quebrar o RI. Devolva uma cópia ou uma visão imutável: `return List.copyOf(elementos);`.

### 2.4 Interfaces bem definidas

Separe **o que** (interface) de **como** (implementação):

```java
public interface Conjunto {
    void adiciona(int x);
    boolean contem(int x);
    int tamanho();
}

public class ConjuntoOrdenado implements Conjunto { ... }   // busca O(log n)
public class ConjuntoHash implements Conjunto { ... }       // busca O(1) em média
```

Código que depende só de `Conjunto` funciona com qualquer implementação: dá para trocar sem mexer no resto. É o princípio "programe para a interface, não para a implementação".

**Imutável ou mutável?** Tipos imutáveis (como `String`, `Integer`, `LocalDate`) são mais seguros: podem ser compartilhados sem medo de aliasing, são naturalmente seguros entre threads e funcionam como chaves de `HashMap`. Prefira imutável por padrão; use mutável quando o desempenho exigir. Em Java moderno, `record` cria tipos imutáveis em uma linha:

```java
public record Ponto(double x, double y) {
    public Ponto {                                   // validação no construtor
        if (Double.isNaN(x) || Double.isNaN(y)) throw new IllegalArgumentException();
    }
    public double distancia(Ponto p) { return Math.hypot(x - p.x, y - p.y); }
}
```

### Atividades de fixação do Tema 2

1. Classifique as operações de `List` (`of`, `add`, `get`, `size`, `subList`) nas quatro categorias.
2. Implemente um TAD `Fracao` imutável em Java, sempre simplificada e com denominador positivo. Escreva o RI e a AF como comentários e um `checaRep`.
3. Encontre a exposição de representação e corrija:
   ```java
   public class Turma {
       private final List<String> alunos;
       public Turma(List<String> alunos) { this.alunos = alunos; }
       public List<String> getAlunos() { return alunos; }
   }
   ```
4. Escreva a interface `Pilha<T>` (empilha, desempilha, topo, vazia) e duas implementações: com `ArrayList` e com lista ligada própria.
5. Por que um objeto mutável usado como chave num `HashMap` pode "sumir" do mapa?

## Tema 3: Classes, herança e polimorfismo

**Objetivo:** usar as ferramentas da orientação a objetos e saber quando cada uma ajuda ou atrapalha.

### 3.1 Classes

Uma **classe** junta estado (campos) e comportamento (métodos). Um **objeto** é uma instância. Membros `static` pertencem à classe, não aos objetos.

```java
public class Conta {
    private static int proximoNumero = 1;   // compartilhado por todas as contas
    private final int numero;
    private long saldoCentavos;

    public Conta() { this.numero = proximoNumero++; }

    public void deposita(long valor) {
        if (valor <= 0) throw new IllegalArgumentException();
        saldoCentavos += valor;
    }
    public long saldo() { return saldoCentavos; }
}
```

**`equals` e `hashCode`:** por padrão, `==` e `equals` comparam **identidade** (é o mesmo objeto?). Para comparar **valor**, sobrescreva os dois juntos (ou use `record`, que já faz isso):

> **Cuidado! Cai na entrevista:** se `a.equals(b)`, então obrigatoriamente `a.hashCode() == b.hashCode()`. Sobrescrever `equals` sem `hashCode` faz `HashSet` e `HashMap` se comportarem de forma errada.

### 3.2 Herança

Uma subclasse **herda** campos e métodos e pode **sobrescrever** comportamentos.

```java
public abstract class Funcionario {
    protected final String nome;
    protected Funcionario(String nome) { this.nome = nome; }
    public abstract long salario();          // cada tipo calcula do seu jeito
    public String resumo() { return nome + ": " + salario(); }
}

public class Mensalista extends Funcionario {
    private final long mensal;
    public Mensalista(String nome, long mensal) { super(nome); this.mensal = mensal; }
    @Override public long salario() { return mensal; }
}

public class Horista extends Funcionario {
    private final long porHora; private final int horas;
    public Horista(String nome, long porHora, int horas) {
        super(nome); this.porHora = porHora; this.horas = horas;
    }
    @Override public long salario() { return porHora * horas; }
}
```

Uma classe `abstract` não pode ser instanciada e pode ter métodos sem corpo, que as subclasses são obrigadas a implementar.

### 3.3 Interfaces

Uma **interface** declara um contrato sem estado. Uma classe pode implementar **várias** interfaces (mas só herda de uma classe).

```java
public interface Forma {
    double area();
    default String descricao() { return "forma de área " + area(); }   // método padrão
}

public record Circulo(double r) implements Forma {
    public double area() { return Math.PI * r * r; }
}
```

Interfaces da biblioteca que você vai implementar o tempo todo: `Comparable<T>` (ordem natural, usada por `sort`), `Iterable<T>` (permite `for (x : colecao)`), `Comparator<T>` (ordens alternativas).

### 3.4 Polimorfismo

**Polimorfismo** é o mesmo código funcionar com objetos de tipos diferentes, cada um respondendo do seu jeito.

```java
List<Funcionario> folha = List.of(new Mensalista("Ana", 800_000), new Horista("Bia", 5_000, 160));
long total = 0;
for (Funcionario f : folha) total += f.salario();   // chama a versão certa de cada um
```

A decisão de qual `salario()` chamar acontece **em tempo de execução**, olhando o tipo real do objeto (*despacho dinâmico*). O `for` não precisa de `if (f instanceof Horista)`: para adicionar um novo tipo de funcionário, basta criar a classe, sem mexer no código que já existe (princípio **aberto/fechado**).

**Princípio de substituição de Liskov:** uma subclasse deve poder ser usada em qualquer lugar onde a superclasse é esperada, **sem surpresas**. Ela pode enfraquecer pré-condições e fortalecer pós-condições, nunca o contrário. Exemplo clássico de violação: `Quadrado extends Retangulo`. Se `Retangulo` tem `setLargura` e `setAltura` independentes, um `Quadrado` precisa mudar os dois juntos, e um código que faz `r.setLargura(5); r.setAltura(4); assert r.area() == 20` quebra.

### 3.5 Composição vs herança

Herança cria **acoplamento forte**: a subclasse depende dos detalhes da superclasse, e mudanças lá quebram aqui. **Composição** (ter um objeto como campo e delegar) é mais flexível.

```java
// herança problemática: uma "pilha" que herda TODOS os métodos de ArrayList,
// inclusive add(0, x) e remove(i), que violam a disciplina de pilha
class PilhaRuim<T> extends ArrayList<T> { ... }

// composição: só expõe o que faz sentido
class Pilha<T> {
    private final ArrayList<T> itens = new ArrayList<>();
    public void empilha(T x) { itens.add(x); }
    public T desempilha() { return itens.remove(itens.size() - 1); }
    public boolean vazia() { return itens.isEmpty(); }
}
```

Regra prática: use herança para relações "é um" verdadeiras e estáveis, com a superclasse projetada para isso. Nos outros casos, **prefira composição** (conselho do livro *Effective Java*). A biblioteca do Java tem o exemplo do que não fazer: `java.util.Stack extends Vector`.

### Atividades de fixação do Tema 3

1. Crie uma hierarquia `Forma` (interface) com `Circulo`, `Retangulo` e `Triangulo`, e um método que soma as áreas de uma lista de formas sem usar `instanceof`.
2. Faça `Fracao` implementar `Comparable<Fracao>` e ordene uma lista de frações com `Collections.sort`.
3. Escreva uma classe `Pessoa` com `equals` sobrescrito mas sem `hashCode`. Adicione duas pessoas "iguais" num `HashSet` e mostre o problema. Corrija.
4. Explique, com código, por que `Quadrado extends Retangulo` viola Liskov. Proponha um modelo melhor.
5. Reescreva usando composição: `class ContadorDeAcessos extends HashMap<String, Integer>`.

## Tema 4: Padrões de projeto

**Objetivo:** reconhecer soluções clássicas para problemas recorrentes de design.

Padrões de projeto são **vocabulário**: soluções testadas, com nome, para problemas que aparecem sempre. O catálogo clássico é o livro *Design Patterns* (a "Gangue dos Quatro", 1994). Não force padrões: use quando o problema aparece.

### 4.1 Strategy

**Problema:** um algoritmo tem variações que devem ser trocáveis.
**Solução:** encapsular cada variação num objeto com interface comum.

```java
interface Frete { long calcula(Pedido p); }

class FreteFixo implements Frete { public long calcula(Pedido p) { return 1500; } }
class FretePorPeso implements Frete { public long calcula(Pedido p) { return 300 * p.pesoKg(); } }
class FreteGratis implements Frete { public long calcula(Pedido p) { return 0; } }

class Checkout {
    private final Frete frete;
    Checkout(Frete frete) { this.frete = frete; }
    long total(Pedido p) { return p.subtotal() + frete.calcula(p); }
}
```

Em Java moderno, uma Strategy de um método só é uma **lambda**: `new Checkout(p -> 1500)`. O `Comparator` passado para `sort` é uma Strategy.

### 4.2 Observer

**Problema:** vários objetos precisam reagir quando outro muda, sem que este conheça os detalhes deles.
**Solução:** o objeto observado mantém uma lista de observadores e os notifica.

```java
interface Observador<T> { void notifica(T evento); }

class Sensor {
    private final List<Observador<Double>> observadores = new ArrayList<>();
    void inscreve(Observador<Double> o) { observadores.add(o); }
    void novaLeitura(double valor) {
        for (var o : observadores) o.notifica(valor);
    }
}

sensor.inscreve(v -> System.out.println("leitura: " + v));
sensor.inscreve(v -> { if (v > 80) alarme.dispara(); });
```

É a base de interfaces gráficas (eventos de clique), do React (estado que notifica a tela) e de sistemas de mensagens.

### 4.3 Factory

**Problema:** o código que usa um objeto não deveria decidir qual classe concreta instanciar.
**Solução:** um método (ou objeto) que cria e devolve pela interface.

```java
interface Forma { double area(); }

class Formas {
    static Forma de(String tipo, double... medidas) {
        return switch (tipo) {
            case "circulo" -> new Circulo(medidas[0]);
            case "retangulo" -> new Retangulo(medidas[0], medidas[1]);
            default -> throw new IllegalArgumentException("tipo desconhecido: " + tipo);
        };
    }
}
```

Métodos de fábrica estáticos também ganham nomes descritivos e podem devolver objetos já existentes: `List.of(...)`, `Integer.valueOf(...)`, `LocalDate.of(...)`.

### 4.4 Iterator

**Problema:** percorrer uma coleção sem expor como ela é guardada.
**Solução:** um objeto com `hasNext()` e `next()`.

```java
class Intervalo implements Iterable<Integer> {
    private final int inicio, fim;
    Intervalo(int inicio, int fim) { this.inicio = inicio; this.fim = fim; }

    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            private int atual = inicio;
            public boolean hasNext() { return atual < fim; }
            public Integer next() {
                if (!hasNext()) throw new NoSuchElementException();
                return atual++;
            }
        };
    }
}

for (int i : new Intervalo(0, 5)) System.out.println(i);
```

Os geradores do Python (`yield`) e as listas preguiçosas do Haskell são a mesma ideia.

> **Cuidado! Cai na prova:** modificar uma coleção enquanto a percorre com `for-each` lança `ConcurrentModificationException`. Use `iterator.remove()` ou `removeIf`.

### 4.5 Imutabilidade

Mais que um padrão, uma estratégia: objetos que **nunca mudam** depois de criados.

Receita para uma classe imutável em Java:

1. Todos os campos `private final`.
2. Nenhum método modificador; "modificações" devolvem um novo objeto (`String.toUpperCase()` devolve outra string).
3. Classe `final` (ou construtor privado), para ninguém criar uma subclasse mutável.
4. Cópias defensivas de campos mutáveis na entrada (construtor) e na saída (getters).

```java
public final class Turma {
    private final List<String> alunos;
    public Turma(List<String> alunos) { this.alunos = List.copyOf(alunos); }
    public List<String> alunos() { return alunos; }            // List.copyOf já é imutável
    public Turma comAluno(String a) {
        var nova = new ArrayList<>(alunos); nova.add(a);
        return new Turma(nova);
    }
}
```

Ganhos: sem aliasing perigoso, seguro entre threads, fácil de testar e de raciocinar (é a programação funcional dentro da OO).

### Atividades de fixação do Tema 4

1. Implemente descontos com Strategy: sem desconto, porcentagem e "leve 3 pague 2". Depois troque as classes por lambdas.
2. Implemente um `Termometro` observável e dois observadores: um que registra o histórico e um que avisa quando a temperatura muda mais de 5 graus.
3. Crie uma fábrica que lê linhas como `circulo 2.0` ou `retangulo 3 4` e devolve `Forma`s.
4. Faça sua `Pilha<T>` implementar `Iterable<T>`, percorrendo do topo para a base.
5. Transforme a `Conta` do Tema 3 numa classe imutável, onde `deposita` devolve uma conta nova. Quais as vantagens e desvantagens nesse caso?

## Tema 5: Testes e refatoração

**Objetivo:** escrever testes que encontram bugs e melhorar código sem mudar o comportamento.

### 5.1 Testes unitários

Um **teste unitário** verifica uma unidade (método ou classe) isoladamente. Com JUnit 5:

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class FracaoTest {
    @Test
    void somaSimplifica() {
        assertEquals(new Fracao(5, 6), new Fracao(1, 2).soma(new Fracao(1, 3)));
    }

    @Test
    void denominadorZeroLancaExcecao() {
        assertThrows(ArithmeticException.class, () -> new Fracao(1, 0));
    }
}
```

Como escolher os casos: **particione** o espaço de entradas em grupos que devem se comportar igual e teste um de cada, mais as **fronteiras** entre eles.

Para `max(int a, int b)`: a < b, a == b, a > b; e valores extremos (negativos, zero, `Integer.MAX_VALUE`).

Para métodos com listas: vazia, um elemento, muitos; elemento procurado no início, meio, fim e ausente; com repetidos.

Bons testes são **rápidos**, **independentes** (a ordem não importa), **determinísticos** e testam **comportamento** (a especificação), não detalhes de implementação.

### 5.2 Testes baseados em propriedades

Em vez de escolher exemplos à mão, você descreve uma **propriedade** que deve valer para **qualquer** entrada, e a biblioteca gera centenas de entradas aleatórias, inclusive casos estranhos que você não pensaria. Se achar uma falha, ela **encolhe** a entrada até o menor contraexemplo.

Com a biblioteca **jqwik** (Java):

```java
@Property
void ordenarNaoMudaOTamanho(@ForAll List<Integer> xs) {
    assertEquals(xs.size(), ordena(xs).size());
}

@Property
void ordenadoEstaEmOrdem(@ForAll List<Integer> xs) {
    List<Integer> r = ordena(xs);
    for (int i = 1; i < r.size(); i++) assertTrue(r.get(i - 1) <= r.get(i));
}

@Property
void somaDeFracoesComuta(@ForAll("fracoes") Fracao a, @ForAll("fracoes") Fracao b) {
    assertEquals(a.soma(b), b.soma(a));
}
```

Propriedades típicas: ida e volta (`decodifica(codifica(x)) == x`), invariantes (tamanho preservado, resultado ordenado), comparação com uma implementação simples e lenta (o **oráculo**), leis algébricas (comutatividade, elemento neutro). A ideia nasceu no Haskell (QuickCheck); em Python, use **Hypothesis**.

### 5.3 Cobertura

**Cobertura de código** mede quanto do código os testes executam (linhas, ramos). Ferramentas: JaCoCo (Java), coverage.py (Python).

- Cobertura baixa indica áreas **sem teste nenhum**: útil para achar buracos.
- Cobertura alta **não** prova que os testes são bons: um teste sem `assert` cobre tudo e não verifica nada.

**Teste de mutação** mede a qualidade dos testes: a ferramenta (PIT, para Java) introduz pequenos bugs no código (troca `<` por `<=`, `+` por `-`) e verifica se algum teste falha. Mutante que sobrevive revela um teste faltando.

### 5.4 Refatoração

**Refatorar** é mudar a estrutura do código **sem mudar o comportamento**, em passos pequenos, rodando os testes a cada passo. Sem testes, não é refatoração, é aposta.

Sinais de que o código precisa de refatoração (*code smells*):

| Sinal | Refatoração |
|---|---|
| Método longo | Extrair método |
| Código duplicado | Extrair método ou classe |
| Nomes ruins (`x`, `dados2`, `processa`) | Renomear |
| Muitos parâmetros | Introduzir objeto de parâmetro |
| `switch` sobre tipo repetido em vários lugares | Substituir por polimorfismo |
| Números mágicos (`if (status == 3)`) | Constante ou `enum` |
| Classe que faz tudo | Extrair classe |

Exemplo, substituir condicional por polimorfismo:

```java
// antes
double area(Forma f) {
    if (f.tipo == CIRCULO) return Math.PI * f.r * f.r;
    else if (f.tipo == RETANGULO) return f.b * f.h;
    ...
}
// depois: cada forma implementa area() (Tema 3)
```

As IDEs automatizam as refatorações mais comuns (renomear, extrair método, mudar assinatura) com segurança: aprenda os atalhos.

### Atividades de fixação do Tema 5

1. Particione as entradas e escreva testes JUnit para `static int contaVogais(String s)`.
2. Escreva três propriedades para uma função `inverte(List<T>)` e teste com jqwik (ou Hypothesis em Python).
3. Esta implementação passa no teste abaixo, mas está errada. Escreva um teste que pegue o erro.
   ```java
   static int max(int[] a) { int m = 0; for (int x : a) if (x > m) m = x; return m; }
   @Test void maxBasico() { assertEquals(5, max(new int[]{1, 5, 3})); }
   ```
4. Explique por que 100% de cobertura de linhas não garante ausência de bugs, com um exemplo.
5. Refatore o código abaixo identificando pelo menos três *code smells*:
   ```java
   double calc(int t, double v, int q) {
       double r = 0;
       if (t == 1) { r = v * q; if (q > 10) r = r * 0.9; }
       else if (t == 2) { r = v * q * 0.8; if (q > 10) r = r * 0.9; }
       else if (t == 3) { r = v * q * 0.5; if (q > 10) r = r * 0.9; }
       return r;
   }
   ```

## Projeto da etapa

**Biblioteca de coleções própria:**

1. Interfaces `Lista<T>`, `Conjunto<T>` e `Mapa<K, V>`, cada uma com especificação completa em Javadoc (pré e pós-condições, comportamento nos casos de borda).
2. Implementações: `ListaArray` (array que dobra de tamanho), `ListaLigada`, `ConjuntoHash` (pode usar a sua `ListaLigada` para os baldes) e `MapaArvore` (árvore binária de busca simples).
3. Cada implementação com RI e AF documentados e `checaRep()`.
4. Todas implementam `Iterable<T>`; iteradores lançam `ConcurrentModificationException` se a coleção mudar durante a iteração.
5. Testes unitários com particionamento de entradas e testes de propriedade comparando cada estrutura com a equivalente do `java.util` (o oráculo).
6. Uma versão imutável de `Lista` com operações que devolvem novas listas.

## Para ir além

- **MIT 6.1020 (antigo 6.031) Software Construction**: as notas de aula são públicas e excelentes, sobre especificações, TADs, RI e AF, testes.
- *Effective Java* (Joshua Bloch): o livro sobre como escrever Java bem.
- *Refactoring* (Martin Fowler) e o catálogo online de refatorações.
- *Head First Design Patterns*: introdução visual aos padrões.
- **Oxford, Imperative Programming**: notas públicas sobre invariantes e raciocínio sobre programas.

## Resumão

- Especificação = pré-condição (dever de quem chama) + pós-condição (garantia de quem implementa).
- Invariante de laço: inicialização, manutenção, término. Função de variante prova que termina.
- TAD: definido pelas operações. Campos privados, representação escondida.
- RI: regra que os campos sempre cumprem; AF: o que a representação significa. Cuidado com exposição da representação.
- Interface separa o quê do como. Prefira imutável.
- `equals` e `hashCode` sempre juntos. Liskov: subclasse sem surpresas.
- Polimorfismo substitui cadeias de `if` por tipo. Prefira composição a herança.
- Strategy troca algoritmos; Observer notifica; Factory decide o que criar; Iterator percorre sem expor.
- Testes: particionar entradas e testar fronteiras. Propriedades acham casos que você não imaginou.
- Cobertura acha buracos, não prova qualidade. Refatorar só com testes, em passos pequenos.
