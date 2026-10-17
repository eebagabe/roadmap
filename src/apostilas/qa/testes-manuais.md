# Testes Manuais: Apostila Prática

Roadmap QA · Semanas 04 e 05

## Comece por aqui

Automação não substitui um bom teste manual: ela **repete** o que alguém pensou antes. Esta apostila ensina a planejar o que testar, documentar sem burocracia e reportar bugs de um jeito que o dev consegue reproduzir de primeira.

### Por que isso vale ouro no mercado

- O primeiro emprego em QA quase sempre começa com testes manuais e escrita de casos.
- Um relatório de bug ruim gera idas e vindas ("não consegui reproduzir"); um bom é corrigido no mesmo dia.
- Entrevistas pedem: "escreva casos de teste para esta tela" e "qual a diferença entre severidade e prioridade?".

### Como esta apostila funciona

1. Pratique em sites feitos para teste: **saucedemo.com**, **automationexercise.com** e a API **serverest.dev**.
2. Crie uma conta gratuita no **Jira** (Atlassian) para registrar bugs de verdade.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** achou um comportamento estranho e não sabe se é bug? Anote os passos, tente reproduzir 3 vezes e procure o requisito. Se ainda houver dúvida, é uma **pergunta** para o PO, não um bug.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 04 | Tema 1: Planejamento e documentação |
| 05 | Tema 2: Bugs e gestão de testes + projeto |

## Tema 1: Planejamento e documentação

**Objetivo:** decidir o que testar, em que ordem, e registrar de forma útil.

### 1.1 Estratégia vs plano de teste

- **Estratégia de teste:** visão geral e duradoura da organização ou produto. "Automatizamos API e fluxos críticos; testes exploratórios a cada release; performance antes de grandes campanhas."
- **Plano de teste:** específico de um projeto ou release. Responde: **o que** testar (escopo), **o que não** testar, **como** (abordagem), **quem**, **quando**, **ambientes**, **riscos**, **critérios de entrada e saída**.

Plano enxuto (cabe numa página):

| Item | Exemplo |
|---|---|
| Escopo | Novo checkout com PIX |
| Fora do escopo | Boleto (sem mudanças) |
| Abordagem | Casos funcionais + exploratório + API + regressão automatizada |
| Ambientes | Homologação com PIX sandbox; Android 12+, iOS 16+, Chrome e Safari |
| Riscos | Integração com o banco instável; QR code expirando |
| Critério de saída | 100% dos casos críticos passando, nenhum bug crítico/alto aberto |

### 1.2 Cenários e casos de teste

- **Cenário:** **o que** testar, em alto nível. "Pagar pedido com PIX."
- **Caso de teste:** **como** testar, com dados e resultado esperado.

Modelo de caso de teste:

| Campo | Exemplo |
|---|---|
| ID | CT-PIX-003 |
| Título | Pagamento PIX expira após 15 minutos |
| Pré-condições | Usuário logado; carrinho com 1 item de R$ 50,00 |
| Passos | 1. Ir ao checkout. 2. Escolher PIX. 3. Gerar QR code. 4. Aguardar 15 minutos sem pagar. |
| Resultado esperado | Mensagem "Código PIX expirado" e botão "Gerar novo código"; pedido continua "Aguardando pagamento" |
| Prioridade | Alta |

Boas práticas:

- Título que diz o **comportamento** testado.
- Um objetivo por caso.
- Resultado esperado **verificável** ("mensagem X aparece"), nunca "funciona corretamente".
- Passos que outra pessoa consegue seguir sem você.

> **Na prática:** muitos times ágeis usam **checklists** e cenários Gherkin em vez de casos de teste detalhados para tudo. Detalhe o que é crítico, regulado ou vai virar automação.

### 1.3 Massa de dados

Dados de teste certos fazem metade do trabalho:

- Usuários com perfis diferentes (novo, antigo, com e sem cartão salvo, bloqueado).
- Valores de fronteira (R$ 0,01, valor máximo).
- Textos difíceis: acentos, emojis 😀, nomes longos, `O'Brien`, `<script>`.
- Datas especiais: 29 de fevereiro, virada do ano, fuso horário, horário de verão (em sistemas que tratam datas históricas).
- **Nunca** use dados reais de clientes em homologação (LGPD). Gere dados fictícios.

### 1.4 Matriz de rastreabilidade

Liga **requisitos** a **casos de teste** (e a bugs). Mostra o que está coberto e o que não está.

