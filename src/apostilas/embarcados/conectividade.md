# Conectividade e IoT: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 21 a 23

## Comece por aqui

Um dispositivo conectado (IoT) mede algo no mundo físico e manda para algum lugar: um celular, um servidor, outro dispositivo. Parece simples, mas envolve escolher a tecnologia sem fio certa, um protocolo que funcione em redes ruins, gastar pouca bateria, atualizar o firmware à distância e, principalmente, **não virar uma porta de entrada para invasores**. Esta etapa vale para casa inteligente, agricultura, indústria, saúde, cidades e veículos.

### Por que isso vale ouro no mercado

- IoT está em todos os setores, do medidor de energia ao rastreador de carga.
- MQTT, BLE e atualização OTA aparecem em grande parte das vagas de firmware que envolvem ESP32 ou nRF.
- Segurança de dispositivos virou exigência legal em vários mercados; quem domina o tema se destaca.

### Como esta apostila funciona

1. Use o **ESP32** com ESP-IDF (ou Arduino, para começar) e um broker MQTT (Mosquitto na sua máquina, em Docker).
2. Um celular com o app **nRF Connect** (gratuito) ajuda a explorar dispositivos Bluetooth.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** comunicação falhando? Separe as camadas: o dispositivo está conectado à rede (IP, sinal)? Chega ao servidor (DNS, porta, firewall)? O TLS fechou (certificado, data e hora do dispositivo)? O protocolo está certo (tópico, credenciais)? Logs de cada etapa no dispositivo economizam horas.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 21 | Tema 1: Comunicação sem fio |
| 22 | Tema 2: Protocolos de IoT |
| 23 | Tema 3: Segurança de dispositivos + projeto |

## Tema 1: Comunicação sem fio

**Objetivo:** conhecer as principais tecnologias e saber escolher.

### 1.1 Wi-Fi

- **Prós:** alta velocidade, infraestrutura já existe nas casas e empresas, acesso direto à internet (IP).
- **Contras:** consumo alto (centenas de mA transmitindo), alcance de dezenas de metros, depende de configurar a rede (o usuário precisa informar senha: *provisioning* por app, BLE ou ponto de acesso temporário).
- Bom para: dispositivos ligados na tomada, câmeras, eletrodomésticos.

### 1.2 Bluetooth Low Energy (BLE)

Feito para consumo baixíssimo e conexão com **celulares**.

- **Advertising:** o dispositivo anuncia sua presença em pacotes pequenos (até 31 bytes no modo clássico de anúncio), sem precisar de conexão. Beacons e sensores simples usam só isso.
- **Conexão e GATT:** os dados ficam organizados em **serviços** e **características** (cada uma com um UUID). O celular (central) lê, escreve ou se inscreve para receber notificações do dispositivo (periférico).
- Alcance típico de dezenas de metros; dá para durar anos numa bateria de moeda.

```
Serviço: Ambiente (UUID 181A, padronizado)
  └─ Característica: Temperatura (UUID 2A6E) → leitura e notificação
  └─ Característica: Umidade (UUID 2A6F)
```

### 1.3 LoRa e LoRaWAN

- **LoRa:** modulação de rádio de **longo alcance** (quilômetros) e baixíssimo consumo, mas com taxa muito baixa (dezenas a poucos milhares de bits por segundo; mensagens de poucas dezenas de bytes).
- **LoRaWAN:** o protocolo de rede sobre LoRa: dispositivos enviam para **gateways**, que repassam a um **servidor de rede** pela internet.
- No Brasil se usa o plano de frequências **AU915**. Há limites de tempo de transmissão e regras de uso da faixa.
- Bom para: agricultura, medição de água e gás, monitoramento em áreas grandes.

### 1.4 Zigbee, Thread e Matter

- **Zigbee** e **Thread** usam o rádio IEEE 802.15.4 e formam redes **mesh** (cada aparelho repassa mensagens dos outros), de baixo consumo, comuns em casa inteligente. O Thread usa IPv6.
- **Matter** não é um rádio: é um **padrão de aplicação** (das grandes empresas de casa inteligente) que funciona sobre Wi-Fi, Thread e Ethernet, para que aparelhos de marcas diferentes funcionem juntos.

### 1.5 Celular (NB-IoT e LTE-M)

Redes de operadoras feitas para IoT: cobertura ampla (cidade, estrada), sem gateway próprio, consumo moderado com modos de economia (PSM, eDRX). Custam um plano e um módulo. LTE-M tem mais banda e mobilidade (rastreadores); NB-IoT, mais penetração em locais fechados e menor consumo (medidores).

