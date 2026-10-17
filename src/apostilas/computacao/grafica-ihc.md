# Computação Gráfica e Interação Humano-Computador: Apostila Prática

Roadmap Ciência da Computação · Semanas 109 e 110

## Comece por aqui

Duas áreas que tratam do encontro entre a máquina e as pessoas. A **computação gráfica** transforma descrições matemáticas de cenas em imagens: jogos, filmes de animação, visualização científica, mapas e interfaces. Ela é álgebra linear aplicada (vetores, matrizes, transformações) somada a um pouco de física da luz. A **interação humano-computador** (IHC) estuda como projetar sistemas que pessoas reais conseguem usar, com eficiência, sem erros e com satisfação, incluindo pessoas com deficiência. Esta etapa curta dá a base das duas e um projeto prático de cada.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CMC-30 Fundamentos de Computação Gráfica |
| MIT | 6.4400 (antiga 6.837) Computer Graphics; 6.4590 Interactive Data Visualization |
| Harvard | CS 1750 Computer Graphics; CS 1790 Design of Useful and Usable Interactive Systems |
| Oxford | Computer Graphics (3º ano); Human-Computer Interaction (3º ano) |

### Como esta apostila funciona

1. Para gráfica, escreva código que gera imagens pixel a pixel (Python com NumPy, C++ ou Rust) antes de usar APIs como OpenGL ou WebGPU.
2. Para IHC, o laboratório são **pessoas**: teste com usuários de verdade, por menor que seja o teste.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** imagem toda preta ou toda errada? Pinte cada pixel com o valor de uma variável intermediária (a normal como cor, a distância como tons de cinza). Em gráfica, depurar é **visualizar**.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 109 | Tema 1: Computação gráfica |
| 110 | Tema 2: Interação humano-computador + projeto |

## Tema 1: Computação gráfica

**Objetivo:** entender como uma cena 3D vira uma imagem, pelos dois caminhos: rasterização e ray tracing.

### 1.1 Pipeline gráfico

Uma imagem digital é uma matriz de **pixels**, cada um com uma cor (em geral, três números: vermelho, verde e azul, de 0 a 255 ou de 0 a 1). Uma cena 3D é descrita por **malhas de triângulos** (o triângulo é a forma mais simples que define um plano), **materiais**, **luzes** e uma **câmera**. Há duas grandes formas de transformar a cena em imagem:

| | Rasterização | Ray tracing |
|---|---|---|
| Pergunta | "Para cada triângulo, que pixels ele cobre?" | "Para cada pixel, o que se vê por ele?" |
| Velocidade | Muito rápida (dezenas a centenas de imagens por segundo) | Mais lenta |
| Realismo | Sombras, reflexos e luz indireta exigem truques | Natural: segue a física da luz |
| Uso | Jogos, interfaces, tempo real | Filmes, arquitetura; em tempo real com GPUs modernas |

O **pipeline de rasterização** das GPUs (OpenGL, Vulkan, Direct3D, Metal, WebGPU):

1. **Processamento de vértices** (*vertex shader*): transforma cada vértice do espaço do objeto para a tela.
2. **Montagem e recorte:** junta os vértices em triângulos e descarta o que está fora da visão.
3. **Rasterização:** descobre os pixels (fragmentos) cobertos por cada triângulo.
4. **Processamento de fragmentos** (*fragment shader*): calcula a cor de cada fragmento (iluminação, texturas).
5. **Teste de profundidade e composição:** o **z-buffer** guarda, para cada pixel, a distância do fragmento mais próximo já desenhado; um novo fragmento só é desenhado se estiver mais perto. Resolve a visibilidade sem ordenar os triângulos.

*Shaders* são pequenos programas que rodam na GPU, em paralelo, para milhões de vértices e pixels: a mesma ideia de SIMD e GPUs que você viu em Concorrência.

### 1.2 Transformações

