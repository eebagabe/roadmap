# Gabarito: Introdução à Computação e Programação

Abra só depois de tentar.

## Tema 1

1. Uma versão possível: "Pegue o primeiro cartão e coloque-o na mão; chame-o de *maior*. Para cada cartão restante, um por vez: se o número dele for maior que o de *maior*, troque o cartão da mão por ele. Quando acabarem os cartões, o cartão na mão é a resposta." Repare: precisa dizer o que fazer com a lista vazia (não há maior) para ser completo.
2. a = 5 + 3 = 8; b = 8 − 3 = 5; a = 8 − 5 = 3. Final: **a = 3, b = 5**. O trecho **troca os valores** de a e b sem variável auxiliar. Em Python, o jeito idiomático é `a, b = b, a`.
3. ```python
   s = int(input())
   h = s // 3600
   m = (s % 3600) // 60
   seg = s % 60
   print(f"{h}:{m:02d}:{seg:02d}")
   ```
   `:02d` completa com zero à esquerda.
4. `int("3.5")` tenta interpretar o **texto** como inteiro e "3.5" não é um inteiro válido: `ValueError`. `int(3.5)` converte um **float** e trunca a parte decimal: devolve **3**. Para converter "3.5", use `int(float("3.5"))`.
5. ```python
   from decimal import Decimal
   preco = Decimal(input("preço: "))      # "19.90" vira exatamente 19,90
   qtd = int(input("quantidade: "))
   print(f"total: R$ {preco * qtd:.2f}")
   ```
   Outra opção é trabalhar em centavos: `centavos = round(float(texto) * 100)` e fazer contas só com inteiros.

## Tema 2

1. ```python
   a, b, c = (float(input()) for _ in range(3))
   if a > b: a, b = b, a
   if b > c: b, c = c, b
   if a > b: a, b = b, a
   print(a, b, c)
   ```
   Três comparações e trocas bastam (é uma pequena rede de ordenação).
2. ```python
   for i in range(1, 11):
       for j in range(1, 11):
           print(f"{i * j:4d}", end="")
       print()
   ```
3. ```python
   soma, qtd = 0, 0
   while True:
       x = float(input())
       if x == 0:
           break
       soma += x
       qtd += 1
   print(soma / qtd if qtd > 0 else "nenhum número digitado")
   ```
4. ```python
   def eh_primo(n):
       if n < 2:
           return False
       d = 2
       while d * d <= n:
           if n % d == 0:
               return False
           d += 1
       return True
   ```
   Se n = a × b com a ≤ b, então a × a ≤ a × b = n, ou seja, a ≤ √n. Se n tiver algum divisor, terá um divisor **menor ou igual a √n**. Não achou nenhum até ali, não há.
5. ```python
   x, eps = 2.0, 1e-6
   baixo, alto = 0.0, 2.0
   g, voltas = 1.0, 0
   while abs(g * g - x) >= eps:
       if g * g < x: baixo = g
       else: alto = g
       g = (baixo + alto) / 2
       voltas += 1
   print(g, voltas)      # 1.41421318..., cerca de 20 voltas
   ```
   O intervalo começa com tamanho 2 e cai pela metade a cada volta; em ~20 voltas fica da ordem de 10⁻⁶.
6. Dois bugs: `i` **nunca aumenta** (laço infinito) e `i < n` deixa **n de fora**. Corrigido:
   ```python
   while i <= n:
       soma += i
       i += 1
   ```

## Tema 3

1. ```python
   def eh_primo(n):  # como no Tema 2
       ...
   def primos_ate(n):
       return [k for k in range(2, n + 1) if eh_primo(k)]

   assert not eh_primo(0) and not eh_primo(1) and eh_primo(2)
   assert primos_ate(1) == []
   assert primos_ate(20) == [2, 3, 5, 7, 11, 13, 17, 19]
   ```
2. ```python
   def mdc(a, b):
       while b != 0:
           a, b = b, a % b
       return a

   assert mdc(12, 18) == 6
   assert mdc(17, 5) == 1
   assert mdc(0, 7) == 7
   ```
