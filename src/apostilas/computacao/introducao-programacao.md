# Introdução à Computação e Programação: Apostila Prática

Roadmap Ciência da Computação · Semanas 7 a 14

## Comece por aqui

Esta é a disciplina que abre todos os cursos de Computação do mundo. No ITA ela se chama CES-10; no MIT, 6.100A; em Harvard, o famoso CS50. O objetivo não é decorar uma linguagem, é aprender a **pensar computacionalmente**: quebrar um problema em partes, descrever a solução como uma sequência precisa de passos, testar e melhorar. Usaremos **Python**, a mesma escolha do MIT e do CS50P, porque a sintaxe sai do caminho e deixa as ideias aparecerem. No fim, um contato rápido com C mostra o que o Python esconde.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CES-10 Introdução à Computação |
| MIT | 6.100A Introduction to CS Programming in Python; 6.1010 Fundamentals of Programming |
| Harvard | CS 50 Introduction to Computer Science; CS 32 Computational Thinking |
| Oxford | Parte de Imperative Programming (1º ano) |

### Como esta apostila funciona

1. Instale Python 3.12 ou mais novo e use o VS Code (ou o terminal + editor da etapa anterior).
2. **Digite** os exemplos, não copie e cole. Mude valores, quebre o código de propósito, leia o erro.
3. Atividades no fim de cada tema; gabarito na outra aba. Guarde tudo no repositório da trilha.

> **Regra dos 20 minutos:** se o programa não faz o que você quer, imprima as variáveis no meio do caminho (`print(f"{x=}")`) e compare com o que você esperava. Quase todo bug está na diferença entre o que você acha que o programa faz e o que ele de fato faz.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 7 | Tema 1: Computação, variáveis e tipos |
| 8 | Tema 2: Controle de fluxo |
| 9 | Tema 3: Funções e abstração |
| 10 | Tema 4: Estruturas de dados nativas |
| 11 | Tema 5: Recursão |
| 12 | Tema 6: Arquivos, exceções e objetos |
| 13 | Tema 7: Eficiência |
| 14 | Tema 8: Simulação, dados e um pouco de C + projeto |

## Tema 1: Computação, variáveis e tipos

**Objetivo:** entender o que é um algoritmo e escrever os primeiros programas com variáveis, tipos e expressões.

### 1.1 O que é computação

Computação é **processar informação seguindo regras precisas**. Um computador sabe fazer pouquíssimas coisas (somar, comparar, guardar e buscar números na memória, decidir o próximo passo), mas faz bilhões delas por segundo, sem errar e sem cansar. Toda a complexidade vem de **combinar** essas operações simples.

Dois tipos de conhecimento:

- **Declarativo:** o que é verdade. "A raiz quadrada de x é o número y tal que y × y = x."
- **Imperativo:** como fazer. "Chute um palpite g; enquanto g × g não estiver perto de x, troque g pela média entre g e x/g."

Programar é transformar conhecimento declarativo em imperativo.

### 1.2 Algoritmos

Um **algoritmo** é uma sequência finita de passos precisos que resolve um problema. Precisa ser:

- **Preciso:** sem ambiguidade ("adicione sal a gosto" não serve).
- **Finito:** termina.
- **Correto:** dá a resposta certa para toda entrada válida.

Exemplo, o método acima para raiz quadrada (método de Herão, de quase 2.000 anos):

```python
x = 25
g = x / 2
while abs(g * g - x) > 0.0001:
    g = (g + x / g) / 2
print(g)   # 5.000000000016778
```

### 1.3 Como um programa executa

O Python lê o seu arquivo de cima para baixo e executa **uma linha de cada vez**. Cada linha muda o **estado** do programa (os valores guardados nas variáveis). Para entender um programa, simule a execução no papel, linha a linha, anotando o valor de cada variável. O site *Python Tutor* desenha isso para você.

O Python é **interpretado**: um programa (o interpretador) lê o seu código e executa. Linguagens como C são **compiladas**: um compilador traduz o código para instruções da máquina antes de rodar. Você vai construir os dois na etapa de Compiladores.

### 1.4 Variáveis e tipos

Uma **variável** é um nome que aponta para um valor. A atribuição `=` não é igualdade matemática: é "calcule o lado direito e dê esse nome ao resultado".

```python
x = 3
x = x + 1      # em matemática seria absurdo; aqui, x passa a valer 4
```

Todo valor tem um **tipo**, que define o que dá para fazer com ele:

| Tipo | Exemplos | Observação |
|---|---|---|
| `int` | `42`, `-7`, `10**100` | Inteiros sem limite de tamanho em Python |
| `float` | `3.14`, `1e-9` | Ponto flutuante: aproximado! |
| `bool` | `True`, `False` | Resultado de comparações |
| `str` | `"olá"`, `'a'` | Texto; imutável |
| `NoneType` | `None` | "Nenhum valor" |

```python
type(3)         # <class 'int'>
int("42")       # converte texto em número: 42
str(42)         # "42"
0.1 + 0.2       # 0.30000000000000004
```

