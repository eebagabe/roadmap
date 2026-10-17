# Performance e Segurança: Apostila Prática

Roadmap QA · Semanas 12 e 13

## Comece por aqui

Um sistema pode passar em todos os testes funcionais e ainda assim **cair na Black Friday**, **vazar dados** ou ser **impossível de usar** para uma pessoa cega. Performance, segurança e acessibilidade também são qualidade, e o QA que domina esses temas se destaca muito.

### Por que isso vale ouro no mercado

- Varejo, bancos e streaming (lembre de grandes eventos ao vivo) investem pesado em testes de carga antes de picos.
- Vazamentos de dados geram multas pela LGPD e manchetes.
- Acessibilidade é obrigação legal no Brasil (Lei Brasileira de Inclusão) e cada vez mais cobrada.

### Como esta apostila funciona

1. Use **apenas** sistemas de estudo ou ambientes em que você tem **autorização**: test.k6.io, serverest.dev (com moderação), OWASP Juice Shop rodando na sua máquina.
2. Atividades no fim de cada tema; gabarito na outra aba.

> **Atenção:** teste de carga e de segurança contra sistemas de terceiros **sem autorização por escrito** pode derrubar o serviço de alguém e é crime (Lei 12.737/2012). Sempre use ambientes próprios ou feitos para estudo.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 12 | Tema 1: Testes de performance |
| 13 | Tema 2: Segurança, acessibilidade e mobile + projeto |

## Tema 1: Testes de performance

**Objetivo:** planejar, executar e interpretar testes de carga.

### 1.1 Tipos de teste

| Tipo | Pergunta | Como |
|---|---|---|
| **Smoke** | O script funciona? | 1 a 2 usuários por 1 minuto |
| **Carga** (load) | Aguenta o volume esperado? | Usuários do dia normal ou do pico esperado |
| **Estresse** (stress) | Onde quebra? Como se recupera? | Aumentar até falhar |
| **Pico** (spike) | Aguenta um salto repentino? | De 10 para 1.000 usuários em segundos |
| **Resistência** (soak/endurance) | Aguenta horas seguidas? | Carga moderada por horas (revela vazamento de memória) |

> **Analogia:** carga é ver se a ponte aguenta o trânsito do dia a dia; estresse é colocar caminhões até ela começar a ceder; pico é todos os carros chegando ao mesmo tempo depois de um show; resistência é o trânsito normal durante uma semana inteira.

### 1.2 Métricas

| Métrica | Significa |
|---|---|
| **Tempo de resposta** | Quanto demorou cada requisição |
| **Percentis (p90, p95, p99)** | p95 = 500 ms: 95% das requisições levaram até 500 ms |
| **Throughput (RPS)** | Requisições por segundo atendidas |
| **Taxa de erro** | % de requisições que falharam |
| **Usuários virtuais (VUs)** | Usuários simulados ao mesmo tempo |
| **Recursos** | CPU, memória, conexões do banco no servidor |

> **Cuidado! Cai na entrevista:** por que **não** usar a média do tempo de resposta? Porque ela esconde os casos ruins. Média de 200 ms pode significar que 5% dos usuários esperam 5 segundos. Use **percentis** (p95, p99).

### 1.3 k6

Ferramenta de carga moderna, com scripts em JavaScript.

```bash
# instalação: https://grafana.com/docs/k6/latest/set-up/install-k6/
k6 version
```

```js
// carga-produtos.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // sobe para 20 usuários
    { duration: '1m', target: 20 },    // mantém
    { duration: '30s', target: 0 },    // desce
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% abaixo de 500 ms
    http_req_failed: ['rate<0.01'],    // menos de 1% de erro
  },
}

export default function () {
  const resp = http.get('https://test.k6.io/')
  check(resp, {
    'status 200': r => r.status === 200,
  })
  sleep(1)   // "tempo de pensar" do usuário
}
```

```bash
k6 run carga-produtos.js
```

### 1.4 Thresholds

**Thresholds** são critérios de aprovação. Se não forem atendidos, o k6 sai com erro, e o pipeline falha. Isso transforma performance em **requisito testável**: "p95 do checkout abaixo de 800 ms com 200 usuários".

### 1.5 JMeter

Ferramenta veterana em Java, com interface gráfica, muito presente em empresas grandes e bancos.

