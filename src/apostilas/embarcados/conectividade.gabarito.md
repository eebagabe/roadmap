# Gabarito: Conectividade e IoT

Abra só depois de tentar.

## Tema 1

1. (a) **LoRaWAN**: área enorme, poucos dados, bateria (alternativa: NB-IoT se houver boa cobertura celular). (b) **BLE**: interação com o celular por perto, consumo baixo; Wi-Fi ou Thread opcionais para acesso remoto via hub. (c) **Wi-Fi**: vídeo exige banda e a câmera fica na tomada. (d) **LTE-M** (ou celular convencional): mobilidade e cobertura em rodovias; GPS para a posição. (e) **Zigbee ou Thread**: baixíssimo consumo, mesh, integração com o hub da casa.
2. Resposta pessoal. É comum ver serviços padronizados como *Battery Service* (nível de bateria) e *Device Information* (fabricante, modelo), além de serviços próprios do fabricante com UUIDs de 128 bits.
3. Prática. Com o ESP-IDF (NimBLE) ou com Arduino, coloque o valor do sensor no campo de "manufacturer data" ou "service data" do anúncio; no nRF Connect, ele aparece na lista de dispositivos sem precisar conectar.
4. **Não é viável.** LoRaWAN envia de dezenas a poucas centenas de bytes por mensagem e tem limites de tempo de transmissão. 200 KB exigiriam milhares de mensagens por dia, muito além do que a rede e as regras de uso permitem, e esgotariam a bateria. Para imagens, use Wi-Fi, celular, ou processe a imagem no dispositivo e envie só o resultado (por exemplo, "praga detectada: sim, 82% de confiança").
5. **Thread** é uma tecnologia de **rede** (mesh de baixo consumo sobre rádio 802.15.4, com IPv6): ela leva os pacotes. **Matter** é um padrão de **aplicação**: define como uma lâmpada, uma tomada ou um sensor descrevem e trocam comandos, e funciona sobre Thread, Wi-Fi ou Ethernet. Um aparelho Matter pode usar Thread como rede.

## Tema 2

1. Prática. No ESP32, conecte ao Wi-Fi, inicie o cliente MQTT apontando para o IP do seu PC (`mqtt://192.168.x.x:1883`) e publique numa task a cada 10 s. No PC: `mosquitto_sub -h localhost -t "#" -v`.
2. Exemplo:
   ```
   predio/{andar}/{comodo}/{sensor}/estado        ex.: predio/07/sala-702/temperatura/estado
   predio/{andar}/{comodo}/{atuador}/comando      ex.: predio/07/sala-702/luz/comando
   predio/{andar}/{comodo}/dispositivo/{id}/status  (online/offline, retido, com Last Will)
   ```
   Assinaturas úteis: `predio/07/#` (tudo do 7º andar), `predio/+/+/temperatura/estado` (todas as temperaturas). Separe estado (o dispositivo publica) de comando (o dispositivo assina) para evitar laços.
3. ```c
   esp_mqtt_client_config_t cfg = {
       .broker.address.uri = "mqtt://192.168.0.10:1883",
       .session.last_will = {
           .topic = "casa/sala/sensor01/status",
           .msg = "offline",
           .qos = 1,
           .retain = 1,
       },
   };
   /* no evento MQTT_EVENT_CONNECTED: */
   esp_mqtt_client_publish(cliente, "casa/sala/sensor01/status", "online", 0, 1, 1);
   ```
   Ao cortar a energia da placa, depois do tempo de keep alive (multiplicado por 1,5) o broker publica `offline`.
4. Exemplo: temperatura em centésimos de grau como `int16_t` (2531 → 2 bytes), umidade em décimos como `uint16_t` (612 → 2 bytes, ou em meio por cento num `uint8_t`), bateria em centésimos de volt menos 2 V num `uint8_t` (3,71 V → 171 → 1 byte). Total: **5 bytes** (ou 4), contra cerca de 55 bytes do JSON.
5. Prática. Use a partição `ota_0`/`ota_1` no `partitions.csv`, `esp_https_ota()` com o certificado do seu servidor local, `CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE=y`, e chame `esp_ota_mark_app_valid_cancel_rollback()` só depois de conectar ao broker com sucesso. Para testar o rollback, faça uma versão que reinicia no boot: o bootloader volta à anterior.

## Tema 3

1. Exemplo resumido. **Falsificação:** alguém se passa pelo app do dono (exigir pareamento seguro e autenticação forte). **Adulteração:** firmware modificado instalado na fechadura (secure boot, OTA assinado). **Repúdio:** dono nega ter aberto a porta (log assinado de eventos). **Vazamento:** horários de entrada e saída expostos (TLS, dados mínimos na nuvem). **Negação de serviço:** interferência ou ataque derruba o Wi-Fi e a fechadura não abre (abertura local por BLE e chave mecânica de emergência; nunca travar quem está dentro). **Elevação de privilégio:** convidado temporário vira administrador (controle de acesso no servidor e no dispositivo).
2. Prática. No Mosquitto: `listener 8883`, `cafile`, `certfile`, `keyfile`, `allow_anonymous false` e `password_file`. No ESP32: URI `mqtts://`, o certificado da CA em `.broker.verification.certificate`, e usuário/senha em `.credentials`. Teste também que a conexão **falha** com um certificado errado.
3. Se a chave estiver em todos os aparelhos, basta alguém extrair de um (lendo a flash) para se passar por qualquer dispositivo, ler ou enviar dados de todos os clientes, e não dá para revogar sem atualizar a frota inteira. Provisionamento único: na linha de produção, cada dispositivo gera seu par de chaves (de preferência dentro de um elemento seguro); a chave pública é assinada pela CA da empresa, gerando um certificado único gravado no aparelho e registrado na plataforma de nuvem. A chave privada nunca sai do dispositivo.
4. A ROM do chip (imutável) contém a lógica de verificação e o chip guarda, em memória de gravação única, o hash da chave pública. A ROM verifica a assinatura do bootloader; o bootloader verifica a da aplicação. Se alguma assinatura falhar, aquele código não executa. Só quem tem a **chave privada** consegue gerar imagens aceitas. Se ela estiver no dispositivo, um atacante a extrai e assina o próprio firmware; se estiver no Git, qualquer pessoa com acesso ao repositório (ou a um vazamento dele) pode fazer o mesmo, e como a chave pública está gravada de forma permanente em milhares de aparelhos, não dá para trocá-la. Guarde-a num HSM ou serviço de assinatura com acesso restrito.
5. Exemplo: (1) sem senha padrão, credenciais únicas por aparelho; (2) TLS em toda comunicação, com verificação de certificado; (3) secure boot ativado; (4) criptografia da flash; (5) OTA assinado com rollback e anti-rollback; (6) debug (JTAG/SWD) travado e console serial desabilitado ou autenticado; (7) nenhum segredo no código-fonte ou no repositório; (8) só as portas e serviços necessários abertos; (9) SBOM e monitoramento de vulnerabilidades das bibliotecas; (10) canal para relatos de vulnerabilidades e política de suporte de atualizações pelo tempo de vida do produto.

## Projeto da etapa

O que um avaliador olharia:

- Consumo medido nos estados de sono e ativo, com estimativa de bateria coerente.
- TLS com verificação de certificado e credenciais fora do código.
- OTA testado, incluindo o rollback de uma versão ruim.
- Status online/offline confiável com Last Will.
- Modelagem de ameaças e checklist no README.