> **Cuidado! Cai na prova:** `0.1 + 0.2 == 0.3` é `False`. Floats são aproximações em base 2 (você verá o porquê em Arquitetura). Compare floats com tolerância: `abs(a - b) < 1e-9` ou `math.isclose(a, b)`. Dinheiro se guarda em centavos inteiros ou com `decimal.Decimal`.

### 1.5 Expressões

Expressões combinam valores com operadores e resultam num valor.

| Operador | Significado | Exemplo |
|---|---|---|
| `+ - *` | Soma, subtração, multiplicação | `2 + 3 * 4` → 14 |
| `/` | Divisão (sempre float) | `7 / 2` → 3.5 |
| `//` | Divisão inteira | `7 // 2` → 3 |
| `%` | Resto | `7 % 2` → 1 |
| `**` | Potência | `2 ** 10` → 1024 |
| `== != < <= > >=` | Comparações | `3 < 5` → True |
| `and or not` | Lógicos | `x > 0 and x < 10` |

`%` é muito mais útil do que parece: `n % 2 == 0` testa paridade, `n % 10` dá o último dígito, `(hora + 5) % 24` dá a hora 5 horas depois.

Entrada e saída:

```python
nome = input("Seu nome: ")          # input sempre devolve str
idade = int(input("Sua idade: "))
print(f"{nome} terá {idade + 10} anos daqui a 10 anos")
```

### Atividades de fixação do Tema 1

1. Escreva um algoritmo em português, preciso o bastante para uma pessoa sem contexto seguir, para achar o maior número de uma lista escrita em cartões.
2. Simule no papel e diga o valor final de `a` e `b`: `a = 5; b = 3; a = a + b; b = a - b; a = a - b`. O que esse trecho faz?
3. Leia um número de segundos e imprima no formato `h:mm:ss` (ex.: 3725 → `1:02:05`). Use `//` e `%`.
4. Por que `int("3.5")` dá erro e `int(3.5)` não? O que cada um devolve?
5. Escreva um programa que lê o valor de uma compra em reais (ex.: `19.90`) e a quantidade, e imprime o total sem erro de arredondamento.

## Tema 2: Controle de fluxo

**Objetivo:** decidir e repetir; depurar programas que fazem as duas coisas.

### 2.1 Condicionais

```python
nota = float(input("Nota: "))
if nota >= 7:
    print("aprovado")
elif nota >= 5:
    print("recuperação")
else:
    print("reprovado")
```

A **indentação** (4 espaços) define o que está dentro do `if`. Só o primeiro ramo verdadeiro executa.

Valores "falsos" em Python: `False`, `0`, `0.0`, `""`, `[]`, `{}`, `None`. Todo o resto é verdadeiro. Por isso `if lista:` testa se a lista não está vazia.

### 2.2 Laços

**`while`** repete enquanto a condição for verdadeira. Use quando não sabe quantas vezes vai repetir:

```python
n = 27
passos = 0
while n != 1:                       # conjectura de Collatz
    n = n // 2 if n % 2 == 0 else 3 * n + 1
    passos += 1
print(passos)                        # 111
```

**`for`** percorre uma sequência. Use quando sabe o que vai percorrer:

```python
for i in range(5):            # 0, 1, 2, 3, 4
    print(i)
for letra in "ITA":
    print(letra)
for i, nome in enumerate(["Ana", "Bia"]):
    print(i, nome)
```

`break` sai do laço; `continue` pula para a próxima volta.

> **Cuidado! Cai na prova:** `range(a, b)` vai de `a` até `b − 1`. O erro "um a mais ou um a menos" (*off-by-one*) é o bug mais comum da história da programação. Teste sempre os limites.

### 2.3 Depuração

Bugs mais comuns no início: laço infinito (a condição nunca vira falsa), off-by-one, comparar com `=` em vez de `==`, esquecer de converter o `input`, indentação errada.

Ferramentas:

- **`print` estratégico:** `print(f"{i=} {soma=}")` mostra nome e valor.
- **Depurador do VS Code:** clique na margem para criar um ponto de parada, rode com F5, avance linha a linha (F10) e observe as variáveis.
- **`assert`:** `assert soma >= 0, "soma ficou negativa"` para o programa se uma suposição for violada.

### 2.4 Pensamento computacional

Quatro hábitos que valem para qualquer problema:

1. **Decomposição:** quebrar em partes menores ("ler os dados", "calcular", "mostrar").
2. **Reconhecimento de padrões:** "isso é parecido com um problema que já resolvi".
3. **Abstração:** ignorar detalhes que não importam (para calcular a rota, a cor do carro não interessa).
4. **Algoritmo:** escrever os passos de forma precisa.

**Busca exaustiva** (força bruta) é o primeiro algoritmo de todos: testar todas as possibilidades. Funciona quando são poucas.

```python
# raiz cúbica inteira por força bruta
x = 27
for r in range(abs(x) + 1):
    if r ** 3 >= abs(x):
        break
print(r if r ** 3 == abs(x) else "não é cubo perfeito")
```

