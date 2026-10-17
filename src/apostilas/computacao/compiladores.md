# Compiladores e Linguagens de Programação: Apostila Prática

Roadmap Ciência da Computação · Semanas 91 a 94

## Comece por aqui

Um compilador é a ponte entre o que humanos escrevem e o que a máquina executa, e é um dos programas mais bonitos da computação, porque junta quase tudo o que você estudou: autômatos e gramáticas (Teoria da Computação), árvores e tabelas hash (Estruturas de Dados), grafos e programação dinâmica (Algoritmos), tipos e recursão (Programação Funcional) e assembly e registradores (Arquitetura). Entender compiladores também faz você programar melhor: mensagens de erro passam a fazer sentido, você entende o que o otimizador consegue ou não fazer, e ganha a capacidade de criar **linguagens pequenas** para resolver problemas (linguagens de configuração, consultas, regras de negócio, *templates*), o que é muito mais comum do que parece.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CTC-41 Compiladores |
| MIT | 6.1100 (antiga 6.035) Computer Language Engineering |
| Harvard | CS 1530 (antiga CS 153) Compilers; CS 1520 Programming Languages |
| Oxford | Compilers (2º ano); Principles of Programming Languages |

### Como esta apostila funciona

1. Siga o livro gratuito **Crafting Interpreters** (Robert Nystrom) em paralelo: ele constrói, passo a passo, um interpretador e uma máquina virtual completos para a linguagem Lox.
2. Escreva o seu próprio compilador ao longo das 4 semanas, um estágio por semana, para uma linguagem pequena (a do projeto).
3. Use o **Compiler Explorer** (godbolt.org) para ver como o GCC e o Clang traduzem e otimizam código real.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** o compilador gera algo errado? Imprima a saída de **cada estágio** (tokens, árvore sintática, representação intermediária, código final) para um programa mínimo que reproduz o erro. O bug está no primeiro estágio cuja saída já está errada.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 91 | Tema 1: Visão geral e análise léxica |
| 92 | Tema 2: Análise sintática |
| 93 | Tema 3: Análise semântica e tipos |
| 94 | Tema 4: Geração de código e interpretadores + projeto |

## Tema 1: Visão geral e análise léxica

**Objetivo:** conhecer a estrutura de um compilador e transformar texto em tokens.

### 1.1 Fases de um compilador

```
código-fonte
   │  análise léxica        → tokens
   │  análise sintática     → árvore sintática (AST)
   │  análise semântica     → AST anotada (tipos, escopos), erros
   │  geração de IR         → representação intermediária
   │  otimização            → IR melhorada
   │  geração de código     → assembly / bytecode
   ▼
programa executável
```

As primeiras fases (o **front-end**) dependem da **linguagem de origem**; as últimas (o **back-end**), da **máquina de destino**; a representação intermediária fica no meio. Com essa divisão, M linguagens e N máquinas precisam de M front-ends e N back-ends, não M × N compiladores. É exatamente a arquitetura do **LLVM**: Clang (C/C++), Rust, Swift e Julia geram a mesma IR, e o LLVM sabe gerar código para x86, ARM, RISC-V, WebAssembly e outros.

Compilador ou interpretador?

| | Compilador | Interpretador |
|---|---|---|
| Faz | Traduz o programa inteiro antes de rodar | Executa o programa diretamente (percorrendo a AST ou um bytecode) |
| Velocidade de execução | Alta | Menor |
| Tempo até começar a rodar | Maior | Imediato |
| Exemplos | GCC, rustc, Go | CPython, Ruby (MRI), shells |

A fronteira é difusa: o Python **compila** para bytecode e **interpreta** o bytecode; Java compila para bytecode e a JVM **compila em tempo de execução** (JIT) os trechos mais usados; o V8 (JavaScript) faz o mesmo.

### 1.2 Tokens

O **analisador léxico** (*lexer* ou *scanner*) lê os caracteres e agrupa em **tokens**, as "palavras" da linguagem:

```
var total = preco * 2; // comentário
```

```
VAR  IDENT(total)  IGUAL  IDENT(preco)  VEZES  NUMERO(2)  PONTO_E_VIRGULA  EOF
```

Cada token tem um **tipo**, o **lexema** (o texto original), às vezes um **valor** (o número 2) e a **posição** (linha e coluna, para mensagens de erro). Espaços e comentários são descartados.

