# Gabarito: Programação Imperativa e Orientada a Objetos

Abra só depois de tentar.

## Tema 1

1. (a) `raizInteira(int n)`: **pré:** n ≥ 0. **Pós:** devolve r tal que r² ≤ n < (r + 1)². (b) `maximo(int[] a)`: **pré:** a não nulo e não vazio. **Pós:** devolve m tal que m está em a e m ≥ a[i] para todo i; a não é modificado. (c) `remove(List<String> lista, String s)`: **pré:** lista não nula e modificável. **Pós:** remove a primeira ocorrência de s (comparando com `equals`), mantendo a ordem dos demais; devolve `true` se removeu e `false` se s não estava na lista (e a lista fica igual).
2. ```java
   int m = a[0];
   int i = 1;
   // invariante: m == max(a[0..i-1])
   while (i < a.length) {
       if (a[i] > m) m = a[i];
       i++;
   }
   ```
   **Inicialização:** com i = 1, m = a[0] = max(a[0..0]). **Manutenção:** se m = max(a[0..i−1]), depois do `if` m = max(m, a[i]) = max(a[0..i]); depois do `i++`, de novo m = max(a[0..i−1]). **Término:** o laço para com i = a.length, então m = max(a[0..a.length−1]), o máximo do array inteiro. A variante `a.length − i` diminui a cada volta e não fica negativa, então o laço termina.
3. ```java
   int i = 0, j = a.length - 1;
   // invariante: a[0..i-1] e a[j+1..n-1] já estão trocados com suas posições espelhadas;
   //             a[i..j] continua como no original
   while (i < j) {
       int t = a[i]; a[i] = a[j]; a[j] = t;
       i++; j--;
   }
   ```
   Variante: `j − i`, que diminui 2 a cada volta. Quando i ≥ j, a parte do meio tem 0 ou 1 elemento (que fica no lugar) e todo o resto foi espelhado.
4. Da mais fraca para a mais forte: **(a), (c), (b)**. Qualquer resultado que satisfaz (b) (o maior) é maior ou igual a a[0], então satisfaz (c); e qualquer resultado que satisfaz (c) é um elemento de a, então satisfaz (a).
5. ```java
   static int busca(int[] a, int x) {
       int lo = 0, hi = a.length - 1;
       // invariante: se x está em a, então está em a[lo..hi] (intervalo fechado)
       while (lo <= hi) {
           int meio = lo + (hi - lo) / 2;
           if (a[meio] < x) lo = meio + 1;
           else if (a[meio] > x) hi = meio - 1;
           else return meio;
       }
       return -1;
   }
   ```
   A diferença: com intervalo fechado, a condição é `lo <= hi` e o lado direito anda para `meio − 1`. Testes: `busca(new int[]{}, 3) == -1`, `busca(new int[]{3}, 3) == 0`, `busca(new int[]{3}, 4) == -1`, `busca(new int[]{1, 3}, 1) == 0`, `busca(new int[]{1, 3}, 3) == 1`, `busca(new int[]{1, 3}, 2) == -1`.

## Tema 2

1. `List.of` é **criadora**; `add` é **modificadora**; `get` e `size` são **observadoras**; `subList` é **produtora** (cria uma lista nova a partir da existente; atenção: no Java ela é uma *visão* da original, e mudanças numa aparecem na outra).
2. ```java
   /**
    * Fração imutável.
    * RI: den > 0 e mdc(|num|, den) == 1.
    * AF: representa o número racional num/den.
    */
   public final class Fracao {
       private final long num, den;

       public Fracao(long num, long den) {
           if (den == 0) throw new ArithmeticException("denominador zero");
           if (den < 0) { num = -num; den = -den; }
           long g = mdc(Math.abs(num), den);
           this.num = num / g;
           this.den = den / g;
           checaRep();
       }

       public Fracao soma(Fracao o) { return new Fracao(num * o.den + o.num * den, den * o.den); }
       public Fracao multiplica(Fracao o) { return new Fracao(num * o.num, den * o.den); }

       private static long mdc(long a, long b) { return b == 0 ? (a == 0 ? 1 : a) : mdc(b, a % b); }

       private void checaRep() {
           assert den > 0;
           assert mdc(Math.abs(num), den) == 1;
       }

       @Override public boolean equals(Object o) {
           return o instanceof Fracao f && f.num == num && f.den == den;
       }
       @Override public int hashCode() { return Long.hashCode(num) * 31 + Long.hashCode(den); }
       @Override public String toString() { return num + "/" + den; }
   }
   ```
   O caso `mdc(0, den)` devolve `den`, então 0/5 vira 0/1. O ajuste `a == 0 ? 1 : a` só evita divisão por zero no caso impossível de mdc(0, 0).