Toda a geometria se move por **matrizes** (Álgebra Linear). Em 3D, usam-se **coordenadas homogêneas**: um ponto (x, y, z) vira (x, y, z, 1) e as transformações viram matrizes 4 × 4. Assim, **translação** (que não é linear em 3D) também vira multiplicação, e qualquer sequência de transformações se combina numa matriz só.

```
translação            escala                rotação em torno de z
[1 0 0 tx]           [sx 0  0  0]          [cos θ  −sen θ  0  0]
[0 1 0 ty]           [0  sy 0  0]          [sen θ   cos θ  0  0]
[0 0 1 tz]           [0  0  sz 0]          [0       0      1  0]
[0 0 0 1 ]           [0  0  0  1]          [0       0      0  1]
```

A ordem importa (o produto de matrizes não comuta): girar e depois transladar é diferente de transladar e depois girar.

A cadeia de espaços de um vértice: **objeto** →(matriz de modelo)→ **mundo** →(matriz de visão: a câmera)→ **câmera** →(matriz de projeção)→ **recorte** →(divisão por w)→ **coordenadas normalizadas** →(viewport)→ **tela**. Em código, `p_tela = Viewport × Projeção × Visão × Modelo × p`.

**Projeção perspectiva:** objetos distantes parecem menores, porque x e y são divididos pela profundidade z. A matriz de projeção coloca z na coordenada w, e a "divisão por w" faz a divisão. A projeção **ortográfica** (sem perspectiva) é usada em desenhos técnicos e em jogos 2D.

**Normais** (vetores perpendiculares à superfície, essenciais para a iluminação) se transformam pela **inversa transposta** da matriz de modelo, não pela própria matriz, para continuarem perpendiculares quando há escala não uniforme.

Rotações em 3D são frequentemente representadas por **quatérnios**, que se interpolam suavemente e evitam o "travamento" dos ângulos de Euler (*gimbal lock*).

### 1.3 Rasterização

Para preencher um triângulo, a GPU testa para cada pixel candidato se o seu centro está **dentro** do triângulo. Um teste elegante usa **funções de aresta**: para a aresta de A a B, E(P) = (B − A) × (P − A) (o "produto vetorial 2D", um determinante 2 × 2, como na etapa de Álgebra Linear). O ponto está dentro se as três funções de aresta têm o mesmo sinal. Os valores normalizados dessas funções são as **coordenadas baricêntricas** (α, β, γ) do ponto, com α + β + γ = 1, usadas para **interpolar** qualquer atributo dos vértices (cor, profundidade, coordenadas de textura) no interior do triângulo.

```python
def aresta(a, b, p):
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

def rasteriza(img, zbuf, v0, v1, v2, cores):
    area = aresta(v0, v1, v2)
    xs = [v[0] for v in (v0, v1, v2)]; ys = [v[1] for v in (v0, v1, v2)]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        for x in range(int(min(xs)), int(max(xs)) + 1):
            p = (x + 0.5, y + 0.5)
            w0, w1, w2 = aresta(v1, v2, p), aresta(v2, v0, p), aresta(v0, v1, p)
            if (w0 >= 0 and w1 >= 0 and w2 >= 0) or (w0 <= 0 and w1 <= 0 and w2 <= 0):
                a, b, c = w0 / area, w1 / area, w2 / area      # baricêntricas
                z = a * v0[2] + b * v1[2] + c * v2[2]
                if z < zbuf[y][x]:                             # teste de profundidade
                    zbuf[y][x] = z
                    img[y][x] = [a * cores[0][i] + b * cores[1][i] + c * cores[2][i] for i in range(3)]
```

**Texturas:** cada vértice tem coordenadas (u, v) numa imagem; interpolam-se (u, v) e busca-se a cor na textura. Para não piscar ao longe, usam-se versões reduzidas da textura (*mipmaps*) e filtragem.

**Serrilhado** (*aliasing*): bordas em escada, porque cada pixel testa um ponto só. **Antisserrilhado** amostra vários pontos por pixel e faz a média.

**Iluminação** clássica (modelo de **Phong** ou **Blinn-Phong**), por fragmento:

