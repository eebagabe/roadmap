# Linux Embarcado: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 18 a 20

## Comece por aqui

Quando o produto precisa de tela gráfica, câmera, rede completa, banco de dados ou muito software (roteadores, centrais multimídia, gateways industriais, robôs, TVs), um microcontrolador não basta: entra o **Linux embarcado**, rodando num processador (MPU) como o da Raspberry Pi, da NXP i.MX ou da TI Sitara. Você ganha um sistema operacional completo; em troca, lida com boot mais longo, mais consumo e um sistema bem mais complexo.

### Por que isso vale ouro no mercado

- Vagas de "Embedded Linux" pedem: Yocto ou Buildroot, device tree, drivers, U-Boot, cross-compilation.
- Muitos produtos combinam os dois mundos: Linux para a parte "inteligente" e um microcontrolador para o tempo real.
- É uma ponte natural para DevOps de dispositivos (atualizações remotas, segurança, frotas).

### Como esta apostila funciona

1. Use uma **Raspberry Pi** (3, 4 ou 5) com Raspberry Pi OS Lite, acessada por SSH.
2. Os exemplos de CAN usam a interface **virtual** `vcan` do Linux: dá para praticar sem nenhum hardware de CAN.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** algo não funciona no Linux embarcado? Olhe as mensagens do kernel (`dmesg`), os logs do sistema (`journalctl -b`) e se o dispositivo apareceu (`ls /dev`, `ls /sys/class`). Quase sempre o problema está escrito em algum desses lugares.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 18 | Tema 1: Linux para embarcados |
| 19 | Tema 2: Hardware no Linux |
| 20 | Tema 3: Imagens e drivers + projeto |

## Tema 1: Linux para embarcados

**Objetivo:** usar o Linux numa placa, compilar para ela e entender o processo de boot.

### 1.1 Shell e ferramentas

Além dos comandos do dia a dia (`ls`, `cd`, `cat`, `grep`, `systemctl`), os que mais importam em embarcados:

```bash
uname -a              # kernel e arquitetura (aarch64, armv7l)
dmesg | tail -30      # mensagens do kernel (drivers carregando, erros de hardware)
journalctl -b -p err  # erros desde o último boot
lsmod                 # módulos do kernel carregados
cat /proc/cpuinfo     # processador
free -h; df -h        # memória e disco
ls /sys/class         # dispositivos por classe (gpio, net, leds, thermal...)
cat /sys/class/thermal/thermal_zone0/temp   # temperatura da CPU em milésimos de grau
```

No Linux, "tudo é arquivo": dispositivos aparecem em `/dev` e informações do kernel em `/proc` e `/sys`.

### 1.2 Raspberry Pi

Preparação sem monitor (*headless*): grave o Raspberry Pi OS Lite com o **Raspberry Pi Imager**, já configurando usuário, Wi-Fi e SSH nas opções avançadas. Depois:

```bash
ssh usuario@raspberrypi.local
sudo raspi-config        # habilitar I2C, SPI, serial
```

### 1.3 Cross-compilation

Compilar programas grandes na própria placa é lento. O normal é compilar no PC para a arquitetura da placa:

```bash
sudo apt install gcc-aarch64-linux-gnu        # para Raspberry Pi 64 bits
aarch64-linux-gnu-gcc -O2 ola.c -o ola
file ola                                       # ELF 64-bit LSB executable, ARM aarch64
scp ola usuario@raspberrypi.local:~
```

Para programas que usam bibliotecas da placa, é preciso um **sysroot** (cópia das bibliotecas e headers do sistema alvo) ou o SDK gerado pelo Yocto/Buildroot. Containers Docker com a toolchain certa também resolvem.

### 1.4 Processo de boot

```
ROM do chip → bootloader (ex.: U-Boot) → kernel Linux (+ device tree) → init (systemd) → serviços e aplicação
```

1. A **ROM** do processador procura um bootloader num local fixo (cartão SD, eMMC, flash SPI).
2. O **bootloader** inicializa a RAM, carrega o kernel e o device tree e passa parâmetros (a "linha de comando" do kernel).
3. O **kernel** inicializa drivers e monta o sistema de arquivos raiz (**rootfs**).
4. O **init** (geralmente systemd) inicia os serviços, incluindo a sua aplicação.

Na Raspberry Pi, a primeira etapa é feita pelo firmware próprio da placa (arquivos na partição de boot, configurados em `config.txt`); em placas industriais, o **U-Boot** é o padrão.

### 1.5 U-Boot

Bootloader mais usado em Linux embarcado. Pela serial, dá para interromper o boot e usar o console dele:

```
=> printenv bootcmd         # o que ele faz por padrão para iniciar
=> setenv bootargs console=ttyS0,115200 root=/dev/mmcblk0p2 rw
=> tftp ${kernel_addr_r} Image   # baixa o kernel pela rede (agiliza o desenvolvimento)
=> boot
```

