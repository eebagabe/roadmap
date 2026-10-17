# Gabarito: Inteligência Artificial

Abra só depois de tentar.

## Tema 1

1. (a) **Sudoku:** totalmente observável, determinístico, um agente, estático, discreto. (b) **Pôquer:** parcialmente observável (cartas dos outros), estocástico (o baralho), multiagente competitivo, discreto. (c) **Robô aspirador:** parcialmente observável (só vê perto), estocástico (sujeira aparece, rodas escorregam), um agente (ou com pessoas e pets no caminho), dinâmico, contínuo. (d) **Carro autônomo:** parcialmente observável, estocástico, multiagente, dinâmico, contínuo: o caso mais difícil em todas as dimensões.
2. Estado: (missionários na margem esquerda, canibais na margem esquerda, lado do barco), começando em (3, 3, E) e com objetivo (0, 0, D). Ações: o barco leva 1 ou 2 pessoas (MM, CC, MC, M, C) para o outro lado. Restrição: em nenhuma margem os canibais podem superar os missionários, se houver missionários lá. A BFS encontra a solução ótima com **11 travessias**.
3. **Peças fora do lugar:** cada peça fora do lugar precisa de pelo menos 1 movimento, então nunca superestima. **Manhattan:** cada peça precisa de pelo menos tantos movimentos quanto a sua distância em linhas mais colunas até o lugar certo (cada movimento muda uma coordenada em 1), e os movimentos de peças diferentes são distintos: nunca superestima. Manhattan ≥ fora do lugar sempre (cada peça fora do lugar contribui com pelo menos 1), então é **mais informada**: em instâncias com solução de ~20 movimentos, o A\* com Manhattan expande tipicamente dezenas de vezes menos nós.
4. A heurística precisa **nunca superestimar**. "Distância em linha reta dividida por 200 km/h" **subestima** o tempo (ninguém anda a 200 km/h numa estrada de 120 km/h, e o caminho real é maior que a linha reta): **é admissível**, mas fraca. O problema seria o contrário: dividir por uma velocidade **menor** que a máxima real (por exemplo, 60 km/h) poderia **superestimar** o tempo de trechos rápidos e fazer o A\* perder a rota ótima. A escolha certa é dividir pela **maior** velocidade possível na rede (120 km/h): admissível e o mais informada possível dentro disso.
5. Os nós MIN valem min(3, 12, 8) = **3**, min(2, 4, 6) = **2**, min(14, 5, 2) = **2**; a raiz (MAX) vale **3**. Alfa-beta da esquerda para a direita: o primeiro MIN é avaliado inteiro (α = 3 na raiz). No segundo MIN, a primeira folha é 2 ≤ α = 3: MAX nunca escolheria esse ramo, **podam-se as folhas 4 e 6**. No terceiro, 14 e depois 5 ainda são maiores que 3, e só a última (2) fica abaixo: nenhuma poda (se os lances estivessem na ordem 2, 5, 14, as duas últimas seriam podadas: a ordem importa).
6. ```python
   def vencedor(t):
       linhas = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
       for a, b, c in linhas:
           if t[a] != " " and t[a] == t[b] == t[c]:
               return 1 if t[a] == "X" else -1
       return 0 if " " not in t else None

   def minimax(t, vez_x):
       v = vencedor(t)
       if v is not None:
           return v
       valores = []
       for i in range(9):
           if t[i] == " ":
               t[i] = "X" if vez_x else "O"
               valores.append(minimax(t, not vez_x))
               t[i] = " "
       return max(valores) if vez_x else min(valores)

   print(minimax([" "] * 9, True))     # 0: empate com jogo perfeito
   ```

## Tema 2

