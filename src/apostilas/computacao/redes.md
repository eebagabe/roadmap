# Redes de Computadores: Apostila Prática

Roadmap Ciência da Computação · Semanas 77 a 80

## Comece por aqui

Quando você digita um endereço no navegador, em menos de um segundo seu computador descobre o endereço IP do servidor, abre uma conexão confiável por cima de uma rede que perde e embaralha pacotes, negocia criptografia, pede a página e a recebe atravessando dezenas de roteadores de empresas diferentes. A internet é o maior sistema distribuído já construído, e funciona graças a uma ideia de projeto: **camadas**, cada uma resolvendo um problema e oferecendo um serviço simples para a de cima. Esta etapa segue a abordagem *top-down*: começa pelo que você usa (HTTP, DNS) e desce até os bits no cabo.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSC-35 Redes de Computadores e Internet |
| MIT | 6.1800 Computer Systems Engineering (parte de redes); 6.5820 Computer Networks |
| Harvard | CS 1450 Networking at Scale |
| Stanford | CS 144 Introduction to Computer Networking |

### Como esta apostila funciona

1. Tenha o **Wireshark** instalado e capture o tráfego enquanto faz cada atividade. Ver os pacotes de verdade vale mais que qualquer diagrama.
2. Use as ferramentas de linha de comando: `ping`, `traceroute` (`tracert` no Windows), `dig`, `curl -v`, `ss`, `ip`, `nc` (netcat).
3. Programe com sockets em Python ou C a partir do Tema 2.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** algo na rede não funciona? Desça as camadas em ordem: o nome resolve (`dig`)? O IP responde (`ping`)? A porta está aberta (`nc -zv host porta`)? O protocolo responde (`curl -v`)? Quase sempre o problema está numa camada só.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 77 | Tema 1: Arquitetura da internet |
| 78 | Tema 2: Camada de aplicação e sockets |
| 79 | Tema 3: Camada de transporte |
| 80 | Tema 4: Rede e enlace + projeto |

## Tema 1: Arquitetura da internet

**Objetivo:** entender a organização em camadas, como a internet é montada e como medir o desempenho de uma rede.

### 1.1 Arquitetura em camadas

Cada camada usa o serviço da camada de baixo e oferece um serviço para a de cima, sem precisar saber como as outras funcionam por dentro.

| Camada | Função | Unidade | Exemplos |
|---|---|---|---|
| Aplicação | O que o usuário quer fazer | Mensagem | HTTP, DNS, SMTP, SSH |
| Transporte | Comunicação entre **processos** | Segmento | TCP, UDP, QUIC |
| Rede | Levar pacotes entre **máquinas**, atravessando redes | Datagrama | IP, ICMP |
| Enlace | Levar quadros entre máquinas **vizinhas** | Quadro | Ethernet, Wi-Fi |
| Física | Bits como sinais | Bit | Cobre, fibra, rádio |

(O modelo OSI tem 7 camadas, com sessão e apresentação; na prática da internet, as 5 acima bastam.)

**Encapsulamento:** ao enviar, cada camada acrescenta um **cabeçalho** com as informações dela ao que recebeu de cima. Ao receber, cada camada retira o seu cabeçalho e entrega o resto para cima.

```
[ Ethernet | IP | TCP | HTTP: GET /index.html ... ]
```

**Princípio fim a fim:** a rede no meio é simples (só encaminha pacotes, "melhor esforço"); a inteligência (confiabilidade, criptografia, controle) fica nas pontas. Isso permitiu à internet crescer e receber aplicações que ninguém imaginou quando ela foi criada.

### 1.2 Como a internet funciona

A internet é uma **rede de redes**: dezenas de milhares de redes independentes (os **sistemas autônomos**, AS: provedores, universidades, grandes empresas) que concordam em trocar tráfego. Provedores de acesso conectam casas e empresas; provedores de trânsito e cabos submarinos ligam continentes; **pontos de troca de tráfego** (IXPs; o IX.br em São Paulo é um dos maiores do mundo) permitem que redes troquem tráfego diretamente. **CDNs** (Cloudflare, Akamai) colocam cópias do conteúdo perto dos usuários.

Comutação de pacotes contra comutação de circuitos:

