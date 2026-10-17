# Fundamentos de Teste: Apostila Prática

Roadmap QA · Semanas 01 a 03

## Comece por aqui

Antes de qualquer ferramenta, um QA precisa saber **pensar em testes**: o que testar, quanto testar, quais entradas escolher e como trabalhar junto do time. Ferramenta muda a cada poucos anos; esse raciocínio vale para a carreira inteira.

### Por que isso vale ouro no mercado

- Entrevistas de QA quase sempre perguntam: diferença entre erro, defeito e falha; severidade vs prioridade; valor limite; o que é BDD.
- A certificação **ISTQB CTFL** (Foundation Level) usa exatamente esses conceitos, e muitas vagas citam como diferencial.
- Um QA que escolhe bem os casos de teste acha mais bugs com menos esforço.

### Como esta apostila funciona

1. Leia a teoria; os quadros **Cuidado! Cai na entrevista** são perguntas reais.
2. Pratique as técnicas em sites e apps que você usa todo dia.
3. Faça as atividades antes de abrir o gabarito.

> **Regra dos 20 minutos:** travou num exercício de técnica? Desenhe a regra numa linha (para valores) ou numa tabela (para combinações). Só depois de 20 minutos abra o gabarito.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 01 | Tema 1: Qualidade e o papel do QA |
| 02 | Tema 2: Tipos e técnicas de teste |
| 03 | Tema 3: QA no time ágil + projeto |

## Tema 1: Qualidade e o papel do QA

**Objetivo:** entender o que é qualidade de software e onde o QA atua.

### 1.1 QA vs QC vs Teste

| Termo | Foco | Exemplo |
|---|---|---|
| **QA** (Quality Assurance) | **Processo**: prevenir defeitos | Definir critérios de aceite, revisar requisitos, padronizar code review |
| **QC** (Quality Control) | **Produto**: encontrar defeitos | Inspecionar a entrega antes de liberar |
| **Teste** | Atividade dentro do QC | Executar casos de teste, automatizar |

Na prática, o cargo "QA" faz os três. Mas um bom QA não é só "quem testa no final": ele participa desde a ideia da funcionalidade.

### 1.2 Erro, defeito e falha

- **Erro (engano):** ação humana equivocada. O dev entendeu errado a regra de desconto.
- **Defeito (bug):** o problema no código ou documento, causado pelo erro.
- **Falha:** o comportamento errado que aparece quando o defeito é executado. O cliente paga o preço cheio.

> **Cuidado! Cai na entrevista:** nem todo defeito gera falha (o trecho pode nunca ser executado), e uma falha pode ter outras causas além de defeito no código (ambiente, dados, configuração).

### 1.3 Os 7 princípios do teste (ISTQB)

1. **Teste mostra a presença de defeitos, não a ausência.** Nenhum teste prova que não há bugs.
2. **Teste exaustivo é impossível.** Não dá para testar todas as combinações; por isso existem técnicas e priorização.
3. **Testar cedo economiza tempo e dinheiro.** Bug achado no requisito custa muito menos que em produção.
4. **Defeitos se agrupam.** Poucos módulos concentram a maior parte dos bugs.
5. **Testes se desgastam** (paradoxo do pesticida). Repetir sempre os mesmos testes deixa de achar bugs novos; renove-os.
6. **Teste depende do contexto.** Testar um app de banco é diferente de testar um jogo.
7. **Ausência de defeitos é uma ilusão.** Um sistema sem bugs que não atende a necessidade do usuário não serve.

### 1.4 Verificação vs validação

- **Verificação:** "estamos construindo o produto **certo do jeito certo**?" Confere contra a especificação.
- **Validação:** "estamos construindo o **produto certo**?" Confere contra a necessidade real do usuário.

> **Analogia:** você encomenda um bolo de chocolate. Verificação: o bolo tem 3 camadas e cobertura, como no pedido? Validação: era isso mesmo que a pessoa queria para a festa (e se ela for alérgica a chocolate)?

### 1.5 Ciclo de vida do software e onde o QA entra

Em qualquer modelo (cascata, ágil), o software passa por: requisitos → design → desenvolvimento → teste → implantação → manutenção. O QA moderno participa de **todas** as fases:

