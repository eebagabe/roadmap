# Gabarito: Computação Gráfica e Interação Humano-Computador

Abra só depois de tentar.

## Tema 1

1. "Girar e depois transladar" = T × R (a primeira transformação fica à direita):
   ```
   T × R = [0 −1 0 2]
           [1  0 0 0]
           [0  0 1 0]
           [0  0 0 1]
   ```
   (1, 0, 0) gira para (0, 1, 0) e translada para **(2, 1, 0)**. Na ordem inversa (R × T), (1, 0, 0) translada para (3, 0, 0) e gira para **(0, 3, 0)**. Resultados diferentes: as matrizes não comutam.
2. Uma transformação **linear** de ℝ³ sempre leva a origem na origem (A × 0 = 0), e uma translação move a origem: não existe matriz 3 × 3 que translade. Acrescentando a coordenada w = 1, a translação vira um "cisalhamento" em 4D, que é linear lá, e a última coluna da matriz 4 × 4 soma o deslocamento. Bônus: com w = 0, os **vetores** (direções) não são afetados pela translação, como deve ser.
3. P = αA + βB + γC com A = (0, 0), B = (4, 0), C = (0, 4): x = 4β e y = 4γ, então β = 0,25, γ = 0,25 e α = 1 − 0,25 − 0,25 = **0,5**. As três são positivas: o ponto está **dentro**.
4. ```python
   import numpy as np
   L = A = 200
   img = np.zeros((A, L, 3)); zbuf = np.full((A, L), np.inf)
   rasteriza(img, zbuf, (20, 180, 0), (180, 180, 0), (100, 20, 0),
             [(1, 0, 0), (0, 1, 0), (0, 0, 1)])
   with open("triangulo.ppm", "w") as f:
       f.write(f"P3\n{L} {A}\n255\n")
       for linha in img:
           f.write(" ".join(f"{int(r*255)} {int(g*255)} {int(b*255)}" for r, g, b in linha) + "\n")
   ```
   O resultado é o triângulo com vermelho, verde e azul nos vértices, misturados suavemente no interior: a interpolação baricêntrica.
5. oc = O − C = (0, 0, 5). a = D · D = 1; b = 2 × oc · D = 2 × (−5) = −10; c = oc · oc − r² = 25 − 1 = 24. Δ = 100 − 96 = 4. t = (10 − 2)/2 = **4**. Ponto atingido: (0, 0, −4). Normal: (P − C)/r = (0, 0, 1): aponta de volta para a câmera, como esperado no ponto da esfera mais próximo dela.
6. Cada pixel estima a luz que chega por uma média de caminhos **aleatórios**. Com poucas amostras, a média varia muito de pixel para pixel: o ruído (granulado). Como em todo Monte Carlo, o erro cai com **1/√N**: 4 vezes mais amostras deixam o ruído com metade da intensidade, e 100 vezes mais, um décimo. É por isso que filmes levam horas por quadro e jogos usam poucas amostras com redes de remoção de ruído.

## Tema 2

1. Exemplo, um aplicativo de banco:
   | Problema | Heurística | Gravidade | Correção |
   |---|---|---|---|
   | Ao transferir, nenhum aviso de "processando"; o usuário toca de novo | 1 Visibilidade do estado | 3 | Indicador de progresso e botão desabilitado após o toque |
   | Mensagem "Erro 403" ao pagar boleto vencido | 9 Recuperação de erros | 3 | "Este boleto venceu em 10/06. Gere um novo no site do emissor." |
   | Pede o código do boleto sem permitir colar | 7 Flexibilidade | 2 | Permitir colar e ler pela câmera |
   | "Resgate" e "Saque" com significados diferentes em telas diferentes | 4 Consistência | 2 | Um termo, um significado |
   | Para cancelar o Pix agendado, 6 toques em menus escondidos | 3 Controle e liberdade | 3 | Atalho na tela do comprovante |
   (Escala de Nielsen: 0 não é problema; 1 cosmético; 2 pequeno; 3 grande; 4 catástrofe.)