- **Thread Group:** quantidade de usuários, rampa e repetições.
- **Samplers:** as requisições (HTTP Request).
- **Listeners:** relatórios (use poucos durante a execução; eles consomem memória).
- **Assertions** e **Timers**.

Boa prática: monte o teste na interface e **execute pela linha de comando**:

```bash
jmeter -n -t plano.jmx -l resultados.jtl -e -o relatorio/
```

### 1.6 Analisar resultados

Um bom relatório de performance responde:

1. **Objetivo e cenário:** o que foi simulado (quantos usuários, por quanto tempo, quais fluxos)?
2. **Resultado vs critério:** os thresholds passaram?
3. **Onde degrada:** a partir de quantos usuários o p95 sobe ou os erros começam?
4. **Gargalo provável:** CPU do servidor? Banco? Um endpoint específico? (Cruze com as métricas de monitoramento.)
5. **Recomendação.**

Cuidados para resultados confiáveis:

- Ambiente parecido com produção (ou os números não valem para produção).
- O gerador de carga não pode ser o gargalo (veja a CPU da máquina que roda o k6).
- Dados variados (não peça sempre o mesmo produto, que fica no cache).
- Inclua o "tempo de pensar" (`sleep`) para simular usuários reais.

### Atividades de fixação do Tema 1

1. Para cada situação, qual tipo de teste? (a) garantir que o sistema aguenta a abertura de vendas de ingressos; (b) descobrir se a memória cresce sem parar ao longo do dia; (c) saber o limite antes de comprar mais servidores; (d) validar o script antes da execução grande.
2. Um relatório diz: "média de 300 ms, p95 de 2,8 s, p99 de 9 s". O sistema está bom? Explique.
3. Escreva um script k6 com 3 estágios (subida, platô, descida) contra test.k6.io, com thresholds de p95 < 600 ms e erros < 1%.
4. Adicione ao script um `check` do status e um segundo endpoint, com pesos diferentes (80% das iterações na home, 20% em outra página).
5. Liste 4 motivos pelos quais um teste de carga pode dar resultado irreal.

## Tema 2: Segurança, acessibilidade e mobile

**Objetivo:** encontrar as falhas de segurança e acessibilidade mais comuns e conhecer o básico de mobile.

### 2.1 OWASP Top 10 para QA

A OWASP mantém a lista dos riscos de segurança mais críticos em aplicações web. O que o QA pode testar no dia a dia:

| Risco | Como o QA testa |
|---|---|
| **Controle de acesso quebrado** | Trocar o ID na URL ou na API (`/pedidos/101` → `/pedidos/102`) e ver se acessa dado de outro usuário (IDOR). Acessar rota de admin com usuário comum. |
| **Falhas de autenticação** | Senhas fracas aceitas? Bloqueio após várias tentativas? Sessão expira? Logout invalida o token? |
| **Injeção** | Campos com `' OR '1'='1`, `<script>alert(1)</script>`: o sistema trata ou quebra? |
| **Dados sensíveis expostos** | Resposta da API traz senha/hash, CPF completo, dados que a tela nem mostra? Site sem HTTPS? |
| **Configuração incorreta** | Mensagens de erro com stack trace, versões de software expostas, páginas de admin abertas |
| **Componentes vulneráveis** | Dependências desatualizadas (`npm audit`, Dependabot) |

> **Cuidado! Cai na entrevista:** o teste de **controle de acesso** (um usuário acessando dados de outro mudando um ID) é simples, não precisa de ferramenta e encontra falhas graves com frequência. Inclua-o em todo plano de teste de API.

### 2.2 OWASP ZAP

Ferramenta gratuita que funciona como **proxy** entre o navegador e o sistema, inspecionando o tráfego, e também faz **varreduras automáticas** de vulnerabilidades conhecidas.

- **Baseline scan** (passivo, seguro de rodar no CI): analisa respostas sem atacar.
- **Full scan** (ativo): envia ataques. **Só em ambiente próprio e autorizado.**

```bash
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://seu-ambiente-de-homologacao
```

Para praticar com segurança, rode o **OWASP Juice Shop** (loja propositalmente vulnerável) na sua máquina:

```bash
docker run -p 3000:3000 bkimminich/juice-shop
```

### 2.3 Testes de acessibilidade

Checklist manual (o mais importante):