- **Circuitos** (telefonia antiga): reserva um caminho com capacidade fixa durante toda a ligação. Garantido, mas desperdiça quando ninguém fala.
- **Pacotes** (internet): divide os dados em pacotes que compartilham os enlaces. Eficiente para tráfego em rajadas, mas sem garantias: pacotes podem atrasar, se perder ou chegar fora de ordem.

### 1.3 Latência e banda

Duas medidas diferentes:

- **Banda** (*throughput*, vazão): quantos bits por segundo passam. "Largura do cano".
- **Latência**: quanto tempo um bit leva para chegar. "Comprimento do cano".

A latência de um pacote em cada salto é a soma de:

| Componente | O que é | Depende de |
|---|---|---|
| Processamento | O roteador examinar o cabeçalho | Microssegundos |
| Fila | Esperar outros pacotes saírem | Congestionamento (varia muito) |
| Transmissão | Colocar todos os bits no fio: L/R | Tamanho do pacote L e taxa R |
| Propagação | O sinal percorrer a distância: d/v | Distância (luz na fibra ≈ 200.000 km/s) |

São Paulo a Nova York (~7.700 km) tem pelo menos ~38 ms de propagação só de ida: nenhuma melhoria de banda reduz isso. O **RTT** (*round-trip time*, ida e volta) é o que o `ping` mede.

**Produto banda × atraso:** quantos bits "cabem" no cano. Um enlace de 1 Gbit/s com RTT de 100 ms tem 100 Mbit (12,5 MB) em trânsito. O TCP precisa de janelas desse tamanho para usar o enlace inteiro (Tema 3).

> **Cuidado! Cai na entrevista:** para páginas web com muitos recursos pequenos, a **latência** importa mais que a banda: cada ida e volta custa um RTT. Por isso se usam CDNs (diminuem d), conexões reaproveitadas, HTTP/2 e HTTP/3.

### 1.4 Comutação de pacotes

Um **roteador** recebe pacotes por uma interface, consulta a **tabela de encaminhamento** e os manda por outra. Se chegam mais pacotes do que a saída consegue enviar, eles esperam numa **fila**; se a fila enche, pacotes são **descartados**. Perda de pacotes na internet é quase sempre **congestionamento**, não erro no fio.

Filas grandes demais também são ruins: o *bufferbloat* (roteadores domésticos com buffers enormes) faz a latência explodir quando alguém faz um upload grande.

```bash
ping -c 5 google.com          # RTT e perda
traceroute google.com         # os saltos até o destino e o RTT de cada um
```

O `traceroute` envia pacotes com **TTL** (tempo de vida) 1, 2, 3...: cada roteador decrementa o TTL e, quando chega a zero, descarta e devolve uma mensagem ICMP de erro, revelando quem é.

### Atividades de fixação do Tema 1

1. Rode `traceroute` para um site brasileiro e um da Ásia. Quantos saltos? Onde o RTT dá saltos grandes, e por quê?
2. Calcule o tempo para enviar um arquivo de 10 MB por um enlace de 100 Mbit/s com 50 ms de propagação. Qual parcela domina? E se o arquivo tivesse 1 KB?
3. Calcule o produto banda × atraso de um enlace de 10 Gbit/s entre São Paulo e Fortaleza (RTT 40 ms).
4. Abra o Wireshark, acesse uma página HTTP simples e identifique os cabeçalhos Ethernet, IP, TCP e HTTP de um pacote.
5. Por que a internet adotou o princípio fim a fim? Dê um exemplo de aplicação que se beneficiou disso.

## Tema 2: Camada de aplicação e sockets

**Objetivo:** entender os protocolos de aplicação mais usados e programar comunicação em rede.

### 2.1 HTTP

O **HTTP** é um protocolo de **requisição e resposta**, em texto (até a versão 1.1), sobre TCP.

```
GET /index.html HTTP/1.1
Host: www.exemplo.com
User-Agent: curl/8.5
Accept: */*

```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1256
Cache-Control: max-age=3600