| Fase | O que o QA faz |
|---|---|
| Requisitos | Revisa histórias, pergunta "e se…?", escreve critérios de aceite |
| Design | Avalia testabilidade, pensa em dados e ambientes |
| Desenvolvimento | Prepara casos e automação em paralelo, pareia com devs |
| Teste | Executa, explora, reporta |
| Implantação | Smoke test em produção, acompanha métricas |
| Manutenção | Regressão, análise de bugs reportados por clientes |

### 1.6 Níveis de teste

| Nível | Testa | Quem costuma fazer |
|---|---|---|
| **Unidade** | Uma função ou classe isolada | Dev |
| **Integração** | Componentes conversando (API + banco, serviço + serviço) | Dev e QA |
| **Sistema** | O sistema inteiro, ponta a ponta | QA |
| **Aceitação** | Se atende ao negócio (UAT) | Usuário/PO com apoio do QA |

### 1.7 ISTQB CTFL

A certificação Foundation Level é a mais conhecida da área. A prova é de múltipla escolha e cobre princípios, técnicas, gestão de testes e ferramentas. O syllabus (programa) é gratuito no site do BSTQB (o braço brasileiro), em português. Não é obrigatória, mas organiza o vocabulário e ajuda em processos seletivos.

### Atividades de fixação do Tema 1

1. Dê um exemplo de erro, defeito e falha num app de delivery.
2. Explique com suas palavras por que "teste exaustivo é impossível", usando como exemplo um formulário com 5 campos.
3. Classifique como verificação ou validação: (a) conferir se o botão está na cor do protótipo; (b) entrevistar usuários depois de usarem o protótipo; (c) revisar se a API devolve os campos do contrato; (d) teste de aceitação com o cliente.
4. Em qual nível de teste cada bug provavelmente seria encontrado? (a) função de cálculo de frete arredonda errado; (b) o serviço de pedidos não consegue falar com o de pagamentos; (c) o fluxo de compra completo falha no último passo; (d) o cliente diz que o relatório não responde a pergunta que ele precisava.
5. Qual dos 7 princípios explica por que a equipe deve renovar os testes de regressão de tempos em tempos?

## Tema 2: Tipos e técnicas de teste

**Objetivo:** escolher **poucos** casos de teste que encontram **muitos** bugs.

### 2.1 Funcional vs não funcional

- **Funcional:** o que o sistema faz. "Ao aplicar o cupom DEZ, o total cai 10%."
- **Não funcional:** como o sistema se comporta. Performance, segurança, usabilidade, acessibilidade, compatibilidade.

### 2.2 Caixa preta e caixa branca

- **Caixa preta:** testa pelas entradas e saídas, sem olhar o código. A maior parte do trabalho do QA.
- **Caixa branca:** testa olhando a estrutura do código (cobertura de comandos e de decisões). Mais comum em testes de unidade.
- **Caixa cinza:** conhece parte do interior (ex.: consulta o banco para conferir o resultado). Muito comum em QA.

### 2.3 Partição de equivalência

Divida as entradas em **grupos que o sistema deveria tratar do mesmo jeito**. Teste **um valor de cada grupo**.

Regra: "a idade para cadastro deve ser de 18 a 65 anos".

| Partição | Exemplo | Esperado |
|---|---|---|
| Inválida: abaixo | 10 | Recusa |
| Válida | 30 | Aceita |
| Inválida: acima | 70 | Recusa |
| Inválida: não numérico | "abc" | Recusa |

Com 4 testes você cobre o que testar 100 idades cobriria.

### 2.4 Análise de valor limite

Bugs adoram as **fronteiras** (`<` em vez de `<=`). Teste os valores **nos limites e logo ao lado**.

Para 18 a 65: teste **17, 18, 65, 66** (técnica de 2 valores). Na versão de 3 valores, inclua também **19 e 64**.

> **Cuidado! Cai na entrevista:** "Um campo aceita de 1 a 100 caracteres. Quais valores você testaria?" Resposta: 0 (vazio), 1, 100 e 101, mais partições inválidas como só espaços ou caracteres especiais, se fizer sentido. Combine partição + valor limite.

### 2.5 Tabela de decisão

Para regras com **combinações de condições**.

Regra de frete: "Frete grátis se o cliente for Prime **ou** se o pedido for acima de R$ 200. Exceto para a região Norte, onde o grátis só vale para Prime."

| | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|---|---|---|---|---|---|---|---|---|
| Prime? | S | S | S | S | N | N | N | N |
| Acima de R$ 200? | S | S | N | N | S | S | N | N |
| Região Norte? | S | N | S | N | S | N | S | N |
| **Frete grátis?** | **S** | **S** | **S** | **S** | **N** | **S** | **N** | **N** |

Cada coluna vira um caso de teste. A tabela também revela **ambiguidades** no requisito, que você leva para o PO antes de virar bug.

### 2.6 Transição de estados

Para sistemas com **estados** e eventos que mudam o estado. Exemplo de pedido:

```
CRIADO --pagar--> PAGO --enviar--> ENVIADO --entregar--> ENTREGUE
   |                |
cancelar         cancelar
   v                v
CANCELADO <---------+
```

Testes:

- Cada transição **válida** pelo menos uma vez.
- Transições **inválidas**: cancelar um pedido `ENTREGUE`; enviar um pedido `CRIADO` (sem pagamento). O sistema precisa recusar.

### 2.7 Teste exploratório

Aprender, desenhar e executar testes **ao mesmo tempo**, guiado pela curiosidade e pela experiência. Não é "clicar aleatoriamente": tem **missão** e **tempo**.

Estrutura de uma sessão (session-based testing):

- **Missão (charter):** "Explorar o carrinho com cupons para descobrir problemas de cálculo".
- **Tempo:** 60 a 90 minutos.
- **Anotações:** o que testou, bugs, dúvidas, ideias.

Heurísticas que ajudam: vazio/zero/um/muitos; limites; caracteres especiais e emojis; voltar/recarregar no meio do fluxo; dois cliques rápidos; sessão expirada; rede lenta; outro idioma/fuso.

### 2.8 Regressão, smoke e sanity

- **Regressão:** testar de novo o que já funcionava, para garantir que uma mudança não quebrou nada. É o principal candidato a automação.
- **Smoke test:** testes rápidos e amplos dos fluxos críticos ("o sistema liga? dá para logar e comprar?"). Roda depois de cada deploy.
- **Sanity test:** teste rápido e focado na funcionalidade que acabou de ser corrigida.
- **Reteste (confirmação):** executar o mesmo caso que falhou para confirmar a correção.

### Atividades de fixação do Tema 2

1. Um campo de senha exige de 8 a 20 caracteres, com pelo menos uma letra e um número. Liste as partições de equivalência e os valores limite.
2. Monte uma tabela de decisão para: "Desconto de 10% para estudantes, 15% para idosos, e quem é os dois recebe só o maior desconto. Compras com cupom não acumulam com esses descontos."
3. Desenhe os estados de uma assinatura de streaming (teste grátis, ativa, inadimplente, cancelada) e liste 2 transições inválidas para testar.
4. Escreva o charter de uma sessão exploratória de 60 minutos para o checkout de um app de delivery.
5. Diferencie smoke, sanity, reteste e regressão com exemplos de uma mesma correção de bug.

## Tema 3: QA no time ágil

**Objetivo:** trabalhar dentro do time, desde a história até a entrega.

### 3.1 Scrum e Kanban

- **Scrum:** trabalho em **sprints** (1 a 4 semanas), com cerimônias: planning, daily, review e retrospectiva. Papéis: PO (prioriza), Scrum Master (facilita) e time de desenvolvimento (inclui o QA).
- **Kanban:** fluxo contínuo, quadro com colunas (A fazer, Fazendo, Em teste, Feito) e **limite de trabalho em andamento** (WIP).

O QA participa do planning (estimando o esforço de teste), do refinamento (fazendo perguntas) e da review (mostrando o que foi validado).

### 3.2 Critérios de aceite

Condições que a história precisa cumprir para ser aceita. Devem ser **claros, testáveis e sem ambiguidade**.

História: *"Como cliente, quero aplicar um cupom no carrinho para pagar menos."*

Critérios de aceite:

1. Cupom válido reduz o total conforme o tipo (percentual ou valor fixo).
2. Cupom expirado mostra a mensagem "Cupom expirado" e não altera o total.
3. Só um cupom por pedido.
4. O desconto nunca deixa o total negativo.