### 1.3 Análise léxica

Cada tipo de token é descrito por uma **expressão regular**:

| Token | Expressão regular |
|---|---|
| Identificador | `[a-zA-Z_][a-zA-Z0-9_]*` |
| Número | `[0-9]+(\.[0-9]+)?` |
| String | `"[^"]*"` |
| Operadores | `==`, `=`, `<=`, `<`, ... |

Duas regras resolvem ambiguidades:

- **Casamento mais longo** (*maximal munch*): em `<=`, leia `<=` e não `<` seguido de `=`; em `variavel`, leia o identificador inteiro e não `var` + `iavel`.
- **Prioridade:** se duas regras casam o mesmo texto, vence a declarada primeiro; por isso palavras reservadas (`var`, `if`) vêm antes dos identificadores (ou se lê um identificador e depois se confere numa tabela de palavras reservadas).

Um lexer escrito à mão é só um laço com um `switch` no caractere atual:

```python
def tokens(fonte):
    i, linha = 0, 1
    while i < len(fonte):
        c = fonte[i]
        if c in " \t\r":
            i += 1
        elif c == "\n":
            linha += 1; i += 1
        elif c == "/" and fonte[i:i + 2] == "//":
            while i < len(fonte) and fonte[i] != "\n":
                i += 1
        elif c.isdigit():
            j = i
            while j < len(fonte) and (fonte[j].isdigit() or fonte[j] == "."):
                j += 1
            yield ("NUMERO", float(fonte[i:j]), linha)
            i = j
        elif c.isalpha() or c == "_":
            j = i
            while j < len(fonte) and (fonte[j].isalnum() or fonte[j] == "_"):
                j += 1
            palavra = fonte[i:j]
            yield (palavra.upper() if palavra in RESERVADAS else "IDENT", palavra, linha)
            i = j
        elif fonte[i:i + 2] in ("==", "!=", "<=", ">="):
            yield (fonte[i:i + 2], None, linha); i += 2
        elif c in "+-*/=<>(){};,!":
            yield (c, None, linha); i += 1
        else:
            raise SyntaxError(f"linha {linha}: caractere inesperado {c!r}")
    yield ("EOF", None, linha)
```

### 1.4 Autômatos na prática

Por baixo, um lexer é um **autômato finito** (Teoria da Computação): as expressões regulares de todos os tokens viram um NFA (Thompson), que vira um DFA (subconjuntos), que é minimizado. Ferramentas como **lex/flex** e **re2c** fazem essa construção automaticamente a partir das expressões regulares e geram código C com uma tabela de transições. O lexer escrito à mão acima é um DFA codificado em `if`s.

O tempo de análise léxica é **linear** no tamanho do código, e costuma ser uma fração relevante do tempo total de compilação (é a única fase que olha cada caractere).

### Atividades de fixação do Tema 1

1. Liste os tokens de `if (x >= 10) { y = x * 2.5; } // fim`.
2. Escreva expressões regulares para: números inteiros em hexadecimal (`0x1F`), strings com aspas escapadas (`"diz \"oi\""`), e comentários de bloco `/* ... */` (que não aninham).
3. Por que comentários de bloco **aninhados** (`/* a /* b */ c */`) não podem ser reconhecidos por uma expressão regular? Como o lexer pode tratá-los?
4. Desenhe o DFA que reconhece os tokens `<`, `<=`, `<<` e `=`, `==`, aplicando o casamento mais longo.
5. Estenda o lexer do texto com strings, a palavra reservada `while` e mensagens de erro com linha e coluna.

## Tema 2: Análise sintática

**Objetivo:** construir a árvore sintática a partir dos tokens, conforme a gramática da linguagem.

### 2.1 Gramáticas

A sintaxe é descrita por uma **gramática livre de contexto** (Teoria da Computação), normalmente em notação EBNF. Exemplo, uma linguagem pequena:

