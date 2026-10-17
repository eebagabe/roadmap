# Gabarito: Redes de Computadores

Abra só depois de tentar.

## Tema 1

1. Um site brasileiro costuma ficar a 5 a 15 saltos e RTT de poucos a algumas dezenas de milissegundos (muitas vezes servido por uma CDN dentro do próprio provedor). Para a Ásia, 15 a 25 saltos e RTT de 250 a 350 ms. O salto grande de RTT aparece no trecho do **cabo submarino** (propagação: dezenas de milhares de quilômetros). Alguns saltos mostram `* * *`: roteadores que não respondem ICMP, o que não significa perda.
2. Transmissão: 10 MB = 80 Mbit; 80 Mbit / 100 Mbit/s = **0,8 s**. Propagação: **0,05 s**. Total ≈ 0,85 s: domina a **transmissão** (a banda). Com 1 KB: transmissão = 8 kbit / 100 Mbit/s = **0,08 ms**; total ≈ 50,08 ms: domina a **propagação** (a latência). Arquivos pequenos são limitados pela latência; grandes, pela banda.
3. 10 × 10⁹ bit/s × 0,04 s = 4 × 10⁸ bits = **400 Mbit = 50 MB** em trânsito. Para usar o enlace inteiro com um fluxo TCP, a janela precisa ser de ~50 MB (o padrão do TCP sem a opção de escala de janela era 64 KB!).
4. No Wireshark, abra o pacote com o `GET`: o painel mostra, de cima para baixo, *Ethernet II* (MACs de origem e destino), *Internet Protocol Version 4* (IPs, TTL, protocolo = 6, que é TCP), *Transmission Control Protocol* (portas, número de sequência, flags) e *Hypertext Transfer Protocol* (a requisição). É o encapsulamento, literalmente.
5. Porque manter a rede simples e genérica permite que **qualquer** aplicação nova funcione sem mudar os roteadores: basta as pontas concordarem. Exemplos: a web (1991), chamadas de voz e vídeo, BitTorrent, streaming e o próprio QUIC foram criados sem pedir permissão a quem opera a rede. Uma rede "inteligente", otimizada para telefonia, teria dificultado tudo isso.

## Tema 2

1. ```
   $ nc www.example.com 80
   GET / HTTP/1.1
   Host: www.example.com

   ```
   (Uma linha em branco no fim.) O cabeçalho **`Host`** é obrigatório no HTTP/1.1: o mesmo IP pode hospedar muitos sites (hospedagem virtual), e o servidor precisa saber qual você quer. Sem ele, a resposta é **`400 Bad Request`**.
2. A saída mostra quatro blocos: (1) os servidores **raiz** (`a.root-servers.net` a `m.root-servers.net`) indicando os servidores de `.br`; (2) os servidores de **`.br`** (`a.dns.br`...) indicando os de `.com.br`, que também são do Registro.br; (3) estes indicando os servidores **autoritativos** do domínio; (4) o autoritativo respondendo o registro **A**. Cada bloco mostra quem respondeu e em quanto tempo.
3. Consultas DNS são pequenas e independentes: com UDP basta **1 RTT**, sem o *handshake* do TCP e sem guardar estado de conexão no servidor (que atende milhões de clientes). Se a resposta se perder, o cliente simplesmente pergunta de novo. O DNS usa **TCP** quando a resposta não cabe num datagrama UDP (por exemplo, com muitos registros ou assinaturas DNSSEC: a resposta vem marcada como truncada e o cliente repete por TCP), nas **transferências de zona** entre servidores, e no DNS criptografado (DoT e DoH).
4. ```python
   import socket

   def baixa(host, caminho="/"):
       with socket.create_connection((host, 80)) as s:
           s.sendall(f"GET {caminho} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n".encode())
           dados = b""
           while b"\r\n\r\n" not in dados:
               dados += s.recv(4096)
           cabecalho, corpo = dados.split(b"\r\n\r\n", 1)
           linhas = cabecalho.decode("iso-8859-1").split("\r\n")
           campos = {k.lower(): v.strip() for k, v in (l.split(":", 1) for l in linhas[1:])}
           tamanho = int(campos.get("content-length", -1))
           while tamanho < 0 or len(corpo) < tamanho:
               parte = s.recv(4096)
               if not parte:
                   break
               corpo += parte
           return linhas[0], corpo

   print(baixa("example.com")[0])     # HTTP/1.1 200 OK
   ```
   Respostas com `Transfer-Encoding: chunked` (sem `Content-Length`) precisariam de tratamento à parte; o `Connection: close` permite ler até o fim da conexão nesse caso.