**Bisseção** é muito mais rápida: chute no meio de um intervalo e descarte a metade errada.

```python
x, eps = 27.0, 0.001
baixo, alto = 0.0, max(1.0, x)
g = (baixo + alto) / 2
while abs(g ** 3 - x) >= eps:
    if g ** 3 < x:
        baixo = g
    else:
        alto = g
    g = (baixo + alto) / 2
print(g)
```

Cada volta corta o intervalo pela metade: a mesma ideia da busca binária e do `git bisect`.

### Atividades de fixação do Tema 2

1. Leia três números e imprima-os em ordem crescente usando apenas `if` (sem `sort`).
2. Imprima a tabuada de 1 a 10 em forma de tabela usando dois `for`.
3. Leia números até o usuário digitar 0 e imprima a média (cuidado com o caso de nenhum número).
4. Diga se um número é primo testando divisores. Por que basta testar até √n?
5. Ache, por bisseção, a raiz quadrada de 2 com precisão de 10⁻⁶. Conte quantas voltas foram necessárias.
6. Este código deveria somar de 1 a n, mas está errado. Ache e corrija o bug:
   ```python
   n = int(input())
   soma = 0
   i = 1
   while i < n:
       soma += i
   print(soma)
   ```

## Tema 3: Funções e abstração

**Objetivo:** organizar programas em funções reutilizáveis, entender escopo e testar.

### 3.1 Funções

```python
def area_circulo(raio: float) -> float:
    """Devolve a área de um círculo de raio dado (raio >= 0)."""
    return 3.141592653589793 * raio ** 2

print(area_circulo(2))
```

- **Parâmetros** são os nomes na definição; **argumentos** são os valores na chamada.
- `return` devolve um valor e encerra a função. Sem `return`, a função devolve `None`.
- A **docstring** explica o que a função faz, o que recebe e o que devolve. As anotações `: float` e `-> float` documentam os tipos (o Python não obriga, mas ferramentas como o `mypy` verificam).

Parâmetros com valor padrão e por nome:

```python
def saudacao(nome, cumprimento="Olá"):
    return f"{cumprimento}, {nome}!"

saudacao("Ana")                         # Olá, Ana!
saudacao("Ana", cumprimento="Bom dia")  # Bom dia, Ana!
```

### 3.2 Escopo

Variáveis criadas dentro de uma função são **locais**: só existem durante a chamada.

```python
x = 10
def f():
    x = 99        # cria um x local, não mexe no global
    return x
print(f(), x)     # 99 10
```

Cada chamada ganha um **quadro** (*frame*) novo na memória com as suas variáveis. É por isso que funções podem se chamar sem confusão, e é a base da recursão (Tema 5).

> **Cuidado! Cai na prova:** evite modificar variáveis globais dentro de funções (`global x`). Funções que só dependem dos parâmetros e só se comunicam pelo `return` são muito mais fáceis de testar e entender.

### 3.3 Decomposição e abstração

Uma boa função faz **uma coisa** e tem um nome que diz o quê. Quem usa a função só precisa conhecer a **especificação** (o que entra, o que sai), não a implementação. Isso é **abstração**: você usa `sorted()` sem saber que algoritmo ele usa por dentro.

Compare:

```python
# tudo misturado
nums = [int(x) for x in input().split()]
m = sum(nums) / len(nums)
v = sum((x - m) ** 2 for x in nums) / len(nums)
print(v ** 0.5)

# decomposto
def media(xs):
    return sum(xs) / len(xs)

def desvio_padrao(xs):
    m = media(xs)
    return (sum((x - m) ** 2 for x in xs) / len(xs)) ** 0.5

nums = [int(x) for x in input().split()]
print(desvio_padrao(nums))
```

A segunda versão pode ser testada por partes e reaproveitada.

Funções também são valores: podem ser passadas como argumento.

```python
def aplicar_duas_vezes(f, x):
    return f(f(x))

aplicar_duas_vezes(lambda n: n * 3, 2)    # 18
```

Essa ideia ganha uma etapa inteira em Programação Funcional.

### 3.4 Testes com assert

Teste as funções com casos escolhidos: típicos, de borda e de erro.

```python
def eh_bissexto(ano: int) -> bool:
    return ano % 4 == 0 and (ano % 100 != 0 or ano % 400 == 0)

assert eh_bissexto(2024)
assert not eh_bissexto(2023)
assert not eh_bissexto(1900)     # borda: divisível por 100
assert eh_bissexto(2000)         # borda: divisível por 400
print("todos os testes passaram")
```

Escreva os testes **antes** ou **junto** com a função: eles obrigam você a entender o que a função deve fazer. Para projetos maiores, use o `pytest` (basta criar funções `test_*` e rodar `pytest`).

### Atividades de fixação do Tema 3

1. Escreva `eh_primo(n)` e `primos_ate(n)` (que usa `eh_primo`). Teste com `assert` incluindo n = 0, 1, 2.
2. Escreva `mdc(a, b)` pelo algoritmo de Euclides (troque (a, b) por (b, a % b) até b ser 0) e teste.
3. Qual a saída? Explique cada linha.
   ```python
   def f(x):
       x = x * 2
       return x
   x = 5
   y = f(x)
   print(x, y)
   ```