### 1.6 Escolher a tecnologia

| | Wi-Fi | BLE | LoRaWAN | Zigbee/Thread | NB-IoT / LTE-M |
|---|---|---|---|---|---|
| Alcance | Dezenas de m | Dezenas de m | Quilômetros | Mesh, dezenas de m por salto | Cobertura da operadora |
| Taxa | Alta | Média | Muito baixa | Baixa | Baixa a média |
| Consumo | Alto | Muito baixo | Muito baixo | Baixo | Médio/baixo |
| Infraestrutura | Roteador | Celular ou gateway | Gateway LoRaWAN | Hub/roteador de borda | Operadora |
| Custo recorrente | Não | Não | Baixo | Não | Plano |

Perguntas para decidir: quanto dado e com que frequência? Bateria ou tomada? Qual a distância e há infraestrutura? O usuário tem celular por perto? Precisa funcionar em vários países?

### Atividades de fixação do Tema 1

1. Escolha a tecnologia e justifique: (a) sensor de umidade do solo numa fazenda de 500 hectares; (b) fechadura inteligente aberta pelo celular; (c) câmera de segurança residencial; (d) rastreador de caminhão em rodovias; (e) sensor de porta aberta numa casa com hub.
2. Com o app nRF Connect, explore um dispositivo BLE perto de você (fone, relógio, pulseira): quais serviços e características ele expõe?
3. Faça o ESP32 anunciar via BLE um nome e o valor de um sensor no pacote de advertising, e leia pelo celular.
4. Um sensor LoRaWAN precisa enviar uma foto de 200 KB por dia. Isso é viável? Por quê?
5. Qual a diferença entre Thread e Matter?

## Tema 2: Protocolos de IoT

**Objetivo:** trocar dados entre dispositivos e a nuvem de forma eficiente e confiável.

### 2.1 MQTT

Protocolo leve de **publicação e assinatura** (publish/subscribe), sobre TCP. Os dispositivos não falam entre si diretamente: falam com um **broker**.

- **Tópicos** hierárquicos: `fazenda/talhao3/sensor12/umidade`.
- **Curingas** na assinatura: `+` (um nível: `fazenda/+/sensor12/umidade`) e `#` (todos os níveis abaixo: `fazenda/talhao3/#`).
- **QoS:** 0 (no máximo uma vez), 1 (pelo menos uma vez, pode duplicar), 2 (exatamente uma vez, mais lento).
- **Retained:** o broker guarda a última mensagem do tópico e entrega a quem assinar depois (bom para "estado atual").
- **Last Will (LWT):** mensagem que o broker publica se o dispositivo cair sem se despedir (ex.: `status = offline`).
- **Keep alive:** pings periódicos para detectar conexões mortas.

```bash
docker run -it -p 1883:1883 eclipse-mosquitto:2 mosquitto -c /mosquitto-no-auth.conf
mosquitto_sub -h localhost -t "casa/#" -v                     # terminal 1
mosquitto_pub -h localhost -t "casa/sala/temperatura" -m 25.3  # terminal 2
```

No ESP32 com ESP-IDF:

```c
#include "mqtt_client.h"

esp_mqtt_client_config_t cfg = {
    .broker.address.uri = "mqtts://broker.exemplo.com:8883",
    .broker.verification.certificate = (const char *)ca_pem_inicio,   // certificado da CA do broker
};
esp_mqtt_client_handle_t cliente = esp_mqtt_client_init(&cfg);
esp_mqtt_client_start(cliente);
/* ... após o evento MQTT_EVENT_CONNECTED: */
esp_mqtt_client_publish(cliente, "casa/sala/temperatura", "25.3", 0, 1, 0);   // QoS 1, sem retain
```

> **Cuidado! Cai na entrevista:** "Como saber se um dispositivo MQTT está offline?" Last Will com mensagem retida de status: ao conectar, o dispositivo publica `online` (retido); se cair, o broker publica o LWT `offline` (retido). Quem assinar o tópico de status sempre sabe o estado atual.

### 2.2 CoAP

Protocolo no estilo REST (GET, POST, PUT, DELETE), mas sobre **UDP** e muito compacto, para dispositivos e redes bem limitados (como Thread). Tem confirmação opcional e "observe" (assinar mudanças de um recurso).

### 2.3 HTTP e REST em dispositivos

Funciona e é universal (qualquer servidor entende), mas é mais pesado: cabeçalhos de texto, uma conexão por requisição (ou keep-alive), sem "empurrar" dados para o dispositivo sem *polling*. Bom para dispositivos ligados na tomada que enviam pouco, ou para interface web local de configuração.

