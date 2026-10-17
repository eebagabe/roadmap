# Programação Funcional: Apostila Prática

Roadmap Ciência da Computação · Semanas 15 a 19

## Comece por aqui

Em Oxford, a **primeira** disciplina de programação não é Python nem Java: é **Haskell**. Em Harvard, a CS 51 ensina abstração com OCaml; em Berkeley, o lendário SICP usava Scheme. Por quê? Porque linguagens funcionais obrigam você a pensar em programas como **funções matemáticas**: sem variáveis que mudam, sem efeitos escondidos. O resultado é código mais fácil de testar, de paralelizar e de **provar correto**. Mesmo que você nunca use Haskell no trabalho, as ideias daqui (map, filter, fold, imutabilidade, tipos algébricos, Option/Maybe) estão hoje em Python, JavaScript, Java, Kotlin, Rust e Swift.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | Tópicos de paradigmas de programação (CES-22, CTC-41) |
| MIT | 6.1010 (partes funcionais) e 6.1020 (imutabilidade) |
| Harvard | CS 51 Abstraction and Design in Computation (OCaml) |
| Oxford | Functional Programming (1º ano, Haskell) |

### Como esta apostila funciona

1. Instale o Haskell com o **GHCup** (`ghcup install ghc cabal hls`). Use o **GHCi** (o interpretador interativo): `ghci arquivo.hs`, depois `:r` para recarregar, `:t expr` para ver o tipo.
2. A cada exemplo, pergunte ao GHCi o tipo das coisas. Em Haskell, **o tipo é a documentação**.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** erro de tipo incompreensível? Escreva a assinatura de tipo de **toda** função (inclusive as auxiliares) e leia o erro de novo: ele fica muito mais preciso. Na dúvida, use `undefined` no lugar de pedaços do código para descobrir qual parte não encaixa.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 15 | Tema 1: Expressões, tipos e funções puras |
| 16 | Tema 2: Listas e casamento de padrões |
| 17 | Tema 3: Funções de ordem superior |
| 18 | Tema 4: Tipos algébricos e raciocínio |
| 19 | Tema 5: Avaliação preguiçosa e mônadas + projeto |

## Tema 1: Expressões, tipos e funções puras

**Objetivo:** entender o modelo funcional e escrever as primeiras funções em Haskell.

### 1.1 Por que funcional

Em Python, este código depende de **quando** você o chama:

```python
contador = 0
def proximo():
    global contador
    contador += 1
    return contador
```

`proximo()` devolve 1, depois 2, depois 3. A mesma expressão, valores diferentes. Para entender o programa, você precisa acompanhar a **história** das variáveis.

Na programação funcional, um programa é uma **composição de funções puras** sobre **valores imutáveis**. Vantagens:

- **Fácil de entender:** cada função pode ser lida isoladamente.
- **Fácil de testar:** mesma entrada, mesma saída, sempre.
- **Paralelizável:** sem estado compartilhado, não há condição de corrida.
- **Provável:** dá para raciocinar como em álgebra (Tema 4).

### 1.2 Expressões e avaliação

Um programa Haskell é uma **expressão** a ser avaliada, como uma conta. Não há "comandos", só valores.

```haskell
ghci> 2 + 3 * 4
14
ghci> if 10 > 3 then "sim" else "não"
"sim"
ghci> let x = 5 in x * x
25
```

`if` é uma expressão (sempre tem `else` e devolve um valor), como o operador ternário `a if c else b` do Python.

**Avaliar é reescrever**: substituir nomes pelas suas definições até sobrar um valor.

```haskell
dobro x = x + x
dobro (3 + 1)
= (3 + 1) + (3 + 1)
= 4 + 4
= 8
```

Esse **modelo de substituição** é tudo de que você precisa para entender um programa funcional. Funciona porque não existe estado escondido.

### 1.3 Tipos

Haskell é **estaticamente tipado** com **inferência**: o compilador descobre os tipos e recusa programas inconsistentes antes de rodar.