```
programa    → declaracao* EOF
declaracao  → "var" IDENT "=" expressao ";"
            | "print" expressao ";"
            | "if" "(" expressao ")" bloco ("else" bloco)?
            | "while" "(" expressao ")" bloco
            | expressao ";"
bloco       → "{" declaracao* "}"
expressao   → atribuicao
atribuicao  → IDENT "=" atribuicao | igualdade
igualdade   → comparacao (("==" | "!=") comparacao)*
comparacao  → termo (("<" | "<=" | ">" | ">=") termo)*
termo       → fator (("+" | "-") fator)*
fator       → unario (("*" | "/") unario)*
unario      → ("!" | "-") unario | primario
primario    → NUMERO | STRING | IDENT | "true" | "false" | "(" expressao ")"
```

Cada nível corresponde a um nível de **precedência** (os mais "fundos" ligam mais forte), e as repetições `(...)*` dão **associatividade à esquerda**. A atribuição é recursiva à direita, porque `a = b = c` significa `a = (b = c)`.

### 2.2 Parser descendente recursivo

Um **parser descendente recursivo** tem **uma função para cada regra** da gramática. Cada função olha o próximo token para decidir que alternativa seguir. É o método mais usado em compiladores reais escritos à mão (GCC, Clang, Go, V8, rustc), porque é simples, rápido e permite **ótimas mensagens de erro**.

```python
class Parser:
    def __init__(self, tokens):
        self.toks, self.pos = list(tokens), 0

    def olha(self):
        return self.toks[self.pos][0]

    def casa(self, *tipos):
        if self.olha() in tipos:
            self.pos += 1
            return self.toks[self.pos - 1]
        return None

    def espera(self, tipo, msg):
        tok = self.casa(tipo)
        if tok is None:
            raise SyntaxError(f"linha {self.toks[self.pos][2]}: {msg}")
        return tok

    def termo(self):
        esq = self.fator()
        while (op := self.casa("+", "-")):
            esq = ("binario", op[0], esq, self.fator())
        return esq

    def fator(self):
        esq = self.unario()
        while (op := self.casa("*", "/")):
            esq = ("binario", op[0], esq, self.unario())
        return esq

    def unario(self):
        if (op := self.casa("!", "-")):
            return ("unario", op[0], self.unario())
        return self.primario()

    def primario(self):
        if (t := self.casa("NUMERO")):
            return ("literal", t[1])
        if (t := self.casa("IDENT")):
            return ("variavel", t[1])
        if self.casa("("):
            e = self.expressao()
            self.espera(")", "esperava ')' depois da expressão")
            return ("grupo", e)
        raise SyntaxError(f"linha {self.toks[self.pos][2]}: esperava uma expressão")
```

Requisitos: a gramática não pode ter **recursão à esquerda** (`termo → termo + fator` geraria recursão infinita; troca-se por repetição) e deve ser possível decidir a alternativa olhando poucos tokens adiante (gramáticas **LL(k)**; a maioria das construções precisa de 1).

**Precedência por escalada** (*Pratt parsing*): uma variação elegante para expressões, em que cada operador tem uma força de ligação e uma única função trata todos os níveis. Muito usada para linguagens com muitos operadores.

**Recuperação de erros:** ao achar um erro, o parser registra a mensagem e **sincroniza**, pulando tokens até um ponto seguro (o próximo `;` ou `}`), para continuar e relatar vários erros de uma vez.

### 2.3 Parsers ascendentes

Os parsers **ascendentes** (*bottom-up*), da família **LR** (LR(0), SLR, **LALR**, LR(1)), leem os tokens da esquerda para a direita, **empilhando** (*shift*), e quando o topo da pilha forma o lado direito de uma regra, **reduzem** (*reduce*) para o lado esquerdo. Uma tabela gerada automaticamente da gramática diz, para cada estado e token, se empilha, reduz, aceita ou dá erro.

```
pilha              entrada        ação
                   2 + 3 * 4      empilha 2
2                  + 3 * 4        reduz: fator → NUM, termo → fator
termo              + 3 * 4        empilha +
termo +            3 * 4          empilha 3, reduz até fator
termo + fator      * 4            empilha * (o * liga mais forte: não reduz ainda)
...
```

São mais **poderosos** (aceitam mais gramáticas, inclusive com recursão à esquerda) e lineares, mas as tabelas são grandes demais para fazer à mão: usam-se **geradores de parsers** como **yacc/Bison** (LALR), ANTLR (LL(\*), descendente) e tree-sitter. Conflitos na tabela (*shift/reduce*, *reduce/reduce*) indicam ambiguidade ou gramática inadequada; o "else pendurado" é o conflito clássico, resolvido escolhendo *shift* (o `else` fica com o `if` mais próximo).