Durante o desenvolvimento, carregar kernel por TFTP e rootfs por NFS evita regravar o cartão a cada mudança.

### 1.6 Kernel e rootfs

- **Kernel:** o núcleo do Linux, com drivers. Configurado com `make menuconfig` e compilado para a arquitetura alvo.
- **Rootfs:** o sistema de arquivos com programas, bibliotecas e configurações. Pode ser uma distribuição completa (Raspberry Pi OS, Debian) ou uma imagem mínima gerada sob medida (Buildroot, Yocto), com alguns MB.

### Atividades de fixação do Tema 1

1. Na Raspberry Pi, descubra: versão do kernel, arquitetura, memória total, temperatura da CPU e os 5 primeiros erros do último boot.
2. Compile um programa "olá" no PC com o cross-compiler, copie para a placa e execute. O que acontece se tentar executá-lo no PC?
3. Descreva o processo de boot da sua placa, do botão de energia até o prompt de login.
4. Por que, em desenvolvimento, carregar o kernel por TFTP e o rootfs por NFS é útil?
5. Qual a diferença entre usar uma distribuição pronta (Raspberry Pi OS) e uma imagem gerada com Yocto num produto comercial?

## Tema 2: Hardware no Linux

**Objetivo:** acessar GPIO, I2C, SPI e CAN a partir do espaço de usuário, e rodar a aplicação como serviço.

### 2.1 Device tree

O **device tree** descreve o hardware que **não** pode ser descoberto sozinho (diferente de USB e PCI): quais periféricos existem, em que endereços, quais pinos, quais chips estão ligados em cada barramento. O kernel lê esse arquivo no boot e carrega os drivers certos.

```dts
&i2c1 {
    status = "okay";
    clock-frequency = <100000>;

    sensor@48 {
        compatible = "ti,tmp102";   // o kernel associa ao driver tmp102
        reg = <0x48>;               // endereço I2C
    };
};
```

Arquivos `.dts` (texto) são compilados em `.dtb` (binário). Na Raspberry Pi, **overlays** ativados no `config.txt` (`dtoverlay=...`, `dtparam=i2c_arm=on`) modificam o device tree sem recompilar nada.

### 2.2 GPIO com libgpiod

A interface antiga `/sys/class/gpio` está **obsoleta**. O modo atual é o dispositivo de caractere (`/dev/gpiochipN`) com a biblioteca e as ferramentas **libgpiod**:

```bash
gpiodetect                    # lista os controladores de GPIO
gpioinfo                      # lista as linhas e quem as usa
gpioset -c gpiochip0 17=1     # liga a linha 17 (sintaxe da libgpiod 2.x)
gpioget -c gpiochip0 27       # lê a linha 27
```

(A sintaxe mudou entre as versões 1.x e 2.x da libgpiod; consulte `gpioset --help` na sua placa.)

Em Python, a biblioteca `gpiod` (oficial) ou a `gpiozero` (mais simples, comum na Raspberry Pi):

```python
from gpiozero import LED, Button
from signal import pause

led = LED(17)
botao = Button(27)
botao.when_pressed = led.toggle
pause()
```

> **Na prática:** Linux comum **não é tempo real**. Piscar um GPIO com precisão de microssegundos a partir do espaço de usuário não funciona bem (o escalonador pode atrasar o processo). Para isso, use periféricos de hardware (PWM do chip), um microcontrolador auxiliar, ou o kernel com PREEMPT_RT, que reduz muito a latência.

### 2.3 I2C e SPI no Linux

```bash
sudo apt install i2c-tools
i2cdetect -y 1                # escaneia o barramento I2C 1 (mostra os endereços que respondem)
i2cget -y 1 0x48 0x00 w       # lê uma palavra do registrador 0 do dispositivo 0x48
```

```python
from smbus2 import SMBus

with SMBus(1) as bus:
    bruto = bus.read_i2c_block_data(0x48, 0x00, 2)
    valor = ((bruto[0] << 8) | bruto[1]) >> 4       # exemplo para o sensor TMP102 (12 bits)
    if valor & 0x800:
        valor -= 4096                                # sinal em complemento de dois
    print(valor * 0.0625, "°C")
```

SPI aparece como `/dev/spidev0.0` e pode ser usado com a biblioteca `spidev` em Python. Quando existe um driver do kernel para o chip (como o `tmp102` do exemplo de device tree), o dado aparece direto em `/sys` (por exemplo, em `/sys/class/hwmon`), sem precisar falar o protocolo.

### 2.4 SocketCAN

O Linux trata a rede CAN como uma **interface de rede** (como `eth0`), o que é uma grande vantagem para testes e ferramentas. Você vai usar muito isso na etapa de redes.