5. ```python
   import asyncio
   clientes = set()

   async def atende(reader, writer):
       clientes.add(writer)
       try:
           while linha := await reader.readline():
               for outro in list(clientes):
                   if outro is not writer:
                       outro.write(linha)
                       await outro.drain()
       finally:
           clientes.discard(writer)
           writer.close()

   async def main():
       srv = await asyncio.start_server(atende, "0.0.0.0", 9000)
       async with srv:
           await srv.serve_forever()

   asyncio.run(main())
   ```
   Teste com vários terminais rodando `nc localhost 9000`.
6. No cliente, um laço com 1.000 `sendall(b"0123456789")`. No servidor, conte quantos `recv(65536)` retornam até o fim: em geral **muito menos que 1.000** (dezenas, ou até um só), porque o TCP junta os bytes (algoritmo de Nagle e buffers). Os 10.000 bytes chegam todos e na ordem, mas sem as fronteiras originais.

## Tema 3

1. Os três primeiros pacotes da conexão: `[SYN]` com Seq = 0 (o Wireshark mostra números **relativos**; o real é aleatório), `[SYN, ACK]` com Seq = 0, Ack = 1, e `[ACK]` com Seq = 1, Ack = 1. Logo depois vem o `Client Hello` do TLS, com a lista de cifras e o nome do site (SNI).
2. Pare e espere: 1.500 bytes = 12.000 bits por RTT de 50 ms → **240 kbit/s**, 0,24% do enlace. Para usar os 100 Mbit/s: produto banda × atraso = 100 × 10⁶ × 0,05 = 5 × 10⁶ bits; 5 × 10⁶ / 12.000 ≈ **417 pacotes** em trânsito (cerca de 625 KB de janela).
3. Ao receber um SYN, o servidor reserva estado para a conexão "meio aberta" e responde SYN-ACK. No **SYN flood**, o atacante envia milhões de SYNs (com IPs de origem falsos) e nunca completa o *handshake*: a fila de conexões pendentes enche e clientes legítimos são recusados. Com **SYN cookies**, o servidor **não guarda nada** no SYN: codifica as informações necessárias no próprio número de sequência inicial que envia (um hash criptográfico dos endereços, portas e um segredo). Quando o ACK final chega, o servidor reconstrói o estado a partir do número confirmado.
4. ```python
   import matplotlib.pyplot as plt
   cwnd, limiar, historico = 1, 32, []
   for rtt in range(100):
       historico.append(cwnd)
       if cwnd > 50:                       # perda detectada
           limiar = cwnd // 2
           cwnd = limiar
       elif cwnd < limiar:
           cwnd *= 2                       # partida lenta
       else:
           cwnd += 1                       # aumento aditivo
   plt.plot(historico); plt.xlabel("RTT"); plt.ylabel("cwnd"); plt.show()
   ```
   O gráfico mostra o crescimento exponencial inicial (1, 2, 4, 8, 16, 32), depois a rampa linear até 51 e o corte para 25, repetindo o dente de serra.
5. Simule taxas x e y: enquanto x + y < C, ambas sobem +1 por passo; quando x + y ≥ C (perda), ambas caem pela metade. No gráfico x × y, o **aumento aditivo** move o ponto numa direção paralela à diagonal (a diferença x − y não muda) e a **diminuição multiplicativa** o move em direção à origem, **reduzindo a diferença pela metade**. Repetindo, a diferença tende a zero e o ponto oscila em torno de x = y = C/2: **justiça**. (Com diminuição aditiva, a diferença nunca diminuiria.)
6. Porque um pacote **atrasado** é tão inútil quanto um perdido: na voz, um trecho de áudio de 300 ms atrás não serve mais; no jogo, a posição antiga do adversário já foi substituída. O TCP pararia tudo para retransmitir o pacote perdido e entregar em ordem (bloqueio no início da fila), aumentando a latência justamente quando a rede está ruim. Em cima do UDP, essas aplicações implementam o que precisam: números de sequência, descarte de pacotes velhos, *buffer* de compensação de variação de atraso (*jitter buffer*), correção de erros antecipada (FEC), retransmissão seletiva só do que ainda é útil e o próprio controle de congestionamento (para não sobrecarregar a rede).