### 2.4 Árvore sintática

A **árvore de derivação** (Teoria da Computação) tem um nó para cada regra aplicada, inclusive parênteses e níveis de precedência. O compilador trabalha com a **árvore sintática abstrata** (AST), que guarda só o essencial:

```
fonte:   x = (a + 2) * b;

AST:     Atribuicao(x,
           Binario(*,
             Binario(+, Variavel(a), Literal(2)),
             Variavel(b)))
```

Os parênteses sumiram: a estrutura da árvore já diz o que agrupa. Em linguagens com tipos algébricos, a AST é um tipo soma (como a `Expr` da Programação Funcional); em linguagens orientadas a objetos, uma hierarquia de classes, percorrida com o padrão **Visitor** ou com casamento de padrões.

Cada nó deve guardar a **posição** no código-fonte, para mensagens de erro nas fases seguintes.

### Atividades de fixação do Tema 2

1. Desenhe a AST de `a = b = 3 + 4 * -c;` com a gramática do texto.
2. Reescreva sem recursão à esquerda: `lista → lista "," item | item`.
3. Complete o parser do texto com `expressao`, `atribuicao`, `igualdade`, `comparacao`, as declarações `var`, `print`, `if` e `while`, e blocos.
4. Acrescente o operador de potência `^`, com precedência maior que `*` e **associatividade à direita** (`2 ^ 3 ^ 2 = 2 ^ 9`). Que muda no parser?
5. Implemente a recuperação de erros por sincronização e mostre que o parser relata dois erros num programa com dois `;` faltando.
6. Simule um parser LR para `id + id * id` com a gramática de expressões (E → E + T | T; T → T * F | F; F → id), mostrando a pilha e a ação em cada passo.

## Tema 3: Análise semântica e tipos

**Objetivo:** verificar que o programa faz sentido (nomes declarados, tipos compatíveis) e entender sistemas de tipos e semântica.

### 3.1 Tabela de símbolos

Um programa sintaticamente correto pode estar errado: usar uma variável não declarada, declarar duas vezes, chamar uma função com o número errado de argumentos, somar um número com uma função. A **análise semântica** percorre a AST e verifica essas regras, usando a **tabela de símbolos**: um mapeamento de nomes para informações (tipo, tipo de declaração, posição na memória).

Implementação típica: uma **pilha de tabelas hash**, uma por escopo. Entrar num bloco empilha uma tabela nova; sair desempilha. Buscar um nome percorre a pilha do topo (escopo mais interno) para a base (global).

```python
class Escopos:
    def __init__(self):
        self.pilha = [{}]
    def entra(self):
        self.pilha.append({})
    def sai(self):
        self.pilha.pop()
    def declara(self, nome, info):
        if nome in self.pilha[-1]:
            raise NameError(f"'{nome}' já declarada neste escopo")
        self.pilha[-1][nome] = info
    def busca(self, nome):
        for escopo in reversed(self.pilha):
            if nome in escopo:
                return escopo[nome]
        raise NameError(f"'{nome}' não declarada")
```

### 3.2 Escopo

O **escopo** de uma declaração é a região do programa onde ela é visível.

- **Escopo léxico (estático):** determinado pela estrutura do texto. Uma função enxerga as variáveis do lugar onde foi **escrita**. É o padrão em quase todas as linguagens modernas.
- **Escopo dinâmico:** determinado pela **pilha de chamadas** em tempo de execução (a função enxerga as variáveis de quem a chamou). Usado em Lisps antigos e em variáveis especiais de alguns shells; difícil de raciocinar.

Escopo léxico com funções de primeira classe leva às **closures**: uma função que "captura" variáveis do escopo onde foi criada e as mantém vivas depois que esse escopo terminou.

```python
def contador():
    n = 0
    def incrementa():
        nonlocal n
        n += 1
        return n
    return incrementa

c = contador()
c(); c()     # 2: a variável n continua viva dentro da closure
```

