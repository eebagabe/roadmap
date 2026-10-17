# Gabarito: Teoria da Computação

Abra só depois de tentar.

## Tema 1

1. Tabelas de transição (estado inicial marcado com →, aceitação com \*):
   - (a) Termina em "01". Estados: q0 (nada útil), q1 (último lido foi 0), \*q2 (últimos dois foram "01").
     | | 0 | 1 |
     |---|---|---|
     | → q0 | q1 | q0 |
     | q1 | q1 | q2 |
     | \*q2 | q1 | q0 |
   - (b) Pelo menos dois 0s: → q0 –0→ q1 –0→ \*q2; ler 1 não muda o estado; q2 fica em q2 com tudo.
   - (c) Sem "11". Estados: \*q0 (último não foi 1), \*q1 (último foi 1), q2 (viu "11": armadilha).
     | | 0 | 1 |
     |---|---|---|
     | → \*q0 | q0 | q1 |
     | \*q1 | q0 | q2 |
     | q2 | q2 | q2 |
   - (d) Divisível por 3: o estado é o **resto** r do número lido até agora. Ler o bit b transforma o número em 2 × número + b, então r' = (2r + b) mod 3.
     | | 0 | 1 |
     |---|---|---|
     | → \*r0 | r0 | r1 |
     | r1 | r2 | r0 |
     | r2 | r1 | r2 |
2. NFA: q0 com laço em 0 e 1; q0 –1→ q1 –0→ q2 –1→ q3 (aceitação), q3 com laço em 0 e 1. Construção dos subconjuntos, partindo de {q0}:
   | Conjunto | 0 | 1 |
   |---|---|---|
   | {q0} | {q0} | {q0, q1} |
   | {q0, q1} | {q0, q2} | {q0, q1} |
   | {q0, q2} | {q0} | {q0, q1, q3} |
   | \*{q0, q1, q3} | {q0, q2, q3} | {q0, q1, q3} |
   | \*{q0, q2, q3} | {q0, q3} | {q0, q1, q3} |
   | \*{q0, q3} | {q0, q3} | {q0, q1, q3} |

   Os três estados de aceitação são equivalentes (depois de ver "101" aceita para sempre); minimizado, o DFA tem **4 estados**: "nada", "viu 1", "viu 10", "viu 101".
3. **8 estados**. Considere as 8 cadeias de tamanho 3. Para duas diferentes x e y, elas diferem em alguma posição i (1, 2 ou 3); acrescente i − 1 símbolos quaisquer. Agora o símbolo da posição i virou o **terceiro a partir do fim** nas duas: uma é aceita e a outra não. Então x e y precisam levar a estados diferentes, e o DFA precisa de pelo menos 8 estados (Myhill-Nerode). Com o "n-ésimo a partir do fim", são 2ⁿ.
4. Estados são pares (paridade de 0s, paridade de 1s): (P, P) inicial, (P, I) de aceitação, (I, P), (I, I). Ler 0 troca a primeira coordenada; ler 1 troca a segunda.
5. ```python
   import json
   def roda(arquivo, cadeias):
       m = json.load(open(arquivo))
       delta = {(t["de"], t["simbolo"]): t["para"] for t in m["transicoes"]}
       for w in cadeias:
           q = m["inicial"]
           try:
               for c in w:
                   q = delta[(q, c)]
               print(w or "ε", "aceita" if q in m["finais"] else "rejeita")
           except KeyError:
               print(w, "rejeita (transição indefinida)")
   ```

## Tema 2