## Tema 4

1. /26: máscara **255.255.255.192**; 2⁶ = 64 endereços, **62 utilizáveis** (tira o da rede e o de *broadcast*). Rede 192.168.10.0; primeiro utilizável **192.168.10.1**; último **192.168.10.62**; *broadcast* **192.168.10.63**.
2. **10.1.2.3 → C** (casa com /8, /16 e /24; vence o /24, o mais longo). **10.1.5.5 → B** (/8 e /16). **10.9.9.9 → A** (só /8). **8.8.8.8 → D** (só a rota padrão /0).
3. O IP local é privado (algo como 192.168.0.15/24), o *gateway* é o roteador de casa (192.168.0.1) e o DNS costuma ser o próprio roteador ou o do provedor. O site "qual é o meu IP" mostra o IP **público** do roteador (ou do CGNAT do provedor): os pacotes saem de casa com o endereço traduzido pelo **NAT**. Se o IP público estiver na faixa 100.64.0.0/10, seu provedor usa CGNAT.
4. Tabela do NAT (IP público 200.1.2.3):
   | Interno | Externo (traduzido) | Destino |
   |---|---|---|
   | 192.168.0.10:50000 | 200.1.2.3:**40001** | servidor:443 |
   | 192.168.0.11:50000 | 200.1.2.3:**40002** | servidor:443 |

   Como as duas conexões teriam o mesmo (IP público, porta 50000), o NAT troca também a **porta** de origem. Quando a resposta chega para 200.1.2.3:40002, a tabela diz que ela vai para 192.168.0.11:50000.
5. Filtro `arp`: a consulta é um quadro de *broadcast* (destino ff:ff:ff:ff:ff:ff) perguntando "Who has 192.168.0.1? Tell 192.168.0.15"; a resposta vem direto (*unicast*) com o MAC. O ARP é um protocolo da **camada de enlace** e o *broadcast* fica restrito à rede local: roteadores não repassam *broadcasts* de enlace. Além disso, MACs só têm significado dentro da rede local; para destinos de outras redes, a máquina só precisa do MAC do roteador.
6. O navegador conferiu: (1) a **cadeia de assinaturas**: o certificado do site foi assinado por uma autoridade intermediária, que foi assinada por uma **raiz** presente no repositório confiável do sistema ou do navegador; (2) a **validade** (datas); (3) que o **nome** acessado está entre os nomes cobertos pelo certificado (campo *Subject Alternative Name*); (4) que o certificado não foi revogado e, em geral, que foi registrado em logs públicos de *Certificate Transparency*; e (5) no *handshake*, que o servidor provou ter a **chave privada** correspondente, com uma assinatura. O cadeado não diz que o site é honesto, só que você está falando com o dono daquele nome e que ninguém no caminho lê ou altera o tráfego.

## Projeto da etapa

Pontos de revisão:

- **Servidor HTTP:** leia até encontrar `\r\n\r\n` (fim dos cabeçalhos), mesmo que chegue em vários `recv`; limite o tamanho dos cabeçalhos (por exemplo, 8 KB) para não ser derrubado por um cliente malicioso.
- **Travessia de diretório:** resolva o caminho com `os.path.realpath(os.path.join(raiz, caminho))` e confira que o resultado **começa com** a pasta raiz; decodifique `%2e%2e` antes de conferir.
- **Content-Type:** `mimetypes.guess_type` resolve; sem ele, o navegador pode baixar o HTML em vez de exibir.
- **Keep-alive:** no HTTP/1.1, a conexão continua aberta por padrão; feche após um tempo ocioso ou se o cliente mandar `Connection: close`.
- **Chat:** trate a desconexão (leitura de 0 bytes ou exceção) removendo o cliente das salas e avisando os outros; não deixe um cliente lento travar o envio para todos (com `asyncio`, um `drain` com tempo limite).
- **Perda simulada:** com `tc ... netem loss 10%` no *loopback*, o Wireshark mostra `[TCP Retransmission]` e `[TCP Dup ACK]`; o download continua correto, só mais lento. Remova a regra depois com `tc qdisc del dev lo root`.