4. Escreva `raiz(x, metodo)` onde `metodo` é uma função; passe a sua bisseção e o método de Herão do Tema 1 e compare quantas voltas cada um precisa.
5. Pegue um programa seu do Tema 2 e decomponha em pelo menos três funções testáveis.

## Tema 4: Estruturas de dados nativas

**Objetivo:** usar listas, tuplas, dicionários e conjuntos, e entender mutabilidade e aliasing.

### 4.1 Listas e tuplas

**Lista:** sequência **mutável** e ordenada.

```python
notas = [7.5, 9.0, 6.0]
notas.append(8.0)          # adiciona no fim
notas[0] = 8.5             # muda um elemento
notas[-1]                  # último: 8.0
notas[1:3]                 # fatia: [9.0, 6.0]
len(notas), max(notas), sorted(notas)
quadrados = [x ** 2 for x in range(10) if x % 2 == 0]   # compreensão de lista
```

**Tupla:** sequência **imutável**. Boa para agrupar valores que andam juntos.

```python
ponto = (3, 4)
x, y = ponto               # desempacotamento
def min_max(xs):
    return min(xs), max(xs)   # devolve uma tupla
```

**Strings** também são sequências imutáveis: `"banana"[1:4]` dá `"ana"`; `"a,b,c".split(",")` dá `["a", "b", "c"]`; `"-".join(["a", "b"])` dá `"a-b"`.

### 4.2 Dicionários

Mapeiam **chaves** em **valores**. Busca por chave é muito rápida (você vai entender o porquê em Tabelas Hash).

```python
idade = {"ana": 20, "bia": 22}
idade["caio"] = 19           # insere
idade["ana"] += 1            # atualiza
"bia" in idade               # True
idade.get("zé", 0)           # 0 se não existir
for nome, i in idade.items():
    print(nome, i)
```

Padrão clássico, contar frequências:

```python
contagem = {}
for palavra in texto.split():
    contagem[palavra] = contagem.get(palavra, 0) + 1
```

(O módulo `collections` tem `Counter`, que faz isso numa linha.)

Chaves precisam ser **imutáveis** (números, strings, tuplas). Listas não podem ser chaves.

### 4.3 Conjuntos

Coleção **sem repetição** e sem ordem. Teste de pertinência rápido.

```python
vistos = set()
a = {1, 2, 3}
b = {2, 3, 4}
a | b, a & b, a - b          # união, interseção, diferença
len(set([1, 1, 2, 2, 3]))    # 3: remove duplicatas
```

| Estrutura | Ordenada | Mutável | Repetição | Uso típico |
|---|---|---|---|---|
| list | Sim | Sim | Sim | Sequência de itens |
| tuple | Sim | Não | Sim | Registro fixo, chave de dict |
| dict | Por inserção | Sim | Chaves únicas | Busca por chave |
| set | Não | Sim | Não | Pertinência, remover duplicatas |

### 4.4 Mutabilidade e aliasing

Variáveis em Python são **etiquetas** coladas em objetos. Duas etiquetas podem apontar para o **mesmo** objeto: isso é **aliasing**.

```python
a = [1, 2, 3]
b = a            # b é outro nome para a MESMA lista
b.append(4)
print(a)         # [1, 2, 3, 4]  ← surpresa!

c = a.copy()     # ou list(a) ou a[:]: lista nova
c.append(5)
print(a)         # [1, 2, 3, 4]
```

`a is b` testa se é o mesmo objeto; `a == b` testa se têm o mesmo conteúdo.

Funções recebem referências: se a função modificar uma lista recebida, quem chamou vê a mudança.

```python
def zera(xs):
    for i in range(len(xs)):
        xs[i] = 0
v = [1, 2]
zera(v)
print(v)         # [0, 0]
```

> **Cuidado! Cai na entrevista:** nunca use lista como valor padrão de parâmetro: `def f(x, acc=[])`. A lista é criada **uma vez** e compartilhada entre chamadas. Use `acc=None` e crie dentro. E cuidado com `[[0] * 3] * 3`: são três referências para a **mesma** linha. Use `[[0] * 3 for _ in range(3)]`.

### Atividades de fixação do Tema 4

1. Dada uma lista de notas, devolva a lista das notas acima da média (com compreensão de lista).
2. Conte a frequência de cada palavra de um texto e imprima as 10 mais comuns.
3. Dadas duas listas de alunos (dos que fizeram a prova 1 e a prova 2), descubra quem fez as duas, quem fez só uma e quem faltou em alguma (dada a lista da turma).
4. Escreva `transposta(m)` para uma matriz representada como lista de listas, sem modificar a original.
5. Explique a saída:
   ```python
   m = [[0] * 2] * 2
   m[0][0] = 1
   print(m)
   ```