<!doctype html>...
```

- **Métodos:** GET (ler), POST (criar/enviar), PUT (substituir), PATCH (alterar parte), DELETE. GET, PUT e DELETE são **idempotentes** (repetir dá o mesmo efeito); POST não.
- **Códigos:** 2xx sucesso (200, 201, 204), 3xx redirecionamento (301, 304), 4xx erro do cliente (400, 401, 403, 404, 429), 5xx erro do servidor (500, 502, 503).
- **Sem estado:** cada requisição é independente; o estado de sessão vem em **cookies** ou *tokens*.
- **Cache:** cabeçalhos como `Cache-Control` e `ETag` permitem reaproveitar respostas (o `304 Not Modified` responde "use a sua cópia").

Evolução: **HTTP/1.1** reaproveita conexões (*keep-alive*), mas uma resposta lenta bloqueia as seguintes na mesma conexão. **HTTP/2** é binário e **multiplexa** várias requisições numa conexão. **HTTP/3** roda sobre **QUIC** (sobre UDP), evitando que a perda de um pacote atrase todas as requisições, e combina o estabelecimento de conexão com a negociação de criptografia.

```bash
curl -v https://example.com     # mostra a requisição, a resposta e a negociação TLS
```

### 2.2 DNS

O **DNS** traduz nomes (`www.ita.br`) em endereços IP. É um **banco de dados distribuído e hierárquico**:

1. Seu computador pergunta ao **resolvedor** (do provedor, ou públicos como 1.1.1.1 e 8.8.8.8).
2. Se não está no cache, o resolvedor pergunta a um **servidor raiz**: "quem cuida de `.br`?".
3. Pergunta ao servidor de `.br` (o Registro.br): "quem cuida de `ita.br`?".
4. Pergunta ao servidor **autoritativo** de `ita.br`, que responde o IP.
5. Tudo fica em cache pelo tempo indicado (**TTL** do registro).

Tipos de registro: **A** (IPv4), **AAAA** (IPv6), **CNAME** (apelido para outro nome), **MX** (servidor de e-mail), **NS** (servidores autoritativos), **TXT** (texto livre, usado em verificações e políticas de e-mail).

```bash
dig www.ita.br
dig +trace www.ita.br      # mostra a cadeia raiz → .br → ita.br
dig MX gmail.com
```

O DNS usa principalmente **UDP** na porta 53 (consultas pequenas, uma ida e volta). Como é tão central, ataques e falhas de DNS derrubam grandes partes da internet, e o DNS sem criptografia expõe quais sites você visita (daí o DNS sobre HTTPS e o DNSSEC, que assina as respostas).

### 2.3 E-mail

O e-mail é **assíncrono** e usa vários protocolos:

- **SMTP** (porta 25 entre servidores; 587 para o cliente enviar): **empurra** mensagens do remetente até o servidor do destinatário, que é descoberto pelo registro **MX**.
- **IMAP** (ou o antigo POP3): o cliente **busca** e sincroniza as mensagens da caixa postal.

O SMTP original não autentica o remetente: qualquer um pode escrever "De: banco@...". Por isso surgiram **SPF** (quais servidores podem enviar por um domínio), **DKIM** (assinatura criptográfica da mensagem) e **DMARC** (política do que fazer quando falham), todos publicados em registros TXT no DNS.

### 2.4 Programação com sockets

Um **socket** é o ponto de comunicação que o sistema operacional oferece para a rede (é um descritor de arquivo, como você viu em Sistemas Operacionais). Uma conexão TCP é identificada por (IP de origem, porta de origem, IP de destino, porta de destino). **Portas** identificam processos: 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS).

Servidor TCP de eco em Python:

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", 9000))
    srv.listen()
    while True:
        conn, endereco = srv.accept()          # bloqueia até um cliente conectar
        with conn:
            while dados := conn.recv(4096):
                conn.sendall(dados)
```

Cliente:

```python
with socket.create_connection(("localhost", 9000)) as s:
    s.sendall(b"ola\n")
    print(s.recv(4096))
```

Pontos que todo mundo erra:

- **TCP é um fluxo de bytes, não de mensagens.** Um `send` de 100 bytes pode chegar em dois `recv` de 60 e 40, ou dois `send` podem chegar num único `recv`. O protocolo de aplicação precisa **delimitar** mensagens (um separador como `\n`, ou um prefixo com o tamanho).
- `send` pode enviar só parte dos dados: use `sendall`.
- Um servidor como o acima atende **um cliente por vez**. Para vários: threads, processos ou E/S assíncrona (`selectors`, `asyncio`), como discutido em Sistemas Operacionais.