Para implementar closures, o compilador precisa guardar as variáveis capturadas **fora da pilha** (no heap), porque a função externa já retornou. A etapa de **resolução de nomes** (em Crafting Interpreters, o *resolver*) calcula, para cada uso de variável, a quantos escopos de distância ela foi declarada, resolvendo de uma vez por todas qual declaração cada nome usa.

### 3.3 Sistemas de tipos

Um **sistema de tipos** classifica as expressões por tipo e rejeita programas que combinam tipos de forma inválida. Dimensões:

| Dimensão | Opções | Exemplos |
|---|---|---|
| Quando verifica | **Estático** (na compilação) ou **dinâmico** (na execução) | Java, Rust, Haskell / Python, JavaScript |
| Rigor | **Forte** (sem conversões implícitas perigosas) ou **fraco** | Python, Haskell / C, JavaScript (`"5" * 2 = 10`) |
| Anotação | **Explícita** ou **inferida** | Java antigo / Haskell, Rust, Kotlin, TypeScript (em parte) |
| Compatibilidade | **Nominal** (pelo nome do tipo) ou **estrutural** (pela forma) | Java / TypeScript, Go (interfaces) |

**Verificação de tipos** é uma recursão sobre a AST, com uma regra por tipo de nó. Em notação de regras de inferência (lê-se: se o que está em cima vale, o que está embaixo vale):

```
  Γ ⊢ e₁ : int    Γ ⊢ e₂ : int          Γ ⊢ c : bool    Γ ⊢ e₁ : T    Γ ⊢ e₂ : T
 ─────────────────────────────          ─────────────────────────────────────────
     Γ ⊢ e₁ + e₂ : int                        Γ ⊢ if c then e₁ else e₂ : T
```

(Γ é o **contexto**: a tabela de símbolos com os tipos das variáveis.)

```python
def tipo(no, env):
    match no:
        case ("literal", v):
            return "bool" if isinstance(v, bool) else "num"
        case ("variavel", nome):
            return env.busca(nome)
        case ("binario", op, a, b):
            ta, tb = tipo(a, env), tipo(b, env)
            if op in "+-*/":
                if ta == tb == "num": return "num"
                raise TypeError(f"'{op}' espera números, recebeu {ta} e {tb}")
            if op in ("<", "<=", ">", ">="):
                if ta == tb == "num": return "bool"
                raise TypeError(f"'{op}' espera números")
            if op in ("==", "!="):
                if ta == tb: return "bool"
                raise TypeError("comparação entre tipos diferentes")
```

**Inferência de tipos** (algoritmo de **Hindley-Milner**, usado em Haskell, OCaml e em parte do Rust): o compilador descobre os tipos sem anotações, gerando **variáveis de tipo** e **equações** entre elas a partir do código, e resolvendo-as por **unificação**. Por isso, em Haskell, `dobro x = x + x` recebe o tipo `Num a => a -> a` sozinho.

**Polimorfismo**: paramétrico (genéricos: `List<T>`, `[a]`), de subtipos (herança e interfaces) e *ad hoc* (sobrecarga e classes de tipos).

**Segurança de tipos** (*type safety*): "programas bem tipados não dão errado" (Robin Milner). Formalmente, **progresso** (uma expressão bem tipada é um valor ou pode dar mais um passo) e **preservação** (dar um passo mantém o tipo). C não tem segurança de tipos (dá para tratar qualquer memória como qualquer tipo); Rust tem, e estende o sistema de tipos para garantir **segurança de memória** sem coletor de lixo (o *borrow checker*).

### 3.4 Semântica de linguagens

O que um programa **significa**? A **semântica formal** responde com matemática, em três estilos:

- **Operacional:** o significado é **como executa**, em passos de reescrita (como o modelo de substituição da Programação Funcional). Por exemplo: `if true then e₁ else e₂ → e₁`. É a base de interpretadores e das provas de segurança de tipos.
- **Denotacional:** o significado de cada construção é um **objeto matemático** (uma função), definido por composição a partir das partes.
- **Axiomática:** o significado é dado pelo que se pode **provar** sobre o programa, com triplas de Hoare {P} C {Q}: se P vale antes de executar C, Q vale depois. Os invariantes de laço da etapa de OO são a regra do `while` da lógica de Hoare.

Semântica formal permite especificar linguagens sem ambiguidade (o WebAssembly tem semântica formal desde o início), provar compiladores corretos (CompCert) e construir ferramentas de verificação.

