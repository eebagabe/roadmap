# Ferramentas do Programador: Apostila Prática

Roadmap Ciência da Computação · Semanas 5 e 6

## Comece por aqui

Nas universidades, ninguém dá uma disciplina inteira sobre terminal e Git: espera-se que o aluno "aprenda sozinho". O MIT percebeu que isso fazia muita gente perder horas e criou *The Missing Semester of Your CS Education* ("o semestre que falta no seu curso"). Esta etapa é a nossa versão: duas semanas para você ficar confortável com as ferramentas que vai usar em **todas** as etapas seguintes. Tempo investido aqui volta multiplicado.

### Equivalências

| Universidade | Onde isso aparece |
|---|---|
| ITA | Aprendido na prática nos laboratórios de CES-10 |
| MIT | *The Missing Semester* (curso de janeiro, aberto no site) |
| Harvard | Primeiras semanas do CS50 (ambiente, terminal, `make`) |
| Oxford | Sessões práticas de laboratório do primeiro ano |

### Como esta apostila funciona

1. Faça tudo no terminal, mesmo quando houver um botão que faça o mesmo. O objetivo é criar fluência.
2. No Windows, instale o **WSL** (seção 1.6) antes de começar. No macOS, use o Terminal. No Linux, você já está em casa.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** não lembra um comando? Antes de pesquisar, tente `man comando` ou `comando --help`. Ler documentação é uma habilidade que esta etapa também treina.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 5 | Tema 1: Terminal e sistema |
| 6 | Tema 2: Git e fluxo de trabalho + projeto |

## Tema 1: Terminal e sistema

**Objetivo:** navegar, manipular arquivos, entender permissões e processos e configurar o ambiente de trabalho.

### 1.1 Shell e comandos básicos

O **terminal** é a janela; o **shell** é o programa que lê o que você digita e executa (bash e zsh são os mais comuns). Todo comando tem a forma `programa opções argumentos`.

| Comando | O que faz | Exemplo |
|---|---|---|
| `pwd` | Mostra a pasta atual | `pwd` |
| `ls` | Lista arquivos | `ls -la` (inclui ocultos, com detalhes) |
| `cd` | Muda de pasta | `cd projetos`, `cd ..`, `cd ~` |
| `mkdir` | Cria pasta | `mkdir -p trilha/etapa1` |
| `touch` | Cria arquivo vazio | `touch notas.md` |
| `cp`, `mv` | Copia, move ou renomeia | `mv velho.txt novo.txt` |
| `rm` | Apaga (sem lixeira!) | `rm arquivo`, `rm -r pasta` |
| `cat`, `less` | Mostra conteúdo | `less log.txt` (q para sair) |
| `grep` | Procura texto | `grep -rn "TODO" .` |
| `find` | Procura arquivos | `find . -name "*.py"` |

**Caminhos:** absoluto começa em `/` (`/home/ana/projetos`); relativo parte da pasta atual (`../outra`). `~` é a sua pasta pessoal; `.` é a pasta atual.

**Composição é o superpoder do shell.** Cada programa faz uma coisa bem feita e você encadeia:

```bash
cat acessos.log | grep "404" | wc -l          # quantas linhas têm 404
ls -l | sort -k5 -n | tail -3                  # os 3 maiores arquivos
history | grep git                              # comandos git que você já usou
echo "olá" > saida.txt                          # > sobrescreve o arquivo
echo "mais" >> saida.txt                        # >> acrescenta no fim
python3 script.py < entrada.txt                 # < usa arquivo como entrada
```

O `|` (pipe) liga a saída de um programa à entrada do próximo. Essa é a filosofia Unix, que você verá por dentro na etapa de Sistemas Operacionais.

> **Cuidado! Cai na prática:** `rm -rf` apaga tudo sem pedir confirmação e não existe lixeira. Sempre confira com `pwd` e `ls` antes, e nunca rode `rm -rf` com variáveis que podem estar vazias.

### 1.2 Arquivos e permissões

`ls -l` mostra algo como:

```
-rwxr-xr--  1 ana  dev  4096 mar 10 10:00 deploy.sh
```

Os 10 primeiros caracteres: tipo (`-` arquivo, `d` pasta) e três grupos de permissão: **dono**, **grupo** e **outros**. Cada grupo tem `r` (ler), `w` (escrever) e `x` (executar).