| Tipo | Exemplos |
|---|---|
| `Int` | `42` (tamanho fixo) |
| `Integer` | `2^100` (sem limite) |
| `Double` | `3.14` |
| `Bool` | `True`, `False` |
| `Char` | `'a'` |
| `String` | `"olá"` (é o mesmo que `[Char]`) |
| `(a, b)` | `(1, "um")` (tupla) |
| `[a]` | `[1, 2, 3]` (lista, todos do mesmo tipo) |

```haskell
ghci> :t not
not :: Bool -> Bool
ghci> :t length
length :: Foldable t => t a -> Int
```

`::` se lê "tem tipo". `a` minúsculo é uma **variável de tipo**: `length` funciona para listas de qualquer coisa (**polimorfismo**).

### 1.4 Funções puras

Uma **função pura** depende **só** dos argumentos e **não tem efeitos colaterais** (não imprime, não altera variáveis, não lê arquivos). Em Haskell, toda função é pura; efeitos ficam isolados no tipo `IO` (Tema 5).

```haskell
-- arquivo funcoes.hs
quadrado :: Int -> Int
quadrado x = x * x

hipotenusa :: Double -> Double -> Double
hipotenusa a b = sqrt (a * a + b * b)

absoluto :: Int -> Int
absoluto n
  | n < 0     = -n
  | otherwise = n

imc :: Double -> Double -> String
imc peso altura
  | v < 18.5  = "abaixo"
  | v < 25    = "normal"
  | otherwise = "acima"
  where v = peso / altura ^ 2
```

- Aplicação de função é por **espaço**: `hipotenusa 3 4`, não `hipotenusa(3, 4)`. Aplicação tem a maior precedência: `quadrado 3 + 1` é `(quadrado 3) + 1`.
- **Guardas** (`|`) escolhem o caso; `otherwise` é `True`.
- `where` define nomes auxiliares.
- O tipo `Double -> Double -> Double` significa "recebe um Double, depois outro, devolve um Double" (o porquê dessa notação está no Tema 3).

**Transparência referencial:** como não há efeitos, qualquer expressão pode ser trocada pelo seu valor sem mudar o programa. `quadrado 3` pode virar `9` em qualquer lugar.

### Atividades de fixação do Tema 1

1. Avalie passo a passo pelo modelo de substituição: `quadrado (quadrado 2)`, com `quadrado x = x * x`.
2. Escreva `maior3 :: Int -> Int -> Int -> Int` que devolve o maior de três números.
3. Escreva `bissexto :: Int -> Bool` com guardas.
4. Pergunte ao GHCi o tipo de: `'a'`, `"a"`, `(True, 'x')`, `[1, 2, 3]`, `fst`, `(+)`. Interprete cada resposta.
5. Quais destas funções Python são puras? Justifique. (a) `def f(x): return x * 2`; (b) `def g(xs): xs.append(1); return xs`; (c) `def h(): return random.random()`; (d) `def k(x): print(x); return x`.

## Tema 2: Listas e casamento de padrões

**Objetivo:** processar listas com recursão e casamento de padrões.

### 2.1 Listas

Uma lista em Haskell é **vazia** (`[]`) ou um **elemento na frente de outra lista** (`x : xs`, "x cons xs").

```haskell
[1, 2, 3]  ==  1 : (2 : (3 : []))
```

Essa definição **recursiva** é a chave de tudo neste tema.

```haskell
ghci> head [1, 2, 3]
1
ghci> tail [1, 2, 3]
[2,3]
ghci> [1, 2] ++ [3, 4]
[1,2,3,4]
ghci> [1 .. 10]
[1,2,3,4,5,6,7,8,9,10]
ghci> take 3 "haskell"
"has"
ghci> reverse [1, 2, 3]
[3,2,1]
```

Listas são **imutáveis**: `0 : xs` cria uma lista nova que **compartilha** `xs` (sem copiar). Por isso adicionar na frente é O(1), mas `xs ++ [x]` (adicionar no fim) é O(n).

### 2.2 Recursão em listas

