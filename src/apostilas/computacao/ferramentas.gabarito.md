# Gabarito: Ferramentas do Programador

Abra só depois de tentar.

## Tema 1

1. `mkdir -p ~/trilha/fase0/{matematica,ferramentas}`. O `-p` cria as pastas intermediárias e as chaves expandem para os dois nomes.
2. ```bash
   wc -l livro.txt
   grep -c "Elizabeth" livro.txt
   tr -cs 'A-Za-z' '\n' < livro.txt | tr 'A-Z' 'a-z' | sort | uniq -c | sort -rn | head -5
   ```
   O terceiro comando troca tudo que não é letra por quebra de linha (uma palavra por linha), passa para minúsculas, ordena, conta repetições (`uniq -c` só conta repetições vizinhas, por isso o `sort` antes) e ordena pela contagem. As mais frequentes serão palavras como "the", "to", "of", "and".
3. ```bash
   echo 'echo "olá, $USER"' > ola.sh
   chmod +x ola.sh
   ./ola.sh
   ls -l ola.sh
   ```
   Normalmente fica `rwxr-xr-x`, ou seja, **755** (depende da `umask` do sistema; com umask 002 seria 775). Boa prática: começar o script com `#!/usr/bin/env bash` para dizer qual interpretador usar.
4. ```bash
   sleep 300 &
   ps aux | grep "sleep 300"     # ou: pgrep sleep
   kill <PID>
   ```
   O `&` já imprime o PID ao iniciar. Alternativa: `kill %1` (o número do job).
5. Acrescente ao `~/.bashrc` (ou `~/.zshrc`): `alias trilha="cd ~/trilha"`. Depois rode `source ~/.bashrc` ou abra um terminal novo.
6. Depois do `ls` com erro, `echo $?` mostra um número diferente de zero (no Linux, **2**). Depois de um `ls` que funcionou, mostra **0**.

## Tema 2

1. ```bash
   mkdir exercicio && cd exercicio && git init
   echo "a" > a.txt && git add a.txt && git commit -m "feat: adiciona a"
   echo "b" > b.txt && git add b.txt && git commit -m "feat: adiciona b"
   echo "c" > c.txt && git add c.txt && git commit -m "feat: adiciona c"
   git log --oneline
   ```
2. ```bash
   git switch -c teste
   echo "versão da branch" > a.txt && git commit -am "feat: muda a na branch"
   git switch main
   echo "versão da main" > a.txt && git commit -am "feat: muda a na main"
   git merge teste            # CONFLICT (content): Merge conflict in a.txt
   # edite a.txt, escolha o conteúdo final e apague <<<<<<<, ======= e >>>>>>>
   git add a.txt && git commit
   ```
3. Com merge, o grafo mostra as duas linhas se separando e um **commit de merge** juntando. Com rebase (`git switch teste && git rebase main`), os commits da branch são reaplicados depois dos da main: o histórico fica **em linha reta** e os commits rebaseados ganham **novos hashes**. Se você depois fizer `git switch main && git merge teste`, o Git só avança o ponteiro (*fast-forward*), sem commit de merge.
4. Mensagem errada, ainda não enviado: `git commit --amend -m "mensagem certa"`. Arquivo `.env` com senha já enviado: **considere a senha comprometida e troque-a imediatamente** (revogue a chave no serviço). Depois, adicione `.env` ao `.gitignore` e remova do controle com `git rm --cached .env`. Apagar do histórico (com `git filter-repo`, por exemplo) é complementar, mas não suficiente: alguém pode ter baixado, e o GitHub guarda caches.
5. O erro está na **linha 12 do arquivo app.py, na função `carregar`**. `KeyError: 'usuarios'` significa que o dicionário `dados` **não tem a chave "usuarios"**. Causas prováveis: o JSON veio diferente do esperado (chave com outro nome, como "users"; resposta de erro da API; arquivo vazio). Depure imprimindo `dados.keys()` antes da linha 12, e trate o caso com `dados.get("usuarios", [])`.
6. O `git bisect` faz busca binária: a cada teste você diz se o commit do meio está "bom" ou "ruim", e o intervalo suspeito cai pela metade. Com 1.000 commits: 1.000 → 500 → 250 → ... → 1, que leva ⌈log₂ 1.000⌉ = **10 passos**. É a matemática da etapa anterior aplicada.

## Projeto da etapa

Checklist de revisão do repositório:

- README com tabela de progresso, por exemplo:
  ```markdown
  | Etapa | Status | Projeto |
  |---|---|---|
  | 0.1 Matemática essencial | ✅ | [caderno](fase0/matematica) |
  | 0.2 Ferramentas | ✅ | este repositório |
  ```
- `.gitignore` com pelo menos `__pycache__/`, `.venv/`, `*.o`, `*.out`, `dist-newstyle/` (Haskell), `.env`.
- `git log --oneline` mostrando commits pequenos e mensagens como `feat: adiciona caderno de matemática`, `docs: explica estrutura no README`.
- No GitHub, pelo menos um pull request fechado com merge.
- Exemplo de `rodar.sh` para o bônus:
  ```bash
  #!/usr/bin/env bash
  set -e                                   # para no primeiro erro (código de saída ≠ 0)
  for teste in $(find . -name "test_*.py"); do
      echo "rodando $teste"
      python3 "$teste"
  done
  echo "todos os testes passaram"
  ```