Em números (octal): r = 4, w = 2, x = 1. `rwxr-xr--` = 7 5 4.

```bash
chmod +x deploy.sh        # torna executável
chmod 644 notas.md        # rw-r--r--: dono lê e escreve, resto só lê
chmod 600 chave_privada   # só o dono lê e escreve (obrigatório para chaves SSH)
```

**sudo** executa um comando como administrador (root). Use só quando necessário: com sudo, um erro pode estragar o sistema.

### 1.3 Processos

Todo programa em execução é um **processo**, com um número (PID).

```bash
ps aux | grep python      # lista processos
top                        # monitor em tempo real (ou htop, mais bonito)
kill 1234                  # pede para o processo 1234 terminar
kill -9 1234               # força o término (último recurso)
```

- **Ctrl+C** interrompe o programa em primeiro plano.
- **Ctrl+Z** suspende; `bg` continua em segundo plano; `fg` traz de volta.
- `comando &` já inicia em segundo plano.

Todo processo termina com um **código de saída**: 0 significa sucesso, qualquer outro número é erro. `echo $?` mostra o código do último comando. Ferramentas de integração contínua usam isso para saber se os testes passaram.

```bash
python3 testes.py && echo "passou" || echo "falhou"
```

### 1.4 Variáveis de ambiente

São variáveis que o shell passa para todos os programas que inicia.

```bash
echo $HOME              # sua pasta pessoal
echo $PATH              # onde o shell procura programas
export API_URL="http://localhost:8000"
```

O **PATH** é uma lista de pastas separadas por `:`. Quando você digita `python3`, o shell procura um arquivo executável com esse nome em cada pasta do PATH, em ordem. "command not found" quase sempre significa que o programa não está instalado ou sua pasta não está no PATH. `which python3` mostra qual foi encontrado.

Configurações permanentes ficam em `~/.bashrc` ou `~/.zshrc`, lidos toda vez que um shell abre. Ali você coloca `export`s e **apelidos**:

```bash
alias gs="git status"
alias ll="ls -la"
```

> **Cuidado! Cai na prática:** nunca coloque senhas e chaves de API direto no código. Use variáveis de ambiente (ou arquivos `.env` fora do Git).

### 1.5 Editor de código

Escolha um editor e aprenda-o de verdade. O **VS Code** é o mais usado e gratuito. Vale aprender:

- Abrir a pasta inteira do projeto (`code .` no terminal).
- Paleta de comandos (Ctrl+Shift+P), busca em todos os arquivos (Ctrl+Shift+F), ir para definição (F12).
- Múltiplos cursores (Alt+clique), mover linha (Alt+↑/↓), comentar (Ctrl+/).
- Terminal integrado (Ctrl+`) e depurador com pontos de parada.
- Extensões da linguagem que você está usando (Python, Haskell, C/C++).

Também vale conhecer o básico do **Vim** ou do **nano**, porque em servidores muitas vezes só eles existem. Sobrevivência no Vim: `i` para escrever, `Esc` para sair do modo de escrita, `:wq` para salvar e sair, `:q!` para sair sem salvar.

### 1.6 WSL no Windows

O **WSL** (Windows Subsystem for Linux) roda um Linux de verdade dentro do Windows. Quase todo o material de Ciência da Computação (MIT, Harvard, Oxford) assume um ambiente Unix.

```powershell
wsl --install          # no PowerShell como administrador; reinicie e escolha Ubuntu
```

Depois, dentro do Ubuntu:

```bash
sudo apt update && sudo apt upgrade
sudo apt install build-essential git python3 python3-pip python3-venv
```

Dicas: guarde seus projetos dentro do Linux (`~/projetos`), não em `/mnt/c/...` (é muito mais rápido); abra no VS Code com `code .` (instale a extensão WSL).

### Atividades de fixação do Tema 1

1. Crie a estrutura `~/trilha/fase0/{matematica,ferramentas}` com **um único** comando `mkdir`.
2. Baixe um arquivo de texto grande (ex.: `curl -o livro.txt https://www.gutenberg.org/cache/epub/1342/pg1342.txt`) e descubra, só com pipes: quantas linhas ele tem; quantas linhas contêm "Elizabeth"; as 5 palavras mais frequentes.
3. Crie um script `ola.sh` que imprime "olá, $USER". Faça-o executável e rode com `./ola.sh`. Que permissão em octal ele ficou?
4. Rode `sleep 300` em segundo plano, encontre o PID com `ps` e mate o processo.
5. Crie um apelido `trilha` que leva você para a pasta da trilha. Faça-o sobreviver ao fechar o terminal.
6. O que acontece com `echo $?` depois de `ls pasta-que-nao-existe`? E depois de `ls`?

## Tema 2: Git e fluxo de trabalho

**Objetivo:** versionar todo o seu trabalho com Git, colaborar pelo GitHub e saber se virar quando algo dá errado.

### 2.1 Commits

O **Git** guarda fotografias (commits) do seu projeto ao longo do tempo. Cada commit tem um identificador (hash), autor, data, mensagem e aponta para o commit anterior.

Três áreas:

```
pasta de trabalho  →  área de preparação (staging)  →  repositório
   (git add)              (git commit)
```

```bash
git init                         # cria um repositório na pasta atual
git status                       # o que mudou? (use o tempo todo)
git add arquivo.py               # prepara um arquivo
git add -p                       # prepara por partes, revisando cada trecho
git commit -m "feat: adiciona busca binária"
git log --oneline --graph        # histórico resumido
git diff                         # o que mudou e ainda não foi preparado
git diff --staged                # o que vai entrar no próximo commit
```

**Commits atômicos:** cada commit faz **uma** coisa e deixa o projeto funcionando. Fica fácil revisar, reverter e descobrir quando um bug entrou. Mensagens no imperativo, curtas e com contexto; muitas equipes usam o padrão *Conventional Commits* (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).

O arquivo **`.gitignore`** lista o que não deve ser versionado: dependências baixadas, arquivos gerados, segredos.

```
__pycache__/
.venv/
*.o
.env
```

### 2.2 Branches, merge e rebase

Uma **branch** é só um ponteiro para um commit. Criar branches é barato: crie uma para cada tarefa.

```bash
git switch -c busca-binaria      # cria e muda para a branch
# ... commits ...
git switch main
git merge busca-binaria          # junta o trabalho na main
```

**Merge** cria um commit que une as duas histórias. **Rebase** reaplica os seus commits em cima da ponta da outra branch, deixando o histórico em linha reta:

```bash
git switch busca-binaria
git rebase main                  # "mova meus commits para depois do que está na main"
```

**Conflitos** acontecem quando as duas branches mudaram as mesmas linhas. O Git marca o arquivo:

```
<<<<<<< HEAD
return busca(lista, alvo)
=======
return busca_binaria(lista, alvo)
>>>>>>> busca-binaria
```

Edite para ficar como deve, apague os marcadores, `git add` e conclua (`git commit` no merge, `git rebase --continue` no rebase).

> **Cuidado! Cai na prática:** não faça rebase de commits que outras pessoas já baixaram (já enviados para uma branch compartilhada). Rebase reescreve a história e bagunça o repositório dos outros.

### 2.3 GitHub e pull requests

O **GitHub** hospeda repositórios remotos.

```bash
git remote add origin git@github.com:voce/trilha.git
git push -u origin main          # envia e liga a branch local à remota
git pull                         # baixa e integra mudanças
git clone URL                    # copia um repositório existente
```

Configure uma **chave SSH** (`ssh-keygen -t ed25519`, depois cole a chave pública nas configurações do GitHub) para não digitar senha.

Fluxo de trabalho padrão em equipes:

1. Crie uma branch para a tarefa.
2. Faça commits pequenos e envie a branch.
3. Abra um **pull request (PR)**: um pedido para juntar sua branch na principal, com descrição do que mudou e por quê.
4. Colegas revisam, comentam, você ajusta.
5. Testes automáticos rodam (integração contínua).
6. Aprovado, o PR é integrado.

Para contribuir com projetos de outras pessoas, você faz um **fork** (cópia no seu GitHub), trabalha nele e abre o PR para o original.

### 2.4 Um bom README

O README é a porta de entrada do projeto. Um bom README responde:

1. **O que é** e qual problema resolve (uma ou duas frases).
2. **Como instalar e rodar** (comandos copiáveis).
3. **Como usar**, com exemplo.
4. **Como testar.**
5. Decisões importantes, limitações e próximos passos.

Escreva em Markdown: `#` títulos, `**negrito**`, listas com `-`, código entre crases triplas. Recrutadores olham README antes de olhar código.

### 2.5 Depuração e mensagens de erro

Mensagem de erro é informação, não bronca. Leia **de baixo para cima** no Python (a última linha diz o erro; as de cima, o caminho até ele):

```
Traceback (most recent call last):
  File "main.py", line 8, in <module>
    print(media(notas))
  File "main.py", line 3, in media
    return sum(xs) / len(xs)
ZeroDivisionError: division by zero
```

Leitura: na linha 3, dentro de `media`, houve divisão por zero; `media` foi chamada na linha 8 com uma lista vazia.

Método para depurar qualquer coisa:

1. **Reproduza** o erro de forma confiável.
2. **Leia** a mensagem inteira e o local exato.
3. **Forme uma hipótese** e teste com `print` ou com o depurador (ponto de parada, executar passo a passo, inspecionar variáveis).
4. **Reduza** o problema: apague código até sobrar o mínimo que ainda falha.
5. Pesquise a mensagem exata; leia a documentação.
6. Explique o problema em voz alta (a famosa depuração com patinho de borracha).

O Git também ajuda a depurar: `git bisect` faz uma busca binária no histórico para achar o commit que introduziu um bug. Com 1.000 commits, ~10 testes bastam.

### Atividades de fixação do Tema 2

1. Crie um repositório, faça três commits atômicos (um arquivo por commit) e mostre o histórico com `git log --oneline`.
2. Crie uma branch, altere a mesma linha de um arquivo nela e na `main`, e resolva o conflito no merge.
3. Repita com rebase em vez de merge. Compare os dois históricos com `git log --oneline --graph --all`.
4. Você fez um commit com a mensagem errada e ainda não enviou. Como corrigir? E se você commitou um arquivo `.env` com senha e já enviou para o GitHub?
5. Leia o traceback e diga onde está o erro e qual a causa provável:
   ```
   File "app.py", line 12, in carregar
       return dados["usuarios"][0]["nome"]
   KeyError: 'usuarios'
   ```
6. Explique por que `git bisect` precisa de no máximo cerca de 10 passos para 1.000 commits.

## Projeto da etapa

**Repositório da trilha:** crie no GitHub o repositório onde ficarão todos os seus projetos da trilha.

1. Estrutura de pastas por fase e etapa; um README na raiz explicando a trilha e com uma tabela de progresso (etapa, status, link do projeto).
2. `.gitignore` adequado para Python, C e Haskell.
3. O caderno de matemática da etapa anterior como primeiro projeto, com seu próprio README.
4. Histórico com commits atômicos e mensagens no padrão Conventional Commits.
5. Pelo menos uma alteração feita por branch e pull request (mesmo que você mesmo aprove).
6. Bônus: um `Makefile` ou script `rodar.sh` que executa os testes de todos os projetos e retorna código de saída diferente de zero se algum falhar.

## Para ir além

- **The Missing Semester of Your CS Education** (MIT, gratuito, com vídeos e exercícios): shell, editores, dados no terminal, Git, depuração, metaprogramação.
- **Pro Git** (livro gratuito, com versão em português).
- **Learn Git Branching** (site interativo para treinar branches e rebase).
- **CS50**: semana 0 e 1 para o ambiente e o terminal.

## Resumão

- Shell: `programa opções argumentos`. Pipes (`|`) compõem ferramentas pequenas. `>` sobrescreve, `>>` acrescenta.
- Permissões: dono, grupo, outros; r = 4, w = 2, x = 1. Chave privada: 600.
- Processo tem PID e código de saída (0 = sucesso). Ctrl+C interrompe; `kill` termina.
- PATH decide onde os programas são procurados. Segredos em variáveis de ambiente, nunca no código.
- Git: pasta de trabalho, staging, repositório. Commits atômicos com boas mensagens.
- Branch para cada tarefa; merge junta, rebase lineariza (nunca em história compartilhada).
- PR: proposta de mudança revisada por outras pessoas.
- Erro em Python: leia de baixo para cima. Depurar é reproduzir, hipotetizar, reduzir.