Como a lista é definida por casos, funções sobre listas também são:

```haskell
soma :: [Int] -> Int
soma []       = 0
soma (x : xs) = x + soma xs

comprimento :: [a] -> Int
comprimento []       = 0
comprimento (_ : xs) = 1 + comprimento xs
```

Avaliando `soma [1, 2, 3]`:

```
soma (1 : 2 : 3 : [])
= 1 + soma (2 : 3 : [])
= 1 + (2 + soma (3 : []))
= 1 + (2 + (3 + soma []))
= 1 + (2 + (3 + 0))
= 6
```

Não existem laços em Haskell: **recursão é o laço**.

### 2.3 Casamento de padrões

Cada equação descreve um **formato** de entrada. O Haskell tenta de cima para baixo e usa a primeira que casar, ligando os nomes às partes.

```haskell
primeiroDeTupla :: (a, b) -> a
primeiroDeTupla (x, _) = x

descreve :: [Int] -> String
descreve []        = "vazia"
descreve [x]       = "um elemento: " ++ show x
descreve (x : y : _) = "começa com " ++ show x ++ " e " ++ show y

fatorial :: Integer -> Integer
fatorial 0 = 1
fatorial n = n * fatorial (n - 1)
```

`_` casa com qualquer coisa e ignora. A expressão `case` faz o mesmo no meio de uma expressão.

> **Cuidado! Cai na prova:** padrões incompletos geram erro em tempo de execução (`head []` dá exceção!). Compile com `-Wall` (no GHCi: `:set -Wall`) para ser avisado de casos esquecidos. Prefira casamento de padrões a `head` e `tail`.

Mais exemplos clássicos:

```haskell
pertence :: Eq a => a -> [a] -> Bool
pertence _ []       = False
pertence y (x : xs) = x == y || pertence y xs

intercala :: [a] -> [a] -> [a]
intercala [] ys = ys
intercala xs [] = xs
intercala (x : xs) (y : ys) = x : y : intercala xs ys

zipar :: [a] -> [b] -> [(a, b)]
zipar (x : xs) (y : ys) = (x, y) : zipar xs ys
zipar _ _               = []
```

### 2.4 Compreensões de lista

Inspiradas na notação de conjuntos da matemática ({x² | x ∈ ℕ, x par}). O Python copiou a ideia do Haskell.

```haskell
ghci> [x * x | x <- [1 .. 10], even x]
[4,16,36,64,100]
ghci> [(x, y) | x <- [1 .. 3], y <- "ab"]
[(1,'a'),(1,'b'),(2,'a'),(2,'b'),(3,'a'),(3,'b')]
```

```haskell
pitagoricos :: Int -> [(Int, Int, Int)]
pitagoricos n = [(a, b, c) | c <- [1 .. n], b <- [1 .. c], a <- [1 .. b], a * a + b * b == c * c]

quicksort :: Ord a => [a] -> [a]
quicksort []       = []
quicksort (p : xs) = quicksort [x | x <- xs, x < p] ++ [p] ++ quicksort [x | x <- xs, x >= p]
```

Esse quicksort de três linhas é famoso por ser praticamente a definição do algoritmo. (Não é o mais eficiente: cria listas novas a cada passo.)

### Atividades de fixação do Tema 2

1. Escreva recursivamente, com casamento de padrões: `produto :: [Int] -> Int`, `maximo :: [Int] -> Int` (decida o que fazer com lista vazia) e `inverte :: [a] -> [a]`.
2. Escreva `ultimo :: [a] -> a` e `penultimo :: [a] -> a`.
3. Escreva `removeDuplicatas :: Eq a => [a] -> [a]` mantendo a primeira ocorrência.
4. Com compreensão de lista: (a) os divisores de n; (b) os primos até n usando (a); (c) todas as palavras de duas letras com o alfabeto "abc".
5. Avalie passo a passo `comprimento "oi"`.
6. Escreva `insere :: Ord a => a -> [a] -> [a]` (em lista ordenada) e use-a para fazer `ordenaPorInsercao`.