```python
import asyncio

async def atende(reader, writer):
    while linha := await reader.readline():
        writer.write(linha)
        await writer.drain()
    writer.close()

async def main():
    srv = await asyncio.start_server(atende, "0.0.0.0", 9000)
    async with srv:
        await srv.serve_forever()

asyncio.run(main())
```

**UDP** (`SOCK_DGRAM`) envia **datagramas** independentes: sem conexão, sem garantia de entrega nem de ordem, mas cada `recvfrom` devolve exatamente um datagrama inteiro.

### Atividades de fixação do Tema 2

1. Use `nc www.example.com 80` (ou `telnet`) e digite uma requisição HTTP/1.1 à mão. Que cabeçalho é obrigatório? O que acontece sem ele?
2. Rode `dig +trace` para um domínio `.com.br` e explique cada etapa da resposta.
3. Por que o DNS usa UDP e não TCP na maior parte das consultas? Quando ele usa TCP?
4. Escreva um cliente HTTP mínimo com sockets que baixa uma página (sem bibliotecas HTTP), tratando o `Content-Length`.
5. Faça um servidor de chat em que cada linha enviada por um cliente é repassada a todos os outros, usando `asyncio`.
6. Mostre experimentalmente que TCP não preserva limites de mensagens: envie 1.000 `send` de 10 bytes seguidos e conte quantos `recv` o servidor faz.

## Tema 3: Camada de transporte

**Objetivo:** entender como o TCP oferece um canal confiável sobre uma rede não confiável e como evita congestionar a internet.

### 3.1 UDP

O **UDP** é quase só o IP com **portas** e uma **soma de verificação** (*checksum*): cabeçalho de 8 bytes, sem conexão, sem retransmissão, sem ordem, sem controle de congestionamento.

Por que usar? Quando **latência** importa mais que confiabilidade, ou quando a aplicação quer controlar tudo:

- DNS (uma pergunta, uma resposta; se perder, pergunta de novo).
- Voz e vídeo em tempo real, jogos (um pacote atrasado é inútil: melhor o próximo).
- QUIC e HTTP/3 (reimplementam a confiabilidade em cima do UDP, no espaço do usuário).
- Transmissão para vários destinos (*multicast*).

### 3.2 TCP

O **TCP** oferece um **fluxo de bytes confiável, ordenado e bidirecional** entre dois processos.

**Estabelecimento (*three-way handshake*):**

```
cliente → SYN (seq = x)
servidor → SYN-ACK (seq = y, ack = x + 1)
cliente → ACK (ack = y + 1)
```

Custa **1 RTT** antes de enviar dados (com TLS, mais 1 RTT no TLS 1.3). Por isso reaproveitar conexões importa tanto.

**Encerramento:** cada lado envia **FIN** e recebe ACK (quatro mensagens). O lado que fecha primeiro fica um tempo no estado `TIME_WAIT` (para absorver pacotes atrasados), o que pode esgotar portas em clientes que abrem e fecham conexões demais.

Cada byte tem um **número de sequência**; o receptor confirma com **ACKs cumulativos** ("recebi tudo até o byte N"). O **controle de fluxo** usa a **janela de recepção**: o receptor anuncia quanto espaço livre tem, e o emissor não manda mais que isso.

```bash
ss -tan                 # conexões TCP e seus estados (ESTAB, LISTEN, TIME-WAIT...)
```

### 3.3 Transmissão confiável

Como transmitir sem erros sobre um canal que perde pacotes? A evolução clássica:

1. **Pare e espere** (*stop-and-wait*): envia um pacote, espera o ACK; se o ACK não chegar dentro de um **tempo limite**, retransmite. Números de sequência distinguem pacotes repetidos. Correto, mas lento: um pacote por RTT. Com RTT de 100 ms e pacotes de 1.500 bytes, só 120 kbit/s, mesmo num enlace de 1 Gbit/s.
2. **Janelas deslizantes** (*pipelining*): permite até W pacotes enviados e não confirmados. A vazão vira ~W/RTT. Para encher o enlace, W precisa ser pelo menos o produto banda × atraso.
3. Em caso de perda: **Go-Back-N** (retransmite a partir do perdido) ou **repetição seletiva** (só o perdido). O TCP usa ACKs cumulativos com **SACK** (confirmações seletivas) e **retransmissão rápida**: três ACKs duplicados indicam que um segmento se perdeu, e ele é reenviado antes do tempo limite.