Decisões semânticas que mudam tudo: **ordem de avaliação** (os argumentos são avaliados antes da chamada, como em quase todas as linguagens, ou só quando usados, como no Haskell?), **passagem de parâmetros** (por valor, por referência, por compartilhamento como no Python e no Java), e o que acontece em erros (comportamento indefinido em C, exceção em Java).

### Atividades de fixação do Tema 3

1. Que erros a análise semântica deve apontar neste programa?
   ```
   var a = 1;
   { var b = a + c; var a = 2; var a = 3; }
   print b;
   ```
2. O que imprime com escopo léxico e com escopo dinâmico?
   ```
   var x = 1;
   fun f() { print x; }
   fun g() { var x = 2; f(); }
   g();
   ```
3. Escreva as regras de tipo (no estilo do texto) para `while`, `!` e `==`.
4. Complete o verificador de tipos com `unario`, atribuição e declaração de variáveis, e teste com programas corretos e com erros.
5. Infira à mão o tipo de `compoe f g x = f (g x)` em Haskell, gerando e resolvendo as equações.
6. Usando a lógica de Hoare, mostre que `{x = 5} y := x + 1 {y = 6}` é válida, e encontre a pré-condição mais fraca para `{?} x := x * 2 {x > 10}`.

## Tema 4: Geração de código e interpretadores

**Objetivo:** traduzir a AST para uma representação intermediária, otimizar e gerar código, ou executá-la num interpretador ou máquina virtual.

### 4.1 Representação intermediária

A **representação intermediária** (IR) é a linguagem interna do compilador, mais simples que o código-fonte e independente da máquina. Formas comuns:

**Código de três endereços:** cada instrução tem no máximo um operador.

```
fonte:  x = (a + b) * (a + b) - c

t1 = a + b
t2 = a + b
t3 = t1 * t2
x  = t3 - c
```

**Grafo de fluxo de controle** (CFG): as instruções agrupadas em **blocos básicos** (sequências sem desvios no meio), com arestas para os possíveis próximos blocos. É sobre ele que as análises e otimizações trabalham (algoritmos de grafos!).

**Forma SSA** (*static single assignment*): cada variável é atribuída **uma única vez**; onde caminhos se juntam, uma função **φ** escolhe o valor conforme o caminho de onde se veio. Simplifica muitas otimizações e é usada pelo LLVM, GCC e pelos JITs modernos.

```
if (c) x = 1; else x = 2;      x1 = 1   (bloco "então")
y = x + 1;                      x2 = 2   (bloco "senão")
                                x3 = φ(x1, x2)
                                y1 = x3 + 1
```

### 4.2 Geração de código

Traduzir a IR para assembly exige três decisões:

- **Seleção de instruções:** que instruções da máquina implementam cada operação da IR (casamento de padrões em árvores; `x * 8` pode virar um deslocamento).
- **Alocação de registradores:** a máquina tem poucos registradores (32 no RISC-V) e o programa, muitas variáveis. Monta-se o **grafo de interferência** (vértices são variáveis; aresta entre duas que estão "vivas" ao mesmo tempo) e faz-se a **coloração** do grafo com k cores, uma por registrador (Matemática Discreta!). Variáveis que não cabem são guardadas na pilha (*spill*). Colorir é NP-difícil, então usam-se heurísticas (Chaitin) ou, em JITs, a alocação mais rápida por varredura linear.
- **Escalonamento de instruções:** reordenar para evitar bolhas no pipeline (Arquitetura).

Para uma linguagem simples, dá para gerar código diretamente da AST para uma **máquina de pilha**, percorrendo a árvore em pós-ordem:

```python
def gera(no, codigo):
    match no:
        case ("literal", v):
            codigo.append(("CONST", v))
        case ("variavel", nome):
            codigo.append(("LOAD", nome))
        case ("binario", op, a, b):
            gera(a, codigo)          # deixa a na pilha
            gera(b, codigo)          # deixa b na pilha
            codigo.append(({"+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV"}[op],))
```

`(a + 2) * b` vira `LOAD a; CONST 2; ADD; LOAD b; MUL`. Desvios viram saltos com **remendo** (*backpatching*): gera-se o salto com destino desconhecido e preenche-se depois, quando o destino for conhecido.

