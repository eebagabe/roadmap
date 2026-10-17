# Gabarito: Compiladores e Linguagens de Programação

Abra só depois de tentar.

## Tema 1

1. `IF  (  IDENT(x)  >=  NUMERO(10)  )  {  IDENT(y)  =  IDENT(x)  *  NUMERO(2.5)  ;  }  EOF`. O comentário e os espaços são descartados; `>=` é um único token (casamento mais longo).
2. Hexadecimal: `0[xX][0-9a-fA-F]+`. String com escapes: `"([^"\\]|\\.)*"` (qualquer caractere que não seja aspas nem barra, ou uma barra seguida de qualquer caractere). Comentário de bloco sem aninhamento: `/\*([^*]|\*+[^*/])*\*+/` (o difícil é aceitar asteriscos no meio sem terminar antes do `*/`; por isso lexers escritos à mão tratam comentários com um laço simples).
3. Aninhamento exige **contar** quantos `/*` foram abertos, sem limite: é o mesmo problema dos parênteses balanceados, que não é regular (lema do bombeamento). O lexer resolve fugindo do autômato puro: ao ver `/*`, entra num laço com um **contador** de profundidade, que soma 1 a cada `/*` e subtrai 1 a cada `*/`, e termina quando o contador volta a 0.
4. Estados: início; depois de `<` (aceita como `<`); depois de `<=` (aceita); depois de `<<` (aceita); depois de `=` (aceita como `=`); depois de `==` (aceita). Do início: `<` → estado "<"; `=` → estado "=". Do estado "<": `=` → "<="; `<` → "<<"; qualquer outro caractere: emite `<` sem consumi-lo. Do estado "=": `=` → "=="; outro: emite `=`. O casamento mais longo é "continuar enquanto houver transição e emitir o último estado de aceitação visto".
5. Acréscimos ao laço:
   ```python
   elif c == '"':
       j = i + 1
       while j < len(fonte) and fonte[j] != '"':
           if fonte[j] == "\n": linha += 1
           j += 1
       if j >= len(fonte):
           raise SyntaxError(f"linha {linha}: string não terminada")
       yield ("STRING", fonte[i + 1:j], linha)
       i = j + 1
   ```
   `while` entra no conjunto `RESERVADAS`. Para a coluna, guarde o índice do início da linha atual (`inicio_linha = i + 1` ao ler `\n`) e calcule `coluna = i - inicio_linha + 1` em cada token.

## Tema 2

1. A atribuição é recursiva à direita e o menos unário liga mais forte que tudo:
   ```
   Atribuicao(a,
     Atribuicao(b,
       Binario(+,
         Literal(3),
         Binario(*,
           Literal(4),
           Unario(-, Variavel(c))))))
   ```
2. `lista → item ("," item)*` (forma EBNF), ou, sem EBNF: `lista → item resto`; `resto → "," item resto | ε`.
3. Esboço das partes que faltam:
   ```python
   def expressao(self):
       return self.atribuicao()

   def atribuicao(self):
       esq = self.igualdade()
       if self.casa("="):
           valor = self.atribuicao()                  # recursão: associatividade à direita
           if esq[0] != "variavel":
               raise SyntaxError("alvo de atribuição inválido")
           return ("atribui", esq[1], valor)
       return esq

   def igualdade(self):
       esq = self.comparacao()
       while (op := self.casa("==", "!=")):
           esq = ("binario", op[0], esq, self.comparacao())
       return esq

   def comparacao(self):
       esq = self.termo()
       while (op := self.casa("<", "<=", ">", ">=")):
           esq = ("binario", op[0], esq, self.termo())
       return esq

   def declaracao(self):
       if self.casa("VAR"):
           nome = self.espera("IDENT", "esperava o nome da variável")[1]
           self.espera("=", "esperava '='")
           e = self.expressao()
           self.espera(";", "esperava ';'")
           return ("var", nome, e)
       if self.casa("PRINT"):
           e = self.expressao(); self.espera(";", "esperava ';'")
           return ("print", e)
       if self.casa("IF"):
           self.espera("(", "esperava '('"); c = self.expressao(); self.espera(")", "esperava ')'")
           entao = self.bloco()
           senao = self.bloco() if self.casa("ELSE") else None
           return ("if", c, entao, senao)
       if self.casa("WHILE"):
           self.espera("(", "esperava '('"); c = self.expressao(); self.espera(")", "esperava ')'")
           return ("while", c, self.bloco())
       e = self.expressao(); self.espera(";", "esperava ';'")
       return ("expr", e)

   def bloco(self):
       self.espera("{", "esperava '{'")
       decls = []
       while self.olha() not in ("}", "EOF"):
           decls.append(self.declaracao())
       self.espera("}", "esperava '}'")
       return ("bloco", decls)
   ```
   O truque da atribuição: lê-se o lado esquerdo como uma expressão qualquer e, ao ver `=`, confere-se que ela era um alvo válido (uma variável).
