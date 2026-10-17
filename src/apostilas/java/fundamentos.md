# Fundamentos — Apostila Prática

Roadmap Java Backend · Semanas 01 a 03

## Comece por aqui

Esta apostila cobre o que acontece **por baixo** do seu código Java: como o computador executa um programa, o que o sistema operacional faz e como os dados viajam pela internet. Parece "teoria de faculdade", mas é exatamente o que separa quem só escreve código de quem entende por que o sistema está lento, travado ou caindo.

### Por que isso vale ouro no mercado

- `OutOfMemoryError` e `StackOverflowError` são problemas de **memória** (heap e stack). Quem entende os dois resolve em minutos.
- Um container Docker é só um **processo** Linux isolado. Quem entende processo entende Docker e Kubernetes muito mais rápido.
- "A API está lenta" muitas vezes é **rede**: DNS, handshake TLS, latência entre regiões.
- Entrevistas de bancos e big techs perguntam "o que acontece quando você digita uma URL no navegador?". Esta apostila responde.

### Como esta apostila funciona

1. Leia a teoria com calma. Os quadros **Cuidado! Cai na entrevista** são os pontos mais cobrados.
2. Digite os comandos e códigos (não copie e cole). Mude valores e veja o que acontece.
3. Faça as atividades **antes** de abrir a aba Gabarito.
4. Escreva as respostas num caderno ou num arquivo `.md` no seu GitHub. Isso vira portfólio.

> **Regra dos 20 minutos:** travou? Releia a seção, teste um pedaço pequeno, desenhe no papel. Só depois de 20 minutos de tentativa abra o gabarito.

### Preparando o ambiente

| Opção | Para quem | Como começar |
|---|---|---|
| WSL2 (recomendado) | Quem usa Windows | No PowerShell como administrador: `wsl --install` e reinicie |
| Linux nativo | Quem já usa Linux | Nada a fazer |
| macOS | Quem usa Mac | Terminal já serve; instale o Homebrew |

Você também vai precisar de um JDK (21 ou mais novo):

```bash
sudo apt install openjdk-21-jdk   # Ubuntu/WSL
java -version
javac -version
```

### Plano de estudo sugerido

| Etapa | O que fazer | Tempo |
|---|---|---|
| 1 | Tema 1 — Como computadores executam programas | Semana 01 |
| 2 | Tema 2 — Sistema operacional, processos e memória | Semana 02 |
| 3 | Tema 3 — Redes e internet | Semana 03 |
| 4 | Projeto da etapa + resumão | Fim de semana |

## Tema 1 — Como computadores executam programas

**Objetivo:** entender o caminho do seu código até virar algo que a CPU executa, e onde os dados ficam guardados enquanto o programa roda.

### 1.1 CPU e RAM

A **CPU** (processador) é quem faz as contas. Ela só entende instruções muito simples: somar, comparar, copiar um valor de um lugar para outro, pular para outra instrução. Ela executa bilhões dessas por segundo.

A **RAM** (memória principal) é onde ficam o programa e os dados **enquanto ele roda**. É rápida, mas some quando o computador desliga. O disco (SSD) guarda tudo de forma permanente, mas é muito mais lento.

> **Analogia:** a CPU é um cozinheiro muito rápido. A RAM é a bancada: o que está ali ele pega na hora. O disco é o estoque no fundo do restaurante: tem tudo, mas buscar demora.

Ordem de grandeza (vale decorar a proporção, não o número exato):

| Onde está o dado | Tempo aproximado |
|---|---|
| Registrador da CPU | < 1 ns |
| Cache L1 | ~1 ns |
| RAM | ~100 ns |
| SSD | ~100 µs (mil vezes mais que a RAM) |
| Rede entre continentes | ~150 ms |

### 1.2 Código fonte e código de máquina

Você escreve **código fonte**: texto que humanos leem (`int x = a + b;`). A CPU só entende **código de máquina**: números binários que representam instruções.

Alguém precisa traduzir. Existem três jeitos:

| Jeito | Como funciona | Exemplo |
|---|---|---|
| Compilado | Traduz tudo antes de rodar e gera um executável | C, C++, Go, Rust |
| Interpretado | Um programa lê e executa linha por linha | Python (simplificando), Bash |
| Bytecode + VM | Compila para um formato intermediário, uma máquina virtual executa | **Java**, Kotlin, C# |

### 1.3 Compilação em C: as quatro etapas

Para entender o Java, vale ver primeiro o caminho clássico do C:

1. **Preprocessing:** resolve `#include` e `#define`. Basicamente "cola" textos.
2. **Compiling:** transforma C em **assembly** (instruções legíveis da CPU).
3. **Assembling:** transforma assembly em **código objeto** (binário, `.o`).
4. **Linking:** junta seu código objeto com bibliotecas (como a `printf`) e gera o executável final.

Teste você mesmo:

```c
// ola.c
#include <stdio.h>
int main() {
    printf("Ola, roadmap!\n");
    return 0;
}
```

```bash
gcc -E ola.c -o ola.i   # 1. preprocessing
gcc -S ola.i -o ola.s   # 2. compiling (abra o ola.s e veja o assembly)
gcc -c ola.s -o ola.o   # 3. assembling
gcc ola.o -o ola        # 4. linking
./ola
```

### 1.4 E o Java?

O Java faz diferente:

1. `javac` compila `Main.java` em **bytecode** (`Main.class`). Bytecode não é código de máquina de nenhuma CPU real.
2. A **JVM** (Java Virtual Machine) lê o bytecode e executa. No começo ela interpreta; os trechos mais usados são compilados para código de máquina **durante a execução** pelo **JIT** (Just-In-Time compiler).