1. (a) ∀x (Aluno(x) ∧ Curso(x, Computação) → Cursa(x, Algoritmos)). (b) ∃p (Professor(p) ∧ ∀a (AlunoMestrado(a) → Orienta(p, a))). Atenção à ordem: ∀a ∃p diria só que cada aluno tem algum orientador. (c) ∀x ¬Pai(x, x).
2. **Para a frente:** fatos {P}; a regra P → Q dispara: {P, Q}; Q → R dispara: {P, Q, R}. R provado. **Resolução:** em cláusulas, BC = {¬P ∨ Q, ¬Q ∨ R, P}; acrescente a negação do objetivo, ¬R. Resolvendo ¬Q ∨ R com ¬R: ¬Q. Resolvendo ¬P ∨ Q com ¬Q: ¬P. Resolvendo ¬P com P: **cláusula vazia** (contradição). Logo R segue da BC.
3. Variáveis: PR, SC, RS, SP, MS; domínio {vermelho, verde, azul}. Restrições (vizinhos diferentes): PR-SC, SC-RS, PR-SP, PR-MS, SP-MS. Fixando PR = vermelho, o AC-3 remove vermelho dos domínios de SC, SP e MS (vizinhos de PR). SP e MS ficam com {verde, azul} e são vizinhos entre si: continuam consistentes (cada valor de um tem par no outro). RS mantém os três valores (não é vizinho de PR). Uma solução: PR vermelho, SC verde, RS vermelho, SP verde, MS azul.
4. Num sudoku difícil, o backtracking ingênuo (variáveis em ordem, sem propagação) costuma explorar **centenas de milhares a milhões** de nós; com MRV e verificação adiante, **centenas a poucos milhares**. A combinação "sempre a casa com menos candidatos" é quase tudo o que um humano faz.
5. ```python
   import random
   def min_conflitos(n, max_passos=100_000):
       col = [random.randrange(n) for _ in range(n)]       # col[linha] = coluna da rainha
       def conflitos(l, c):
           return sum(1 for l2 in range(n) if l2 != l and
                      (col[l2] == c or abs(col[l2] - c) == abs(l2 - l)))
       for _ in range(max_passos):
           em_conflito = [l for l in range(n) if conflitos(l, col[l]) > 0]
           if not em_conflito:
               return col
           l = random.choice(em_conflito)
           col[l] = min(range(n), key=lambda c: (conflitos(l, c), random.random()))
       return None
   ```
   Essa versão simples é O(n²) por passo; com contadores de rainhas por coluna e por diagonal, cada passo fica O(n) e n = 10.000 resolve em segundos. O número de passos fica quase constante (~50) independentemente de n: as soluções são muito densas no espaço.
6. Variáveis: o horário de cada disciplina (domínio: os 4 horários). Restrições: duas disciplinas do mesmo professor em horários diferentes (e, se houver, duas disciplinas da mesma turma também). Com 3 professores dando 2 disciplinas cada, basta que cada par do mesmo professor fique em horários diferentes: há muitas soluções, e o resolvedor encontra uma imediatamente. Acrescente salas (variável sala por disciplina, com "mesma sala ⇒ horários diferentes") para ficar interessante.

## Tema 3

1. Enumerando sobre Terremoto e Alarme: P(R, j, m) ≈ 0,000592 e P(¬R, j, m) ≈ 0,001492. Normalizando: **P(Roubo | João, Maria) ≈ 0,284**. Mesmo com as duas ligações, a chance de roubo é só 28%, porque roubos são raros (a taxa base de Bayes).
2. Na ponderação por verossimilhança, fixe João = Maria = verdadeiro, sorteie Roubo, Terremoto e Alarme pelas tabelas e dê a cada amostra o peso P(João | Alarme) × P(Maria | Alarme). Com 10⁴ amostras, como roubo é raríssimo (1 em 1.000), a estimativa varia bastante (por exemplo, entre 0,2 e 0,4); com 10⁶, fica perto de 0,284. Eventos raros pedem muitas amostras.
3. πP = π com π₁ + π₂ = 1: π₁ = 0,8π₁ + 0,4π₂ ⇒ 0,2π₁ = 0,4π₂ ⇒ π₁ = 2π₂. **π = (2/3, 1/3)**. As linhas de P¹⁰⁰ ficam ambas iguais a (0,6667; 0,3333): a cadeia "esquece" o estado inicial.
4. ```python
   from collections import defaultdict
   import random
   palavras = open("livro.txt", encoding="utf-8").read().split()
   modelo = defaultdict(list)
   for a, b, c in zip(palavras, palavras[1:], palavras[2:]):
       modelo[(a, b)].append(c)
   estado = random.choice(list(modelo))
   texto = list(estado)
   for _ in range(60):
       proxima = random.choice(modelo.get(estado, palavras))
       texto.append(proxima)
       estado = (estado[1], proxima)
   print(" ".join(texto))
   ```
   Cada trio de palavras seguidas aparece no livro, então trechos curtos parecem corretos; mas o modelo só "lembra" duas palavras, então não há coerência de sentido além disso. Os modelos de linguagem modernos resolvem justamente isso: condicionam em milhares de palavras anteriores.
5. Com os parâmetros do exemplo (inicial: Saudável 0,6, Febre 0,4; transições Saudável → Saudável 0,7, Saudável → Febre 0,3, Febre → Saudável 0,4, Febre → Febre 0,6; emissões Saudável: normal 0,5, frio 0,4, tontura 0,1; Febre: normal 0,1, frio 0,3, tontura 0,6), a sequência mais provável é **Saudável, Saudável, Febre**, com probabilidade ≈ 0,01512.
6. Sem exame e sem manutenção: perda esperada = 0,05 × 10.000 = **R$ 500**. Manutenção sempre: **R$ 1.000**. Exame e manutenção só se o exame indicar quebra: 200 + 0,05 × 1.000 = **R$ 250**. **Vale fazer o exame.** O valor da informação aqui é 500 − 250 + 200 = R$ 450 (o quanto o exame melhora a decisão, antes de pagar por ele), maior que o custo de R$ 200.