1. (a) **0\*(10\*10\*)\*** (blocos com dois 1s). (b) **(1 ∣ 01)\*(0 ∣ ε)**: todo 0 é seguido de 1, exceto talvez um 0 no fim. (c) `[a-z]+@[a-z]+\.[a-z]+` (e-mails reais são bem mais complicados: a especificação completa nem é prática como regex). (d) `[+-]?[0-9]+(\.[0-9]+)?`.
2. Pela construção: NFA para a e para b, unidos por ε a partir de um novo início (a ∣ b); a estrela adiciona um novo início e um novo fim ligados por ε, com ε do fim do bloco de volta ao seu início; em seguida, concatenam-se por ε os NFAs de a, b e b. O resultado tem cerca de 10 estados (versus 4 do DFA mínimo, que lembra quanto de "abb" já foi visto).
3. (a) {ww}: escolha s = 0ᵖ10ᵖ1. Como |xy| ≤ p, y = 0ᵏ dentro do primeiro bloco. xy²z = 0^(p+k)10ᵖ1: o primeiro 1 deixa de estar no meio, e a cadeia não é da forma ww. (b) {0^(n²)}: s = 0^(p²). Com 1 ≤ |y| = k ≤ p, xy²z tem tamanho p² + k, e p² < p² + k ≤ p² + p < (p + 1)²: não é quadrado perfeito. (c) Mesmo número de 0s e 1s: s = 0ᵖ1ᵖ, y = 0ᵏ, xy²z tem mais 0s. ∎ (Nas três, a escolha de s é o que torna a prova possível: com s = (01)^p, por exemplo, a (c) não sairia.)
4. {0ⁿ1ᵐ : n, m ≥ 0} = **0\*1\***: regular. {0ⁿ1ᵐ : n ≠ m} **não** é regular: se fosse, o complemento intersectado com 0\*1\* também seria (fechamento), e isso dá {0ⁿ1ⁿ}, que não é regular.
5. Classes iniciais: {C, E} (finais) e {A, B, D}. Em {A, B, D}, com b: A → C (final), B → D (não final), D → E (final): separa B. Novas classes: {A, D}, {B}, {C, E}. Verificando: A e D vão, com a, para B e B; com b, para C e E (mesma classe). C e E vão, com a, para B; com b, para C. Estável. **DFA mínimo com 3 estados**: AD (inicial), B, CE (final), com AD: a → B, b → CE; B: a → B, b → AD; CE: a → B, b → CE.
6. O tempo cresce exponencialmente (cada "a" a mais dobra, aproximadamente): com n = 25 já leva segundos ou mais. O motor do Python tenta todas as formas de dividir a sequência de as entre o `+` de dentro e o de fora antes de concluir que não há b, e são 2ⁿ formas. Um motor baseado em simulação de NFA (Thompson) decide em tempo linear.

## Tema 3

1. (a) **S → (S)S ∣ ε**. (b) **S → aSa ∣ bSb ∣ a ∣ b ∣ ε**. (c) **S → aSb ∣ aS ∣ ε** (cada b é casado com um a; os as extras saem de aS). (d) **S → aSbS ∣ bSaS ∣ ε**.
2. Árvore 1: a raiz é \*, com filhos (1 + 2) e 3: valor **9**. Árvore 2: a raiz é +, com filhos 1 e (2 \* 3): valor **7**. A gramática não diz qual é a certa: é ambígua. A gramática com E, T, F força a segunda (precedência da multiplicação).
3. ```
             E
             |
             T
           / | \
          T  *  F
          |     |
          F    num(4)
        / | \
       (  E  )
        / | \
       E  +  T
       |     |
       T     F
       |     |
       F   num(3)
       |
     num(2)
   ```
   Os parênteses forçam a soma a ficar mais "funda" que a multiplicação, logo calculada antes.
4. Estado 1 (primeira metade): para cada símbolo lido, empilhe-o. A qualquer momento, **não deterministicamente**, mude para o estado 2 ("cheguei no meio"). Estado 2: para cada símbolo lido, desempilhe e confira se é igual; se diferente, esse ramo morre. Aceite se a entrada e a pilha acabarem juntas. O não determinismo está em **adivinhar onde é o meio**; um PDA determinístico não consegue saber, porque nenhum símbolo marca o meio.
5. Com uma pilha, ao ler os as dá para empilhar uma contagem e, nos bs, desempilhá-la para comparar. Mas ela fica **vazia** ao terminar os bs, e não há como comparar com os cs. Formalmente, pelo lema do bombeamento para GLCs com s = aᵖbᵖcᵖ: os dois trechos bombeados ficam numa janela de tamanho ≤ p, então tocam no máximo **dois** dos três blocos; bombear desequilibra as contagens. ∎
6. ```python
   def E():
       v = T()
       while olha() in ("+", "-"):
           op = consome(); v = (op, v, T())        # laço: associatividade à esquerda
       return v
   def T():
       v = U()
       while olha() in ("*", "/"):
           op = consome(); v = (op, v, U())
       return v
   def U():
       if olha() == "-":
           consome(); return ("neg", U())
       return F()
   def avalia(n):
       if isinstance(n, int): return n
       if n[0] == "neg": return -avalia(n[1])
       op, a, b = n
       a, b = avalia(a), avalia(b)
       return {"+": a + b, "-": a - b, "*": a * b, "/": a / b}[op]
   ```
   Teste a associatividade: "8 - 3 - 2" tem que dar 3 ((8 − 3) − 2), não 7.

## Tema 4