### 4.3 Otimizações

Otimizações transformam o código sem mudar o comportamento observável. Algumas clássicas:

| Otimização | Antes | Depois |
|---|---|---|
| Dobra de constantes | `x = 60 * 60 * 24` | `x = 86400` |
| Propagação de constantes | `a = 5; b = a + 1` | `b = 6` |
| Eliminação de subexpressão comum | `t1 = a + b; t2 = a + b` | `t2 = t1` |
| Eliminação de código morto | `x = f();` (x nunca usado, f sem efeitos) | (removido) |
| Redução de força | `x * 8` | `x << 3` |
| Movimentação de código invariante | Calcular `n * 2` dentro do laço | Calcular uma vez antes do laço |
| *Inlining* | Chamada de função pequena | Corpo da função no lugar |
| Desenrolar laços | Laço de 4 voltas | 4 cópias do corpo |
| Vetorização | Laço escalar | Instruções SIMD |

Muitas dependem de **análises de fluxo de dados**: quais variáveis estão **vivas** em cada ponto (necessárias depois), quais definições **alcançam** cada uso. São resolvidas como sistemas de equações sobre o CFG, iterando até um ponto fixo.

O *inlining* é a otimização mais importante na prática: além de eliminar o custo da chamada, expõe o corpo da função às outras otimizações no contexto de quem chamou.

> **Cuidado! Cai na prática:** em C, o otimizador assume que **comportamento indefinido nunca acontece**. Um teste como `if (x + 1 < x)` para detectar estouro de `int` pode ser **removido inteiro**, porque "x + 1 < x nunca é verdade" se não houver estouro. Escreva `if (x == INT_MAX)` ou use `__builtin_add_overflow`.

### 4.4 Interpretadores e máquinas virtuais

**Interpretador de árvore** (*tree-walking*): percorre a AST e executa cada nó. O mais simples de escrever (é o `avalia` da Programação Funcional), porém mais lento.

```python
def avalia(no, env):
    match no:
        case ("literal", v): return v
        case ("variavel", nome): return env[nome]
        case ("binario", "+", a, b): return avalia(a, env) + avalia(b, env)
        case ("binario", "*", a, b): return avalia(a, env) * avalia(b, env)
        # ...
```

**Máquina virtual de bytecode:** o compilador gera instruções compactas para uma máquina imaginária, e um laço executa:

```python
def executa(codigo, variaveis):
    pilha, pc = [], 0
    while pc < len(codigo):
        instr = codigo[pc]
        match instr[0]:
            case "CONST": pilha.append(instr[1])
            case "LOAD":  pilha.append(variaveis[instr[1]])
            case "STORE": variaveis[instr[1]] = pilha.pop()
            case "ADD":   b, a = pilha.pop(), pilha.pop(); pilha.append(a + b)
            case "MUL":   b, a = pilha.pop(), pilha.pop(); pilha.append(a * b)
            case "JMP_SE_FALSO":
                if not pilha.pop():
                    pc = instr[1]; continue
            case "JMP":   pc = instr[1]; continue
        pc += 1
```

Bytecode é mais rápido que percorrer a árvore (instruções contíguas na memória, menos indireções). Máquinas de **pilha** (JVM, CPython, WebAssembly) geram código simples; máquinas de **registradores** (Lua, Dalvik) executam menos instruções.

**Compilação JIT** (*just-in-time*): a máquina virtual interpreta no começo, mede quais trechos rodam muito (*hot spots*) e os compila para código de máquina durante a execução, podendo usar informações reais (os tipos que de fato aparecem) para otimizar de forma especulativa, e desfazer (*deoptimize*) se a suposição falhar. É o que torna JavaScript (V8) e Java (HotSpot) rápidos.

**Coleta de lixo:** linguagens com memória automática precisam de um **coletor de lixo** na máquina virtual: **contagem de referências** (CPython, Swift; não coleta ciclos sozinha), **marcar e varrer** (marca tudo que é alcançável a partir das raízes, como variáveis globais e a pilha, e libera o resto) e coletores **geracionais** (a maioria dos objetos morre jovem; coleta a geração nova com frequência).

### Atividades de fixação do Tema 4