## Tema 3: Funções de ordem superior

**Objetivo:** usar funções como valores para capturar padrões de recursão.

### 3.1 map e filter

Uma função de **ordem superior** recebe ou devolve funções. Repare que muitas funções do Tema 2 seguem o mesmo esqueleto:

```haskell
dobraTodos []       = []
dobraTodos (x : xs) = 2 * x : dobraTodos xs

maiusculas []       = []
maiusculas (c : cs) = toUpper c : maiusculas cs
```

A única diferença é a função aplicada a cada elemento. Isolando o padrão:

```haskell
map :: (a -> b) -> [a] -> [b]
map _ []       = []
map f (x : xs) = f x : map f xs

dobraTodos = map (* 2)
maiusculas = map toUpper
```

O mesmo para **selecionar** elementos:

```haskell
filter :: (a -> Bool) -> [a] -> [a]
filter _ [] = []
filter p (x : xs)
  | p x       = x : filter p xs
  | otherwise = filter p xs

ghci> filter even [1 .. 10]
[2,4,6,8,10]
```

**Funções anônimas (lambdas):** `\x -> x * x + 1`. Em Python, `lambda x: x * x + 1`.

### 3.2 fold

O padrão mais geral: **combinar** todos os elementos num único valor.

```haskell
soma []       = 0
soma (x : xs) = x + soma xs

produto []       = 1
produto (x : xs) = x * produto xs
```

Diferenças: o valor do caso base (0 ou 1) e a operação (+ ou *).

```haskell
foldr :: (a -> b -> b) -> b -> [a] -> b
foldr _ z []       = z
foldr f z (x : xs) = f x (foldr f z xs)

soma    = foldr (+) 0
produto = foldr (*) 1
e       = foldr (&&) True
```

Uma forma de visualizar: `foldr f z` troca cada `:` da lista por `f` e o `[]` final por `z`.

```
foldr (+) 0 (1 : 2 : 3 : [])  =  1 + (2 + (3 + 0))
```

`foldl` associa para a esquerda: `foldl f z [1, 2, 3] = f (f (f z 1) 2) 3`. Em Haskell, para somas em listas grandes, use `foldl'` (de `Data.List`), que não acumula contas pendentes.

Quase tudo é um fold:

```haskell
comprimento = foldr (\_ n -> 1 + n) 0
mapa f      = foldr (\x acc -> f x : acc) []
inverte     = foldl (\acc x -> x : acc) []
```

Em Python: `functools.reduce`; em JavaScript: `array.reduce`; em Java: `stream.reduce`.

### 3.3 Currying

Em Haskell, **toda função recebe exatamente um argumento**. Uma "função de dois argumentos" é, na verdade, uma função que recebe o primeiro e **devolve uma função** que espera o segundo.

```haskell
soma3 :: Int -> Int -> Int -> Int
soma3 a b c = a + b + c
-- o tipo é Int -> (Int -> (Int -> Int))

ghci> let somaCom10 = soma3 4 6
ghci> somaCom10 5
15
```

Isso é **currying** (em homenagem ao lógico Haskell Curry, que também dá nome à linguagem). Permite **aplicação parcial**, que é muito útil com funções de ordem superior:

```haskell
map (soma3 1 2) [10, 20]     -- [13, 23]
filter (> 3) [1 .. 6]        -- [4, 5, 6]; (> 3) é uma "seção" do operador
```

### 3.4 Composição

A **composição** `(f . g) x = f (g x)` cria uma função nova a partir de duas, exatamente como (f ∘ g) na matemática.

```haskell
somaDosQuadradosImpares :: [Int] -> Int
somaDosQuadradosImpares = sum . map (^ 2) . filter odd
```

Leia da direita para a esquerda: filtra os ímpares, eleva ao quadrado, soma. É um **pipeline**, como os pipes do shell (`cat | grep | wc`). Esse estilo, sem mencionar o argumento, chama-se *point-free*.