6. Agrupe palavras que são anagramas entre si (ex.: "amor", "roma", "mora", "ramo"). Dica: use um dicionário cuja chave é a palavra com as letras ordenadas.

## Tema 5: Recursão

**Objetivo:** resolver problemas definindo-os em termos de versões menores de si mesmos.

### 5.1 Caso base e passo recursivo

Uma função recursiva chama a si mesma com uma entrada **menor**, até chegar num caso **simples o bastante** para responder direto.

```python
def fatorial(n: int) -> int:
    if n == 0:               # caso base
        return 1
    return n * fatorial(n - 1)   # passo recursivo
```

Receita:

1. Qual o caso mais simples? Responda direto (caso base).
2. Supondo que a função já funciona para entradas menores (o "salto de fé"), como usar essa resposta para resolver a entrada atual?
3. Garanta que toda chamada se aproxima do caso base.

Essa receita é exatamente a **indução matemática**, que você verá formalmente em Matemática Discreta.

Mais exemplos:

```python
def soma_digitos(n):
    return n if n < 10 else n % 10 + soma_digitos(n // 10)

def eh_palindromo(s):
    if len(s) <= 1:
        return True
    return s[0] == s[-1] and eh_palindromo(s[1:-1])
```

### 5.2 Pilha de chamadas

Cada chamada cria um quadro novo na **pilha de chamadas** (*call stack*). `fatorial(3)`:

```
fatorial(3) espera fatorial(2)
  fatorial(2) espera fatorial(1)
    fatorial(1) espera fatorial(0)
      fatorial(0) devolve 1
    fatorial(1) devolve 1 × 1 = 1
  fatorial(2) devolve 2 × 1 = 2
fatorial(3) devolve 3 × 2 = 6
```

Sem caso base (ou com um passo que não se aproxima dele), a pilha cresce até estourar: `RecursionError: maximum recursion depth exceeded` (o limite padrão do Python é cerca de 1.000 chamadas).

**Torres de Hanói**, o exemplo clássico onde a recursão é muito mais natural que um laço:

```python
def hanoi(n, origem, destino, auxiliar):
    if n == 0:
        return
    hanoi(n - 1, origem, auxiliar, destino)   # tira os n−1 de cima do caminho
    print(f"mova disco {n} de {origem} para {destino}")
    hanoi(n - 1, auxiliar, destino, origem)   # coloca-os de volta por cima
```

São 2ⁿ − 1 movimentos.

### 5.3 Recursão vs iteração

Todo laço pode virar recursão e vice-versa. Quando usar cada um:

- **Recursão** é natural para estruturas recursivas (árvores, expressões, pastas dentro de pastas) e para "dividir e conquistar".
- **Iteração** é mais eficiente em Python (sem custo de quadro, sem limite de profundidade) para processos lineares.

Cuidado com recursão que **refaz trabalho**:

```python
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
```

`fib(40)` leva segundos, porque `fib(38)` é calculado 2 vezes, `fib(37)` 3 vezes, e assim por diante: o número de chamadas cresce exponencialmente. Solução: **memoização**, guardar resultados já calculados.

```python
memo = {}
def fib(n):
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
```

(Ou use `@functools.cache`.) Essa ideia vira a **programação dinâmica** em Algoritmos.

### Atividades de fixação do Tema 5

1. Escreva recursivamente: `potencia(b, e)`, `soma(lista)` e `inverte(s)` (inverter uma string).
2. Escreva `potencia_rapida(b, e)` usando bᵉ = (b^(e/2))² quando e é par. Quantas chamadas faz para e = 1.000 em comparação com a versão anterior?
3. Desenhe a pilha de chamadas de `soma_digitos(472)`.
4. Rode `hanoi(3, "A", "C", "B")` e confira que são 7 movimentos. Prove (informalmente) por que são 2ⁿ − 1.
5. Conte quantas chamadas `fib(n)` (sem memo) faz para n = 10, 20, 25. Depois compare com a versão memoizada.
6. Escreva `achata(lista)` que transforma `[1, [2, [3, 4]], 5]` em `[1, 2, 3, 4, 5]`. Use `isinstance(x, list)`.
7. Liste todos os subconjuntos de uma lista recursivamente (cada elemento entra ou não entra).

## Tema 6: Arquivos, exceções e objetos

**Objetivo:** ler e gravar arquivos, tratar erros, organizar código em módulos e criar os primeiros tipos próprios.

### 6.1 Arquivos

```python
with open("notas.txt", "w", encoding="utf-8") as f:
    f.write("Ana,8.5\nBia,9.0\n")

with open("notas.txt", encoding="utf-8") as f:
    for linha in f:
        nome, nota = linha.strip().split(",")
        print(nome, float(nota))
```

O `with` garante que o arquivo seja fechado mesmo se der erro. Modos: `"r"` ler, `"w"` escrever (apaga o conteúdo!), `"a"` acrescentar.

Para formatos comuns, use as bibliotecas: `csv` para planilhas, `json` para dados estruturados.

```python
import json
dados = {"alunos": [{"nome": "Ana", "nota": 8.5}]}
with open("dados.json", "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)
```