| Requisito | Casos de teste | Status |
|---|---|---|
| RF01 - Pagar com PIX | CT-PIX-001, 002, 003 | Passou |
| RF02 - Estornar PIX | CT-PIX-010 | Falhou (BUG-231) |
| RF03 - Comprovante por e-mail | - | **Sem cobertura** |

### 1.5 Checklists

Para verificações rápidas e repetitivas. Exemplo de checklist de formulário:

- [ ] Campos obrigatórios indicados e validados
- [ ] Mensagens de erro claras, perto do campo
- [ ] Limites de tamanho respeitados
- [ ] Funciona só com teclado (Tab, Enter)
- [ ] Botão de envio desabilita ao clicar (sem duplo envio)
- [ ] Dados preservados ao voltar de um erro
- [ ] Funciona no celular

### 1.6 Priorização por risco

Não há tempo para testar tudo com a mesma profundidade. **Risco = probabilidade de falhar × impacto se falhar.**

| | Impacto baixo | Impacto alto |
|---|---|---|
| **Probabilidade alta** | Médio | **Testar primeiro e mais fundo** |
| **Probabilidade baixa** | Testar por último | Médio |

Alto impacto: dinheiro, dados pessoais, login, funcionalidades mais usadas, requisitos legais. Alta probabilidade: código novo, complexo, mexido às pressas, área com histórico de bugs.

### Atividades de fixação do Tema 1

1. Escreva um plano de teste de uma página para a funcionalidade "favoritar produtos" de um e-commerce.
2. Escreva 5 casos de teste para o login do saucedemo.com, incluindo os usuários especiais da página inicial.
3. Monte uma massa de dados para testar um cadastro de cliente (nome, CPF, data de nascimento, e-mail, telefone).
4. Classifique por risco e ordene: (a) mudança na cor do rodapé; (b) novo cálculo de juros do parcelamento; (c) login com Google (código novo); (d) página "Sobre nós".
5. Monte uma matriz de rastreabilidade para 3 requisitos do saucedemo, indicando um requisito sem cobertura.

## Tema 2: Bugs e gestão de testes

**Objetivo:** reportar bugs de forma clara e acompanhar a qualidade com números.

### 2.1 Ciclo de vida do bug

```
Novo → Em análise → Aberto/Confirmado → Em correção → Corrigido → Em reteste → Fechado
                ↘ Rejeitado (não é bug / duplicado / não reproduz)
                                                      ↘ Reaberto (voltou a falhar)
```

Cada empresa adapta, mas a ideia é a mesma.

### 2.2 Severidade vs prioridade

- **Severidade:** o **impacto técnico/negócio** do bug. Quem define costuma ser o QA.
- **Prioridade:** a **urgência** para corrigir. Quem define costuma ser o PO.

| Exemplo | Severidade | Prioridade |
|---|---|---|
| Site fora do ar | Crítica | Alta |
| Logo da empresa com erro de digitação na home | Baixa | **Alta** (imagem da marca) |
| Relatório anual com erro, usado uma vez por ano, daqui a 10 meses | **Alta** | Baixa |
| Texto desalinhado na página de ajuda | Baixa | Baixa |

> **Cuidado! Cai na entrevista:** os exemplos de **baixa severidade e alta prioridade** (logo errado) e **alta severidade e baixa prioridade** (funcionalidade quase não usada) são as perguntas mais comuns sobre o tema.

### 2.3 Relatório de bug

Um bom relatório deixa o dev reproduzir **sem falar com você**.

```markdown
**Título:** Cupom "DEZ" aplica 100% de desconto quando o carrinho tem 2 itens iguais

**Ambiente:** Homologação, v2.14.0, Chrome 130, Windows 11

**Pré-condições:** usuário logado (qa.teste@exemplo.com); cupom DEZ ativo (10%)

**Passos para reproduzir:**
1. Adicionar "Camiseta Azul M" (R$ 50,00) ao carrinho
2. Aumentar a quantidade para 2
3. Aplicar o cupom DEZ

**Resultado atual:** total R$ 0,00
**Resultado esperado:** total R$ 90,00 (R$ 100,00 − 10%)

**Frequência:** 5 de 5 tentativas
**Evidências:** video-cupom.mp4, print-network.png (resposta da API /carrinho/cupom com "desconto": 100)
**Severidade:** Crítica (perda financeira) · **Prioridade sugerida:** Alta
**Observação:** com 1 item ou 2 itens diferentes funciona corretamente.
```