2. No macOS, a barra de menus fica **na borda superior da tela**: o cursor para ali sozinho, então o alvo tem altura efetivamente **infinita** e o usuário pode "jogar" o mouse para cima sem precisão. Um menu dentro da janela é um alvo pequeno, que exige desacelerar e mirar. No celular, a parte de baixo da tela fica **perto** do polegar (D pequeno na lei de Fitts), enquanto o topo é longe para quem usa o aparelho com uma mão: por isso barras de navegação e botões de ação principais migraram para baixo.
3. Ferramentas automáticas acham contraste insuficiente, imagens sem `alt`, campos sem rótulo e hierarquia de títulos quebrada. Elas **não** acham, por exemplo: textos alternativos inúteis ("imagem1.png"), ordem de foco confusa, foco preso num modal, foco invisível, componentes que só funcionam com o mouse, rótulos que não fazem sentido quando lidos fora de contexto ("clique aqui"), ou mensagens dinâmicas que o leitor de tela não anuncia. Estima-se que testes automáticos cobrem só cerca de um terço dos critérios.
4. ```html
   <form>
     <label for="nome">Nome</label>
     <input id="nome" name="nome" type="text" required aria-describedby="nome-erro"
            autocomplete="name">
     <p id="nome-erro" class="erro" role="alert">Informe o seu nome.</p>
     <button type="submit">Enviar</button>
   </form>
   ```
   Correções: `<button>` real (funciona com teclado e é anunciado como botão), em vez de `<div>` clicável; `<label>` associado ao campo (o `placeholder` some ao digitar e não é um rótulo); a mensagem de erro ligada ao campo e anunciada (`aria-describedby`, `role="alert"`), com texto que diz o que fazer, e sem depender **só** da cor vermelha; e contraste: cinza #999 sobre branco tem contraste ~2,8:1, abaixo do mínimo de 4,5:1 (use, por exemplo, #595959 ou mais escuro).
5. Achados típicos de um primeiro teste em papel: as pessoas não acham onde escolher a especialidade (procuram pelo nome do médico); não entendem se o horário mostrado já está reservado; esperam uma tela de confirmação com data, hora, local e como cancelar. O mais importante é ver **onde as pessoas hesitam** e mudar o protótipo antes de escrever código.
6. Itens ímpares: (resposta − 1) = 3 + 4 + 3 + 4 + 3 = 17. Itens pares: (5 − resposta) = 3 + 4 + 3 + 3 + 4 = 17. Soma 34 × 2,5 = **85**: bem acima da média (~68), na faixa considerada "excelente".

## Projeto da etapa

Pontos de revisão:

- **Ray tracer:** o "acne de sombra" (pontilhado escuro na superfície) aparece quando o raio secundário intersecta a própria superfície por erro de ponto flutuante; comece os raios em t > 0,001. Aplique correção gama (raiz quadrada, para gama 2) antes de gravar, ou a imagem fica escura demais. Vidro: use a aproximação de Schlick para a refletância e trate a reflexão interna total.
- **Paralelismo:** cada pixel é independente, então paralelizar por linhas (threads, `multiprocessing` ou OpenMP) dá ganho quase linear: o exemplo perfeito de problema "embaraçosamente paralelo" da etapa de Concorrência.
- **Teste de usabilidade:** um roteiro fixo (boas-vindas, consentimento, tarefas, SUS, perguntas finais), sempre as mesmas tarefas e na mesma ordem para todos, e anotações com o que a pessoa **fez**, separadas das suas interpretações. Não defenda a interface nem ensine durante o teste.
- **Relatório:** priorize por gravidade e frequência (quantos participantes tiveram o problema), use citações curtas dos participantes como evidência e proponha redesenhos concretos. Um bom relatório faz a equipe do aplicativo querer corrigir, não se defender.