1. Para cada símbolo da esquerda do #: marque-o (troque por X), lembre no **estado** se era 0 ou 1, ande até depois do #, pule os já marcados, confira se o primeiro não marcado é igual e marque-o; volte ao início do lado esquerdo. Quando o lado esquerdo acabar, confira se o lado direito também está todo marcado. Aceite se tudo bateu. Custo O(n²) passos (vai e volta para cada símbolo).
2. ```python
   def turing(regras, fita, estado="q0", aceita="fim", max_passos=10_000):
       fita = dict(enumerate(fita))
       cabeca = 0
       for _ in range(max_passos):
           if estado == aceita:
               break
           simbolo = fita.get(cabeca, "_")
           estado, escreve, mov = regras[(estado, simbolo)]
           fita[cabeca] = escreve
           cabeca += 1 if mov == "D" else -1
       return "".join(fita[i] for i in sorted(fita)).strip("_")

   # soma 1: vá até o fim, depois volte trocando 1 por 0 até achar um 0 (ou o início)
   regras = {
       ("q0", "0"): ("q0", "0", "D"), ("q0", "1"): ("q0", "1", "D"),
       ("q0", "_"): ("soma", "_", "E"),
       ("soma", "1"): ("soma", "0", "E"),
       ("soma", "0"): ("fim", "1", "E"),
       ("soma", "_"): ("fim", "1", "E"),
   }
   turing(regras, "1011")     # '1100'
   ```
3. Um DFA sempre para depois de ler a cadeia (|w| passos): basta simular. Uma máquina de Turing pode rodar **para sempre**; simulá-la não permite concluir "não aceita" num tempo finito garantido. Decidir isso resolveria o problema da parada.
4. Dado (P, w), construa P' que **ignora a própria entrada** e roda P com w. P' para com a entrada vazia sse P para com w. Um decisor para "para com a entrada vazia" decidiria a parada. Contradição. ∎
5. (a) **Indecidível** (propriedade não trivial da linguagem: alguns programas aceitam "abc", outros não). (b) **Decidível**: é sobre o texto da máquina, conte os estados. (c) **Indecidível** pelo teorema de Rice. (d) **Decidível**: simule 100 passos e veja. Não é uma propriedade da **linguagem** (dois programas com a mesma linguagem podem levar 50 e 500 passos), então Rice não se aplica.
6. Se existisse o detector perfeito D, considere o programa Z: "pergunte a D se Z é vírus (Z conhece o próprio código, o que é sempre possível, pelo teorema da recursão de Kleene); se D disser que sim, termine sem apagar nada; se disser que não, apague arquivos". Z contradiz D nos dois casos. Também segue de Rice: "em algum momento apaga arquivos" é uma propriedade não trivial do comportamento. Antivírus reais trocam perfeição por assinaturas, heurísticas e isolamento, aceitando falsos positivos e falsos negativos.

## Tema 5

1. (a) **Certificado:** a cor de cada vértice. **Verificador:** para cada aresta, confira se as pontas têm cores diferentes: O(V + E). (b) **Certificado:** o subconjunto (índices). **Verificador:** some e compare com o alvo: O(n) somas de números da entrada. (c) **Certificado:** um divisor d com 1 < d < N. **Verificador:** calcule N mod d: polinomial no número de dígitos.
2. O tamanho da entrada é n itens mais o número W escrito em **log W bits**. O(nW) = O(n × 2^(log W)) é **exponencial** no tamanho da entrada. Basta dar W com 100 dígitos para o algoritmo ficar inviável. A mochila é NP-completa no sentido "fraco": fácil quando os números são pequenos.
3. Dado (G, k), construa o **complemento** Ḡ (mesmos vértices; arestas exatamente onde G não tem). Um conjunto é clique em G sse é independente em Ḡ. Então "G tem clique de tamanho k?" ⟺ "Ḡ tem independente de tamanho k?". A construção é O(V²). ∎
4. Vértices: C1 = {x, y, ¬z}, C2 = {¬x, ¬y, z}, C3 = {x, ¬y, z}. Arestas entre cláusulas diferentes, exceto contraditórios (x com ¬x, y com ¬y, z com ¬z). Um clique de tamanho 3: **x (de C1), ¬y (de C2), x (de C3)**: x e ¬y não são contraditórios, e x com x também não. Valoração: **x = verdadeiro, y = falso, z qualquer**. Confere: C1 verdadeira por x, C2 por ¬y, C3 por x. (Outro: y de C1, z de C2, z de C3 dá y = V, z = V.)
5. **Não prova que é difícil.** "Meu problema ≤ₚ SAT" mostra que o seu problema **está em NP** (é no máximo tão difícil quanto SAT) e que dá para resolvê-lo com um resolvedor SAT, o que é útil na prática! Para provar que é difícil, a redução teria que ser **de** SAT (ou de outro NP-completo) **para** o seu problema.
6. Cada cláusula (a ∨ b) equivale a ¬a → b e ¬b → a. Monte o **grafo de implicações** com 2n vértices (cada variável e sua negação). Se x e ¬x estão na mesma componente fortemente conexa, x → ... → ¬x → ... → x: x implica a própria negação e vice-versa, insatisfatível. Caso contrário, dá para montar uma valoração: em ordem topológica reversa das componentes, atribua verdadeiro aos literais da componente que vem depois. Componentes fortemente conexas saem em O(V + E) (Tarjan ou Kosaraju), então **2-SAT ∈ P**. Com 3 literais por cláusula, a cláusula não vira implicações simples, e é por isso que 3-SAT é NP-completo.

