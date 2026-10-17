# Gabarito: CI/CD e Qualidade Contínua

Abra só depois de tentar.

## Tema 1

1. Exemplo: **no PR:** lint + build + testes de unidade (front e API) + testes de API/integração com banco em container + testes de componentes do front → **merge na main:** deploy automático em homologação → smoke + E2E dos fluxos críticos + acessibilidade (axe) + teste de carga curto (smoke k6) → **aprovação** (automática se tudo verde) → deploy em produção (de preferência canary) → **smoke em produção** e monitoramento sintético contínuo. Uma vez por dia (agendado): suíte E2E completa e teste de carga maior.
2. Prática. Confira se os segredos estão em `secrets` e se o job `e2e` tem `needs: api`.
3. Prática. O ponto-chave é `if: ${{ !cancelled() }}` (ou `if: always()`) no passo de upload, senão ele não roda quando os testes falham, justamente quando o relatório é mais útil.
4. Resposta pessoal. O ganho costuma ser próximo de metade do tempo dos testes (com 2 shards), menos o tempo fixo de setup de cada máquina (checkout, instalar dependências e navegadores). Por isso shards demais deixam de compensar.
5. Em Settings > Branches (ou Rules > Rulesets): regra para `main` com "Require status checks to pass" selecionando os jobs do workflow, e "Require a pull request before merging".

## Tema 2

1. (a) Unidade; (b) E2E; (c) API/integração; (d) unidade; (e) teste de componente (integração no front); um E2E também cobriria, mas seria caro para algo tão específico.
2. Problema: **cone de sorvete**. Suíte lenta (feedback só depois de 3 horas, então ninguém roda no PR), provavelmente cheia de flaky e cara de manter, e bugs de regra de negócio sendo procurados pela interface. Plano: **mês 1:** medir a taxa de flaky e o tempo; colocar os flaky em quarentena; escolher 30 a 50 E2E dos fluxos mais críticos para rodar no PR (o resto agendado à noite); começar testes de API para as regras mais testadas pelos E2E. **Mês 2:** cada E2E que testa uma regra de negócio vira um teste de API ou unidade (com os devs), e o E2E é removido; paralelismo/sharding. **Mês 3:** quality gate no PR (unidade + API + E2E críticos em menos de 15 minutos); meta de cobertura para código novo; revisar a suíte E2E restante, mantendo só jornadas completas.
3. Exemplo resumido:
   - **Objetivo:** liberar duas vezes por semana com confiança nos fluxos de pedido e pagamento.
   - **Riscos principais:** pagamento, cálculo de taxa/cupom, rastreamento do pedido, login.
   - **Níveis:** unidade (regras de preço, cupom, taxa); API (pedidos, pagamentos, restaurantes, com contrato entre serviços); E2E (5 jornadas: login, buscar e pedir, pagar com cartão e PIX, acompanhar, avaliar) em web e em 2 aparelhos Android/iOS.
   - **Manual/exploratório:** sessões em cada funcionalidade nova; testes de interrupção e rede no mobile.
   - **Não funcionais:** carga antes de campanhas e no horário de almoço/jantar; acessibilidade automatizada no PR; segurança (controle de acesso) nos testes de API.
   - **Pipeline e gates:** PR bloqueado sem unidade + API + E2E críticos verdes.
   - **Produção:** smoke pós-deploy, monitoramento sintético do fluxo de pedido, feature flags para lançamentos.
   - **Métricas:** bugs escapados, tempo da suíte, taxa de flaky.
4. (1) A cada 5 minutos: abrir a home e buscar um produto (verifica disponibilidade e busca). (2) A cada 15 minutos: login com conta de teste + adicionar ao carrinho. (3) A cada 30 minutos: checkout até a tela de pagamento com um meio de pagamento de teste, sem concluir (ou concluindo com estorno automático). Todos com alerta para o time de plantão e medindo também o tempo de resposta.
5. Resposta pessoal. É comum a IA acertar cenários óbvios (caminho feliz, campos obrigatórios), inventar regras que não estão na história (limites e mensagens), esquecer casos de permissão/segurança e de dados de fronteira, e não considerar o contexto do produto. Por isso a revisão humana é obrigatória.

## Projeto da etapa

O que um avaliador olharia:

- Pipeline verde, rápido (minutos, não horas) e com relatório acessível.
- Testes independentes rodando em paralelo.
- Estratégia escrita no README explicando o que **não** foi automatizado e por quê.
- Segredos fora do código; `docker compose up` funcionando de primeira.