3. O construtor guarda a **mesma lista** recebida (quem criou a turma pode alterá-la depois) e o getter devolve a lista interna (qualquer um pode alterá-la). Correção com cópias defensivas:
   ```java
   public Turma(List<String> alunos) { this.alunos = List.copyOf(alunos); }
   public List<String> getAlunos() { return alunos; }   // List.copyOf já devolve lista imutável
   ```
4. ```java
   public interface Pilha<T> {
       void empilha(T x);
       /** @throws NoSuchElementException se vazia */
       T desempilha();
       /** @throws NoSuchElementException se vazia */
       T topo();
       boolean vazia();
   }

   public class PilhaArray<T> implements Pilha<T> {
       private final ArrayList<T> itens = new ArrayList<>();
       public void empilha(T x) { itens.add(x); }
       public T desempilha() { T t = topo(); itens.remove(itens.size() - 1); return t; }
       public T topo() { if (vazia()) throw new NoSuchElementException(); return itens.get(itens.size() - 1); }
       public boolean vazia() { return itens.isEmpty(); }
   }

   public class PilhaLigada<T> implements Pilha<T> {
       private record No<T>(T valor, No<T> prox) {}
       private No<T> topo = null;
       public void empilha(T x) { topo = new No<>(x, topo); }
       public T desempilha() { T t = topo(); topo = topo.prox(); return t; }
       public T topo() { if (vazia()) throw new NoSuchElementException(); return topo.valor(); }
       public boolean vazia() { return topo == null; }
   }
   ```
5. O `HashMap` guarda cada chave no "balde" calculado pelo `hashCode` no momento da inserção. Se a chave muda depois, o `hashCode` muda, e `get` procura no balde **novo**, onde ela não está: a entrada continua no mapa, mas fica inacessível. Por isso chaves devem ser imutáveis (ou, pelo menos, não mudar os campos usados em `equals`/`hashCode`).

## Tema 3

1. ```java
   interface Forma { double area(); }
   record Circulo(double r) implements Forma { public double area() { return Math.PI * r * r; } }
   record Retangulo(double b, double h) implements Forma { public double area() { return b * h; } }
   record Triangulo(double b, double h) implements Forma { public double area() { return b * h / 2; } }

   static double areaTotal(List<? extends Forma> formas) {
       double total = 0;
       for (Forma f : formas) total += f.area();
       return total;
   }
   ```
2. ```java
   public final class Fracao implements Comparable<Fracao> {
       ...
       @Override public int compareTo(Fracao o) {
           return Long.compare(num * o.den, o.num * den);   // den > 0 pelo RI, então a ordem se mantém
       }
   }
   Collections.sort(fracoes);
   ```
   O RI (denominador positivo) é o que garante que multiplicar cruzado não inverte a desigualdade. (Para valores grandes, cuidado com estouro de `long`; use `Math.multiplyExact` ou `BigInteger`.)
3. ```java
   class Pessoa {
       final String cpf;
       Pessoa(String cpf) { this.cpf = cpf; }
       @Override public boolean equals(Object o) { return o instanceof Pessoa p && p.cpf.equals(cpf); }
   }
   Set<Pessoa> s = new HashSet<>();
   s.add(new Pessoa("123"));
   s.add(new Pessoa("123"));
   System.out.println(s.size());     // 2 (quase sempre): hashCode diferentes, baldes diferentes
   ```
   Correção: `@Override public int hashCode() { return cpf.hashCode(); }`. Agora o tamanho é 1. Ou use `record Pessoa(String cpf) {}`.
