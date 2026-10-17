# Gabarito: Linux Embarcado

Abra só depois de tentar.

## Tema 1

1. ```bash
   uname -r; uname -m
   free -h
   cat /sys/class/thermal/thermal_zone0/temp    # ex.: 48312 = 48,3 °C
   journalctl -b -p err | head -5
   ```
2. Prática. No PC, a execução falha com um erro como `cannot execute binary file: Exec format error`, porque o binário é para ARM (aarch64) e o PC é x86-64. (Com o pacote `qemu-user`, dá até para executar binários ARM no PC, útil para testes.)
3. Exemplo para Raspberry Pi 4: a ROM do processador lê o bootloader da EEPROM da placa; ele carrega o firmware da partição de boot do cartão, que lê o `config.txt`, carrega o kernel, o device tree (e os overlays) e passa a linha de comando do `cmdline.txt`; o kernel inicializa os drivers e monta o rootfs (segunda partição); o systemd inicia os serviços até o prompt de login (ou o SSH).
4. Porque cada mudança no kernel ou no sistema de arquivos não exige regravar o cartão ou a flash: basta recompilar no PC e reiniciar a placa, que busca tudo pela rede. Economiza muito tempo e desgaste da mídia.
5. A distribuição pronta é ótima para protótipos: tem tudo e é fácil. Num produto, traz centenas de pacotes desnecessários (mais superfície de ataque, boot lento, mais espaço, atualizações imprevisíveis) e é difícil de reproduzir exatamente. Com Yocto, a imagem tem **só** o que o produto precisa, é **reprodutível** (mesma entrada gera a mesma imagem), tem licenças rastreadas e um processo de atualização controlado.

## Tema 2

1. ```bash
   gpioset -c gpiochip0 17=1   # LED (com resistor) na GPIO17
   gpioget -c gpiochip0 27     # botão na GPIO27 (com pull-up/pull-down configurado)
   ```
   Em Python, o exemplo com `gpiozero` da seção 2.2.
2. Prática. Habilite o I2C no `raspi-config`; `i2cdetect -y 1` deve mostrar o endereço do sensor (ex.: 0x48 ou 0x76) na tabela.
3. Prática. No Wireshark, capture na interface `vcan0`; ele decodifica os quadros CAN (ID, tamanho e dados).
4. Use a unidade da seção 2.5. Ao executar `sudo systemctl kill coletor` (ou matar o processo pelo PID), o systemd reinicia o serviço após 2 s; `systemctl status coletor` mostra o novo PID e o histórico no journal.
5. A 20 kHz cada meio ciclo dura 25 µs. Um processo comum no Linux pode ser interrompido pelo escalonador por centenas de microssegundos ou mais, e o Python ainda acrescenta sobrecarga: o sinal fica irregular (jitter enorme). Use o **PWM de hardware** do chip (na Raspberry Pi, pelo overlay `pwm` e `/sys/class/pwm`), um chip dedicado (como o PCA9685 por I2C) ou um microcontrolador auxiliar.

## Tema 3

1. Resposta pessoal. Uma imagem mínima do Buildroot com Python costuma ficar na casa de dezenas de MB e iniciar bem mais rápido que o Raspberry Pi OS.
2. Saída esperada no `dmesg`: `ola: carregado` ao executar `insmod` e `ola: removido` ao executar `rmmod`.
3. ```c
   static atomic_t leituras = ATOMIC_INIT(0);

   static ssize_t contador_read(struct file *f, char __user *buf, size_t len, loff_t *pos)
   {
       char msg[32];
       int n;
       if (*pos == 0)
           atomic_inc(&leituras);           // conta uma leitura por abertura/leitura do início
       n = scnprintf(msg, sizeof(msg), "%d\n", atomic_read(&leituras));
       return simple_read_from_buffer(buf, len, pos, msg, n);
   }
   ```
   `atomic_t` porque vários processos podem ler ao mesmo tempo.
4. **Driver no kernel** quando: o dispositivo precisa de interrupções com baixa latência, DMA, integração com um subsistema existente (rede, entrada, som, hwmon, IIO) ou ser usado por várias aplicações de forma padronizada. Exemplo: um controlador CAN novo, que precisa aparecer como interface SocketCAN. **Espaço de usuário** quando dá para resolver com as interfaces genéricas (i2c-dev, spidev, libgpiod, UART) e o desempenho basta. Exemplo: ler um sensor de umidade por I2C a cada 10 s. É mais simples de desenvolver, depurar e atualizar, e um erro não derruba o sistema.
5. O sistema roda da partição **A**. O cliente de atualização baixa a imagem, verifica a assinatura e começa a gravar na **B**. A energia cai no meio: a **B** fica incompleta, mas o bootloader ainda está configurado para iniciar a **A**, que está intacta; o sistema volta normalmente e tenta a atualização de novo depois. Se a queda ocorresse depois da gravação, quando o bootloader já tentaria a **B**: a **B** inicia, mas se não confirmar que subiu bem (a aplicação marca a partição como "boa" após o boot) dentro de algumas tentativas, o bootloader volta para a **A**. Em nenhum momento o aparelho fica sem um sistema que funcione.

## Projeto da etapa

O que um avaliador olharia:

- Serviço systemd com usuário próprio, reinício automático e logs úteis no journal.
- Tratamento de falhas: sensor desconectado ou CAN sem tráfego não derrubam a aplicação.
- Imagem reprodutível (configuração do Buildroot ou camada Yocto no repositório).
- Documentação clara do boot e da arquitetura.