- **Ambiente:** uma luz constante, para nada ficar totalmente preto.
- **Difusa** (lei de **Lambert**): proporcional a max(0, N · L), o cosseno do ângulo entre a normal N e a direção da luz L. Superfícies voltadas para a luz são mais claras.
- **Especular:** o brilho, proporcional a max(0, N · H)ⁿ (H é o vetor no meio entre a luz e o olho); n grande, brilho pequeno e intenso (superfície polida).

Hoje, jogos e filmes usam **renderização baseada em física** (PBR), com materiais descritos por "metalicidade" e "rugosidade" que conservam energia.

### 1.4 Ray tracing

O **ray tracing** inverte o caminho da luz: para cada pixel, lança um **raio** do olho pelo pixel e descobre o que ele atinge primeiro.

Um raio é P(t) = O + t D (origem O, direção D, t ≥ 0). Interseção com uma **esfera** de centro C e raio r: |O + tD − C|² = r² dá uma equação do 2º grau em t (Bhaskara, Fase 0!). O menor t positivo é o ponto visível.

```python
import numpy as np

def intersecta_esfera(O, D, C, r):
    oc = O - C
    a, b, c = D @ D, 2 * oc @ D, oc @ oc - r * r
    delta = b * b - 4 * a * c
    if delta < 0:
        return None
    t = (-b - np.sqrt(delta)) / (2 * a)
    return t if t > 1e-4 else None
```

No ponto atingido, a cor vem da iluminação, e o ray tracing ganha de graça efeitos que a rasterização imita com truques:

- **Sombras:** lance um raio do ponto até a luz; se algo bloquear, o ponto está na sombra.
- **Reflexos:** lance um raio refletido (R = D − 2(D · N)N) e some a cor que ele encontrar, recursivamente.
- **Refração:** em vidro e água, um raio refratado pela lei de Snell.

**Path tracing:** para iluminação global realista (luz que quica nas paredes, cores que "sangram" entre superfícies, sombras suaves), em cada ponto lança-se um raio em direção **aleatória** e repete-se; a média de muitas amostras por pixel converge para a imagem fisicamente correta. É **Monte Carlo** (Probabilidade): o ruído cai com 1/√amostras. Filmes da Pixar usam *path tracing*; jogos modernos usam algumas amostras por pixel e uma rede neural para remover o ruído.

**Aceleração:** testar cada raio contra milhões de triângulos seria lento demais. Organizam-se os objetos numa **hierarquia de volumes envolventes** (BVH): uma árvore de caixas, em que um raio que não atinge uma caixa descarta tudo dentro dela (como uma busca em árvore: de O(n) para ~O(log n) por raio). GPUs modernas têm hardware dedicado para percorrer BVHs.

### Atividades de fixação do Tema 1

1. Escreva a matriz 4 × 4 que gira 90° em torno do eixo z e depois translada (2, 0, 0). Aplique ao ponto (1, 0, 0). Faça na ordem inversa e compare.
2. Por que é preciso uma coordenada a mais (homogênea) para representar translação como multiplicação de matriz?
3. Calcule as coordenadas baricêntricas do ponto (1, 1) no triângulo (0, 0), (4, 0), (0, 4). O ponto está dentro?
4. Escreva um programa que rasteriza um triângulo com cores diferentes nos vértices (interpolação baricêntrica) e salva uma imagem PPM ou PNG.
5. Calcule a interseção do raio O = (0, 0, 0), D = (0, 0, −1) com a esfera de centro (0, 0, −5) e raio 1. Qual a normal no ponto atingido?
6. Por que o *path tracing* produz imagens com ruído e como o número de amostras por pixel afeta isso?

## Tema 2: Interação humano-computador

**Objetivo:** projetar e avaliar interfaces usáveis e acessíveis, com usuários reais.

### 2.1 Usabilidade

