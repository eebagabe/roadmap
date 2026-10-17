# Gabarito: Programação Funcional

Abra só depois de tentar.

## Tema 1

1. Substituindo de fora para dentro (como o Haskell faz):
   ```
   quadrado (quadrado 2)
   = quadrado 2 * quadrado 2
   = (2 * 2) * quadrado 2
   = 4 * quadrado 2
   = 4 * (2 * 2)
   = 4 * 4
   = 16
   ```
   Substituindo de dentro para fora: `quadrado (quadrado 2) = quadrado 4 = 4 * 4 = 16`. Funções puras dão o mesmo resultado em qualquer ordem (o GHC, na prática, compartilha o valor de `quadrado 2` para não calculá-lo duas vezes).
2. ```haskell
   maior3 :: Int -> Int -> Int -> Int
   maior3 a b c = max a (max b c)
   ```
3. ```haskell
   bissexto :: Int -> Bool
   bissexto a
     | a `mod` 400 == 0 = True
     | a `mod` 100 == 0 = False
     | otherwise        = a `mod` 4 == 0
   ```
4. - `'a' :: Char`
   - `"a" :: String` (ou seja, `[Char]`: lista de um caractere)
   - `(True, 'x') :: (Bool, Char)`
   - `[1, 2, 3] :: Num a => [a]`: lista de algum tipo numérico, ainda não decidido
   - `fst :: (a, b) -> a`: pega o primeiro de qualquer par
   - `(+) :: Num a => a -> a -> a`: soma dois valores do mesmo tipo numérico
5. (a) **Pura.** (b) **Impura:** modifica a lista recebida (efeito visível para quem chamou). (c) **Impura:** o resultado depende de estado escondido (o gerador aleatório), não só dos argumentos. (d) **Impura:** imprimir é um efeito colateral, mesmo que o valor devolvido seja sempre o mesmo.

## Tema 2

1. ```haskell
   produto :: [Int] -> Int
   produto []       = 1
   produto (x : xs) = x * produto xs

   maximo :: [Int] -> Int
   maximo []       = error "maximo: lista vazia"     -- ou devolva Maybe Int (Tema 4)
   maximo [x]      = x
   maximo (x : xs) = max x (maximo xs)

   inverte :: [a] -> [a]
   inverte []       = []
   inverte (x : xs) = inverte xs ++ [x]
   ```
   Essa `inverte` é O(n²) (cada `++` percorre a lista). A versão com acumulador é O(n): `inverte xs = go xs [] where go [] acc = acc; go (y : ys) acc = go ys (y : acc)`.
2. ```haskell
   ultimo :: [a] -> a
   ultimo [x]      = x
   ultimo (_ : xs) = ultimo xs

   penultimo :: [a] -> a
   penultimo [x, _]   = x
   penultimo (_ : xs) = penultimo xs
   ```
   Ambas falham em listas curtas demais; com `-Wall` o compilador avisa.
3. ```haskell
   removeDuplicatas :: Eq a => [a] -> [a]
   removeDuplicatas []       = []
   removeDuplicatas (x : xs) = x : removeDuplicatas [y | y <- xs, y /= x]
   ```
4. ```haskell
   divisores :: Int -> [Int]
   divisores n = [d | d <- [1 .. n], n `mod` d == 0]

   primosAte :: Int -> [Int]
   primosAte n = [p | p <- [2 .. n], divisores p == [1, p]]

   palavras2 :: [String]
   palavras2 = [[a, b] | a <- "abc", b <- "abc"]     -- 9 palavras
   ```
5. ```
   comprimento "oi"
   = comprimento ('o' : 'i' : [])
   = 1 + comprimento ('i' : [])
   = 1 + (1 + comprimento [])
   = 1 + (1 + 0)
   = 2
   ```
6. ```haskell
   insere :: Ord a => a -> [a] -> [a]
   insere x [] = [x]
   insere x (y : ys)
     | x <= y    = x : y : ys
     | otherwise = y : insere x ys

   ordenaPorInsercao :: Ord a => [a] -> [a]
   ordenaPorInsercao []       = []
   ordenaPorInsercao (x : xs) = insere x (ordenaPorInsercao xs)
   ```
   Repare que `ordenaPorInsercao = foldr insere []` (Tema 3).

## Tema 3

1. ```haskell
   sum (map (^ 2) (filter (\x -> x `mod` 3 == 0 || x `mod` 5 == 0) [1 .. 100]))
   -- 164036
   ```
2. ```haskell
   todos :: (a -> Bool) -> [a] -> Bool
   todos p = foldr (\x acc -> p x && acc) True

   algum :: (a -> Bool) -> [a] -> Bool
   algum p = foldr (\x acc -> p x || acc) False
   ```
   Graças à preguiça, `algum even [1 ..]` termina: o `||` não avalia o resto quando encontra `True`.