O operador `$` é aplicação com precedência baixa, que economiza parênteses: `sum $ map (^ 2) $ filter odd xs`.

### Atividades de fixação do Tema 3

1. Use `map`, `filter` e `sum` para calcular a soma dos quadrados dos números de 1 a 100 que são divisíveis por 3 ou por 5.
2. Escreva `todos :: (a -> Bool) -> [a] -> Bool` e `algum :: (a -> Bool) -> [a] -> Bool` usando `foldr`.
3. Escreva `filter` usando `foldr`.
4. Qual o tipo de `map (+ 1)`? E de `filter`? E de `(.)`? Confira no GHCi e explique.
5. Reescreva em estilo point-free: `f xs = length (filter even xs)`.
6. Calcule à mão `foldr (-) 0 [1, 2, 3]` e `foldl (-) 0 [1, 2, 3]`. Por que são diferentes?
7. Traduza para Python com `map`, `filter` e `functools.reduce` o exercício 1.

## Tema 4: Tipos algébricos e raciocínio

**Objetivo:** modelar dados com tipos próprios, tratar ausência e erro com tipos, e provar propriedades de programas.

### 4.1 Tipos algébricos

Você pode criar tipos novos combinando dois ingredientes:

- **Soma (ou):** um valor é **uma** de várias alternativas.
- **Produto (e):** um valor carrega **vários** campos juntos.

```haskell
data Cor = Vermelho | Verde | Azul
  deriving (Show, Eq)

data Forma = Circulo Double | Retangulo Double Double
  deriving Show

area :: Forma -> Double
area (Circulo r)       = pi * r * r
area (Retangulo b h)   = b * h
```

`Forma` é uma soma (Círculo **ou** Retângulo) de produtos (Retângulo tem base **e** altura). Com `-Wall`, o compilador avisa se você esquecer de tratar alguma alternativa: adicionar `Triangulo` aponta todos os lugares que precisam mudar.

Tipos **recursivos** descrevem estruturas como árvores:

```haskell
data Arvore a = Folha | No (Arvore a) a (Arvore a)

insere :: Ord a => a -> Arvore a -> Arvore a
insere x Folha = No Folha x Folha
insere x arv@(No esq v dir)
  | x < v     = No (insere x esq) v dir
  | x > v     = No esq v (insere x dir)
  | otherwise = arv

emOrdem :: Arvore a -> [a]
emOrdem Folha          = []
emOrdem (No esq v dir) = emOrdem esq ++ [v] ++ emOrdem dir
```

Expressões aritméticas são o exemplo clássico (e o projeto desta etapa):

```haskell
data Expr = Num Int | Soma Expr Expr | Mult Expr Expr

avalia :: Expr -> Int
avalia (Num n)    = n
avalia (Soma a b) = avalia a + avalia b
avalia (Mult a b) = avalia a * avalia b

-- (2 + 3) * 4
avalia (Mult (Soma (Num 2) (Num 3)) (Num 4))   -- 20
```

### 4.2 Classes de tipos

Uma **classe de tipos** é um conjunto de operações que vários tipos podem implementar, parecido com uma interface em Java.

| Classe | Operações | Significado |
|---|---|---|
| `Eq` | `==`, `/=` | Dá para comparar igualdade |
| `Ord` | `<`, `compare`, `max` | Dá para ordenar |
| `Show` | `show` | Dá para converter em texto |
| `Num` | `+`, `*`, `-` | Comporta-se como número |
| `Functor` | `fmap` | É um "recipiente" que dá para mapear |

```haskell
instance Show Expr where
  show (Num n)    = show n
  show (Soma a b) = "(" ++ show a ++ " + " ++ show b ++ ")"
  show (Mult a b) = show a ++ " * " ++ show b
```

Em tipos como `Ord a => [a] -> [a]`, a parte antes de `=>` é uma **restrição**: funciona para qualquer `a`, desde que `a` seja ordenável.

### 4.3 Maybe e Either

Como representar "pode não haver resultado" sem `null` (que Tony Hoare, seu inventor, chamou de "erro de um bilhão de dólares")?