### 3.3 BDD e Gherkin

**BDD** (Behavior-Driven Development) é escrever o comportamento esperado em exemplos concretos, numa linguagem que negócio, dev e QA entendem. **Gherkin** é o formato:

```gherkin
# language: pt
Funcionalidade: Cupom de desconto

  Cenário: Aplicar cupom percentual válido
    Dado que tenho um carrinho com total de R$ 100,00
    Quando aplico o cupom "DEZ"
    Então o total deve ser R$ 90,00

  Cenário: Cupom expirado
    Dado que tenho um carrinho com total de R$ 100,00
    Quando aplico o cupom "NATAL2020"
    Então devo ver a mensagem "Cupom expirado"
    E o total deve continuar R$ 100,00

  Esquema do Cenário: Total nunca fica negativo
    Dado que tenho um carrinho com total de R$ <total>
    Quando aplico o cupom de valor fixo de R$ <desconto>
    Então o total deve ser R$ <resultado>

    Exemplos:
      | total | desconto | resultado |
      | 50,00 | 20,00    | 30,00     |
      | 15,00 | 20,00    | 0,00      |
```

Boas práticas: um comportamento por cenário; linguagem de negócio (não "clico no botão id=btn-3"); `Dado` (contexto), `Quando` (ação), `Então` (resultado).

> **Cuidado! Cai na entrevista:** BDD **não é** ferramenta (Cucumber é ferramenta). BDD é colaboração para descobrir o comportamento antes de codar. Escrever Gherkin depois que tudo está pronto, sozinho, perde o principal benefício.

### 3.4 Shift-left

"Mover o teste para a esquerda" na linha do tempo: testar **mais cedo**. Revisar requisitos, pensar em cenários no refinamento, automatizar junto com o desenvolvimento, testes de unidade e de API em vez de deixar tudo para a interface no fim.

Complemento: **shift-right**, que é testar e monitorar **em produção** (feature flags, monitoramento, testes A/B).

### 3.5 Definition of Done e Three Amigos

**Definition of Done (DoD):** checklist do time que vale para **toda** história. Exemplo: código revisado, testes automatizados passando, critérios de aceite validados, sem bugs críticos abertos, documentação atualizada.

**Three Amigos:** antes de desenvolver, **negócio (PO)**, **dev** e **QA** conversam sobre a história. Cada um traz um olhar: o que resolver, como construir, o que pode dar errado. Muitos bugs morrem aqui, antes de existir código.

### Atividades de fixação do Tema 3

1. Escreva 4 critérios de aceite para: *"Como usuário, quero recuperar minha senha por e-mail."*
2. Transforme os critérios do exercício 1 em cenários Gherkin em português.
3. O que há de errado neste cenário? `Quando eu clico no campo #email e digito "a@b.com" e clico em #senha e digito "123" e clico em #btn-login Então vejo a página /home`
4. Proponha 4 itens para a Definition of Done de um time que hoje só testa no fim da sprint.
5. Numa reunião de Three Amigos sobre "parcelamento no cartão", que perguntas você, como QA, faria?

## Projeto da etapa

**Plano e casos de teste de um e-commerce real** (escolha uma loja que você usa):

1. Escolha o fluxo de compra (busca → produto → carrinho → checkout).
2. Escreva critérios de aceite para 3 funcionalidades (busca, carrinho, cupom).
3. Aplique partição de equivalência e valor limite em pelo menos 3 campos.
4. Monte uma tabela de decisão para a regra de frete da loja.
5. Escreva os cenários em Gherkin.
6. Faça uma sessão exploratória de 60 minutos e registre o que encontrar.
7. Publique tudo num repositório no GitHub (arquivos `.md` e `.feature`).

## Resumão

- QA previne (processo), QC detecta (produto), teste é a atividade.
- Erro (pessoa) → defeito (código) → falha (comportamento).
- 7 princípios: teste mostra presença de defeitos, exaustivo é impossível, cedo é mais barato, defeitos se agrupam, testes se desgastam, contexto importa, sem defeito não basta.
- Técnicas: partição, valor limite, tabela de decisão, transição de estados, exploratório.
- BDD é colaboração; Gherkin é o formato; Dado/Quando/Então em linguagem de negócio.
- Shift-left: QA desde o refinamento.
