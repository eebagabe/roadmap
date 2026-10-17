# Gabarito: Testes Manuais

Abra só depois de tentar.

## Tema 1

1. Exemplo:

   | Item | Conteúdo |
   |---|---|
   | Escopo | Favoritar e desfavoritar na listagem e no detalhe; página "Meus favoritos"; sincronização entre web e app |
   | Fora do escopo | Recomendações baseadas em favoritos |
   | Abordagem | Casos funcionais, exploratório (logado/deslogado, produto esgotado), testes de API do endpoint de favoritos |
   | Ambientes | Homologação; Chrome, Safari, Android e iOS |
   | Riscos | Usuário deslogado tentando favoritar; produto removido do catálogo continuar na lista |
   | Critério de saída | Casos críticos passando e nenhum bug alto aberto |

2. Exemplos (usuários listados na página do saucedemo, senha `secret_sauce`):

   | ID | Título | Dados | Resultado esperado |
   |---|---|---|---|
   | CT-01 | Login com usuário padrão válido | standard_user | Abre a página de produtos |
   | CT-02 | Login com usuário bloqueado | locked_out_user | Mensagem informando que o usuário está bloqueado |
   | CT-03 | Login com senha errada | standard_user / errada | Mensagem de usuário e senha não conferem |
   | CT-04 | Login com campos vazios | (vazio) | Mensagem pedindo o usuário |
   | CT-05 | Acesso direto à página interna sem login | URL /inventory.html | Volta para o login com mensagem de acesso negado |

3. Exemplos: nomes `Ana`, `Maria da Conceição dos Santos Oliveira` (longo), `João D'Ávila` (acento e apóstrofo), `A` (1 caractere); CPF válido gerado por ferramenta, CPF com dígito verificador errado, `000.000.000-00`, com e sem máscara; data de nascimento de quem tem exatamente 18 anos hoje, 17 anos e 364 dias, `29/02/2004`, data futura; e-mails `ana@exemplo.com`, `ana+teste@exemplo.com`, sem `@`, com espaço; telefone com DDD, sem DDD, celular com 9 dígitos, fixo com 8.
4. Ordem: **(b)** juros (alto impacto financeiro, lógica nova), **(c)** login com Google (código novo, impacto alto: sem login ninguém compra), **(a)** cor do rodapé, **(d)** página "Sobre nós" (as duas últimas com baixo risco; a ordem entre elas pouco importa).
5. Exemplo:

   | Requisito | Casos | Status |
   |---|---|---|
   | RF01 - Login | CT-01 a CT-05 | Passou |
   | RF02 - Adicionar ao carrinho | CT-10, CT-11 | Falhou com problem_user |
   | RF03 - Ordenar produtos por preço | - | **Sem cobertura** |

## Tema 2

1. (a) Severidade **alta** (a funcionalidade principal falha para parte dos usuários), prioridade **alta**. (b) Severidade **baixa**, prioridade **média** (comunicação com todo cliente novo; correção barata). (c) Severidade **alta** (dados errados em auditoria), prioridade **baixa agora**, porque só será usado no fim do ano; precisa estar planejado. (d) Severidade **crítica** (vazamento de dados pessoais, falha de controle de acesso, LGPD), prioridade **altíssima**: corrigir imediatamente.
2. ```markdown
   **Título:** Botão "Finalizar compra" não responde ao pagar com cartão salvo
   **Ambiente:** Produção, app Android 3.8.1, Samsung A54 (Android 14)
   **Pré-condições:** usuário com cartão Visa salvo; carrinho com 1 item
   **Passos:**
   1. Abrir o carrinho e tocar em "Continuar"
   2. Selecionar o cartão salvo
   3. Tocar em "Finalizar compra"
   **Resultado atual:** nada acontece; nenhum feedback na tela
   **Resultado esperado:** pedido criado e tela de confirmação exibida
   **Frequência:** 3 de 3 tentativas; com cartão novo funciona
   **Evidências:** vídeo anexo; horário 14:32 para buscar nos logs
   **Severidade:** Alta · **Prioridade sugerida:** Alta
   ```
3. Resposta pessoal. Bugs comuns com `problem_user`: imagens de produtos trocadas ou repetidas; alguns botões "Add to cart"/"Remove" não funcionam em certos produtos; ordenação não muda a lista; campo de sobrenome no checkout não aceita o texto digitado. Confira se cada relatório tem passos, atual vs esperado e evidência.
4. `project = LOJA AND type = Bug AND priority in (Highest, High) AND created >= -7d AND resolution = Unresolved ORDER BY priority DESC, created DESC` (os nomes das prioridades variam conforme a configuração do Jira).
5. Na aba Network, procure a requisição feita na ação. Se ela retornou **4xx/5xx** ou um corpo com erro, o problema está (ou começa) na **API**: anexe print da requisição com status e corpo da resposta (ou exporte o HAR). Se a API respondeu **200 com os dados certos** e a tela mostra errado, o problema é do **front**: anexe a resposta correta e o print da tela errada, mais erros do Console, se houver.

## Projeto da etapa

O que um avaliador olharia:

- Casos priorizados por risco, com resultado esperado verificável.
- Bugs reproduzíveis, um por relatório, com severidade e prioridade justificadas.
- Resumo final com uma recomendação clara ("não liberar: 2 bugs críticos no checkout").
