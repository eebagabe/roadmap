# Gabarito: Segurança e Criptografia

Abra só depois de tentar.

## Tema 1

1. ```python
   import os
   m1, m2 = b"ATACAR AO AMANHECER", b"RECUAR PARA O LESTE"
   k = os.urandom(len(m1))
   c1 = bytes(a ^ b for a, b in zip(m1, k))
   c2 = bytes(a ^ b for a, b in zip(m2, k))
   x = bytes(a ^ b for a, b in zip(c1, c2))
   print(x == bytes(a ^ b for a, b in zip(m1, m2)))     # True
   ```
   A chave some: c₁ ⊕ c₂ = m₁ ⊕ m₂. Quem conhece ou adivinha parte de uma mensagem descobre a parte correspondente da outra. Por isso a chave do one-time pad nunca pode ser reutilizada (e, pelo mesmo motivo, um *nonce* nunca pode se repetir com a mesma chave numa cifra de fluxo).
2. Em **ECB**, as áreas de cor uniforme viram blocos cifrados **iguais**, e o contorno da imagem continua visível na imagem cifrada. Em **CTR** (ou qualquer modo com *nonce*), o resultado parece ruído uniforme. Para a demonstração, cifre só os bytes dos pixels e mantenha o cabeçalho do arquivo, para poder visualizar.
3. 2⁵⁶ ≈ 7,2 × 10¹⁶ chaves a 10¹² por segundo: ~72.000 s ≈ **20 horas** (o DES foi de fato quebrado por força bruta no fim dos anos 1990). 2¹²⁸ ≈ 3,4 × 10³⁸: ~3,4 × 10²⁶ s ≈ **10¹⁹ anos**, quase um bilhão de vezes a idade do universo. Cada bit a mais dobra o trabalho.
4. O sal impede tabelas pré-calculadas e obriga a atacar cada usuário separadamente, mas o SHA-256 foi feito para ser **rápido**: hardware comum calcula bilhões por segundo, e listas de senhas comuns são testadas em pouco tempo. Medições típicas: **milhões** de SHA-256 por segundo num núcleo, contra **poucos** bcrypt com custo 12 por segundo (cada um leva ~0,2 a 0,3 s). Para quem faz login uma vez, a diferença é imperceptível; para quem tenta adivinhar em massa, o custo fica um milhão de vezes maior.
5. A = 5⁶ mod 23 = **8**; B = 5¹⁵ mod 23 = **19**. Alice: Bᵃ = 19⁶ mod 23 = **2**. Bob: Aᵇ = 8¹⁵ mod 23 = **2**. Segredo comum: **2**.
6. ```python
   p, q, e = 61, 53, 17
   n, phi = p * q, (p - 1) * (q - 1)
   d = pow(e, -1, phi)
   m = 42
   c = pow(m, e, n)
   c_dobro = (c * pow(2, e, n)) % n          # sem conhecer m
   print(pow(c_dobro, d, n))                  # 84 = 2 × 42
   ```
   Como 2ᵉ × mᵉ = (2m)ᵉ, multiplicar o texto cifrado por 2ᵉ produz a cifra de 2m. É por isso que o RSA real usa preenchimento aleatório (OAEP) e por isso cifrar sem autenticar não garante integridade.
7. A saída mostra o certificado do **site** (o *subject* com o nome do domínio), o da **intermediária** que o assinou e, às vezes, a cadeia até a **raiz**, que normalmente não é enviada porque já está no repositório confiável do sistema. Em cada certificado, o *issuer* é o *subject* do próximo da cadeia.

## Tema 2