O **tempo limite** (RTO) é estimado a partir do RTT medido e da sua variação (média móvel exponencial): curto demais gera retransmissões inúteis; longo demais demora a recuperar perdas.

### 3.4 Controle de congestionamento

O controle de **fluxo** protege o **receptor**; o controle de **congestionamento** protege a **rede**. Sem ele, todos enviam no máximo, as filas dos roteadores enchem, pacotes se perdem, todos retransmitem, e a rede entra em **colapso por congestionamento** (aconteceu de verdade em 1986, quando a vazão entre Berkeley e o LBL caiu mil vezes, e motivou o algoritmo de Van Jacobson).

O TCP mantém uma **janela de congestionamento** (cwnd) e envia no máximo min(cwnd, janela do receptor). Algoritmo clássico (Reno), **AIMD** (aumento aditivo, diminuição multiplicativa):

- **Partida lenta** (*slow start*): começa pequeno e **dobra** a cwnd a cada RTT (crescimento exponencial) até um limiar.
- **Prevenção de congestionamento:** depois, aumenta **1 segmento por RTT** (aditivo), sondando com cuidado.
- **Perda detectada por 3 ACKs duplicados:** corta a cwnd **pela metade** (multiplicativo).
- **Tempo limite estourado:** volta para cwnd = 1 e partida lenta.

O gráfico da cwnd vira o famoso **"dente de serra"**. AIMD tem uma propriedade bonita: vários fluxos competindo convergem para uma divisão **justa** da banda.

Algoritmos modernos: **CUBIC** (padrão no Linux, cresce com uma função cúbica, melhor em redes rápidas e longas) e **BBR** (do Google: em vez de esperar perdas, estima a banda e o RTT mínimo e envia na taxa certa, evitando encher filas).

### Atividades de fixação do Tema 3

1. Capture no Wireshark o *handshake* de uma conexão HTTPS: identifique SYN, SYN-ACK, ACK, os números de sequência e o início do TLS.
2. Com RTT de 50 ms, pacotes de 1.500 bytes e enlace de 100 Mbit/s: qual a vazão do pare e espere? Que tamanho de janela (em pacotes) é necessário para usar o enlace todo?
3. Por que o TCP exige que o servidor guarde estado já no SYN, e como isso é explorado no ataque **SYN flood**? O que são *SYN cookies*?
4. Simule em Python o AIMD: cwnd começa em 1, partida lenta até o limiar 32, depois +1 por RTT, e uma perda (corte pela metade) sempre que cwnd passar de 50. Faça o gráfico de 100 RTTs.
5. Dois fluxos AIMD compartilham um enlace de capacidade C, começando com taxas muito diferentes. Mostre (simulando ou com um gráfico x × y) que eles convergem para C/2 cada.
6. Por que jogos online e chamadas de vídeo preferem UDP? O que eles precisam implementar por conta própria?

## Tema 4: Rede e enlace

**Objetivo:** entender o endereçamento IP, como os pacotes encontram o caminho e como as redes locais funcionam.

### 4.1 IP e endereçamento

O **IP** entrega datagramas entre máquinas, no modelo de **melhor esforço**: sem garantias de entrega, ordem ou prazo.

**IPv4:** endereços de 32 bits, escritos como 4 números de 0 a 255 (192.168.0.10). Os endereços são organizados em **prefixos** (notação **CIDR**): 200.17.0.0/16 significa "os primeiros 16 bits identificam a rede; o resto, as máquinas dentro dela" (65.536 endereços). A **máscara** /24 = 255.255.255.0.

Endereços especiais: **privados** (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, usados dentro de casas e empresas, não roteados na internet), **loopback** (127.0.0.1, a própria máquina) e o endereço de *broadcast* da sub-rede.

**IPv6:** endereços de **128 bits** (2001:db8::1), criados porque os ~4,3 bilhões de endereços IPv4 acabaram (os registros regionais esgotaram entre 2011 e 2019). A adoção cresce devagar; o Brasil tem uma das maiores taxas de uso de IPv6 do mundo.

**DHCP** dá a cada máquina que entra na rede um IP, a máscara, o roteador padrão (*gateway*) e o servidor DNS. **ICMP** transporta mensagens de controle e erro (o `ping` e o `traceroute` usam ICMP).

### 4.2 Roteamento