Prática **sem hardware**, com uma interface virtual:

```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
sudo apt install can-utils

candump vcan0                    # terminal 1: mostra tudo que passa
cansend vcan0 123#DEADBEEF       # terminal 2: envia ID 0x123 com 4 bytes
cangen vcan0 -g 100              # gera tráfego aleatório a cada 100 ms
```

Com hardware real (um adaptador USB-CAN ou um MCP2515 ligado por SPI com overlay na Raspberry Pi):

```bash
sudo ip link set can0 up type can bitrate 500000
candump can0
```

(Algumas instalações do WSL não têm o módulo `vcan`; uma Raspberry Pi ou uma máquina virtual Linux resolvem.)

### 2.5 Serviços com systemd

A aplicação do produto deve iniciar sozinha no boot e reiniciar se cair:

```ini
# /etc/systemd/system/coletor.service
[Unit]
Description=Coletor de sensores
After=network-online.target

[Service]
ExecStart=/usr/bin/python3 /opt/coletor/main.py
Restart=always
RestartSec=2
User=coletor
WatchdogSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now coletor
journalctl -u coletor -f        # acompanha os logs do serviço
```

`WatchdogSec` faz o systemd reiniciar o serviço se ele parar de avisar que está vivo (a aplicação precisa enviar o sinal com `sd_notify`), o mesmo conceito do watchdog de hardware. Rodar com um usuário próprio (não `root`) limita o estrago de uma falha de segurança.

### Atividades de fixação do Tema 2

1. Acenda um LED e leia um botão pela libgpiod (linha de comando) e depois em Python.
2. Ligue um sensor I2C na Raspberry Pi, encontre-o com `i2cdetect` e leia o valor em Python.
3. Crie uma interface `vcan0`, envie mensagens com `cansend` e capture com `candump` e com o Wireshark.
4. Transforme o script do exercício 2 num serviço systemd que inicia no boot e reinicia se for encerrado. Teste com `kill`.
5. Por que gerar um sinal PWM de 20 kHz alternando um GPIO em Python não funciona bem? O que usar no lugar?

## Tema 3: Imagens e drivers

**Objetivo:** gerar imagens Linux sob medida, escrever um módulo do kernel e planejar atualizações.

### 3.1 Buildroot

Ferramenta que gera, a partir de uma configuração, a **toolchain**, o **kernel**, o **bootloader** e um **rootfs mínimo**.

```bash
git clone https://gitlab.com/buildroot.org/buildroot.git && cd buildroot
make list-defconfigs | grep raspberrypi
make raspberrypi4_64_defconfig
make menuconfig          # escolhe pacotes (python3, can-utils, dropbear para SSH...)
make -j$(nproc)          # demora na primeira vez
ls output/images/        # sdcard.img pronto para gravar
```

Simples, rápido de aprender, ótimo para produtos com software bem definido. A imagem pode ter poucos MB e iniciar em segundos.

### 3.2 Yocto

Padrão da indústria para produtos maiores. Mais complexo e poderoso: em vez de um menu, você descreve tudo em **camadas** (*layers*) e **receitas** (*recipes*), processadas pela ferramenta **BitBake**.

| Conceito | Significado |
|---|---|
| Poky | Distribuição de referência do Yocto |
| Layer (`meta-*`) | Conjunto de receitas e configurações (ex.: `meta-raspberrypi`, a sua `meta-produto`) |
| Recipe (`.bb`) | Como baixar, compilar e instalar um software |
| MACHINE | A placa alvo |
| Image | O que entra no rootfs (ex.: `core-image-minimal`) |

```bash
source poky/oe-init-build-env
bitbake-layers add-layer ../meta-raspberrypi
echo 'MACHINE = "raspberrypi4-64"' >> conf/local.conf
bitbake core-image-minimal
```

Uma receita simples:

```bitbake
SUMMARY = "Coletor de sensores"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/MIT;md5=0835ade698e0bcf8506ecda2f7b4f302"
SRC_URI = "file://coletor.c"
S = "${WORKDIR}"

do_compile() {
    ${CC} ${CFLAGS} ${LDFLAGS} coletor.c -o coletor
}
do_install() {
    install -d ${D}${bindir}
    install -m 0755 coletor ${D}${bindir}
}
```

| | Buildroot | Yocto |
|---|---|---|
| Curva de aprendizado | Menor | Bem maior |
| Gerenciamento de pacotes na placa | Não | Opcional |
| Reuso entre produtos | Limitado | Excelente (camadas) |
| Suporte de fabricantes (BSP) | Bom | Padrão de mercado |

### 3.3 Módulos do kernel

Drivers são normalmente **módulos** carregados sob demanda. Um módulo mínimo:

```c
// ola.c
#include <linux/module.h>
#include <linux/init.h>

static int __init ola_init(void)
{
    pr_info("ola: carregado\n");
    return 0;
}

static void __exit ola_exit(void)
{
    pr_info("ola: removido\n");
}

module_init(ola_init);
module_exit(ola_exit);
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de exemplo");
```

```make
# Makefile
obj-m += ola.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

```bash
sudo apt install linux-headers-$(uname -r)   # na Raspberry Pi: raspberrypi-kernel-headers, conforme a versão do sistema
make
sudo insmod ola.ko
dmesg | tail -2
sudo rmmod ola
```

No kernel não há `printf`, `malloc` nem biblioteca C: há `pr_info`, `kmalloc` e APIs próprias. Um erro num módulo pode travar o sistema inteiro.

### 3.4 Drivers de caractere

Um **driver de caractere** cria um arquivo em `/dev` que a aplicação usa com `open`, `read`, `write` e `ioctl`. A forma mais simples é o *misc device*:

```c
#include <linux/miscdevice.h>
#include <linux/fs.h>

static ssize_t contador_read(struct file *f, char __user *buf, size_t len, loff_t *pos)
{
    static const char msg[] = "ola do kernel\n";
    return simple_read_from_buffer(buf, len, pos, msg, sizeof(msg) - 1);
}

static const struct file_operations fops = {
    .owner = THIS_MODULE,
    .read  = contador_read,
};

static struct miscdevice dev = {
    .minor = MISC_DYNAMIC_MINOR,
    .name  = "contador",
    .fops  = &fops,
};

module_misc_device(dev);
MODULE_LICENSE("GPL");
```

`cat /dev/contador` mostra a mensagem. Dados entre usuário e kernel passam sempre por funções como `copy_to_user` e `copy_from_user` (aqui, dentro do `simple_read_from_buffer`), nunca por acesso direto ao ponteiro do usuário.

Antes de escrever um driver, verifique se o kernel já tem um para o seu chip (muitas vezes basta ativá-lo e descrevê-lo no device tree) e se dá para resolver no espaço de usuário (libgpiod, spidev, i2c-dev), o que é mais simples e seguro.

### 3.5 Atualização de firmware (A/B)

Um produto em campo precisa ser atualizado sem risco de "virar tijolo":

- **Partições A/B:** o sistema roda da A; a atualização é gravada na B; o bootloader tenta iniciar a B; se ela não confirmar que iniciou bem, volta para a A automaticamente.
- **Rootfs somente leitura** (com uma partição separada para dados): evita corrupção por quedas de energia e torna o sistema previsível.
- Imagens **assinadas** e verificadas antes de instalar.
- Ferramentas prontas: **RAUC**, **SWUpdate**, **Mender**.

### Atividades de fixação do Tema 3

1. Gere uma imagem com o Buildroot para a sua placa contendo Python e can-utils, grave e inicie. Qual o tamanho da imagem e o tempo de boot?
2. Compile, carregue e remova o módulo "olá". Mostre as mensagens no `dmesg`.
3. Modifique o driver de caractere para contar quantas vezes o arquivo foi lido e devolver esse número.
4. Quando escrever um driver do kernel e quando resolver no espaço de usuário? Dê um exemplo de cada.
5. Descreva, passo a passo, uma atualização A/B que falha no meio (queda de energia) e como o sistema se recupera.

## Projeto da etapa

**Gateway de sensores com Linux embarcado:**

1. Raspberry Pi lendo um sensor I2C e recebendo mensagens CAN (de um microcontrolador com transceiver ou, sem hardware, de um script enviando em `vcan0`).
2. Aplicação (Python ou C) como serviço systemd, com usuário próprio, reinício automático e logs no journal.
3. Dados expostos por uma API HTTP simples ou publicados por MQTT (você verá mais em Conectividade).
4. Imagem gerada com Buildroot (ou Yocto, se quiser o desafio) com tudo instalado.
5. README com o desenho da arquitetura e o processo de boot do seu sistema.

## Resumão

- Linux embarcado: quando o produto precisa de muito software; roda em MPU, não é tempo real por padrão.
- `dmesg`, `journalctl`, `/sys` e `/dev` contam quase tudo.
- Cross-compile no PC; sysroot ou SDK para bibliotecas.
- Boot: ROM → bootloader (U-Boot) → kernel + device tree → systemd → aplicação.
- Device tree descreve o hardware; overlays ajustam sem recompilar.
- GPIO com libgpiod; I2C com i2c-tools/smbus2; CAN com SocketCAN (vcan para praticar).
- Aplicação como serviço systemd com reinício e watchdog.
- Buildroot é simples; Yocto é o padrão da indústria. Módulos e drivers de caractere para o que o kernel não tem.
- Atualização segura: A/B, rootfs somente leitura, imagens assinadas.