1. O AddressSanitizer interrompe o programa com `stack-buffer-overflow`, mostrando a linha do `scanf`, o tamanho da escrita e a variável `nome` de 16 bytes. Com `fgets(nome, sizeof nome, stdin)`, a leitura fica limitada ao tamanho do buffer e o erro desaparece (o restante da linha precisa ser descartado ou tratado). Sobre as defesas: o **canário** é um valor aleatório colocado na pilha antes dos dados de controle da função; se ele mudar, o programa é encerrado antes de usar dados corrompidos. O **ASLR** sorteia os endereços de memória a cada execução, então um atacante não sabe onde estão o código e os dados. Nenhuma das duas corrige o bug: só tornam a exploração mais difícil. A correção de verdade é não escrever além do buffer (ou usar uma linguagem segura em memória).
2. A correção é sempre a mesma: **consultas parametrizadas** (ou um ORM que as use), para que o valor digitado seja tratado como **dado** e nunca como parte do comando SQL. Defesas complementares: o usuário do banco da aplicação com o menor privilégio possível, validação da entrada por lista do que é permitido, e mensagens de erro que não exibem a consulta.
3. O XSS acontece quando um texto enviado por um usuário é inserido na página como **HTML** sem escape e o navegador o interpreta como código. O React protege por padrão porque, ao renderizar `{texto}`, ele insere **texto**, escapando os caracteres especiais; o risco volta quando se usa `dangerouslySetInnerHTML`, `innerHTML` ou se monta HTML por concatenação. Defesas complementares: sanitizar HTML que precise ser aceito (com uma biblioteca como DOMPurify), uma política CSP que proíba scripts embutidos, e cookies de sessão com `HttpOnly`.
4. Possível **controle de acesso quebrado** (IDOR): estar logado não significa poder ver **qualquer** fatura. O servidor deve verificar que a fatura pertence ao usuário (ou que ele tem permissão), a cada requisição. Teste automatizado:
   ```python
   def test_usuario_nao_ve_fatura_de_outro(cliente, criar_usuario, criar_fatura):
       ana, bia = criar_usuario("ana"), criar_usuario("bia")
       fatura_da_bia = criar_fatura(dona=bia)
       resposta = cliente.get(f"/api/faturas/{fatura_da_bia.id}", como=ana)
       assert resposta.status_code in (403, 404)
   ```
   (404 evita até confirmar que a fatura existe.) Usar identificadores aleatórios (UUIDs) dificulta adivinhar, mas **não** substitui a verificação.
5. Problemas e correções:
   - Mensagem revela que o e-mail está cadastrado (enumeração de usuários): use uma mensagem genérica, "usuário ou senha inválidos".
   - Sem limite de tentativas: permite adivinhar senhas em massa; aplique limite por conta e por origem, com atrasos progressivos, e ofereça MFA.
   - Senha em MD5: rápido e quebrado; migre para **Argon2id** ou **bcrypt** (recalculando o hash no próximo login bem-sucedido de cada usuário).
   - Cookie sem `HttpOnly`: um XSS conseguiria ler a sessão; use `HttpOnly`, `Secure` e `SameSite`, e regenere o identificador da sessão no login.
6. Diagrama: navegador do paciente e da recepção (zona não confiável) → **fronteira** → API → **fronteira** → banco de dados; e API → **fronteira** → provedor de e-mail e SMS. Exemplos de ameaças STRIDE:
   | Ameaça | Exemplo | Mitigação |
   |---|---|---|
   | S | Alguém entra como outro paciente com senha vazada | MFA, limite de tentativas, senhas comparadas com listas de vazadas |
   | S | Lembrete falso por SMS em nome da clínica | Mensagens sem links de login; educação dos pacientes |
   | T | Paciente altera o ID do médico ou o horário na requisição | Validar tudo no servidor; regras de negócio só no servidor |
   | R | Recepcionista nega ter cancelado uma consulta | Registro de auditoria com usuário, ação e horário |
   | I | Paciente vê consultas de outro trocando o ID | Verificação de propriedade em cada requisição |
   | I | Backup do banco sem criptografia vaza dados de saúde | Backups cifrados, acesso restrito, conformidade com a LGPD |
   | D | Robô marca todos os horários livres | Limite de agendamentos por paciente, CAPTCHA, limite de requisições |
   | E | Usuário comum acessa a área administrativa | Autorização por papel verificada no servidor, menor privilégio |

## Projeto da etapa

Pontos de revisão:

- **Primos grandes:** gere números ímpares aleatórios de 1.024 bits com `secrets.randbits` e teste com Miller-Rabin (40 rodadas); a densidade de primos garante que poucas centenas de tentativas bastam.
- **Ataques didáticos ao RSA "de livro":** explique por que cada um funciona (falta de preenchimento, maleabilidade, determinismo) e, principalmente, como o OAEP impede cada um. A parte mais importante do relatório é a conclusão: em produção, use bibliotecas consolidadas e não implemente criptografia própria.
- **Laboratório web:** rode o Juice Shop **localmente**, num container, e use só ambientes de treinamento. Para cada desafio, o relatório deve dar mais peso à **correção no código** (consulta parametrizada, verificação de autorização, escape de saída, hash de senha adequado) do que ao caminho da exploração.
- **Relatório:** classifique por gravidade, descreva o impacto para o negócio em linguagem simples e priorize as correções. Bons relatórios são lidos por gestores, não só por técnicos.