### 6.2 Exceções

Erros em tempo de execução levantam **exceções**. Você pode capturá-las:

```python
def ler_inteiro(msg):
    while True:
        try:
            return int(input(msg))
        except ValueError:
            print("Digite um número inteiro.")
```

```python
try:
    with open("config.json") as f:
        cfg = json.load(f)
except FileNotFoundError:
    cfg = {}
```

E levantar as suas, quando a entrada viola a especificação:

```python
def media(xs):
    if not xs:
        raise ValueError("media() de lista vazia")
    return sum(xs) / len(xs)
```

> **Cuidado! Cai na prova:** nunca escreva `except:` sozinho (ou `except Exception: pass`). Isso engole **todos** os erros, inclusive bugs seus, e o programa segue errado em silêncio. Capture só o que você sabe tratar.

### 6.3 Módulos

Um **módulo** é um arquivo `.py`. Separe o código por assunto e importe:

```python
# geometria.py
def area_circulo(r): ...

# main.py
from geometria import area_circulo
import math, random
```

O bloco abaixo só roda quando o arquivo é executado diretamente (não quando é importado). Ponha ali os testes rápidos:

```python
if __name__ == "__main__":
    assert area_circulo(1) > 3.14
```

Bibliotecas de terceiros se instalam com `pip`, de preferência num **ambiente virtual** por projeto:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install matplotlib
```

### 6.4 Classes e objetos

Uma **classe** define um novo tipo, juntando **dados** (atributos) e **comportamento** (métodos).

```python
class ContaBancaria:
    def __init__(self, titular: str, saldo: int = 0):
        self.titular = titular
        self.saldo = saldo           # em centavos

    def depositar(self, valor: int) -> None:
        if valor <= 0:
            raise ValueError("depósito precisa ser positivo")
        self.saldo += valor

    def sacar(self, valor: int) -> None:
        if valor > self.saldo:
            raise ValueError("saldo insuficiente")
        self.saldo -= valor

    def __str__(self):
        return f"{self.titular}: R$ {self.saldo / 100:.2f}"

c = ContaBancaria("Ana")
c.depositar(10_000)
c.sacar(2_550)
print(c)            # Ana: R$ 74.50
```

- `__init__` inicializa o objeto; `self` é o próprio objeto.
- Cada objeto (instância) tem seus próprios atributos.
- Métodos especiais como `__str__`, `__eq__` e `__lt__` integram a classe com o Python (`print`, `==`, `sorted`).

A classe garante que o saldo nunca fique negativo: quem usa não precisa lembrar dessa regra. Isso é **encapsulamento**, que você aprofunda na etapa de Orientação a Objetos.

### Atividades de fixação do Tema 6

1. Leia um CSV com colunas `nome,nota1,nota2` e grave outro com a média de cada aluno e a situação (aprovado se média ≥ 7).
2. Torne o programa anterior robusto: linhas com nota inválida devem ser relatadas (número da linha) e puladas, sem derrubar o programa.
3. Escreva uma classe `Fracao` com numerador e denominador, sempre simplificada (use o `mdc`), com `__add__`, `__mul__`, `__eq__` e `__str__`. Denominador zero deve levantar exceção.
4. Separe a `Fracao` num módulo `fracao.py` com testes no bloco `if __name__ == "__main__"`.
5. Qual a diferença entre `except ValueError` e `except Exception`? Dê um exemplo em que o segundo esconde um bug.

## Tema 7: Eficiência

**Objetivo:** estimar quanto tempo um programa leva conforme a entrada cresce, e conhecer busca e ordenação.

### 7.1 Contando operações

Medir tempo com relógio depende da máquina, do que mais está rodando, da linguagem. Por isso, contamos **operações básicas** em função do **tamanho da entrada n**.

```python
def soma(xs):              # n = len(xs)
    total = 0              # 1 operação
    for x in xs:           # n voltas
        total += x         # 1 operação por volta
    return total           # total ≈ n + 2 operações
```

```python
def tem_duplicata(xs):
    for i in range(len(xs)):
        for j in range(i + 1, len(xs)):
            if xs[i] == xs[j]:
                return True
    return False           # pior caso: n(n − 1)/2 comparações
```

Olhamos o **pior caso** (garantia) e o comportamento quando **n é grande**.

### 7.2 Big O intuitivo

**Big O** descreve como o custo cresce, ignorando constantes e termos menores. n(n − 1)/2 = n²/2 − n/2 vira **O(n²)**.

| Classe | Nome | Exemplo | n = 10⁶ |
|---|---|---|---|
| O(1) | Constante | Acessar `xs[i]`, buscar em dict | instantâneo |
| O(log n) | Logarítmica | Busca binária | ~20 passos |
| O(n) | Linear | Percorrer a lista | 10⁶ |
| O(n log n) | Linearítmica | Boa ordenação (`sorted`) | ~2 × 10⁷ |
| O(n²) | Quadrática | Comparar todos os pares | 10¹² (horas) |
| O(2ⁿ) | Exponencial | Testar todos os subconjuntos | impossível |

Regras práticas: laços em sequência **somam**; laços aninhados **multiplicam**; operações que cortam o problema ao meio dão **log n**.

`tem_duplicata` pode virar O(n) com um conjunto:

```python
def tem_duplicata(xs):
    vistos = set()
    for x in xs:
        if x in vistos:      # O(1) em média
            return True
        vistos.add(x)
    return False