O **encaminhamento** é a ação local do roteador: olhar o destino de cada pacote e escolher a interface de saída pela regra do **prefixo mais longo** (*longest prefix match*): entre as entradas da tabela que contêm o destino, vence a mais específica. Roteadores de núcleo fazem isso centenas de milhões de vezes por segundo, com hardware especializado.

O **roteamento** é o processo global de **construir** as tabelas:

- **Dentro de um sistema autônomo:** algoritmos de caminho mínimo da etapa de Algoritmos. **Estado de enlace** (OSPF): cada roteador conhece o mapa inteiro e roda **Dijkstra**. **Vetor de distâncias** (RIP): cada roteador conhece só os vizinhos e troca estimativas, que é o **Bellman-Ford distribuído** (e sofre o problema da "contagem até o infinito" quando um enlace cai).
- **Entre sistemas autônomos:** **BGP**, um protocolo de **vetor de caminhos** baseado em **políticas** (acordos comerciais), não em distância. Cada AS anuncia os prefixos que alcança e o caminho de ASes até eles. Erros e ataques de BGP (anúncios falsos de prefixos alheios) já tiraram do ar grandes serviços, como na queda do Facebook em 2021.

### 4.3 NAT

Em casa, todos os seus dispositivos têm IPs privados (192.168.x.x), e o roteador tem **um** IP público. O **NAT** (*network address translation*) reescreve os pacotes que saem, trocando (IP privado, porta) por (IP público, porta nova), e guarda o mapeamento numa tabela para traduzir as respostas de volta.

O NAT prolongou a vida do IPv4 por décadas, mas quebra o princípio fim a fim: de fora, não dá para iniciar uma conexão para dentro sem configuração (*port forwarding*). Aplicações par a par (chamadas de vídeo, jogos) precisam de técnicas como **STUN**, **TURN** e *hole punching* para atravessá-lo. Provedores também usam **CGNAT** (um NAT para muitos clientes), o que torna tudo isso mais difícil.

### 4.4 Ethernet e Wi-Fi

Na camada de **enlace**, máquinas na **mesma rede local** se identificam por **endereços MAC** (48 bits, gravados na placa de rede, como 3c:22:fb:12:34:56).

- **ARP:** "quem tem o IP 192.168.0.1? Responda com o seu MAC". A máquina descobre o MAC do roteador (ou do vizinho) para montar o quadro Ethernet. Para destinos fora da rede local, o quadro vai para o MAC do **roteador**, enquanto o pacote IP dentro dele continua endereçado ao destino final.
- **Switch:** aprende em que porta está cada MAC (olhando a origem dos quadros) e encaminha cada quadro só para a porta certa. Quadros para MACs desconhecidos ou de *broadcast* vão para todas as portas.
- **Detecção de erros:** cada quadro tem um **CRC**; quadros corrompidos são descartados (a retransmissão, se houver, fica com o TCP).

**Wi-Fi** (802.11): o meio é compartilhado e sujeito a interferência e colisões; usa **CSMA/CA** (escuta o canal antes de transmitir e espera um tempo aleatório) e confirmações a cada quadro. Por isso Wi-Fi tem latência mais variável e perda maior que cabo.

### 4.5 TLS

O **TLS** fica entre o TCP e a aplicação (o "S" de HTTPS) e garante:

- **Confidencialidade:** ninguém no caminho lê os dados (criptografia simétrica, como AES ou ChaCha20).
- **Integridade:** ninguém altera os dados sem ser percebido.
- **Autenticação do servidor:** você está falando com o `banco.com.br` de verdade, comprovado por um **certificado** assinado por uma **autoridade certificadora** em que o seu sistema confia.

O *handshake* do TLS 1.3, resumido: o cliente manda as opções suportadas e uma chave pública efêmera (Diffie-Hellman); o servidor responde com a sua parte, o certificado e uma assinatura; ambos derivam a mesma chave simétrica de sessão. Tudo em **1 RTT**. A criptografia por trás (Diffie-Hellman, assinaturas, certificados) é o assunto da etapa de Segurança.

> **Cuidado! Cai na entrevista:** HTTPS protege o **conteúdo**, mas não esconde **com quem** você fala: o IP de destino aparece, e o nome do site costuma aparecer no SNI do *handshake* (a menos que se use o ECH, *Encrypted Client Hello*).

### Atividades de fixação do Tema 4