### 2.4 JSON vs formatos binários

| Formato | Exemplo | Tamanho | Observação |
|---|---|---|---|
| JSON | `{"t":25.3,"u":61}` | 17 bytes | Legível, universal |
| CBOR / MessagePack | mesmo dado, binário | ~10 bytes | "JSON binário", sem esquema |
| Protocol Buffers | com esquema `.proto` | ~7 bytes | Compacto, com versão de esquema |
| Estrutura própria | 2 bytes temp + 1 byte umidade | 3 bytes | Mínimo; comum em LoRaWAN |

Em links caros ou lentos (LoRaWAN, satélite, celular com plano pequeno), cada byte conta.

### 2.5 Plataformas de nuvem IoT

Serviços que recebem os dados, gerenciam milhares de dispositivos e suas credenciais, e integram com bancos e painéis: **AWS IoT Core**, **Azure IoT Hub**, e opções abertas como **ThingsBoard** e **EMQX**. Conceito comum: o **device shadow/twin**, uma cópia na nuvem do estado desejado e do estado reportado do dispositivo, que sincroniza quando ele se conecta (útil para dispositivos que passam muito tempo dormindo).

### 2.6 Atualização OTA

Corrigir bugs e falhas de segurança em milhares de aparelhos em campo exige **atualização remota (OTA)** confiável:

- **Duas partições** de aplicação (no ESP-IDF, `ota_0` e `ota_1`): baixa para a inativa, verifica e troca no próximo boot.
- **Rollback:** a nova versão precisa confirmar que funciona (`esp_ota_mark_app_valid_cancel_rollback()`); se travar ou reiniciar antes, o bootloader volta à anterior.
- **Imagem assinada** (Tema 3) e transferência por TLS.
- **Liberação gradual:** primeiro para 1% da frota, observar, depois ampliar.
- Considerar bateria fraca e conexão instável (retomar o download de onde parou).

### Atividades de fixação do Tema 2

1. Suba o Mosquitto em Docker e faça o ESP32 publicar temperatura a cada 10 s. Assine pelo PC e veja as mensagens.
2. Projete a árvore de tópicos MQTT de um prédio com 10 andares, vários cômodos e sensores de temperatura, presença e luz, incluindo tópicos de comando e de status.
3. Implemente Last Will e mensagem retida de status no ESP32. Desligue a placa e veja o broker publicar `offline`.
4. Um sensor envia `{"temperatura": 25.31, "umidade": 61.2, "bateria": 3.71}` a cada 15 minutos por LoRaWAN. Proponha um formato binário e calcule o tamanho.
5. Implemente OTA no ESP32 a partir de um servidor HTTPS na sua máquina, com rollback se a nova versão não confirmar que iniciou bem.

## Tema 3: Segurança de dispositivos

**Objetivo:** proteger o dispositivo, os dados e a rede de quem os usa.

### 3.1 Modelagem de ameaças

Antes de escolher técnicas, pergunte: **o que** proteger (dados do usuário, controle de um atuador, propriedade intelectual do firmware), **de quem** (alguém na internet, alguém com o aparelho na mão) e **o que acontece** se der errado. O modelo **STRIDE** ajuda a listar ameaças: falsificação de identidade, adulteração, repúdio, vazamento de informação, negação de serviço e elevação de privilégio.

Casos reais mostram o risco: botnets como a **Mirai** (2016) usaram câmeras e roteadores com **senha padrão** para derrubar grandes sites.

### 3.2 Secure boot

**Cadeia de confiança:** cada etapa verifica a assinatura da próxima antes de executá-la. A ROM (imutável) verifica o bootloader, que verifica a aplicação. A chave pública fica gravada de forma permanente no chip (eFuses ou memória OTP); a privada fica guardada pelo fabricante, **nunca** no dispositivo nem no repositório.

Resultado: o dispositivo só executa firmware assinado por você. O ESP32 (Secure Boot v2), STM32 (com soluções como o SBSFU/TF-M) e os processadores de Linux embarcado têm suporte.

Complemento: **criptografia da flash**, para que quem dessoldar a memória não leia o firmware nem os segredos.

### 3.3 TLS em microcontroladores

Bibliotecas como **mbedTLS** e **wolfSSL** levam TLS a microcontroladores. Pontos de atenção:

- **Verifique o certificado do servidor** (com o certificado da CA embutido). Desligar a verificação para "fazer funcionar" anula a segurança.
- O dispositivo precisa de **data e hora** razoáveis (SNTP) para validar a validade dos certificados.
- **TLS mútuo:** o dispositivo também apresenta um certificado próprio, único, e o servidor sabe exatamente quem é (padrão nas plataformas de nuvem IoT).
- O handshake consome RAM e tempo: use curvas elípticas (ECDSA) e reutilize sessões.

### 3.4 Armazenamento de chaves

Onde guardar a chave privada do dispositivo?

| Opção | Proteção |
|---|---|
| Na flash comum, sem criptografia | Nenhuma: quem ler a flash copia a chave |
| Flash criptografada | Boa contra leitura física simples |
| Elemento seguro (ex.: ATECC608, SE050) | A chave é gerada e usada **dentro** do chip e nunca sai dele |
| TrustZone / TF-M (Cortex-M33) | Isola o código e as chaves sensíveis do resto do firmware |

Regra: **credenciais únicas por dispositivo**, nunca a mesma senha ou chave em todos (se uma vazar, todas vazam).

### 3.5 Proteção de debug

A porta de depuração (SWD/JTAG) permite ler a memória toda e controlar o processador. Em produção:

- Desabilite ou trave o debug (no STM32, os níveis de **RDP**, Readout Protection; no ESP32, eFuses que desativam o JTAG).
- Não deixe consoles de comando abertos na UART sem autenticação.
- Remova logs com informações sensíveis.

### 3.6 Firmware assinado e o ciclo de vida

- **Assinatura** de toda imagem de atualização; o dispositivo verifica antes de instalar.
- **Anti-rollback:** impedir a instalação de uma versão antiga com falha conhecida (contador de versão em memória que só aumenta).
- Processo para **receber relatos** de vulnerabilidades e publicar correções por OTA durante a vida útil do produto.
- Lista de componentes de software (**SBOM**) para saber se o produto é afetado quando sai uma falha numa biblioteca.

Normas e regulações: **ETSI EN 303 645** (base para IoT de consumo na Europa), **Cyber Resilience Act** (União Europeia) e, no Brasil, requisitos de segurança cibernética da **Anatel** para equipamentos de telecomunicações (como roteadores e modems). Quem exporta ou certifica produtos precisa acompanhar.

> **Cuidado! Cai na entrevista:** "Liste práticas de segurança para um dispositivo IoT." Sem senha padrão e credenciais únicas por aparelho; TLS com verificação de certificado; secure boot e criptografia da flash; firmware assinado com OTA e anti-rollback; debug travado em produção; menor quantidade possível de serviços expostos; processo de atualização durante a vida útil.

### Atividades de fixação do Tema 3

1. Faça a modelagem de ameaças (com STRIDE) de uma fechadura inteligente com Wi-Fi e BLE.
2. Configure o broker Mosquitto com TLS e usuário/senha e conecte o ESP32 verificando o certificado.
3. Por que usar a mesma chave de API em todos os dispositivos de um produto é perigoso? Como provisionar credenciais únicas na fábrica?
4. Explique a cadeia de confiança do secure boot e por que a chave privada de assinatura nunca deve estar no dispositivo nem no Git.
5. Escreva um checklist de segurança de 10 itens para liberar um produto IoT para produção.

## Projeto da etapa

**Sensor IoT a bateria, seguro e atualizável:**

1. ESP32 que acorda do *deep sleep*, mede (temperatura e umidade), publica por **MQTT com TLS** e volta a dormir.
2. Tópicos bem definidos, status com Last Will e mensagem retida.
3. Provisionamento do Wi-Fi sem senha no código (por BLE ou ponto de acesso temporário).
4. **OTA** com rollback; imagem assinada (Secure Boot v2 é opcional nesta etapa: queimar eFuses é irreversível, então pratique numa placa reserva).
5. Medição do consumo (multímetro ou medidor de energia) e estimativa da duração da bateria.
6. Painel simples (Node-RED, Grafana ou ThingsBoard) mostrando os dados.
7. README com a modelagem de ameaças e o checklist de segurança.

## Resumão

- Escolha o rádio pela quantidade de dados, distância, energia e infraestrutura: Wi-Fi, BLE, LoRaWAN, Zigbee/Thread, NB-IoT/LTE-M.
- BLE: advertising e GATT (serviços e características). Matter é aplicação, não rádio.
- MQTT: broker, tópicos com curingas, QoS, retained, Last Will.
- Em links caros, formatos binários. Device shadow para dispositivos que dormem.
- OTA com duas partições, rollback, assinatura e liberação gradual.
- Segurança: modelagem de ameaças, secure boot, TLS com verificação, credenciais únicas, chaves em elemento seguro, debug travado.