```haskell
data Maybe a = Nothing | Just a

divisaoSegura :: Int -> Int -> Maybe Int
divisaoSegura _ 0 = Nothing
divisaoSegura a b = Just (a `div` b)

buscaIdade :: String -> [(String, Int)] -> Maybe Int
buscaIdade = lookup
```

O tipo **obriga** quem chama a tratar o caso `Nothing`: não há como esquecer.

```haskell
case divisaoSegura 10 0 of
  Nothing -> "não dá para dividir por zero"
  Just q  -> "resultado: " ++ show q
```

**Either** carrega o motivo do erro:

```haskell
data Either e a = Left e | Right a

converteIdade :: String -> Either String Int
converteIdade s
  | null s              = Left "vazio"
  | not (all isDigit s) = Left ("não é número: " ++ s)
  | otherwise           = Right (read s)
```

Essas ideias estão hoje em todo lugar: `Optional` (Java), `Option` e `Result` (Rust), tipos `T | None` com verificação no Python (mypy), `?.` no TypeScript e no Kotlin.

### 4.4 Raciocínio equacional

Como funções são puras, dá para **provar** coisas sobre programas usando as definições como equações, igual a álgebra.

Definições:

```haskell
[] ++ ys       = ys                    -- (++.1)
(x : xs) ++ ys = x : (xs ++ ys)        -- (++.2)

length []       = 0                    -- (len.1)
length (_ : xs) = 1 + length xs        -- (len.2)
```

### 4.5 Indução sobre programas

**Teorema:** para quaisquer listas finitas xs e ys, `length (xs ++ ys) = length xs + length ys`.

**Prova por indução estrutural em xs** (a lista é vazia ou é x : xs, então basta provar esses dois casos):

*Caso base* (xs = []):

```
length ([] ++ ys)
= length ys                       por (++.1)
= 0 + length ys                   aritmética
= length [] + length ys           por (len.1)
```

*Passo* (xs = x : xs'), supondo a hipótese de indução (HI) `length (xs' ++ ys) = length xs' + length ys`:

```
length ((x : xs') ++ ys)
= length (x : (xs' ++ ys))        por (++.2)
= 1 + length (xs' ++ ys)          por (len.2)
= 1 + (length xs' + length ys)    pela HI
= (1 + length xs') + length ys    associatividade
= length (x : xs') + length ys    por (len.2)
```

∎. Repare que a estrutura da prova espelha a estrutura da recursão. Isso não é coincidência: recursão e indução são a mesma ideia vista de dois lados. Em Oxford, provas assim são cobradas na prova de Functional Programming; em Matemática Discreta você verá indução de forma geral.

Outras leis úteis (todas prováveis por indução): `map f (map g xs) = map (f . g) xs` (fusão de map: percorrer uma vez em vez de duas); `map id xs = xs`; `reverse (reverse xs) = xs`. Compiladores usam leis assim para otimizar programas.

### Atividades de fixação do Tema 4

1. Crie `data DiaSemana` com os 7 dias e uma função `fimDeSemana :: DiaSemana -> Bool`.
2. Adicione `Triangulo` (base e altura) a `Forma` e atualize `area`. Escreva `perimetro` (para o triângulo, peça os três lados).
3. Para a `Arvore` do texto, escreva `tamanho`, `altura` e `pertence`.
4. Escreva `cabecaSegura :: [a] -> Maybe a` e `indice :: Int -> [a] -> Maybe a`.
5. Escreva `media :: [Double] -> Either String Double` que dá erro para lista vazia.
6. Prove por indução: `map f (xs ++ ys) = map f xs ++ map f ys`.
7. Prove por indução: `length (map f xs) = length xs`.

## Tema 5: Avaliação preguiçosa e mônadas

**Objetivo:** entender como Haskell avalia, como faz entrada e saída sendo puro, e trazer as ideias de volta para Python e JavaScript.

### 5.1 Avaliação preguiçosa