1. Navegue **só com teclado**: Tab chega em tudo? A ordem faz sentido? O foco é visível? Modais prendem o foco e fecham com Esc?
2. Use um **leitor de tela** por 10 minutos: NVDA (Windows, gratuito) ou VoiceOver (Mac/iPhone). Botões e imagens têm nome? Formulários anunciam os rótulos e erros?
3. Zoom de **200%**: o conteúdo continua usável, sem cortar?
4. **Contraste** suficiente (ferramenta: WebAIM Contrast Checker)?
5. Informação **não** depende só de cor?

As referências são as **WCAG** (nível AA é o alvo comum) e, no Brasil, o **eMAG** para sites de governo.

### 2.4 axe-core

Automatiza parte da verificação (ferramentas automáticas encontram uma parte dos problemas; o resto exige teste manual).

```bash
npm install -D @axe-core/playwright
```

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('página de login sem violações graves', async ({ page }) => {
  await page.goto('https://www.saucedemo.com')
  const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const graves = resultado.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
  expect(graves).toEqual([])
})
```

Também existe a extensão **axe DevTools** e a auditoria de acessibilidade do **Lighthouse**.

### 2.5 Testes mobile

Particularidades do mobile:

- **Fragmentação:** muitos modelos, tamanhos de tela e versões de Android/iOS. Defina uma matriz de dispositivos pelos dados de uso reais.
- **Interrupções:** ligação, notificação, perder rede, trocar de app e voltar, girar a tela.
- **Rede:** 3G lento, modo avião, troca Wi-Fi ↔ 4G no meio de uma operação.
- **Permissões:** câmera, localização, notificações negadas.
- **Bateria e memória.**
- Lojas (App Store/Play Store) e atualização do app com dados antigos.

Ferramentas: emuladores (Android Studio), simuladores (Xcode, só Mac), dispositivos reais, e nuvens de dispositivos (BrowserStack, Sauce Labs, AWS Device Farm).

### 2.6 Appium

Automação de apps nativos e híbridos (Android e iOS) usando o protocolo WebDriver, o mesmo conceito do Selenium.

```js
// WebdriverIO + Appium (esboço)
const usuario = await $('~campo-usuario')        // accessibility id
await usuario.setValue('standard_user')
await $('~botao-entrar').click()
await expect($('~titulo-produtos')).toBeDisplayed()
```

Mesmos princípios da web: seletores estáveis (accessibility id), esperas, Page Objects e testes independentes. Alternativas: **Maestro** (simples, em YAML), **Espresso** (Android) e **XCUITest** (iOS).

### Atividades de fixação do Tema 2

1. Liste 5 testes de segurança que você incluiria no plano de teste da API de pedidos de um e-commerce.
2. Suba o OWASP Juice Shop localmente e encontre 2 problemas (use o "Score Board" do próprio Juice Shop como guia). Descreva como encontrou.
3. Faça o checklist de acessibilidade manual em um site que você usa (teclado, leitor de tela, zoom, contraste). Registre 3 problemas como relatórios de bug.
4. Automatize a verificação com axe-core em 2 páginas do saucedemo e analise o resultado.
5. Escreva 8 casos de teste específicos de mobile para um app de banco (pense em interrupções, rede e permissões).

## Projeto da etapa

**Teste de carga com relatório:**

1. Escolha um alvo autorizado (test.k6.io ou uma API sua rodando localmente, como a ServeRest via `npx serverest`).
2. Escreva scripts k6 de smoke, carga e estresse para um fluxo (listar produtos → ver produto → adicionar ao carrinho).
3. Defina thresholds e justifique.
4. Rode e escreva um relatório de 1 página: cenário, resultados (p95, erros, RPS), onde degradou e recomendação.
5. Bônus: teste de acessibilidade com axe-core e um baseline scan do ZAP num ambiente local.

## Resumão

- Tipos: smoke, carga, estresse, pico, resistência.
- Use percentis (p95, p99), não média. Thresholds viram critérios de aprovação.
- k6 (JavaScript) e JMeter (GUI, Java); execute JMeter pela linha de comando.
- Ambiente realista e gerador de carga que não seja o gargalo.
- OWASP Top 10: comece por controle de acesso (trocar IDs) e injeção.
- Só teste segurança e carga com autorização.
- Acessibilidade: teclado, leitor de tela, zoom, contraste; axe-core automatiza parte.
- Mobile: fragmentação, interrupções, rede, permissões; Appium para automação.
