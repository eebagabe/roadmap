# Gabarito: Performance e Segurança

Abra só depois de tentar.

## Tema 1

1. (a) **Pico** (spike), e também carga no volume esperado de pico; (b) **resistência** (soak); (c) **estresse**; (d) **smoke**.
2. **Não está bom.** A média de 300 ms esconde a cauda: 5% das requisições levam mais de 2,8 s e 1% leva mais de 9 s. Num sistema com milhares de usuários, isso é muita gente com experiência ruim (e possivelmente timeouts). É preciso investigar o que acontece nessas requisições lentas (queries específicas, cache frio, coleta de lixo, um endpoint em particular).
3. ```js
   import http from 'k6/http'
   import { check, sleep } from 'k6'

   export const options = {
     stages: [
       { duration: '1m', target: 50 },
       { duration: '3m', target: 50 },
       { duration: '1m', target: 0 },
     ],
     thresholds: {
       http_req_duration: ['p(95)<600'],
       http_req_failed: ['rate<0.01'],
     },
   }

   export default function () {
     const r = http.get('https://test.k6.io/')
     check(r, { 'status 200': res => res.status === 200 })
     sleep(1)
   }
   ```
4. ```js
   export default function () {
     if (Math.random() < 0.8) {
       const r = http.get('https://test.k6.io/')
       check(r, { 'home 200': res => res.status === 200 })
     } else {
       const r = http.get('https://test.k6.io/contacts.php')
       check(r, { 'contatos 200': res => res.status === 200 })
     }
     sleep(1)
   }
   ```
   Alternativa mais organizada: usar `scenarios` no `options`, um por fluxo, cada um com sua quantidade de usuários.
5. Ambiente de teste muito menor (ou maior) que produção; gerador de carga sem CPU/rede suficiente (o gargalo vira o próprio k6); dados repetidos que só batem no cache; ausência de "tempo de pensar" (cada VU vira uma metralhadora); rede da máquina de teste muito diferente da dos usuários; serviços externos mockados respondendo instantaneamente.

## Tema 2

1. Exemplos: (1) usuário A tenta `GET /pedidos/{id do pedido de B}` (deve receber 403/404); (2) requisição sem token e com token alterado/expirado (401); (3) usuário comum tenta alterar o status de um pedido para "pago" (403); (4) enviar `quantidade: -5` ou preço no corpo da requisição para tentar mudar o valor (o servidor deve ignorar/recusar e calcular o preço por conta própria); (5) campos de texto com `'; DROP TABLE pedidos;--` e `<script>` (devem ser tratados sem erro 500 e sem execução); (6) resposta não expõe dados desnecessários (CPF completo, dados de cartão).
2. Resposta pessoal. Desafios fáceis comuns do Juice Shop: encontrar o Score Board escondido (procurando nas rotas do JavaScript), acessar a área de administração, provocar mensagens de erro detalhadas, injeção de SQL no login. O importante é descrever **passos reproduzíveis** e o **impacto**.
3. Resposta pessoal. Problemas frequentes: foco invisível, botões só com ícone sem nome, imagens sem `alt`, contraste baixo em textos cinza claro, carrosséis que não param, modais que não fecham com Esc.
4. ```ts
   for (const caminho of ['/', '/inventory.html']) {
     test(`acessibilidade em ${caminho}`, async ({ page }) => {
       // para /inventory.html, faça login antes (ou use storageState)
       await page.goto(caminho)
       const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
       console.table(violations.map(v => ({ regra: v.id, impacto: v.impact, ocorrencias: v.nodes.length })))
       expect(violations.filter(v => v.impact === 'critical')).toEqual([])
     })
   }
   ```
   Analise cada regra (o `helpUrl` de cada violação explica o problema e a correção). Lembre que ferramenta automática não pega tudo.
5. Exemplos: (1) receber uma ligação durante uma transferência e voltar ao app; (2) perder a conexão ao confirmar um PIX (não pode duplicar nem ficar em estado desconhecido); (3) trocar de Wi-Fi para 4G durante o login; (4) app em segundo plano por 10 minutos: a sessão expira e pede autenticação de novo; (5) negar permissão de câmera e tentar ler um QR code (mensagem explicando como liberar); (6) girar a tela no meio do preenchimento (dados preservados); (7) fonte do sistema no tamanho máximo (texto não corta); (8) atualizar o app de uma versão antiga com sessão salva; bônus: print de tela bloqueado nas telas sensíveis, se for requisito.

## Projeto da etapa

O que um avaliador olharia:

- Thresholds justificados pelo negócio, não números aleatórios.
- Relatório com percentis, taxa de erro e o ponto de degradação.
- Uso apenas de alvos autorizados.
- Recomendação clara e acionável ("o endpoint /carrinho degrada a partir de 80 VUs; investigar a query de estoque").