## Tema 6

1. Seja B ∈ NP com certificados de tamanho p(n) e verificador polinomial V. Algoritmo: para cada um dos 2^(p(n)) certificados possíveis, **um de cada vez**, rode V; se algum for aceito, responda sim. O tempo é exponencial, mas o **espaço** é só o do certificado atual mais o do verificador, ambos polinomiais, porque o espaço é **reaproveitado** entre as tentativas. Logo B ∈ PSPACE.
2. "O primeiro jogador ganha?" é "existe uma jogada minha tal que, para toda resposta do adversário, existe uma jogada minha tal que...". É uma alternância de ∃ e ∀ (como TQBF). Um problema em NP só tem o "existe": um certificado curto. Para uma estratégia vencedora não há, em geral, certificado curto e verificável, porque ela precisa responder a todas as jogadas do adversário.
3. Calculando a probabilidade binomial exata de a maioria errar: são necessárias **305 repetições** (com número ímpar) para erro abaixo de 10⁻⁹. Chernoff (μ = 2n/3, falha se X ≤ n/2, δ = 1/4) garante erro ≤ e^(−n/48), o que exige n ≈ 1.000: uma cota correta, mas folgada. Em ambos os casos, o número cresce só com o **logaritmo** do erro desejado.
4. Três abordagens: (1) **programação linear inteira** com um resolvedor (HiGHS, OR-Tools, Gurobi), quando o modelo é bem definido e quer-se o ótimo ou um certificado de quão longe se está dele; costuma resolver 500 funcionários em minutos; (2) **resolvedor de restrições** (CP-SAT do OR-Tools), quando há muitas regras lógicas (folgas, sequências proibidas, preferências); (3) **heurística de busca local** (*simulated annealing*, busca tabu), quando o tempo é curto ou o modelo muda muito, aceitando uma boa solução sem garantia. Na prática, começa-se pelo resolvedor e recorre-se a heurísticas se ele não der conta.
5. Para AES, o melhor ataque genérico é buscar a chave, e Grover só dá ganho **quadrático**: uma chave de 256 bits passa a ter "segurança de 128 bits", ainda inviável. Basta dobrar o tamanho da chave. Para RSA, Shor dá ganho **exponencial**: fatora em tempo polinomial, e aumentar a chave não resolve. Por isso é o RSA (e as curvas elípticas) que estão sendo substituídos pela criptografia pós-quântica.

## Projeto da etapa

Pontos de revisão:

- **Formato de arquivo:** inclua o tipo da máquina, o alfabeto e, para máquinas de Turing, o símbolo de branco. Valide o arquivo ao carregar (transições para estados inexistentes, símbolos fora do alfabeto, DFA com transição faltando).
- **Visualização:** Graphviz (`graphviz` no Python) gera o diagrama; destaque o estado atual mudando a cor do nó a cada passo. Para a máquina de Turing, mostre uma janela da fita em volta da cabeça.
- **NFA → DFA:** só gere os subconjuntos **alcançáveis** a partir do inicial (busca em largura), senão o DFA terá 2ⁿ estados sempre.
- **Teste diferencial contra o `re`:** gere expressões aleatórias pequenas (só com união, concatenação e estrela) e cadeias aleatórias; use `re.fullmatch` para comparar. Divergências quase sempre são bugs de ε-fecho.
- **Demonstração de ReDoS:** um gráfico do tempo em função de n, com o `re` subindo como exponencial e o seu motor como uma reta, resume a etapa inteira: teoria de autômatos com consequência prática direta.