Haskell só calcula um valor quando ele é **necessário** (avaliação preguiçosa, ou *lazy*). Consequências surpreendentes:

```haskell
ghci> take 5 [1 ..]               -- lista infinita!
[1,2,3,4,5]
ghci> let naturais = [0 ..]
ghci> takeWhile (< 30) (map (^ 2) naturais)
[0,1,4,9,16,25]
ghci> fst (1, undefined)          -- undefined nunca é avaliado
1
```

Definições elegantes de sequências infinitas:

```haskell
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

primos :: [Int]
primos = crivo [2 ..]
  where crivo (p : xs) = p : crivo [x | x <- xs, x `mod` p /= 0]

ghci> take 10 fibs
[0,1,1,2,3,5,8,13,21,34]
```

Vantagens: separar **gerar** de **consumir** (gere todas as possibilidades, pegue só as que precisa). Custo: é mais difícil prever o uso de memória (contas pendentes podem se acumular, por isso `foldl'`).

Python tem preguiça sob demanda com **geradores** (`yield`, `range`, expressões geradoras entre parênteses).

### 5.2 Entrada e saída

Se toda função é pura, como imprimir algo? A resposta do Haskell: um valor do tipo `IO a` é uma **descrição** de uma ação que, quando executada, interage com o mundo e produz um `a`. O programa principal (`main`) é uma grande ação composta.

```haskell
main :: IO ()
main = do
  putStrLn "Qual o seu nome?"
  nome <- getLine
  let saudacao = "Olá, " ++ nome ++ "!"
  putStrLn saudacao
```

- `<-` extrai o resultado de uma ação `IO`.
- `let` dá nome a um valor puro.
- O tipo separa o mundo puro do impuro: uma função `Int -> Int` **não pode** imprimir nada; isso é garantido pelo compilador.

Arquitetura recomendada (em qualquer linguagem): **núcleo puro, casca fina de efeitos**. Leia a entrada, chame funções puras que fazem todo o trabalho, imprima o resultado.

```haskell
main :: IO ()
main = do
  texto <- getContents
  putStr (processa texto)          -- processa :: String -> String é pura e testável
```

### 5.3 Mônadas

Repare num padrão incômodo ao encadear operações que podem falhar:

```haskell
calcula :: Int -> Int -> Int -> Maybe Int
calcula a b c =
  case divisaoSegura a b of
    Nothing -> Nothing
    Just x  -> case divisaoSegura x c of
      Nothing -> Nothing
      Just y  -> Just (y + 1)
```

A lógica "se falhou, propague a falha; senão, continue com o valor" se repete. A operação `>>=` (*bind*) captura esse padrão:

```haskell
(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing >>= _ = Nothing
Just x  >>= f = f x

calcula a b c = divisaoSegura a b >>= \x -> divisaoSegura x c >>= \y -> Just (y + 1)
```

E a notação `do` é açúcar sintático para `>>=`:

```haskell
calcula a b c = do
  x <- divisaoSegura a b
  y <- divisaoSegura x c
  return (y + 1)
```

Uma **mônada** é qualquer tipo com `return` (embrulha um valor) e `>>=` (encadeia), obedecendo a três leis simples. `Maybe` encadeia operações que podem falhar; `Either` falhas com mensagem; listas, computações com vários resultados; `IO`, ações com efeito. A mesma notação `do` serve para todas.

Não se preocupe em dominar mônadas agora: o importante é reconhecer o padrão "encadear computações num contexto". Você o encontrará como `Promise.then` e `async/await` no JavaScript, `Optional.flatMap` no Java e o operador `?` do Rust.

### 5.4 Ideias funcionais em Python e JavaScript

```python
from functools import reduce
from dataclasses import dataclass

# map/filter/reduce e compreensões
total = sum(x * x for x in range(1, 101) if x % 3 == 0)

# imutabilidade
@dataclass(frozen=True)
class Ponto:
    x: float
    y: float

# funções puras + núcleo puro, casca de efeitos
def processa(linhas: list[str]) -> list[str]:
    return [l.upper() for l in linhas if l.strip()]

# "Maybe" com tipos opcionais
def busca(idades: dict[str, int], nome: str) -> int | None:
    return idades.get(nome)
```