**Usabilidade** é o quanto usuários específicos conseguem atingir objetivos específicos com **eficácia** (conseguem?), **eficiência** (com quanto esforço e tempo?) e **satisfação** (gostam?), num contexto de uso (ISO 9241-11).

Você **não** é o usuário: quem construiu o sistema sabe como ele funciona e não consegue mais enxergá-lo com olhos novos. Por isso, IHC é sobre observar pessoas reais.

**As 10 heurísticas de Nielsen** (um guia para avaliar e projetar interfaces):

1. **Visibilidade do estado do sistema:** mostre o que está acontecendo (carregando, salvo, enviado).
2. **Correspondência com o mundo real:** fale a língua do usuário, não a do sistema ("Erro 0x80070005" não ajuda).
3. **Controle e liberdade:** saídas claras e "desfazer".
4. **Consistência e padrões:** o mesmo nome e lugar para a mesma coisa; siga as convenções da plataforma.
5. **Prevenção de erros:** melhor impedir o erro que explicá-lo (desabilite datas inválidas no calendário; peça confirmação antes de apagar).
6. **Reconhecer em vez de lembrar:** mostre as opções em vez de exigir que o usuário decore.
7. **Flexibilidade e eficiência:** atalhos para os experientes, sem atrapalhar os novatos.
8. **Estética e design minimalista:** cada informação extra compete com as relevantes.
9. **Ajudar a reconhecer, diagnosticar e se recuperar de erros:** diga o que deu errado e como resolver, em linguagem simples.
10. **Ajuda e documentação**, fácil de encontrar e focada em tarefas.

Princípios da psicologia que guiam o design:

- **Lei de Fitts:** o tempo para apontar um alvo cresce com a distância e diminui com o tamanho do alvo (T = a + b log₂(1 + D/L)). Botões importantes devem ser grandes e perto; cantos e bordas da tela são alvos "infinitos".
- **Lei de Hick:** o tempo de decisão cresce com o logaritmo do número de opções. Menus enormes atrasam.
- **Memória de trabalho limitada** (poucos itens de cada vez): não exija que o usuário lembre informações de uma tela para outra.
- **Modelos mentais:** as pessoas formam uma ideia de como o sistema funciona; a interface deve combinar com ela (Donald Norman: *affordances*, o que o objeto sugere que se faça com ele, e *feedback*).
- **Gestalt:** elementos próximos ou parecidos são vistos como grupo; use espaço e alinhamento para organizar.

### 2.2 Acessibilidade

Cerca de **1 em cada 6 pessoas** no mundo tem alguma deficiência (OMS), e todos passam por limitações temporárias ou situacionais (um braço quebrado, sol na tela do celular, ambiente barulhento) e pelo envelhecimento. **Acessibilidade** é projetar para que todos possam usar. No Brasil, a **Lei Brasileira de Inclusão** (Lei 13.146/2015) exige acessibilidade em sites de empresas e órgãos públicos.

As **WCAG** (*Web Content Accessibility Guidelines*, do W3C) organizam-se em quatro princípios, **POUR**:

| Princípio | Exemplos |
|---|---|
| **Perceptível** | Texto alternativo em imagens; legendas em vídeos; contraste suficiente (pelo menos 4,5:1 para texto normal); não usar só a cor para transmitir informação |
| **Operável** | Tudo funciona pelo **teclado**; foco visível; tempo suficiente; nada que pisque mais de 3 vezes por segundo; alvos de toque grandes |
| **Compreensível** | Linguagem clara; comportamento previsível; rótulos e instruções em formulários; mensagens de erro úteis |
| **Robusto** | HTML semântico e válido, compatível com tecnologias assistivas (leitores de tela como NVDA, VoiceOver e TalkBack) |

Na prática, para a web:

- Use os elementos **semânticos** certos (`<button>` para botões, `<a>` para links, `<label>` ligado ao campo, títulos `<h1>` a `<h6>` em ordem): eles já vêm com comportamento de teclado e significado para leitores de tela. Um `<div>` com evento de clique não é um botão para quem usa teclado.
- **ARIA** só quando o HTML não basta ("nenhum ARIA é melhor que ARIA ruim").
- Teste **navegando só pelo teclado** e com um **leitor de tela**, e use ferramentas automáticas (axe, Lighthouse), que pegam só uma parte dos problemas.