4. ```java
   void testa(Retangulo r) {
       r.setLargura(5);
       r.setAltura(4);
       assert r.area() == 20;       // falha se r for um Quadrado: área 16
   }
   ```
   O `Quadrado` precisa manter largura == altura, então `setAltura(4)` também muda a largura. Ele **fortalece a pós-condição de forma incompatível** (o setter de `Retangulo` promete não mexer na outra dimensão). Modelos melhores: tornar as formas **imutáveis** (sem setters, `Quadrado` pode ser só um `Retangulo` com lados iguais criado por fábrica), ou ter `Quadrado` e `Retangulo` como irmãos implementando `Forma`, sem herança entre eles.
5. ```java
   class ContadorDeAcessos {
       private final Map<String, Integer> contagem = new HashMap<>();
       void registra(String pagina) { contagem.merge(pagina, 1, Integer::sum); }
       int acessos(String pagina) { return contagem.getOrDefault(pagina, 0); }
   }
   ```
   Com herança, qualquer um poderia chamar `put("x", -7)` ou `clear()`, quebrando a ideia de contador.

## Tema 4

1. ```java
   interface Desconto { long aplica(long precoUnit, int qtd); }

   class SemDesconto implements Desconto {
       public long aplica(long p, int q) { return p * q; }
   }
   class Porcentagem implements Desconto {
       private final int pct;
       Porcentagem(int pct) { this.pct = pct; }
       public long aplica(long p, int q) { return p * q * (100 - pct) / 100; }
   }
   class Leve3Pague2 implements Desconto {
       public long aplica(long p, int q) { return p * (q - q / 3); }
   }

   // com lambdas
   Desconto sem = (p, q) -> p * q;
   Desconto dezPorCento = (p, q) -> p * q * 90 / 100;
   Desconto leve3 = (p, q) -> p * (q - q / 3);
   ```
2. ```java
   class Termometro {
       private final List<Consumer<Double>> obs = new ArrayList<>();
       void inscreve(Consumer<Double> o) { obs.add(o); }
       void mede(double t) { obs.forEach(o -> o.accept(t)); }
   }

   List<Double> historico = new ArrayList<>();
   termometro.inscreve(historico::add);

   double[] ultima = { Double.NaN };
   termometro.inscreve(t -> {
       if (!Double.isNaN(ultima[0]) && Math.abs(t - ultima[0]) > 5) System.out.println("mudança brusca: " + t);
       ultima[0] = t;
   });
   ```
   O array de um elemento contorna a regra de que lambdas só capturam variáveis efetivamente finais. Uma classe com campo `ultima` seria mais clara.
3. ```java
   static Forma deLinha(String linha) {
       String[] p = linha.trim().split("\\s+");
       return switch (p[0]) {
           case "circulo" -> new Circulo(Double.parseDouble(p[1]));
           case "retangulo" -> new Retangulo(Double.parseDouble(p[1]), Double.parseDouble(p[2]));
           default -> throw new IllegalArgumentException("forma desconhecida: " + p[0]);
       };
   }
   ```
4. Na `PilhaLigada`:
   ```java
   public Iterator<T> iterator() {
       return new Iterator<>() {
           private No<T> atual = topo;
           public boolean hasNext() { return atual != null; }
           public T next() {
               if (atual == null) throw new NoSuchElementException();
               T v = atual.valor(); atual = atual.prox(); return v;
           }
       };
   }
   ```
   A lista ligada já está do topo para a base, então o iterador é natural.
5. ```java
   public record Conta(int numero, long saldo) {
       public Conta { if (saldo < 0) throw new IllegalArgumentException(); }
       public Conta deposita(long v) {
           if (v <= 0) throw new IllegalArgumentException();
           return new Conta(numero, saldo + v);
       }
   }
   ```
   **Vantagens:** histórico fácil (cada versão é um valor), seguro entre threads, sem aliasing. **Desvantagens:** uma conta é, por natureza, uma entidade com identidade que muda ao longo do tempo; quem guarda a referência antiga fica com o saldo velho, e todo código precisa lembrar de usar o objeto devolvido (`c = c.deposita(100)`). Nesse caso, o mais comum é a conta ser mutável (com sincronização) ou o saldo ser derivado de uma lista imutável de transações.

## Tema 5