3. ```haskell
   filtra :: (a -> Bool) -> [a] -> [a]
   filtra p = foldr (\x acc -> if p x then x : acc else acc) []
   ```
4. - `map (+ 1) :: Num b => [b] -> [b]`: aplicação parcial; falta só a lista.
   - `filter :: (a -> Bool) -> [a] -> [a]`: recebe um predicado e uma lista, devolve lista do mesmo tipo.
   - `(.) :: (b -> c) -> (a -> b) -> a -> c`: recebe f (de b para c) e g (de a para b) e devolve uma função de a para c. Os tipos "encaixam" no meio (o b), exatamente como na composição matemática.
5. `f = length . filter even`.
6. `foldr (-) 0 [1, 2, 3]` = 1 − (2 − (3 − 0)) = 1 − (2 − 3) = 1 − (−1) = **2**. `foldl (-) 0 [1, 2, 3]` = ((0 − 1) − 2) − 3 = **−6**. São diferentes porque a subtração **não é associativa**: a ordem dos parênteses importa. Para operações associativas com elemento neutro (soma, produto, `&&`, `++`), `foldr` e `foldl` dão o mesmo resultado.
7. ```python
   from functools import reduce
   numeros = filter(lambda x: x % 3 == 0 or x % 5 == 0, range(1, 101))
   quadrados = map(lambda x: x * x, numeros)
   print(reduce(lambda acc, x: acc + x, quadrados, 0))   # 164036
   ```

## Tema 4

1. ```haskell
   data DiaSemana = Dom | Seg | Ter | Qua | Qui | Sex | Sab
     deriving (Show, Eq, Enum, Bounded)

   fimDeSemana :: DiaSemana -> Bool
   fimDeSemana Sab = True
   fimDeSemana Dom = True
   fimDeSemana _   = False
   ```
   Com `Enum` e `Bounded`, `[minBound .. maxBound] :: [DiaSemana]` lista todos os dias.
2. ```haskell
   data Forma = Circulo Double | Retangulo Double Double | Triangulo Double Double Double

   area :: Forma -> Double
   area (Circulo r)         = pi * r * r
   area (Retangulo b h)     = b * h
   area (Triangulo a b c)   = sqrt (s * (s - a) * (s - b) * (s - c))   -- Herão
     where s = (a + b + c) / 2

   perimetro :: Forma -> Double
   perimetro (Circulo r)       = 2 * pi * r
   perimetro (Retangulo b h)   = 2 * (b + h)
   perimetro (Triangulo a b c) = a + b + c
   ```
   Guardar os três lados permite calcular área e perímetro, então trocamos a representação "base e altura" por lados. Esse é o tipo de decisão de modelagem que os tipos algébricos deixam explícita.
3. ```haskell
   tamanho :: Arvore a -> Int
   tamanho Folha          = 0
   tamanho (No e _ d)     = tamanho e + 1 + tamanho d

   altura :: Arvore a -> Int
   altura Folha           = 0
   altura (No e _ d)      = 1 + max (altura e) (altura d)

   pertence :: Ord a => a -> Arvore a -> Bool
   pertence _ Folha = False
   pertence x (No e v d)
     | x < v     = pertence x e
     | x > v     = pertence x d
     | otherwise = True
   ```
4. ```haskell
   cabecaSegura :: [a] -> Maybe a
   cabecaSegura []      = Nothing
   cabecaSegura (x : _) = Just x

   indice :: Int -> [a] -> Maybe a
   indice _ []       = Nothing
   indice 0 (x : _)  = Just x
   indice n (_ : xs)
     | n < 0     = Nothing
     | otherwise = indice (n - 1) xs
   ```
5. ```haskell
   media :: [Double] -> Either String Double
   media [] = Left "média de lista vazia"
   media xs = Right (sum xs / fromIntegral (length xs))
   ```
   `fromIntegral` converte o `Int` de `length` para `Double`: Haskell nunca converte tipos numéricos sozinho.
6. Definição usada: `map f [] = []` (map.1) e `map f (x : xs) = f x : map f xs` (map.2).

   *Base* (xs = []):
   ```
   map f ([] ++ ys)
   = map f ys                         (++.1)
   = [] ++ map f ys                   (++.1, lido ao contrário)
   = map f [] ++ map f ys             (map.1)
   ```
   *Passo* (xs = x : xs'), com HI `map f (xs' ++ ys) = map f xs' ++ map f ys`:
   ```
   map f ((x : xs') ++ ys)
   = map f (x : (xs' ++ ys))          (++.2)
   = f x : map f (xs' ++ ys)          (map.2)
   = f x : (map f xs' ++ map f ys)    HI
   = (f x : map f xs') ++ map f ys    (++.2, lido ao contrário)
   = map f (x : xs') ++ map f ys      (map.2)
   ```