**Design inclusivo** beneficia todos: legendas ajudam em ambientes barulhentos, alto contraste ajuda sob o sol, rampas ajudam carrinhos de bebê (o "efeito rampa").

### 2.3 Prototipação

Descobrir problemas cedo é muito mais barato. O processo de **design centrado no usuário** é iterativo: **entender** (pesquisa com usuários: entrevistas, observação, personas, jornadas), **idear**, **prototipar**, **testar**, e repetir.

Níveis de **fidelidade** dos protótipos:

| Fidelidade | Forma | Bom para |
|---|---|---|
| Baixa | Rabiscos em papel, *wireframes* em caixas cinzas | Explorar muitas ideias rápido; os usuários criticam à vontade (parece inacabado) |
| Média | Telas clicáveis em ferramentas como Figma, sem visual final | Testar fluxos e navegação |
| Alta | Visual final, interações realistas, às vezes código | Testar detalhes, validar antes de construir |

Comece com baixa fidelidade: um protótipo em papel testado em cinco pessoas numa tarde revela os problemas de fluxo mais graves antes de qualquer linha de código. Faça várias alternativas antes de escolher uma (ninguém acerta o design na primeira ideia).

### 2.4 Avaliação com usuários

**Teste de usabilidade:** peça a participantes **representativos** que realizem **tarefas reais** ("marque uma consulta com um dermatologista para a próxima semana") enquanto **pensam em voz alta**, e observe sem ajudar. Registre onde hesitam, erram ou desistem.

- **Cinco usuários** encontram a maior parte dos problemas graves de uma interface (Nielsen e Landauer): é melhor fazer vários testes pequenos ao longo do projeto do que um grande no fim.
- Não pergunte "você gostou?" nem "você usaria?": observe o que as pessoas **fazem**, não o que dizem que fariam.
- Tarefas sem pistas: não use as palavras do botão no enunciado.

Métricas: taxa de sucesso por tarefa, tempo, número de erros e, para a satisfação, questionários padronizados como o **SUS** (*System Usability Scale*: 10 perguntas, nota de 0 a 100; acima de ~68 é acima da média).

Outros métodos:

- **Avaliação heurística:** 3 a 5 especialistas inspecionam a interface com as heurísticas de Nielsen. Barata e rápida, mas não substitui usuários reais.
- **Teste A/B** (Probabilidade): duas versões para grupos aleatórios, comparando uma métrica. Ótimo para decidir entre alternativas em produtos com muitos usuários; não explica o **porquê**.
- **Análise de uso** (*analytics*), questionários e entrevistas.

Atenção à ética: usuários reais merecem respeito. Consentimento informado, dados anonimizados, e nunca usar **padrões enganosos** (*dark patterns*: cancelamento escondido, caixas pré-marcadas, urgência falsa), que melhoram métricas de curto prazo enganando pessoas, e que a etapa de Ética e as leis de defesa do consumidor condenam.

### Atividades de fixação do Tema 2

1. Escolha um aplicativo ou site que você usa (de banco, de transporte, do governo) e faça uma avaliação heurística: liste 5 problemas, a heurística violada e a gravidade (0 a 4) de cada um, com uma sugestão de correção.
2. Use a lei de Fitts para explicar por que o menu de um aplicativo no topo da tela do macOS é mais rápido de acessar que um menu dentro da janela, e por que botões de ação principais em celulares costumam ficar na parte de baixo.
3. Avalie a acessibilidade de uma página com o Lighthouse e o axe. Depois navegue por ela só com o teclado e com um leitor de tela. Que problemas as ferramentas automáticas **não** acharam?
4. Corrija este formulário para acessibilidade:
   ```html
   <div onclick="enviar()" style="color:#999;background:#fff">Enviar</div>
   <input type="text" placeholder="Nome">
   <span style="color:red">Campo obrigatório</span>
   ```