3. Saída: **`5 10`**. Dentro de `f`, `x` é um parâmetro local; `x = x * 2` cria um novo valor para o `x` **local** (10) e o devolve. O `x` global continua 5. `y` recebe 10.
4. ```python
   def bissecao(x, eps=1e-9):
       baixo, alto, voltas = 0.0, max(1.0, x), 0
       g = (baixo + alto) / 2
       while abs(g * g - x) >= eps:
           if g * g < x: baixo = g
           else: alto = g
           g = (baixo + alto) / 2
           voltas += 1
       return g, voltas

   def herao(x, eps=1e-9):
       g, voltas = x / 2 or 1.0, 0
       while abs(g * g - x) >= eps:
           g = (g + x / g) / 2
           voltas += 1
       return g, voltas

   def raiz(x, metodo):
       return metodo(x)

   print(raiz(2, bissecao), raiz(2, herao))
   ```
   Herão converge **muito** mais rápido (cerca de 4 a 5 voltas contra ~30 da bissecção): a cada volta ele dobra o número de dígitos corretos. Herão é o método de Newton aplicado a g² − x, que você verá em Cálculo.
5. Exemplo com o programa da média do Tema 2: `ler_numeros()` (lê até o 0 e devolve a lista), `media(xs)` (levanta erro para lista vazia) e `main()` (junta tudo e imprime). As duas primeiras podem ser testadas com `assert`; `ler_numeros` pode receber a função de entrada como parâmetro para ser testada sem teclado.

## Tema 4

1. ```python
   def acima_da_media(notas):
       m = sum(notas) / len(notas)
       return [n for n in notas if n > m]
   ```
2. ```python
   from collections import Counter
   palavras = texto.lower().split()
   for palavra, qtd in Counter(palavras).most_common(10):
       print(palavra, qtd)
   ```
   Sem `Counter`: conte num dicionário e ordene com `sorted(contagem.items(), key=lambda par: par[1], reverse=True)[:10]`.
3. ```python
   p1, p2, turma = set(prova1), set(prova2), set(turma)
   as_duas = p1 & p2
   so_uma = p1 ^ p2              # diferença simétrica
   faltou_alguma = turma - as_duas
   ```
4. ```python
   def transposta(m):
       return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]
   ```
   Cria listas novas, então a original não muda. Versão curta: `[list(linha) for linha in zip(*m)]`.
5. Saída: **`[[1, 0], [1, 0]]`**. `[[0] * 2] * 2` cria **uma** lista `[0, 0]` e uma lista externa com **duas referências para ela**. Mudar `m[0][0]` muda a única linha que existe, vista pelos dois índices. Correto: `[[0] * 2 for _ in range(2)]`.
6. ```python
   grupos = {}
   for p in palavras:
       chave = "".join(sorted(p))
       grupos.setdefault(chave, []).append(p)
   print([g for g in grupos.values() if len(g) > 1])
   ```
   "amor", "roma", "mora" e "ramo" têm todas a chave "amor" (letras ordenadas: a, m, o, r).

## Tema 5

1. ```python
   def potencia(b, e):
       return 1 if e == 0 else b * potencia(b, e - 1)

   def soma(xs):
       return 0 if not xs else xs[0] + soma(xs[1:])

   def inverte(s):
       return s if len(s) <= 1 else inverte(s[1:]) + s[0]
   ```
2. ```python
   def potencia_rapida(b, e):
       if e == 0:
           return 1
       meia = potencia_rapida(b, e // 2)
       return meia * meia if e % 2 == 0 else meia * meia * b
   ```
   A versão simples faz **1.001 chamadas** para e = 1.000 (e estoura a pilha padrão do Python perto disso). A rápida divide e por 2 a cada chamada: cerca de **11 chamadas** (log₂ 1.000 ≈ 10). Atenção: é essencial guardar `meia` numa variável; chamar `potencia_rapida(b, e // 2)` duas vezes jogaria fora o ganho.
3. ```
   soma_digitos(472) = 2 + soma_digitos(47)
     soma_digitos(47) = 7 + soma_digitos(4)
       soma_digitos(4) = 4                    (caso base)
     soma_digitos(47) = 7 + 4 = 11
   soma_digitos(472) = 2 + 11 = 13
   ```