7. *Base:* `length (map f [])` = `length []`, por (map.1). *Passo:* `length (map f (x : xs)) = length (f x : map f xs) = 1 + length (map f xs) = 1 + length xs` (pela HI) `= length (x : xs)`. ∎

## Tema 5

1. ```haskell
   take 10 (dropWhile (<= 1000) (map (^ 2) [1 ..]))
   -- [1024,1089,1156,1225,1296,1369,1444,1521,1600,1681]

   length (takeWhile (\f -> length (show f) < 100) fibs)
   -- 476: F₄₇₆ é o primeiro com 100 dígitos
   ```
2. ```haskell
   conta :: String -> String
   conta texto = unwords (map show [length (lines texto), length (words texto), length texto]) ++ "\n"

   main :: IO ()
   main = interact conta
   ```
   `interact` lê toda a entrada, aplica a função pura e imprime. Teste com `echo "um dois\ntres" | runghc wc.hs`.
3. ```haskell
   idadeECidade :: String -> [(String, Int)] -> [(String, String)] -> Maybe (Int, String)
   idadeECidade nome idades cidades = do
     i <- lookup nome idades
     c <- lookup nome cidades
     return (i, c)
   ```
   Se qualquer `lookup` der `Nothing`, o resultado inteiro é `Nothing`, sem nenhum `case` explícito.
4. ```haskell
   import Text.Read (readMaybe)

   converte :: String -> Either String Int
   converte s = maybe (Left ("inválido: " ++ s)) Right (readMaybe s)

   somaSegura :: [String] -> Either String Int
   somaSegura xs = sum <$> traverse converte xs

   -- somaSegura ["1", "2", "3"]   == Right 6
   -- somaSegura ["1", "x", "3"]   == Left "inválido: x"
   ```
   `traverse` aplica `converte` a cada item e para no primeiro `Left`; `<$>` (fmap) aplica `sum` dentro do `Right`.
5. ```python
   from itertools import count, islice

   def primos():
       encontrados = []
       for n in count(2):
           if all(n % p for p in encontrados if p * p <= n):
               encontrados.append(n)
               yield n

   print(list(islice(primos(), 20)))
   ```

## Projeto da etapa

Esqueleto sugerido:

```haskell
import qualified Data.Map as M

data Expr
  = Num Int
  | Var String
  | Soma Expr Expr
  | Sub Expr Expr
  | Mult Expr Expr
  | Div Expr Expr
  | Let String Expr Expr
  deriving (Show, Eq)

data Erro = DivisaoPorZero | VariavelNaoDefinida String
  deriving (Show, Eq)

type Ambiente = M.Map String Int

avalia :: Ambiente -> Expr -> Either Erro Int
avalia _ (Num n)       = Right n
avalia amb (Var x)     = maybe (Left (VariavelNaoDefinida x)) Right (M.lookup x amb)
avalia amb (Soma a b)  = (+) <$> avalia amb a <*> avalia amb b
avalia amb (Sub a b)   = (-) <$> avalia amb a <*> avalia amb b
avalia amb (Mult a b)  = (*) <$> avalia amb a <*> avalia amb b
avalia amb (Div a b)   = do
  x <- avalia amb a
  y <- avalia amb b
  if y == 0 then Left DivisaoPorZero else Right (x `div` y)
avalia amb (Let x e corpo) = do
  v <- avalia amb e
  avalia (M.insert x v amb) corpo

simplifica :: Expr -> Expr
simplifica (Soma a b) = case (simplifica a, simplifica b) of
  (Num 0, e)     -> e
  (e, Num 0)     -> e
  (Num x, Num y) -> Num (x + y)
  (x, y)         -> Soma x y
simplifica (Mult a b) = case (simplifica a, simplifica b) of
  (Num 0, _)     -> Num 0
  (_, Num 0)     -> Num 0
  (Num 1, e)     -> e
  (e, Num 1)     -> e
  (Num x, Num y) -> Num (x * y)
  (x, y)         -> Mult x y
simplifica e = e   -- complete para Sub, Div e Let
```

Atenção a uma armadilha que o QuickCheck encontra sozinho: a regra `0 * e = 0` **muda o resultado** quando `e` contém uma divisão por zero ou uma variável indefinida (antes dava erro, depois dá 0). Decida e documente: ou só aplique a regra quando `e` não pode falhar, ou ajuste a propriedade testada. Encontrar esse tipo de caso é exatamente para que servem os testes baseados em propriedades.