```

> **Cuidado! Cai na entrevista:** `x in lista` é O(n) (percorre a lista); `x in conjunto` e `x in dicionario` são O(1) em média. Trocar lista por conjunto é a otimização mais comum em entrevistas.

### 7.3 Busca linear e binária

**Busca linear:** olha um por um. O(n). Funciona em qualquer lista.

**Busca binária:** só em lista **ordenada**. Compara com o meio e descarta metade. O(log n).

```python
def busca_binaria(xs, alvo):
    baixo, alto = 0, len(xs) - 1
    while baixo <= alto:
        meio = (baixo + alto) // 2
        if xs[meio] == alvo:
            return meio
        if xs[meio] < alvo:
            baixo = meio + 1
        else:
            alto = meio - 1
    return -1
```

Parece simples, mas é famosa por ter bugs de limite: teste com lista vazia, um elemento, alvo no início, no fim e ausente.

### 7.4 Ordenação simples

**Ordenação por seleção:** ache o menor, coloque na primeira posição; repita no resto.

```python
def selecao(xs):
    xs = xs.copy()
    for i in range(len(xs)):
        menor = min(range(i, len(xs)), key=lambda k: xs[k])
        xs[i], xs[menor] = xs[menor], xs[i]
    return xs
```

**Ordenação por inserção:** como ordenar cartas na mão; cada novo elemento é inserido no lugar certo da parte já ordenada.

```python
def insercao(xs):
    xs = xs.copy()
    for i in range(1, len(xs)):
        atual, j = xs[i], i - 1
        while j >= 0 and xs[j] > atual:
            xs[j + 1] = xs[j]
            j -= 1
        xs[j + 1] = atual
    return xs
```

Ambas são O(n²). A inserção é O(n) quando a lista já está quase ordenada. O `sorted()` do Python usa o **Timsort**, O(n log n), que mistura inserção e merge sort. Você verá merge sort, quicksort e o limite teórico em Estruturas de Dados.

### Atividades de fixação do Tema 7

1. Dê o Big O de cada trecho:
   ```python
   # (a)
   for i in range(n): print(i)
   for j in range(n): print(j)
   # (b)
   for i in range(n):
       for j in range(n): print(i, j)
   # (c)
   i = n
   while i > 1: i //= 2
   # (d)
   for i in range(n):
       j = 1
       while j < n: j *= 2
   ```
2. Meça com `time.perf_counter()` o tempo da busca linear e da binária em listas de 10³, 10⁵ e 10⁷ elementos. O resultado bate com a teoria?
3. Escreva a busca binária recursiva.
4. Conte as comparações que seleção e inserção fazem numa lista já ordenada, numa invertida e numa aleatória, com n = 1.000.
5. Dada uma lista de números e um valor alvo, diga se existem dois números que somam o alvo. Faça em O(n²) e depois em O(n).

## Tema 8: Simulação, dados e um pouco de C

**Objetivo:** usar aleatoriedade e simulação para responder perguntas, visualizar dados e ver como é programar mais perto da máquina.

### 8.1 Aleatoriedade

```python
import random
random.seed(42)                 # resultados reprodutíveis
random.random()                 # float em [0, 1)
random.randint(1, 6)            # dado
random.choice(["cara", "coroa"])
random.shuffle(baralho)
random.sample(range(60), 6)     # 6 números sem repetição
```

Computadores geram números **pseudoaleatórios**: uma fórmula determinística que parece aleatória. Com a mesma *seed*, a mesma sequência. Para criptografia, use o módulo `secrets`, não o `random`.

### 8.2 Monte Carlo

Quando a conta exata é difícil, **simule muitas vezes e conte**.

Qual a chance de, numa sala com 23 pessoas, duas fazerem aniversário no mesmo dia?

```python
def mesmo_aniversario(pessoas, tentativas=100_000):
    sucessos = 0
    for _ in range(tentativas):
        dias = [random.randint(1, 365) for _ in range(pessoas)]
        if len(set(dias)) < pessoas:
            sucessos += 1
    return sucessos / tentativas

print(mesmo_aniversario(23))   # ≈ 0.507
```

Estimando π: jogue pontos aleatórios no quadrado [0, 1] × [0, 1]; a fração que cai dentro do quarto de círculo x² + y² ≤ 1 tende a π/4.

Mais tentativas, mais precisão, mas devagar: o erro cai com 1/√(tentativas). Para ganhar um dígito, multiplique as tentativas por 100. Você entenderá o porquê em Probabilidade (teorema central do limite).

### 8.3 Gráficos

```python
import matplotlib.pyplot as plt