Por isso o lema "escreva uma vez, rode em qualquer lugar": o mesmo `.class` roda em Windows, Linux ou Mac, desde que tenha uma JVM.

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        int a = 2, b = 3;
        System.out.println(a + b);
    }
}
```

```bash
javac Main.java       # gera Main.class
javap -c Main         # mostra o bytecode
java Main             # a JVM executa
```

> **Cuidado! Cai na entrevista:** "Java é compilado ou interpretado?" Resposta boa: **os dois**. É compilado para bytecode pelo `javac` e, na JVM, é interpretado e também compilado para código nativo pelo JIT nos trechos mais executados ("hot spots").

### 1.5 Endereços de memória

A RAM é como uma rua gigante de casas numeradas. Cada casa guarda 1 byte e tem um **endereço**. Uma variável é um apelido para um endereço. Um `int` em Java ocupa 4 bytes, um `long` ocupa 8.

Em Java você não mexe com endereços diretamente (não existe ponteiro como em C), mas eles existem: uma variável de objeto guarda uma **referência**, que é basicamente "onde o objeto está".

### 1.6 Stack e Heap

Quando o programa roda, a memória dele é dividida em regiões. As duas mais importantes:

| | Stack (pilha) | Heap |
|---|---|---|
| Guarda | Variáveis locais e chamadas de função | Objetos (`new`) |
| Tamanho | Pequena (por thread) | Grande (compartilhada) |
| Quem limpa | Automático, ao sair da função | Garbage Collector (em Java) |
| Erro típico | `StackOverflowError` | `OutOfMemoryError` |

```java
void exemplo() {
    int idade = 30;                 // na stack
    Pessoa p = new Pessoa("Ana");   // 'p' (a referência) na stack, o objeto Pessoa no heap
}
```

> **Analogia:** a stack é uma pilha de pratos: você só coloca e tira do topo, rápido e organizado. O heap é um depósito: cabe muita coisa, em qualquer lugar, mas alguém precisa passar recolhendo o que ninguém usa mais (o Garbage Collector).

### 1.7 Call Stack

Cada vez que uma função é chamada, um **frame** (com as variáveis locais e o ponto de retorno) é empilhado na stack. Quando a função termina, o frame sai.

```java
static int fatorial(int n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}
```

`fatorial(3)` empilha: `fatorial(3)` → `fatorial(2)` → `fatorial(1)`. Depois desempilha na ordem contrária, multiplicando.

Recursão sem caso base nunca para de empilhar e estoura a stack:

```java
static int infinito(int n) { return infinito(n + 1); }  // StackOverflowError
```

O **stack trace** que aparece quando dá erro é justamente a call stack naquele momento. Aprender a ler stack trace é uma das habilidades mais úteis do dia a dia.

> **Cuidado! Cai na entrevista:** "Qual a diferença entre stack e heap?" Fale de **o que guarda**, **quem limpa** e **qual erro** cada uma gera. Bônus: cada thread tem sua própria stack; o heap é compartilhado entre todas.

### Atividades de fixação — Tema 1

1. Explique com suas palavras, usando uma analogia diferente do cozinheiro, a diferença entre CPU, RAM e disco.
2. Rode as quatro etapas de compilação do `ola.c`. Abra o `ola.s` e anote 3 instruções que você reconhece (ou chuta o que fazem).
3. Compile o `Main.java` e rode `javap -c Main`. Encontre a instrução que faz a soma.
4. Um colega diz: "Java é lento porque é interpretado". Corrija-o em até 3 frases.
5. No código abaixo, diga o que fica na stack e o que fica no heap:
   ```java
   void processar() {
       int total = 0;
       List<String> nomes = new ArrayList<>();
       nomes.add("Ana");
   }
   ```
6. Escreva um método recursivo que cause `StackOverflowError`. Depois, rode com `java -Xss256k Main` e com `java -Xss4m Main` contando a profundidade alcançada. O que mudou e por quê?

## Tema 2 — Sistema operacional, processos e memória

**Objetivo:** entender quem gerencia a CPU e a memória entre vários programas, e o que são processos e threads.

### 2.1 O que o sistema operacional faz

O SO (Linux, Windows, macOS) fica entre o hardware e os programas. Ele tem dois papéis:

- **Máquina estendida:** esconde a complexidade. Você chama `Files.readString(path)` e não precisa saber em que setor do SSD o arquivo está.
- **Gerente de recursos:** divide CPU, memória, disco e rede entre todos os programas de forma justa e segura.

Os programas pedem coisas ao SO por meio de **chamadas de sistema (syscalls)**: abrir arquivo, criar processo, enviar dados pela rede.

### 2.2 Processo e Thread

Um **processo** é um programa em execução. Ele tem seu próprio espaço de memória, seus arquivos abertos e pelo menos uma thread.

Uma **thread** é uma linha de execução dentro do processo. Várias threads do mesmo processo **compartilham a memória** (o heap), mas cada uma tem sua própria stack.

| | Processo | Thread |
|---|---|---|
| Memória | Isolada | Compartilhada com as outras threads do processo |
| Custo para criar | Alto | Mais baixo |
| Se travar | Não derruba os outros processos | Pode derrubar o processo todo |
| Comunicação | Precisa de IPC (pipes, sockets) | Lê e escreve na mesma memória |

> **Analogia:** o processo é uma casa. As threads são as pessoas morando nela: dividem a cozinha e a geladeira (memória), cada uma com sua tarefa. Duas pessoas pegando o último iogurte ao mesmo tempo é uma **condição de corrida**.

Uma aplicação Spring Boot é **um processo** (a JVM) com **dezenas de threads**: uma para cada requisição sendo atendida, threads do Garbage Collector, e por aí vai.

```bash
java -version &          # qualquer programa Java rodando
ps aux | grep java       # lista processos
top -H -p <PID>          # mostra as threads de um processo
jcmd <PID> Thread.print  # lista as threads da JVM (com nome!)
```

### 2.3 Context Switch

Uma CPU com 8 núcleos executa no máximo 8 threads **ao mesmo tempo**. Mas seu computador tem milhares de threads. O SO alterna rapidinho entre elas: salva o estado de uma (registradores, onde parou) e carrega o de outra. Isso é a **troca de contexto**.

Ela tem custo. Criar 10 mil threads de SO para atender 10 mil requisições gasta muito tempo só trocando de contexto e muita memória com stacks. Foi por isso que o Java 21 trouxe as **Virtual Threads**, que você verá na etapa Java Backend.

### 2.4 Memória virtual, Address Space e Paging

Cada processo acha que tem a memória toda só para ele, começando do endereço 0. Isso é o **espaço de endereçamento** (address space) **virtual**. O SO e a CPU (pela MMU) traduzem endereços virtuais em endereços físicos reais.

A memória é dividida em **páginas** de tamanho fixo (normalmente 4 KB). Cada processo tem uma **tabela de páginas** que diz em qual quadro da RAM física cada página está. Se a página não está na RAM, acontece um **page fault** e o SO busca do disco (swap).

Benefícios:

- **Isolamento:** um processo não consegue ler a memória de outro.
- **Flexibilidade:** o processo não precisa de um bloco contínuo de RAM.
- **Mais memória do que existe:** páginas pouco usadas vão para o disco.

> **Cuidado! Cai na entrevista:** se o sistema começa a usar muito swap, ele fica **extremamente** lento (lembra da tabela: disco é mil vezes mais lento que RAM). Em servidores Java, configure a heap (`-Xmx`) para caber folgada na RAM do container.

### 2.5 I/O

**I/O** (entrada e saída) é toda comunicação com o mundo de fora da CPU e da RAM: disco, rede, teclado. É lenta. Enquanto uma thread espera I/O (por exemplo, a resposta do banco de dados), ela fica **bloqueada** e o SO coloca outra para rodar.

A maioria dos backends é **I/O bound**: passam mais tempo esperando banco e outras APIs do que calculando. Isso explica por que o número de threads importa tanto em servidores.

```bash
uname -a          # versão do kernel
nproc             # quantos núcleos
free -h           # memória (olhe a coluna "available")
cat /proc/$$/status | grep -i vm   # memória virtual do seu shell
```

### Atividades de fixação — Tema 2

1. Dê um exemplo do dia a dia de um backend que mostre o SO como **máquina estendida** e outro como **gerente de recursos**.
2. Por que um bug de memória numa thread pode derrubar a aplicação Spring inteira, mas um bug no Chrome não derruba seu VS Code?
3. Rode uma aplicação Java qualquer (pode ser um `Thread.sleep(600000)` no `main`) e use `jcmd <PID> Thread.print`. Quantas threads existem? Anote 3 nomes e chute o que cada uma faz.
4. Explique por que criar uma thread de SO por requisição não escala para 50 mil conexões simultâneas.
5. O que é um page fault? Ele sempre é um erro?
6. Classifique como CPU bound ou I/O bound: (a) API que consulta o banco e devolve JSON; (b) gerar miniaturas de 10 mil imagens; (c) serviço que chama 3 outras APIs e junta as respostas; (d) calcular o hash bcrypt de uma senha.

## Tema 3 — Redes e internet

**Objetivo:** entender como uma requisição sai do navegador e chega no seu servidor Java.

### 3.1 IP e portas

Todo computador numa rede tem um **endereço IP** (ex.: `142.250.79.46`). O IP leva o pacote até a máquina certa. A **porta** leva até o programa certo dentro da máquina: o Spring Boot escuta por padrão na `8080`, HTTPS usa a `443`, o PostgreSQL a `5432`.

> **Analogia:** o IP é o endereço do prédio; a porta é o número do apartamento.

### 3.2 DNS

Ninguém decora IP. O **DNS** traduz nomes (`google.com`) em IPs. É uma "lista telefônica" distribuída, com cache em vários níveis (navegador, SO, provedor).

```bash
nslookup google.com
dig +short github.com
```

### 3.3 TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Conexão | Sim (handshake de 3 vias) | Não |
| Garante entrega e ordem | Sim | Não |
| Velocidade | Mais lento | Mais rápido |
| Usado em | HTTP/1.1, HTTP/2, bancos de dados, e-mail | DNS, jogos, chamadas de vídeo, HTTP/3 (QUIC) |

O **handshake** do TCP: cliente manda `SYN`, servidor responde `SYN-ACK`, cliente responde `ACK`. Só depois os dados começam a ir. Isso custa uma ida e volta (round trip) de rede.

### 3.4 HTTP, HTTPS e TLS

**HTTP** é o protocolo de texto que a web usa: o cliente manda uma requisição (`GET /usuarios/1`) e recebe uma resposta (`200 OK` + corpo). Você vai aprofundar na etapa Backend.

**HTTPS** é HTTP dentro de um túnel criptografado pelo **TLS**. O TLS garante:

- **Confidencialidade:** ninguém no meio do caminho lê os dados.
- **Integridade:** ninguém altera os dados sem ser percebido.
- **Autenticidade:** o certificado prova que você está falando com o site certo.

```bash
curl -v https://example.com 2>&1 | head -40   # veja o handshake TLS e os headers
```

### 3.5 Latência e banda

- **Latência:** quanto tempo um pacote leva para ir e voltar (ms). Depende muito da distância física.
- **Banda:** quanto dado cabe por segundo (Mbps).

Uma API que faz 10 chamadas sequenciais a outro serviço com 50 ms de latência gasta **500 ms** só esperando rede, não importa quão rápido seja o código. Por isso agrupar chamadas e fazer em paralelo importa.

### 3.6 O que acontece quando você digita uma URL

A pergunta clássica. Resposta em passos:

1. O navegador interpreta a URL (`https://loja.com/produtos`).
2. **DNS:** descobre o IP de `loja.com` (cache do navegador, do SO, depois servidor DNS).
3. **TCP:** abre conexão com o IP na porta 443 (handshake).
4. **TLS:** negocia criptografia e valida o certificado.
5. **HTTP:** envia `GET /produtos` com headers (cookies, user-agent).
6. No servidor: load balancer → aplicação (seu Spring Boot) → banco de dados → resposta.
7. O navegador recebe HTML, baixa CSS/JS/imagens (mais requisições) e desenha a página.