5. Faça um protótipo em papel de 3 telas para marcar uma consulta e teste com 3 pessoas pedindo que pensem em voz alta. Liste o que mudaria.
6. Calcule a nota SUS de um participante que respondeu (de 1 a 5) às 10 perguntas: 4, 2, 5, 1, 4, 2, 5, 2, 4, 1.

## Projeto da etapa

Faça os dois:

**1. Ray tracer simples** (seguindo o livro gratuito *Ray Tracing in One Weekend*, em C++, Rust ou Python com NumPy):

- Câmera, raios, esferas e planos, normais, antisserrilhado com várias amostras por pixel.
- Materiais difusos (Lambert), metálicos (reflexo com rugosidade) e dielétricos (vidro com refração).
- Sombras e iluminação indireta por *path tracing*; mostre imagens com 1, 10, 100 e 1.000 amostras por pixel e comente o ruído.
- Bônus: uma BVH e a medida do ganho de velocidade com muitas esferas; paralelizar por linhas de pixels.

**2. Avaliação de usabilidade de um aplicativo real:**

- Escolha um aplicativo ou site de uso público (de preferência um serviço importante, como transporte, saúde ou governo).
- Avaliação heurística com pelo menos 10 problemas classificados.
- Teste de usabilidade com 5 pessoas (com consentimento), 3 a 5 tarefas, pensando em voz alta, medindo sucesso e tempo, e questionário SUS.
- Avaliação de acessibilidade (ferramentas automáticas, teclado e leitor de tela) com referência aos critérios WCAG.
- Relatório com os problemas priorizados, evidências (citações e observações) e propostas de redesenho em *wireframes*.

## Para ir além

- *Ray Tracing in One Weekend* (a série gratuita de Peter Shirley) e *Physically Based Rendering* (gratuito online).
- *Fundamentals of Computer Graphics* (Marschner e Shirley) e *Real-Time Rendering* (Akenine-Möller e outros).
- **MIT 6.837** no OpenCourseWare e o tutorial **LearnOpenGL** (gratuito); *The Book of Shaders* para *shaders* de fragmento.
- *O Design do Dia a Dia* (Donald Norman): o clássico de IHC, acessível e divertido.
- *Não Me Faça Pensar* (Steve Krug): usabilidade web e testes com usuários de forma prática.
- Nielsen Norman Group (nngroup.com), as **WCAG 2.2** e o guia de acessibilidade do governo brasileiro (eMAG).

## Resumão

- Rasterização: para cada triângulo, que pixels cobre (rápida, tempo real). Ray tracing: para cada pixel, o que se vê (realista).
- Pipeline: vértices → recorte → rasterização → fragmentos → z-buffer. Shaders rodam em paralelo na GPU.
- Coordenadas homogêneas: translação, rotação e escala viram matrizes 4 × 4. A ordem importa. Modelo → visão → projeção → tela.
- Perspectiva: divide por w (a profundidade). Normais usam a inversa transposta.
- Funções de aresta testam se o pixel está dentro; baricêntricas interpolam cor, profundidade e textura.
- Iluminação: ambiente + difusa (N · L) + especular. PBR nos sistemas modernos.
- Raio O + tD; esfera dá equação do 2º grau. Sombras, reflexos e refração com raios extras. Path tracing é Monte Carlo; BVH acelera.
- Usabilidade: eficácia, eficiência, satisfação. Você não é o usuário.
- Heurísticas de Nielsen; leis de Fitts e Hick; modelos mentais, affordances e feedback.
- Acessibilidade (WCAG, POUR): HTML semântico, teclado, contraste, texto alternativo, leitores de tela. É lei no Brasil.
- Prototipe cedo e barato; teste com 5 usuários pensando em voz alta; observe, não pergunte. SUS mede satisfação.
- Sem dark patterns: respeito ao usuário é parte do design.