ns = range(2, 61)
probs = [mesmo_aniversario(n, 5_000) for n in ns]
plt.plot(ns, probs, marker=".")
plt.axhline(0.5, linestyle="--")
plt.xlabel("pessoas na sala")
plt.ylabel("P(aniversário repetido)")
plt.title("Paradoxo do aniversário")
plt.show()
```

Um gráfico bem feito tem título, eixos com nome e unidade, e mostra uma comparação clara. Use gráficos para **conferir** os seus programas: um resultado que não faz sentido no gráfico costuma ser bug.

### 8.4 Primeiro contato com C

Python esconde muita coisa. Em C, você vê a máquina mais de perto:

```c
#include <stdio.h>

int main(void) {
    int n;
    printf("n: ");
    scanf("%d", &n);
    long soma = 0;
    for (int i = 1; i <= n; i++) {
        soma += i;
    }
    printf("soma de 1 a %d = %ld\n", n, soma);
    return 0;
}
```

```bash
gcc -Wall -o soma soma.c && ./soma
```

Diferenças que importam:

| | Python | C |
|---|---|---|
| Execução | Interpretado | Compilado para código de máquina |
| Tipos | Verificados ao rodar | Declarados e verificados ao compilar |
| Inteiros | Sem limite | Tamanho fixo (`int` costuma ter 32 bits: estoura!) |
| Memória | Automática (coletor de lixo) | Você aloca e libera |
| Velocidade | Mais lento | Dezenas de vezes mais rápido em laços |
| Erros | Exceção com mensagem | Muitas vezes comportamento indefinido, sem aviso |

Experimente: some de 1 a 100.000 com `int soma` em vez de `long`. O resultado sai errado (estouro), sem nenhum aviso. Você vai entender o porquê em Arquitetura e dominar C em Sistemas Operacionais.

### Atividades de fixação do Tema 8

1. Estime π por Monte Carlo com 10³, 10⁵ e 10⁷ pontos. Quantos dígitos corretos você obtém em cada caso?
2. Simule o problema de Monty Hall (três portas, um carro, o apresentador abre uma porta vazia, você troca ou não). Qual estratégia ganha mais?
3. Simule 1.000 lançamentos de dois dados e faça o histograma das somas. Que soma é mais comum? Por quê?
4. Reescreva em C o programa que testa se um número é primo. Compare o tempo com o Python para contar os primos até 10⁶.
5. Em C, faça `int x = 2147483647; x = x + 1; printf("%d\n", x);`. O que aparece? Pesquise "integer overflow".

## Projeto da etapa

Faça os dois:

**1. Jogo de terminal (campo minado ou forca):**

- Código decomposto em funções pequenas e testadas (ex.: `gerar_tabuleiro`, `contar_minas_vizinhas`, `revelar`, `venceu`).
- No campo minado, revelar uma casa vazia abre as vizinhas recursivamente.
- Entrada robusta: comandos inválidos não derrubam o jogo.
- Placar salvo em arquivo JSON.

**2. Simulador (fila de banco ou epidemia):**

- Fila de banco: clientes chegam aleatoriamente, caixas atendem com tempo aleatório; meça o tempo médio de espera com 1, 2 e 3 caixas e faça um gráfico.
- Epidemia: pessoas numa grade, cada infectado contamina vizinhos com probabilidade p; mostre a curva de infectados ao longo do tempo para valores diferentes de p.
- Use classes para as entidades (Cliente, Caixa ou Pessoa) e `random.seed` para reprodutibilidade.

Os dois com README, testes e commits atômicos no repositório da trilha.

## Para ir além

- **CS50x** (Harvard, gratuito no edX e no YouTube, com legendas em português): a melhor introdução do mundo, passa por C, Python, SQL e web.
- **CS50P** (Harvard): introdução focada em Python.
- **MIT 6.100A** no OpenCourseWare: aulas, notas e listas do MIT.
- *Think Python* (Allen Downey, gratuito online).
- **Python Tutor** (pythontutor.com): visualiza a execução, a pilha e o aliasing.

## Resumão

- Algoritmo: passos precisos, finitos e corretos. Programa: algoritmo numa linguagem.
- Variável é etiqueta; `=` é atribuição. Float é aproximado: compare com tolerância.
- `if/elif/else` decide; `while` repete com condição; `for` percorre. Teste os limites (off-by-one).
- Funções: uma coisa, bem nomeada, especificada e testada. Variáveis locais vivem num quadro próprio.
- list (mutável), tuple (imutável), dict (chave → valor, O(1)), set (sem repetição, O(1)).
- Aliasing: duas variáveis, um objeto. Copie quando precisar de independência.
- Recursão: caso base + passo menor. Cuidado com trabalho repetido: memoize.
- Capture só as exceções que sabe tratar. `with` para arquivos.
- Big O: laços aninhados multiplicam; cortar ao meio dá log n. Busca binária O(log n) exige lista ordenada.
- Monte Carlo: simule e conte. Erro cai com 1/√n.
- C: compilado, tipos fixos, memória manual e sem rede de proteção.
