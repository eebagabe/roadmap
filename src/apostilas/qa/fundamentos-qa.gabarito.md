# Gabarito — Fundamentos de Teste

Abra só depois de tentar.

## Tema 1

1. Exemplo: **erro**, o dev entendeu que a taxa de entrega grátis vale acima de R$ 50 "inclusive", mas escreveu a condição como "maior que"; **defeito**, a linha `if (total > 50)` no código; **falha**, um cliente com pedido de exatamente R$ 50,00 paga taxa de entrega.
2. Mesmo um formulário pequeno tem combinações demais: se cada um dos 5 campos tiver só 10 valores relevantes, são 10⁵ = 100 mil combinações, sem contar ordem de preenchimento, navegadores e estados do sistema. Por isso escolhemos casos representativos com técnicas e priorizamos por risco.
3. (a) Verificação; (b) validação; (c) verificação; (d) validação.
4. (a) Unidade; (b) integração; (c) sistema; (d) aceitação.
5. Princípio 5: **testes se desgastam** (paradoxo do pesticida).

## Tema 2

1. Partições de **tamanho**: menos de 8 (inválida), de 8 a 20 (válida), mais de 20 (inválida). Partições de **composição**: só letras (inválida), só números (inválida), letras e números (válida), vazia (inválida). Valores limite de tamanho: **7, 8, 20 e 21** caracteres (com letras e números, para isolar a regra de tamanho). Exemplo de conjunto: `abc1234` (7, recusa), `abcd1234` (8, aceita), senha de 20 com letras e números (aceita), 21 (recusa), `abcdefgh` (8 só letras, recusa), `12345678` (8 só números, recusa).
2. Condições: estudante (S/N), idoso (S/N), cupom (S/N).

   | | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
   |---|---|---|---|---|---|---|---|---|
   | Estudante | S | S | S | S | N | N | N | N |
   | Idoso | S | S | N | N | S | S | N | N |
   | Cupom | S | N | S | N | S | N | S | N |
   | **Resultado** | Só cupom | 15% | Só cupom | 10% | Só cupom | 15% | Só cupom | Nenhum |

   Pergunta para o PO que a tabela revela: com cupom, o cliente recebe **apenas o cupom**, ou o sistema deveria aplicar o **maior** entre cupom e desconto de perfil? O requisito não diz.
3. Estados: `TESTE_GRATIS`, `ATIVA`, `INADIMPLENTE`, `CANCELADA`. Transições válidas: teste grátis → ativa (primeira cobrança ok); ativa → inadimplente (cobrança falha); inadimplente → ativa (pagamento regularizado); qualquer uma → cancelada (usuário cancela). Inválidas para testar: **cancelada → inadimplente** (não deve haver cobrança após cancelar); **teste grátis → inadimplente sem tentativa de cobrança**; reativar uma cancelada sem novo pagamento.
4. Exemplo: *"Explorar o checkout com diferentes formas de pagamento, cupons e alterações de endereço, para descobrir problemas de cálculo de total, de taxa de entrega e de mensagens de erro. Tempo: 60 minutos. Dados: conta de teste com 2 endereços, cartão de teste aprovado e recusado, cupom válido e expirado."*
5. Bug: cupom não aplicava em pedidos acima de R$ 1.000. **Reteste:** executar o caso que falhou (cupom num pedido de R$ 1.200) e confirmar que agora funciona. **Sanity:** testes rápidos ao redor da correção (cupom em R$ 999, R$ 1.000, R$ 1.001, cupom percentual e fixo). **Regressão:** a suíte do carrinho e do checkout inteira, para ver se a mudança não quebrou outra coisa. **Smoke:** após o deploy, verificar rapidamente que login, busca, carrinho e pagamento continuam no ar.

## Tema 3

1. (1) Ao informar um e-mail cadastrado, o sistema envia um link de redefinição. (2) Ao informar um e-mail não cadastrado, o sistema mostra a **mesma** mensagem genérica ("Se o e-mail existir, você receberá um link"), para não revelar quais e-mails existem. (3) O link expira em 30 minutos e só pode ser usado uma vez. (4) A nova senha segue a política de senha e, após a troca, as outras sessões abertas são encerradas.
2. ```gherkin
   # language: pt
   Funcionalidade: Recuperar senha

     Cenário: Solicitar recuperação com e-mail cadastrado
       Dado que existe um usuário com o e-mail "ana@exemplo.com"
       Quando solicito a recuperação de senha para "ana@exemplo.com"
       Então devo ver a mensagem "Se o e-mail existir, você receberá um link"
       E um e-mail de redefinição deve ser enviado para "ana@exemplo.com"

     Cenário: Solicitar recuperação com e-mail não cadastrado
       Quando solicito a recuperação de senha para "naoexiste@exemplo.com"
       Então devo ver a mensagem "Se o e-mail existir, você receberá um link"
       E nenhum e-mail deve ser enviado

     Cenário: Link expirado
       Dado que recebi um link de redefinição há 31 minutos
       Quando acesso o link
       Então devo ver a mensagem "Link expirado"

     Cenário: Link já utilizado
       Dado que já redefini minha senha usando um link
       Quando acesso o mesmo link novamente
       Então devo ver a mensagem "Link inválido"
   ```
3. Está escrito em linguagem de **interface** (seletores, cliques), não de negócio; mistura várias ações num só passo; e quebra se o layout mudar. Melhor: `Dado que sou um usuário cadastrado / Quando faço login com credenciais válidas / Então devo ver a página inicial`. Os detalhes de clique ficam no código da automação.
4. Exemplos: critérios de aceite validados pelo QA **dentro** da sprint; testes automatizados de API e unidade para o código novo, rodando no CI; nenhum bug crítico ou alto em aberto na história; Three Amigos feito antes de iniciar o desenvolvimento.
5. Exemplos: Qual o número máximo de parcelas, e ele depende do valor? Há valor mínimo por parcela? Tem juros a partir de qual parcela, e como mostramos o valor total? E se o cartão for de débito ou pré-pago? Como o estorno funciona em compra parcelada? O que acontece com cupom de desconto em compra parcelada? Como arredondar os centavos (a última parcela absorve a diferença)?

## Projeto da etapa

O que um avaliador olharia:

- Critérios de aceite testáveis (nada de "deve ser rápido" sem número).
- Valores limite corretos e justificados.
- Tabela de decisão que revela pelo menos uma ambiguidade.
- Gherkin em linguagem de negócio, um comportamento por cenário.
- Registro da sessão exploratória com bugs claros e reproduzíveis.
