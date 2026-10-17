# Gabarito: Fundamentos

Abra só depois de tentar. Questões "pessoais" não têm resposta única: o que importa é o raciocínio.

## Tema 1

1. Resposta pessoal. Exemplo: numa biblioteca, a CPU é o leitor, a RAM é a mesa onde estão os livros abertos agora, e o disco são as estantes. O que está na mesa se lê na hora; buscar na estante demora; e quando a biblioteca fecha a mesa é limpa (RAM é volátil), mas as estantes continuam lá.
2. Resposta pessoal. Costumam aparecer `push`, `mov`, `call` (chama `puts` ou `printf`), `ret`. `mov` copia valores, `call` chama função, `ret` retorna.
3. A instrução é `iadd` (soma dois inteiros do topo da pilha de operandos). Antes dela aparecem `iload_1` e `iload_2`, que empilham `a` e `b`.
4. O Java não é só interpretado. A JVM usa o compilador JIT, que transforma os trechos mais executados em código de máquina otimizado durante a execução. Depois do aquecimento ("warm-up"), o desempenho fica próximo de linguagens compiladas.
5. `total` (int) fica na stack. `nomes` (a referência) fica na stack; o objeto `ArrayList` fica no heap. A `String "Ana"` também fica no heap (no String Pool, que faz parte do heap desde o Java 7).
6. Exemplo:
   ```java
   static int profundidade = 0;
   static void desce() { profundidade++; desce(); }
   public static void main(String[] a) {
       try { desce(); } catch (StackOverflowError e) { System.out.println(profundidade); }
   }
   ```
   Com `-Xss4m` a profundidade é bem maior que com `-Xss256k`, porque `-Xss` define o tamanho da stack de cada thread: mais espaço, mais frames cabem antes de estourar.

## Tema 2

1. Exemplos: máquina estendida, a aplicação grava um log com `Files.writeString` sem saber nada do sistema de arquivos ou do disco; gerente de recursos, o SO divide os núcleos da CPU entre a JVM, o PostgreSQL e o Docker rodando na mesma máquina.
2. As threads da aplicação Spring vivem no **mesmo processo** e compartilham a memória, então um erro grave (memória corrompida, `OutOfMemoryError` que derruba a JVM) afeta todas. Chrome e VS Code são **processos diferentes**, com memória isolada pelo SO.
3. Resposta pessoal. É comum ver mais de 10 threads mesmo num programa vazio: `main`, `Reference Handler` (cuida de referências para o GC), `Finalizer`, `Signal Dispatcher` (recebe sinais do SO, como Ctrl+C), threads do compilador JIT (`C1/C2 CompilerThread`) e do GC.
4. Cada thread de SO reserva memória para a stack (por padrão perto de 1 MB de espaço reservado) e o SO precisa escalonar todas. Com 50 mil threads: dezenas de GB reservados e muito tempo gasto em troca de contexto. Soluções: pools de threads, I/O não bloqueante ou Virtual Threads.
5. Page fault é quando o processo acessa uma página que não está na RAM naquele momento. Não é necessariamente erro: é normal (por exemplo, na primeira vez que a página é usada, ou se ela foi para o swap). Só vira erro (`segmentation fault`) se o endereço for inválido para aquele processo.
6. (a) I/O bound; (b) CPU bound; (c) I/O bound; (d) CPU bound (bcrypt é lento de propósito).

## Tema 3

1. Resposta pessoal. Sites grandes retornam vários IPs para distribuir carga e ter redundância; também podem responder IPs diferentes conforme sua região (CDN).
2. Resposta pessoal. Procure linhas como `Connected to github.com (20.201.28.151) port 443`, `SSL connection using TLSv1.3` e `< HTTP/2 200`.
3. Chamada de vídeo: **UDP**, porque um pacote atrasado é inútil e é melhor perder um quadro do que travar esperando retransmissão. Transferência bancária: **TCP**, porque não pode perder nem embaralhar dados.
4. Mínimo de 5 × 120 = **600 ms** só de rede. Melhorias: fazer as chamadas **em paralelo** (cai para ~120 ms se forem independentes); usar uma **API em lote** (uma chamada só); colocar **cache** para dados que mudam pouco; mover o serviço para mais perto (mesma região).
5. O navegador resolve `www.itau.com.br` no DNS e obtém um IP (provavelmente de uma CDN). Abre conexão TCP na porta 443 e faz o handshake TLS, validando o certificado do Itaú. Envia `GET /` com headers e cookies. A requisição passa por CDN/WAF e load balancer até os servidores de aplicação, que podem consultar caches e bancos. A resposta HTML volta, o navegador baixa CSS, JS e imagens (outras requisições, muitas vindas de cache) e renderiza a página.

## Projeto da etapa

Uma solução de referência:

```java
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class MiniServidor {
    public static void main(String[] args) throws IOException {
        try (ServerSocket server = new ServerSocket(8081)) {
            System.out.println("Escutando em http://localhost:8081");
            while (true) {
                Socket cliente = server.accept();
                new Thread(() -> atender(cliente)).start();
            }
        }
    }

    static void atender(Socket cliente) {
        try (cliente;
             var in = new BufferedReader(new InputStreamReader(cliente.getInputStream()));
             var out = cliente.getOutputStream()) {
            String linha = in.readLine();               // ex.: GET /ola HTTP/1.1
            String caminho = linha == null ? "/" : linha.split(" ")[1];
            byte[] corpo = ("Voce pediu " + caminho + " na thread "
                    + Thread.currentThread().getName() + "\n").getBytes(StandardCharsets.UTF_8);
            out.write(("HTTP/1.1 200 OK\r\nContent-Type: text/plain; charset=utf-8\r\n"
                    + "Content-Length: " + corpo.length + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
            out.write(corpo);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

Repare: o protocolo HTTP é só texto com `\r\n` no fim de cada linha e uma linha em branco separando headers do corpo.