```javascript
const total = [...Array(100).keys()]
  .map((i) => i + 1)
  .filter((x) => x % 3 === 0)
  .reduce((acc, x) => acc + x * x, 0)

const usuario = resposta?.dados?.usuario ?? 'anônimo'   // "Maybe" do dia a dia
```

O React, por exemplo, é baseado em ideias funcionais: componentes como funções puras do estado para a tela, e estado imutável.

### Atividades de fixação do Tema 5

1. Use listas infinitas para obter: os 10 primeiros quadrados perfeitos maiores que 1.000; a posição do primeiro número de Fibonacci com 100 dígitos (contando F₀ = 0).
2. Escreva um programa Haskell que lê linhas da entrada até o fim e imprime quantas linhas, palavras e caracteres há (um `wc`), com toda a lógica numa função pura.
3. Reescreva com notação `do` (na mônada `Maybe`): buscar a idade de uma pessoa num dicionário, buscar a cidade dela em outro e devolver as duas juntas como tupla.
4. Escreva `somaSegura :: [String] -> Either String Int` que converte cada texto em número e soma, parando no primeiro erro (use `mapM` ou `traverse`).
5. Em Python, escreva um gerador infinito de primos e use `itertools.islice` para pegar os 20 primeiros.

## Projeto da etapa

**Interpretador de expressões aritméticas:**

1. Tipo `Expr` com números, variáveis, soma, subtração, multiplicação, divisão e `let x = e1 in e2`.
2. `avalia :: Ambiente -> Expr -> Either Erro Int`, onde `Ambiente` associa nomes a valores e `Erro` é um tipo algébrico (`DivisaoPorZero`, `VariavelNaoDefinida String`).
3. `simplifica :: Expr -> Expr` aplicando leis como `0 + e = e`, `1 * e = e`, `0 * e = 0`, e constantes calculadas antes.
4. `mostra :: Expr -> String` com o mínimo de parênteses.
5. Bônus: um parser que lê `"let x = 2 + 3 in x * x"` e devolve a `Expr` (comece com tokens separados por espaço; em Compiladores você fará um de verdade).
6. Testes com **QuickCheck**: por exemplo, a propriedade "simplificar não muda o valor": `avalia amb (simplifica e) == avalia amb e`.

## Para ir além

- **Oxford, Functional Programming**: notas e listas públicas no site do departamento.
- *Learn You a Haskell for Great Good!* (gratuito online): divertido e didático.
- *Programming in Haskell* (Graham Hutton): o livro-texto mais usado em cursos universitários; o autor tem vídeos gratuitos no YouTube.
- **SICP** (*Structure and Interpretation of Computer Programs*, gratuito) e **CS 61A** de Berkeley (aulas públicas): a mesma filosofia, com Scheme e Python.
- **Harvard CS 51**: materiais públicos com OCaml.

## Resumão

- Funcional: programas como composição de funções puras sobre valores imutáveis.
- Avaliar é substituir. Transparência referencial: expressão pode ser trocada pelo valor.
- Lista: `[]` ou `x : xs`. Recursão com casamento de padrões no lugar de laços.
- `map` transforma, `filter` seleciona, `foldr` combina. `foldr f z` troca `:` por `f` e `[]` por `z`.
- Currying: toda função recebe um argumento; aplicação parcial é natural. `(f . g) x = f (g x)`.
- Tipos algébricos: somas (ou) de produtos (e). O compilador avisa casos esquecidos.
- `Maybe` e `Either` substituem `null` e exceções, e o tipo obriga a tratar.
- Indução estrutural prova propriedades de funções recursivas; a prova espelha a recursão.
- Preguiça: listas infinitas e separar gerar de consumir.
- `IO` separa efeitos; núcleo puro, casca fina. Mônada: encadear computações num contexto (`do`, `>>=`).