Dicas: título que descreve o **problema** (não "erro no carrinho"); um bug por relatório; isole a causa (a observação final ajuda muito o dev); tom neutro, sem culpados.

### 2.4 Jira

Ferramenta mais usada para gerenciar tarefas e bugs. Conceitos:

- **Projeto**, **Issue** (história, tarefa, bug), **Epic** (agrupa histórias), **Sprint**, **Board**.
- **JQL** para filtros: `project = LOJA AND type = Bug AND status != Done AND priority in (Highest, High) ORDER BY created DESC`
- Plugins de gestão de testes (Xray, Zephyr) para casos e execuções dentro do Jira. Alternativas: TestRail, Qase.

### 2.5 Evidências

- **Print** com a área relevante destacada.
- **Vídeo** curto para fluxos (Loom, OBS, gravador do sistema).
- **Logs do console** e **requisições** da aba Network (status, corpo da resposta), muitas vezes a prova de que o problema é do backend.
- **HAR** (exportar da aba Network) para problemas de rede.
- Dados usados (IDs de pedido, usuário de teste) e horário, para o dev achar nos logs do servidor.

### 2.6 DevTools para QA

| Uso | Como |
|---|---|
| Ver se o erro é do front ou da API | Aba Network: a requisição deu 500? O corpo da resposta tem o erro? |
| Simular rede lenta/offline | Network > Throttling |
| Simular celular | Ctrl+Shift+M (modo dispositivo) |
| Ver erros de JavaScript | Aba Console |
| Limpar dados do site | Application > Clear storage |
| Ver cookies e localStorage | Aba Application |

### 2.7 Métricas de qualidade

Use métricas para **conversar e melhorar**, nunca para culpar pessoas.

| Métrica | O que mostra |
|---|---|
| Bugs abertos por severidade | Situação atual do release |
| Bugs escapados (achados em produção) | Eficácia dos testes |
| Taxa de reabertura | Qualidade das correções |
| Tempo médio de correção | Fluxo do time |
| Cobertura de requisitos | O que ainda não foi testado |
| Taxa de sucesso da regressão automatizada | Saúde da automação |

> **Na prática:** "número de bugs encontrados por QA" é uma métrica ruim: incentiva reportar muitos bugs pequenos em vez de prevenir os grandes.

### Atividades de fixação do Tema 2

1. Classifique severidade e prioridade e justifique: (a) botão "Comprar" não funciona no Safari (15% dos usuários); (b) erro de português no e-mail de boas-vindas; (c) relatório interno de auditoria com valores errados, usado só no fechamento do ano; (d) usuário consegue ver pedidos de outro usuário trocando o ID na URL.
2. Reescreva este relatório de bug: *"Título: Erro. Descrição: Tentei comprar e não deu. Arrumem urgente!!!"*
3. Faça login no saucedemo.com com `problem_user`, encontre 3 bugs e escreva o relatório completo de cada um.
4. Escreva uma JQL para: bugs do projeto LOJA, críticos ou altos, criados nos últimos 7 dias, ainda não resolvidos.
5. Use a aba Network para descobrir se um erro na tela de um site de estudo vem do front ou da API. Que evidência você anexaria?

## Projeto da etapa

**Caça a bugs no Sauce Demo:**

1. Escreva um plano de teste de uma página.
2. Escreva 15 casos de teste priorizados por risco (login, catálogo, carrinho, checkout).
3. Execute com os usuários `standard_user`, `problem_user`, `performance_glitch_user` e `error_user`.
4. Registre os bugs encontrados num projeto do Jira (ou num arquivo `bugs.md`), com severidade, prioridade e evidências.
5. Monte a matriz de rastreabilidade e um resumo final: casos executados, passaram, falharam, bugs por severidade, recomendação (libera ou não libera?).

## Resumão

- Plano de teste: escopo, fora do escopo, abordagem, ambientes, riscos, critérios de saída.
- Caso de teste: objetivo único, passos reproduzíveis, resultado esperado verificável.
- Priorize por risco: probabilidade × impacto.
- Severidade = impacto; prioridade = urgência.
- Relatório de bug: título claro, ambiente, passos, atual vs esperado, evidências, frequência.
- Use a aba Network para separar bug de front e de API.
- Métricas para melhorar o processo, não para culpar pessoas.