1. Partições: string vazia; só vogais; só consoantes; mistura; maiúsculas; vogais acentuadas (decida a especificação!); caracteres não letras.
   ```java
   @Test void vazia() { assertEquals(0, contaVogais("")); }
   @Test void soVogais() { assertEquals(5, contaVogais("aeiou")); }
   @Test void soConsoantes() { assertEquals(0, contaVogais("bcd")); }
   @Test void mistura() { assertEquals(3, contaVogais("banana")); }
   @Test void maiusculas() { assertEquals(2, contaVogais("OI")); }
   @Test void acentuadas() { assertEquals(3, contaVogais("ação é")); }   // se a especificação incluir acentos
   @Test void simbolos() { assertEquals(1, contaVogais("1a!")); }
   ```
2. Propriedades: (1) `inverte(inverte(xs)).equals(xs)`; (2) `inverte(xs).size() == xs.size()`; (3) para todo i, `inverte(xs).get(i).equals(xs.get(n - 1 - i))`; (4) `inverte(a ++ b) == inverte(b) ++ inverte(a)`.
   ```java
   @Property
   void inverterDuasVezes(@ForAll List<Integer> xs) {
       assertEquals(xs, inverte(inverte(xs)));
   }
   ```
3. O máximo começa em 0, então falha para arrays só com negativos:
   ```java
   @Test void soNegativos() { assertEquals(-1, max(new int[]{-3, -1, -2})); }   // devolve 0
   ```
   Correção: `int m = a[0];` (e especificar que o array não pode ser vazio).
4. Cobertura mede o que **rodou**, não o que foi **verificado**, nem as **combinações** de caminhos. Exemplo: `int div(int a, int b) { return a / b; }` com o teste `assertEquals(2, div(4, 2))` tem 100% de cobertura e não percebe que `b = 0` lança exceção. Outro: o teste do exercício 3 cobre 100% das linhas de `max` e o bug passa.
5. *Smells:* número mágico (`t == 1, 2, 3`), nomes sem significado (`calc`, `t`, `v`, `q`, `r`), código duplicado (o desconto por quantidade repetido três vezes), condicional por tipo (candidato a polimorfismo ou `enum`), e o caso de `t` inválido devolvendo 0 em silêncio.
   ```java
   enum TipoCliente {
       COMUM(1.0), PARCEIRO(0.8), FUNCIONARIO(0.5);
       final double fator;
       TipoCliente(double fator) { this.fator = fator; }
   }

   static final int QTD_DESCONTO_ATACADO = 10;
   static final double FATOR_ATACADO = 0.9;

   static double precoTotal(TipoCliente tipo, double precoUnitario, int quantidade) {
       double total = precoUnitario * quantidade * tipo.fator;
       return quantidade > QTD_DESCONTO_ATACADO ? total * FATOR_ATACADO : total;
   }
   ```
   (Para dinheiro de verdade, use `long` em centavos ou `BigDecimal`, não `double`.) Antes de refatorar, escreva testes para o comportamento original; rode-os depois de cada passo.

## Projeto da etapa

Pontos que a revisão deve verificar:

- `ListaArray`: ao encher, cria um array com o **dobro** da capacidade e copia; assim, n inserções no fim custam O(n) no total (custo amortizado O(1), que você vai provar em Estruturas de Dados). Crescer de 1 em 1 deixaria tudo O(n²).
- `ConjuntoHash`: índice do balde = `Math.floorMod(x.hashCode(), capacidade)` (o `hashCode` pode ser negativo; `%` daria índice negativo). Redimensione quando o número de elementos passar de 0,75 × capacidade.
- `MapaArvore`: RI "para todo nó, as chaves da subárvore esquerda são menores e as da direita maiores"; `checaRep` percorre a árvore com limites mínimo e máximo.
- `ConcurrentModificationException`: guarde um contador `modificacoes` incrementado por toda operação que altera a coleção; o iterador copia o valor ao ser criado e compara a cada `next()`.
- Testes de propriedade com oráculo: gere uma sequência aleatória de operações (adiciona, remove, contém) e aplique na sua estrutura e na do `java.util`, comparando os resultados a cada passo. Esse único teste costuma achar mais bugs que dezenas de testes manuais.