> **Cuidado! Cai na entrevista:** não precisa ir até o nível elétrico. Mostre que conhece **DNS, TCP, TLS, HTTP e o caminho no servidor**. Se o entrevistador for de backend, detalhe o passo 6 (load balancer, cache, banco).

### Atividades de fixação — Tema 3

1. Use `dig +short` para descobrir o IP de 3 sites que você usa. Algum retornou mais de um IP? Por que você acha que isso acontece?
2. Rode `curl -v https://github.com` e identifique na saída: o IP conectado, a versão do TLS e o status HTTP.
3. Para um app de chamada de vídeo e para um app de transferência bancária, escolha TCP ou UDP e justifique.
4. Sua API em São Paulo chama um serviço nos EUA (latência de 120 ms ida e volta) 5 vezes por requisição, em sequência. Qual é o tempo mínimo da sua requisição? Proponha 2 formas de melhorar.
5. Explique, em até 10 linhas, o que acontece quando você digita `https://www.itau.com.br` e aperta Enter.

## Projeto da etapa

**Mini servidor HTTP em Java puro.** Sem Spring. Use `java.net.ServerSocket` para:

1. Escutar na porta 8081.
2. Ler a primeira linha da requisição (`GET /ola HTTP/1.1`).
3. Responder `HTTP/1.1 200 OK` com um corpo de texto.
4. Testar com `curl localhost:8081/ola` e com o navegador.
5. Bônus: atender cada conexão numa thread nova e ver no `jcmd` as threads aparecendo.

Você vai entender, na prática, que um "servidor web" é só um programa lendo e escrevendo texto num socket.

## Resumão

- CPU executa, RAM guarda enquanto roda, disco guarda para sempre. Cada nível é muito mais lento que o anterior.
- Java compila para bytecode; a JVM interpreta e o JIT compila os trechos quentes.
- Stack: variáveis locais e chamadas, por thread. Heap: objetos, compartilhado, limpo pelo GC.
- Processo isola memória; threads compartilham. Troca de contexto tem custo.
- Memória virtual dá isolamento e flexibilidade; swap demais deixa tudo lento.
- Uma URL passa por DNS, TCP, TLS e HTTP antes de chegar no seu código.