1. Traduza para código de três endereços e desenhe o CFG:
   ```
   s = 0; i = 0;
   while (i < n) { if (i % 2 == 0) s = s + i; i = i + 1; }
   ```
2. Converta o trecho do exercício 1 para SSA (onde entram as funções φ?).
3. Aplique à mão dobra e propagação de constantes, eliminação de subexpressão comum e de código morto:
   ```
   a = 4; b = a * 2; c = x + b; d = x + b; e = c * 0; y = d + e
   ```
4. Gere bytecode de máquina de pilha para `if (a < b) m = a; else m = b;` com remendo dos saltos.
5. Monte o grafo de interferência para o código abaixo e diga quantos registradores são necessários sem *spill*:
   ```
   a = 1; b = 2; c = a + b; d = a * c; e = b + d; return e
   ```
6. Compile `int quadrado(int x) { return x * x; } int f(int y) { return quadrado(y + 1); }` no Compiler Explorer com `-O0` e `-O2`. O que o otimizador fez?

## Projeto da etapa

**Interpretador e compilador para uma linguagem pequena** (seguindo *Crafting Interpreters*, ou com a sua própria linguagem):

1. **Linguagem:** números, booleanos, strings, variáveis, aritmética, comparação, `if`/`else`, `while`, funções com recursão e closures, e `print`.
2. **Lexer e parser** descendente recursivo escritos à mão, com mensagens de erro com linha e coluna e recuperação por sincronização.
3. **Resolução de nomes e verificação de tipos** estática (ao menos para números, booleanos e strings).
4. **Interpretador de árvore** completo (a primeira metade do livro, *jlox*).
5. **Compilador para bytecode e máquina virtual** (a segunda metade, *clox*, em C), com pilha, chamadas de função e coleta de lixo por marcar e varrer. Ou, como alternativa, gere **assembly RISC-V** e rode no simulador da etapa de Arquitetura.
6. Pelo menos duas otimizações (dobra de constantes e eliminação de código morto) e um benchmark (Fibonacci recursivo de 30) comparando o interpretador de árvore, a máquina virtual e o Python.
7. Uma bateria de testes com programas de exemplo e as saídas esperadas, incluindo programas com erros de propósito.

## Para ir além

- *Crafting Interpreters* (Robert Nystrom, gratuito online): o melhor ponto de partida.
- *Engineering a Compiler* (Cooper e Torczon) e o "livro do dragão", *Compilers: Principles, Techniques, and Tools* (Aho, Lam, Sethi e Ullman).
- *Types and Programming Languages* (Benjamin Pierce): a referência de sistemas de tipos.
- **Stanford CS 143** e o curso **Compilers** de Alex Aiken (gratuito online), com o projeto da linguagem COOL.
- O tutorial **Kaleidoscope** do LLVM: um front-end que gera IR do LLVM e ganha otimizações e geração de código de graça.
- Notas públicas de **Compilers** de Oxford e o *Essentials of Compilation* (Jeremy Siek, gratuito).

## Resumão

- Fases: léxica, sintática, semântica, IR, otimização, geração de código. Front-end, IR e back-end (LLVM).
- Compilador traduz antes; interpretador executa direto; bytecode e JIT ficam no meio.
- Lexer: expressões regulares → DFA. Casamento mais longo e prioridade das palavras reservadas.
- Gramática codifica precedência e associatividade. Descendente recursivo: uma função por regra, sem recursão à esquerda.
- LR/LALR: empilha e reduz com tabelas geradas (Bison). Conflitos indicam ambiguidade.
- AST guarda só o essencial, com posições para mensagens de erro.
- Tabela de símbolos: pilha de escopos. Escopo léxico e closures (variáveis capturadas vão para o heap).
- Tipos: estático ou dinâmico, forte ou fraco, nominal ou estrutural. Verificação por regras recursivas; Hindley-Milner infere por unificação.
- Semântica operacional, denotacional e axiomática (lógica de Hoare).
- IR: três endereços, CFG, SSA com φ. Alocação de registradores é coloração de grafos.
- Otimizações: constantes, subexpressões comuns, código morto, invariantes de laço, inlining, vetorização. UB em C é premissa do otimizador.
- Interpretador de árvore é simples; VM de bytecode é mais rápida; JIT compila os trechos quentes. Coleta de lixo: contagem, marcar e varrer, gerações.