4. Um novo nível entre `fator` e `unario`, com **recursão à direita** em vez de laço:
   ```python
   def potencia(self):
       base = self.unario()
       if self.casa("^"):
           return ("binario", "^", base, self.potencia())   # chama a si mesma: associa à direita
       return base
   ```
   e `fator` passa a chamar `potencia` no lugar de `unario`. (Decida também se `-2 ^ 2` é −4, como na matemática, ou 4; para dar −4, o unário deve ficar **acima** da potência.)
5. ```python
   def sincroniza(self):
       while self.olha() != "EOF":
           if self.toks[self.pos - 1][0] == ";":
               return
           if self.olha() in ("VAR", "PRINT", "IF", "WHILE", "FUN"):
               return
           self.pos += 1

   def programa(self):
       decls, erros = [], []
       while self.olha() != "EOF":
           try:
               decls.append(self.declaracao())
           except SyntaxError as e:
               erros.append(str(e))
               self.sincroniza()
       return decls, erros
   ```
6. ```
   pilha          entrada          ação
   $              id + id * id $   empilha id
   $ id           + id * id $      reduz F → id
   $ F            + id * id $      reduz T → F
   $ T            + id * id $      reduz E → T
   $ E            + id * id $      empilha +
   $ E +          id * id $        empilha id
   $ E + id       * id $           reduz F → id
   $ E + F        * id $           reduz T → F
   $ E + T        * id $           empilha *   (não reduz E → E + T: o * tem precedência)
   $ E + T *      id $             empilha id
   $ E + T * id   $                reduz F → id
   $ E + T * F    $                reduz T → T * F
   $ E + T        $                reduz E → E + T
   $ E            $                aceita
   ```
   A decisão crucial é na linha marcada: com `*` na entrada, a tabela manda **empilhar** em vez de reduzir, e é assim que a precedência aparece num parser LR.

## Tema 3

1. Três erros: (1) **`c` não declarada** (em `var b = a + c`); (2) **`a` declarada duas vezes no mesmo escopo** (`var a = 2; var a = 3;` dentro do bloco; a primeira declaração interna, que esconde o `a` de fora, é permitida); (3) **`b` não está visível** no `print b`, porque foi declarada dentro do bloco, que já terminou. (Em `var b = a + c`, o `a` é o de **fora**, com valor 1, porque o `a` interno só é declarado depois.)
2. **Escopo léxico: imprime 1.** `f` foi escrita no nível global e enxerga o `x` global. **Escopo dinâmico: imprime 2.** `f` foi chamada por `g`, e o `x` mais recente na pilha de chamadas é o de `g`.
3. ```
       Γ ⊢ c : bool    Γ ⊢ corpo ok              Γ ⊢ e : bool             Γ ⊢ e₁ : T    Γ ⊢ e₂ : T
      ─────────────────────────────            ──────────────            ───────────────────────────
         Γ ⊢ while c corpo ok                    Γ ⊢ !e : bool               Γ ⊢ e₁ == e₂ : bool
   ```
   (`while` é um comando: não tem tipo, só precisa estar "ok".)
4. ```python
   case ("unario", "-", e):
       if tipo(e, env) != "num": raise TypeError("'-' espera número")
       return "num"
   case ("unario", "!", e):
       if tipo(e, env) != "bool": raise TypeError("'!' espera booleano")
       return "bool"
   case ("atribui", nome, e):
       t_var, t_e = env.busca(nome), tipo(e, env)
       if t_var != t_e: raise TypeError(f"'{nome}' é {t_var}, recebeu {t_e}")
       return t_var
   ```
   E na declaração `("var", nome, e)`: calcule o tipo de `e` **antes** de declarar (`env.declara(nome, tipo(e, env))`), para que `var x = x;` dê erro de variável não declarada.
5. `compoe f g x = f (g x)`. Variáveis de tipo: x : α; `g x` exige g : α → β; `f (g x)` exige f : β → γ; o resultado tem tipo γ. Portanto **compoe :: (β → γ) → (α → β) → α → γ**, que é o tipo do operador `(.)`.
6. Para `y := x + 1`, a pré-condição mais fraca de `y = 6` é obtida substituindo y por x + 1: **x + 1 = 6**, ou seja, x = 5. Como `{x = 5}` implica isso, a tripla é válida. Para `x := x * 2` com pós-condição x > 10: substitua x por x × 2: **x × 2 > 10**, ou seja, **x > 5** (nos inteiros, x ≥ 6). Essa é a **regra da atribuição** de Hoare: wp(x := e, Q) = Q[x ← e].