## Tema 4

1. Com penalidade −0,04, a política ótima vai para o +1 pelo caminho mais seguro, dando a volta longe do −1 quando escorregar para lá seria arriscado (o famoso desenho do livro: no estado ao lado do −1, a ação ótima é ir "para trás", contra a parede). Com **−2 por passo**, viver é tão ruim que o agente corre para a **saída mais próxima**, mesmo que seja o −1. Com **+0,1 por passo**, viver é bom: o agente **evita as duas saídas** e fica andando para sempre (com γ = 1, os valores divergem; é preciso γ < 1 para a iteração convergir).
2. ```python
   import gymnasium as gym
   import numpy as np
   env = gym.make("FrozenLake-v1", is_slippery=True)
   Q = np.zeros((env.observation_space.n, env.action_space.n))
   sucessos = []
   for ep in range(20_000):
       s, _ = env.reset()
       fim = False
       while not fim:
           a = env.action_space.sample() if np.random.rand() < 0.1 else int(np.argmax(Q[s]))
           s2, r, term, trunc, _ = env.step(a)
           Q[s, a] += 0.1 * (r + 0.99 * np.max(Q[s2]) * (not term) - Q[s, a])
           s, fim = s2, term or trunc
       sucessos.append(r)
   ```
   A média móvel da taxa de sucesso começa perto de 1% e sobe para algo entre 60% e 75% (o gelo escorregadio impede chegar a 100%: o limite é o da política ótima).
3. Com **ε = 0**, o agente sempre escolhe a ação de maior Q; como tudo começa em zero e a recompensa só aparece no objetivo, ele repete sempre a mesma ação (a primeira) e quase nunca chega ao objetivo para aprender: **fica preso**. Com ε = 0,1, aprende bem. Com ε = 0,5, aprende Q, mas a política **seguida** durante o treino é muito aleatória e a taxa de sucesso observada é baixa (use ε decrescente: explorar muito no começo, pouco no fim).
4. Otimizar "tempo de tela" recompensa o que **prende** a atenção, não o que o usuário valoriza: o sistema pode aprender a recomendar conteúdo cada vez mais polêmico, alarmista ou viciante, a explorar o sono (vídeos em reprodução automática de madrugada), ou a esconder a saída. A métrica sobe, o bem-estar e a satisfação de longo prazo caem. Mitigações: combinar várias métricas (satisfação declarada, retorno no longo prazo), limites e controles do usuário, auditoria dos efeitos.
5. Exemplo, reconhecimento facial em segurança pública: **afetados:** qualquer pessoa em espaço público, com risco maior para quem o sistema reconhece pior. **Vieses:** taxas de falso positivo maiores para pessoas negras, já documentadas em estudos e em casos de prisões injustas no Brasil; bases de "procurados" desatualizadas. **Transparência e contestação:** frequentemente não há divulgação de taxas de erro, de quem opera o sistema nem de como contestar; a LGPD tem exceções para segurança pública, e a regulação está em discussão. Uma boa resposta aponta lacunas concretas e propõe medidas (auditoria independente, revisão humana obrigatória antes de qualquer abordagem, publicação de métricas por grupo).

## Projeto da etapa

Pontos de revisão:

- **Função de avaliação:** comece simples (diferença de peças, no Othello também os cantos e a mobilidade) e meça cada termo novo jogando contra a versão anterior. Ajuste fino de pesos pode ser feito por busca local (*hill climbing*) com partidas automáticas.
- **Aprofundamento iterativo com tempo:** a profundidade d − 1 completa fornece a melhor ordenação de lances para a profundidade d (comece pelo melhor lance anterior), e garante que sempre exista uma jogada pronta quando o tempo acabar.
- **Tabela de transposição:** chave de hash da posição (*Zobrist hashing*: um número aleatório por peça e casa, combinado por XOR, atualizável em O(1) a cada lance), guardando valor, profundidade e tipo de limite (exato, mínimo ou máximo, por causa das podas).
- **Resolvedor de CSP:** representar domínios como conjuntos e guardar as remoções feitas pela verificação adiante numa pilha, para desfazer ao voltar, evita copiar os domínios inteiros a cada nó.
- **Grade de horários real:** as restrições "suaves" (preferências: um professor que prefere a manhã) não cabem bem em CSP puro: ou viram uma função de custo minimizada por busca local, ou se usa um resolvedor com otimização (CP-SAT permite objetivo). Documente a escolha.