4. Seja M(n) o número de movimentos. M(0) = 0 e M(n) = M(n − 1) + 1 + M(n − 1) = 2M(n − 1) + 1. Então M(1) = 1, M(2) = 3, M(3) = 7, M(4) = 15: sempre 2ⁿ − 1. Prova por indução: se M(n − 1) = 2ⁿ⁻¹ − 1, então M(n) = 2(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1.
5. Sem memo: **177** chamadas para n = 10, **21.891** para n = 20 e **242.785** para n = 25 (cresce cerca de 1,6 vez a cada n a mais). Com memo: cerca de **2n** chamadas (19, 39 e 49), porque cada valor é calculado uma vez.
6. ```python
   def achata(xs):
       resultado = []
       for x in xs:
           if isinstance(x, list):
               resultado.extend(achata(x))
           else:
               resultado.append(x)
       return resultado
   ```
7. ```python
   def subconjuntos(xs):
       if not xs:
           return [[]]
       sem_primeiro = subconjuntos(xs[1:])
       com_primeiro = [[xs[0]] + s for s in sem_primeiro]
       return sem_primeiro + com_primeiro

   assert len(subconjuntos([1, 2, 3])) == 8     # 2³
   ```

## Tema 6

1. ```python
   import csv
   with open("notas.csv", encoding="utf-8") as ent, open("medias.csv", "w", newline="", encoding="utf-8") as sai:
       leitor = csv.DictReader(ent)
       escritor = csv.writer(sai)
       escritor.writerow(["nome", "media", "situacao"])
       for linha in leitor:
           m = (float(linha["nota1"]) + float(linha["nota2"])) / 2
           escritor.writerow([linha["nome"], f"{m:.1f}", "aprovado" if m >= 7 else "reprovado"])
   ```
2. Envolva a conversão em `try/except ValueError` e use `enumerate(leitor, start=2)` para saber o número da linha (a linha 1 é o cabeçalho):
   ```python
   for num, linha in enumerate(leitor, start=2):
       try:
           m = (float(linha["nota1"]) + float(linha["nota2"])) / 2
       except (ValueError, TypeError):
           print(f"linha {num} ignorada: nota inválida")
           continue
       ...
   ```
3. ```python
   from math import gcd

   class Fracao:
       def __init__(self, num: int, den: int = 1):
           if den == 0:
               raise ZeroDivisionError("denominador zero")
           if den < 0:
               num, den = -num, -den
           g = gcd(num, den)
           self.num, self.den = num // g, den // g

       def __add__(self, outra):
           return Fracao(self.num * outra.den + outra.num * self.den, self.den * outra.den)

       def __mul__(self, outra):
           return Fracao(self.num * outra.num, self.den * outra.den)

       def __eq__(self, outra):
           return self.num == outra.num and self.den == outra.den

       def __str__(self):
           return f"{self.num}/{self.den}"
   ```
   Como a fração está sempre simplificada e com denominador positivo, `__eq__` pode comparar os campos direto.
4. No fim de `fracao.py`:
   ```python
   if __name__ == "__main__":
       assert Fracao(1, 2) + Fracao(1, 3) == Fracao(5, 6)
       assert Fracao(2, 4) == Fracao(1, 2)
       assert Fracao(1, -2) == Fracao(-1, 2)
       print("ok")
   ```
5. `except ValueError` só captura erros de valor (como conversão inválida). `except Exception` captura quase tudo, inclusive `NameError`, `TypeError` e `KeyError`, que normalmente são **bugs do programador**. Exemplo:
   ```python
   try:
       idade = int(entrada)
       categoria = classificar(idadee)    # erro de digitação: NameError
   except Exception:
       print("idade inválida")            # o bug aparece como "idade inválida"
   ```

## Tema 7

1. (a) **O(n)** (dois laços em sequência: 2n); (b) **O(n²)** (aninhados); (c) **O(log n)** (divide por 2 a cada volta); (d) **O(n log n)** (n voltas, cada uma com um laço de log n).
2. ```python
   import time, random
   for n in (10**3, 10**5, 10**7):
       xs = list(range(n))
       alvo = n - 1                       # pior caso da linear
       t = time.perf_counter(); _ = alvo in xs; t1 = time.perf_counter() - t
       t = time.perf_counter(); busca_binaria(xs, alvo); t2 = time.perf_counter() - t
       print(n, t1, t2)
   ```
   A linear cresce cerca de 100 vezes a cada linha (n multiplicado por 100); a binária quase não muda (de ~10 para ~23 passos). Bate com O(n) e O(log n).
3. ```python
   def busca_binaria_rec(xs, alvo, baixo=0, alto=None):
       if alto is None:
           alto = len(xs) - 1
       if baixo > alto:
           return -1
       meio = (baixo + alto) // 2
       if xs[meio] == alvo:
           return meio
       if xs[meio] < alvo:
           return busca_binaria_rec(xs, alvo, meio + 1, alto)
       return busca_binaria_rec(xs, alvo, baixo, meio - 1)
   ```
   Passe os índices em vez de fatiar a lista: fatiar copia e transformaria cada passo em O(n).
4. A seleção faz sempre n(n − 1)/2 = **499.500** comparações, em qualquer caso (procura o menor no resto inteiro). A inserção faz **999** numa lista ordenada (melhor caso, O(n)), **499.500** numa invertida (pior caso) e cerca de **250 mil** numa aleatória (em média, cada elemento anda metade do caminho).
5. ```python
   def dois_somam_quadratico(xs, alvo):
       for i in range(len(xs)):
           for j in range(i + 1, len(xs)):
               if xs[i] + xs[j] == alvo:
                   return True
       return False

   def dois_somam_linear(xs, alvo):
       vistos = set()
       for x in xs:
           if alvo - x in vistos:
               return True
           vistos.add(x)
       return False
   ```
   É o famoso "Two Sum", talvez a pergunta de entrevista mais comum do mundo.

## Tema 8

1. ```python
   import random
   def estima_pi(n):
       dentro = sum(1 for _ in range(n) if random.random() ** 2 + random.random() ** 2 <= 1)
       return 4 * dentro / n
   ```
   Tipicamente: 10³ pontos acerta 1 casa (3,1 ± 0,05); 10⁵ acerta 2 (3,14 ± 0,005); 10⁷ acerta 3 (3,141 ± 0,0005). Cada fator 100 nas tentativas dá ~1 dígito a mais, como previsto pelo erro 1/√n.
2. ```python
   def monty_hall(trocar, n=100_000):
       vitorias = 0
       for _ in range(n):
           carro = random.randint(0, 2)
           escolha = random.randint(0, 2)
           aberta = next(p for p in range(3) if p != escolha and p != carro)
           if trocar:
               escolha = next(p for p in range(3) if p != escolha and p != aberta)
           vitorias += escolha == carro
       return vitorias / n
   print(monty_hall(False), monty_hall(True))   # ≈ 0.333 e ≈ 0.667
   ```
   **Trocar ganha 2/3 das vezes.** Você só perde trocando se acertou de primeira, o que acontece em 1/3 das vezes.
3. A soma **7** é a mais comum: há 6 combinações (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) de 36 possíveis, ou 1/6. As somas 2 e 12 têm só uma combinação cada (1/36). O histograma tem forma de triângulo.
4. ```c
   #include <stdio.h>

   int eh_primo(int n) {
       if (n < 2) return 0;
       for (int d = 2; d * d <= n; d++)
           if (n % d == 0) return 0;
       return 1;
   }

   int main(void) {
       int total = 0;
       for (int i = 0; i <= 1000000; i++) total += eh_primo(i);
       printf("%d\n", total);      // 78498
       return 0;
   }
   ```
   Compilado com `gcc -O2`, roda em uma fração de segundo; o mesmo laço em Python puro leva alguns segundos. Diferença típica: 20 a 50 vezes.
5. Normalmente aparece **−2147483648**. O `int` de 32 bits vai de −2³¹ a 2³¹ − 1; somar 1 ao máximo "dá a volta". Em C, estouro de inteiro **com sinal** é *comportamento indefinido*: o padrão não garante nada, e o compilador pode até otimizar supondo que nunca acontece. Compile com `-fsanitize=undefined` para ser avisado.

## Projeto da etapa

Pontos de revisão:

- **Campo minado:** `contar_minas_vizinhas(tab, l, c)` percorre os 8 vizinhos verificando os limites do tabuleiro (bug clássico: índice −1 em Python não dá erro, pega a última linha!). `revelar` é recursiva: se a casa tem 0 minas vizinhas, revela os vizinhos ainda fechados. Para tabuleiros grandes, troque a recursão por uma pilha explícita para não estourar o limite.
- **Forca:** guarde as letras tentadas num `set`; a palavra mascarada é `"".join(l if l in tentadas else "_" for l in palavra)`.
- **Fila de banco:** o resultado esperado é que o tempo de espera cai muito de 1 para 2 caixas e pouco de 2 para 3 quando a taxa de chegada é moderada. Se a taxa de chegada for maior que a capacidade de atendimento, a fila cresce sem limite. Esse comportamento não linear é o assunto da teoria de filas.
- **Epidemia:** abaixo de um certo p a doença some rápido; acima, quase todos se infectam. Essa mudança brusca é um *limiar* (como o R₀ da epidemiologia).
- Testes cobrindo as funções puras; a parte de entrada e saída separada da lógica.