## Tema 4

1. ```
   B0:  s = 0
        i = 0
   B1:  if i >= n goto B5          (teste do while)
   B2:  t1 = i % 2
        if t1 != 0 goto B4
   B3:  s = s + i
   B4:  i = i + 1
        goto B1
   B5:  (fim)
   ```
   CFG: B0 → B1; B1 → B2 e B1 → B5; B2 → B3 e B2 → B4; B3 → B4; B4 → B1 (a aresta de volta forma o laço).
2. As funções φ entram onde caminhos se juntam e uma variável tem definições diferentes: no início de **B1** (`s` e `i` vêm de B0 ou de B4) e no início de **B4** (`s` vem de B2 sem alteração ou de B3 alterado):
   ```
   B0:  s0 = 0; i0 = 0
   B1:  s1 = φ(s0, s3); i1 = φ(i0, i2)
        if i1 >= n goto B5
   B2:  t1 = i1 % 2; if t1 != 0 goto B4
   B3:  s2 = s1 + i1
   B4:  s3 = φ(s1, s2); i2 = i1 + 1; goto B1
   ```
3. Propagação e dobra: a = 4, b = 8, c = x + 8, d = x + 8. Subexpressão comum: d = c. e = c × 0 = 0 (dobra algébrica). y = d + e = c + 0 = c. Código morto: a, b, d e e não são mais usados. Resultado: **`c = x + 8; y = c`** (ou só `y = x + 8`, se c não for usado depois).
4. ```
   0: LOAD a
   1: LOAD b
   2: LT
   3: JMP_SE_FALSO ?      (remendado para 7)
   4: LOAD a
   5: STORE m
   6: JMP ?               (remendado para 9)
   7: LOAD b
   8: STORE m
   9: ...
   ```
   Ao gerar o salto na posição 3, o destino ainda não existe: guarda-se a posição 3 numa lista e, ao começar o `else` (posição 7), escreve-se 7 lá. O mesmo para o salto da posição 6, preenchido com 9 ao terminar o `else`.
5. Vivas: depois de `a = 1`: {a}; depois de `b = 2`: {a, b}; depois de `c = a + b`: {a, b, c} (a é usado em d, b em e); depois de `d = a * c`: {b, d}; depois de `e = b + d`: {e}. Interferências: a-b, a-c, b-c, b-d. Há um triângulo (a, b, c), então são necessárias **3 cores**, e 3 bastam (d pode usar o registrador de a ou de c; e reutiliza qualquer um). **3 registradores**.
6. Com `-O0`, `f` chama `quadrado` com `call`/`jal`, e cada função guarda e recarrega variáveis da pilha. Com `-O2`, `quadrado` é **inlined** em `f`: `f` vira algo como `y + 1` seguido de uma multiplicação dele por ele mesmo, sem chamada nenhuma e sem acesso à pilha (e `quadrado` continua existindo separadamente só porque é visível para outros arquivos; com `static`, desapareceria).

## Projeto da etapa

Pontos de revisão:

- **Closures em clox:** o livro usa *upvalues*: enquanto a função externa está ativa, a variável capturada fica na pilha; quando ela retorna, o valor é **movido** para o heap e todas as closures que a capturaram passam a apontar para a cópia. É a parte mais difícil do livro; leia o capítulo duas vezes antes de implementar.
- **Coleta de lixo:** as raízes incluem a pilha da VM, as variáveis globais, as closures em execução e os objetos que o **próprio compilador** está criando (se o coletor rodar no meio da compilação, eles ainda não estão em lugar nenhum alcançável). Teste com o coletor rodando a **cada** alocação (`DEBUG_STRESS_GC`) para achar bugs cedo.
- **Testes:** cada arquivo de teste com o resultado esperado em comentários (`print 1 + 2; // espera: 3`) e um script que roda todos e compara. O repositório do *Crafting Interpreters* tem uma suíte pronta para Lox.
- **Benchmark esperado:** em Fibonacci de 30, o interpretador de árvore costuma ser várias vezes mais lento que a VM de bytecode, e a VM em C costuma ficar perto do CPython ou mais rápida.
- **Mensagens de erro:** vale gastar tempo nelas: `[linha 4] Erro em '=': alvo de atribuição inválido.` é muito melhor que uma exceção genérica. Bons compiladores são lembrados pelas mensagens de erro (o Elm e o Rust são referências).