1. Para a rede 192.168.10.0/26: qual a máscara, quantos endereços utilizáveis, qual o primeiro, o último e o de *broadcast*?
2. Uma tabela de encaminhamento tem: 10.0.0.0/8 → interface A; 10.1.0.0/16 → B; 10.1.2.0/24 → C; 0.0.0.0/0 → D. Para onde vão 10.1.2.3, 10.1.5.5, 10.9.9.9 e 8.8.8.8?
3. Rode `ip addr` e `ip route` (ou `ipconfig` e `route print`). Identifique seu IP, a máscara, o *gateway* e o servidor DNS. Compare o seu IP com o que aparece em "qual é o meu IP" num site. Explique a diferença.
4. Simule a tabela do NAT para dois computadores da casa acessando o mesmo servidor web na porta 443, ambos usando a porta de origem 50000.
5. Capture no Wireshark uma consulta ARP e a resposta. Por que o ARP não atravessa roteadores?
6. Abra um site com HTTPS, examine o certificado no navegador (emissor, validade, nomes cobertos, cadeia até a raiz). O que o navegador conferiu para mostrar o cadeado?

## Projeto da etapa

**Servidor HTTP próprio, chat e análise de tráfego:**

1. **Servidor HTTP/1.1** com sockets (Python ou C), sem bibliotecas HTTP: interpreta a linha de requisição e os cabeçalhos, serve arquivos estáticos de uma pasta com o `Content-Type` correto, responde 404 e 400, suporta *keep-alive* e impede o acesso a arquivos fora da pasta (`../../etc/passwd`). Atenda vários clientes ao mesmo tempo (threads ou `asyncio`) e meça com `wrk` ou `ab` quantas requisições por segundo ele aguenta.
2. **Chat cliente-servidor** com um protocolo próprio documentado: mensagens delimitadas, comandos (`/nick`, `/entrar sala`, `/sair`), e tratamento de clientes que caem no meio.
3. **Análise com Wireshark:** capture uma sessão do seu servidor e do chat e mostre, num relatório, o *handshake* TCP, a delimitação de mensagens, uma retransmissão (provoque perda com `tc qdisc add dev lo root netem loss 10%` no Linux) e o encerramento da conexão.

## Para ir além

- *Computer Networking: A Top-Down Approach* (Kurose e Ross), com os laboratórios de Wireshark gratuitos no site dos autores.
- **Stanford CS 144:** os laboratórios públicos constroem um TCP inteiro, peça por peça.
- *Computer Networks: A Systems Approach* (Peterson e Davie, gratuito online).
- *High Performance Browser Networking* (Ilya Grigorik, gratuito online): TCP, TLS, HTTP/2 e HTTP/3 do ponto de vista de desempenho web.
- *Beej's Guide to Network Programming* (gratuito): sockets em C.

## Resumão

- Camadas: aplicação, transporte, rede, enlace, física. Encapsulamento: cada uma põe o seu cabeçalho.
- Princípio fim a fim: rede simples de melhor esforço, inteligência nas pontas.
- Latência = processamento + fila + transmissão (L/R) + propagação (d/v). Banda × atraso = bits em trânsito.
- Perda de pacotes na internet é quase sempre congestionamento (filas cheias).
- HTTP: requisição/resposta sem estado; métodos, códigos, cache. HTTP/2 multiplexa; HTTP/3 usa QUIC sobre UDP.
- DNS: hierarquia raiz → TLD → autoritativo, com cache por TTL. Registros A, AAAA, CNAME, MX.
- Sockets: TCP é fluxo de bytes (delimite mensagens); UDP é datagrama sem garantias.
- TCP: handshake de 3 vias, números de sequência, ACKs, janelas deslizantes, retransmissão.
- Controle de fluxo protege o receptor; de congestionamento, a rede. AIMD: dente de serra e justiça. CUBIC e BBR.
- IPv4 de 32 bits com CIDR; IPv6 de 128. Encaminhamento por prefixo mais longo.
- Roteamento: OSPF (Dijkstra), RIP (Bellman-Ford), BGP (políticas entre ASes).
- NAT traduz privado ↔ público e quebra o fim a fim. ARP: IP → MAC na rede local. Switch aprende MACs.
- TLS: confidencialidade, integridade e autenticação do servidor por certificados; 1 RTT no TLS 1.3.
