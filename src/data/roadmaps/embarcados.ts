import type { Roadmap } from '../types'

export const embarcados: Roadmap = {
  id: 'embarcados',
  title: 'Roadmap Sistemas Embarcados',
  short: 'Embarcados',
  icon: '🔌',
  accent: '#dc2626',
  objective:
    'Sair da eletrônica básica até projetar dispositivos completos: C para microcontroladores, RTOS, Linux embarcado, conectividade, redes industriais e automotivas, controle e confiabilidade.',
  intro:
    'Sistema embarcado é um computador escondido dentro de outro produto: no relógio inteligente, na máquina de lavar, no marca-passo, no inversor de uma fábrica, no avião e nas dezenas de ECUs de um carro. É uma área de longo prazo, que mistura eletrônica, programação de baixo nível e confiabilidade. O roteiro é generalista: a base (eletrônica, C, microcontroladores, RTOS e Linux) serve para qualquer setor. As etapas finais apresentam conectividade e IoT, redes industriais e automotivas, controle e as normas de segurança de cada área, para você escolher onde aprofundar. Tenha uma placa na mão desde a primeira semana: embarcados se aprende fazendo LED piscar, medindo com multímetro e quebrando a cabeça com o osciloscópio.',
  status: 'disponivel',
  sections: [
    {
      id: 'eletronica',
      title: 'Fundamentos de Eletrônica',
      summary: 'Tensão, corrente, componentes e instrumentos. Sem isso, o código não tem onde rodar.',
      weeks: [
        {
          id: 'eletricidade',
          title: 'Eletricidade básica',
          topics: ['Tensão, corrente e resistência', 'Lei de Ohm', 'Potência', 'Circuitos série e paralelo', 'Divisor de tensão', 'Multímetro', 'Segurança elétrica'],
        },
        {
          id: 'componentes',
          title: 'Componentes eletrônicos',
          topics: ['Resistores', 'Capacitores', 'Indutores', 'Diodos e LEDs', 'Transistores BJT', 'MOSFETs', 'Reguladores de tensão', 'Relés'],
        },
        {
          id: 'digital',
          title: 'Eletrônica digital',
          topics: ['Binário e hexadecimal', 'Portas lógicas', 'Flip-flops e registradores', 'Níveis lógicos 3,3 V e 5 V', 'Pull-up e pull-down', 'Open-drain', 'Protoboard'],
        },
        {
          id: 'instrumentacao',
          title: 'Instrumentação e documentação',
          topics: ['Ler esquemáticos', 'Ler datasheets', 'Fonte de bancada', 'Osciloscópio', 'Analisador lógico', 'Soldagem'],
        },
      ],
    },
    {
      id: 'c-embarcado',
      title: 'C para Embarcados',
      summary: 'A linguagem dos microcontroladores, usada perto do metal e com regras rígidas.',
      weeks: [
        {
          id: 'c-essencial',
          title: 'C essencial',
          topics: ['Tipos e stdint.h', 'Ponteiros', 'Arrays e strings', 'Structs e unions', 'Enums', 'Funções e escopo', 'Pré-processador'],
        },
        {
          id: 'baixo-nivel',
          title: 'C de baixo nível',
          topics: ['Operações bit a bit', 'Máscaras e campos de bits', 'volatile', 'const', 'Registradores mapeados em memória', 'Endianness', 'Alinhamento e padding'],
        },
        {
          id: 'toolchain',
          title: 'Toolchain e build',
          topics: ['Compilação cruzada', 'arm-none-eabi-gcc', 'Linker script', 'Código de startup', 'Map file', 'Makefile e CMake'],
        },
        {
          id: 'qualidade-c',
          title: 'Código confiável',
          topics: ['Memória estática vs dinâmica', 'MISRA C', 'Máquinas de estado', 'Testes unitários em C', 'Depuração com GDB', 'Análise estática'],
        },
      ],
    },
    {
      id: 'microcontroladores',
      title: 'Microcontroladores',
      summary: 'Programar o hardware de verdade: GPIO, interrupções, timers e protocolos.',
      weeks: [
        {
          id: 'arquitetura',
          title: 'Arquitetura de microcontroladores',
          topics: ['MCU vs MPU', 'ARM Cortex-M', 'Flash, RAM e mapa de memória', 'Clock e PLL', 'Tabela de vetores', 'Processo de boot'],
        },
        {
          id: 'gpio-interrupcoes',
          title: 'GPIO e interrupções',
          topics: ['GPIO por registradores', 'HAL e CubeMX', 'Interrupções e NVIC', 'Rotinas de interrupção (ISR)', 'Debounce', 'SysTick'],
        },
        {
          id: 'timers-adc',
          title: 'Timers, PWM e ADC',
          topics: ['Timers', 'PWM', 'Input capture', 'ADC', 'DAC', 'Leitura de sensores'],
        },
        {
          id: 'protocolos',
          title: 'Protocolos seriais',
          topics: ['UART', 'SPI', 'I2C', 'Comparando protocolos', 'Depurar com analisador lógico'],
        },
        {
          id: 'mcu-avancado',
          title: 'Recursos avançados',
          topics: ['DMA', 'Watchdog', 'Modos de baixo consumo', 'Memória flash e EEPROM', 'Bootloader', 'ESP32 e conectividade'],
        },
      ],
    },
    {
      id: 'rtos',
      title: 'RTOS e Tempo Real',
      summary: 'Várias tarefas no mesmo chip, cumprindo prazos de forma previsível.',
      weeks: [
        {
          id: 'tempo-real',
          title: 'Conceitos de tempo real',
          topics: ['Super loop vs RTOS', 'Hard e soft real-time', 'Deadline, jitter e latência', 'WCET', 'Escalonamento por prioridade', 'Rate Monotonic'],
        },
        {
          id: 'freertos',
          title: 'FreeRTOS na prática',
          topics: ['Tasks', 'Estados de uma task', 'vTaskDelay e vTaskDelayUntil', 'Filas', 'Software timers', 'Configuração (FreeRTOSConfig.h)'],
        },
        {
          id: 'sincronizacao',
          title: 'Sincronização',
          topics: ['Condição de corrida', 'Seção crítica', 'Mutex', 'Semáforos', 'Inversão de prioridade', 'Deadlock', 'ISR e RTOS'],
        },
        {
          id: 'zephyr',
          title: 'Zephyr e arquitetura de firmware',
          topics: ['Zephyr RTOS', 'Devicetree no Zephyr', 'Arquitetura em camadas', 'Event-driven e active objects', 'Logs e tracing'],
        },
      ],
    },
    {
      id: 'linux-embarcado',
      title: 'Linux Embarcado',
      summary: 'Quando o produto precisa de rede, tela, câmera e muito software: Linux em placas.',
      weeks: [
        {
          id: 'linux-base',
          title: 'Linux para embarcados',
          topics: ['Shell e ferramentas', 'Raspberry Pi', 'Cross-compilation', 'Processo de boot', 'U-Boot', 'Kernel e rootfs'],
        },
        {
          id: 'hardware-linux',
          title: 'Hardware no Linux',
          topics: ['Device tree', 'GPIO com libgpiod', 'I2C e SPI no Linux', 'SocketCAN', 'Serviços com systemd'],
        },
        {
          id: 'build-drivers',
          title: 'Imagens e drivers',
          topics: ['Buildroot', 'Yocto', 'Módulos do kernel', 'Drivers de caractere', 'Atualização de firmware (A/B)'],
        },
      ],
    },
    {
      id: 'conectividade',
      title: 'Conectividade e IoT',
      summary: 'Dispositivos que conversam sem fio, com a nuvem e com segurança.',
      weeks: [
        {
          id: 'sem-fio',
          title: 'Comunicação sem fio',
          topics: ['Wi-Fi', 'Bluetooth Low Energy', 'LoRa e LoRaWAN', 'Zigbee, Thread e Matter', 'Celular (NB-IoT e LTE-M)', 'Escolher a tecnologia'],
        },
        {
          id: 'protocolos-iot',
          title: 'Protocolos de IoT',
          topics: ['MQTT', 'CoAP', 'HTTP e REST em dispositivos', 'JSON vs formatos binários', 'Plataformas de nuvem IoT', 'Atualização OTA'],
        },
        {
          id: 'seguranca-dispositivos',
          title: 'Segurança de dispositivos',
          topics: ['Modelagem de ameaças', 'Secure boot', 'TLS em microcontroladores', 'Armazenamento de chaves', 'Proteção de debug', 'Firmware assinado'],
        },
      ],
    },
    {
      id: 'redes-campo',
      title: 'Redes Industriais e Automotivas',
      summary: 'Barramentos robustos usados em fábricas, máquinas e veículos.',
      weeks: [
        {
          id: 'rs485-modbus',
          title: 'RS-485 e Modbus',
          topics: ['RS-232 e RS-485', 'Modbus RTU', 'Modbus TCP', 'Mestre e escravo', 'CLPs e sensores industriais'],
        },
        {
          id: 'can',
          title: 'Rede CAN',
          topics: ['Por que CAN', 'Camada física (CANH e CANL)', 'Quadro CAN', 'Arbitragem', 'Bit timing', 'Erros e bus-off', 'CAN FD'],
        },
        {
          id: 'can-pratica',
          title: 'CAN na prática',
          topics: ['Arquivos DBC', 'Sinais e escalas', 'SocketCAN e can-utils', 'cantools em Python', 'MCP2515 e transceivers', 'CANopen e J1939'],
        },
        {
          id: 'automotivo',
          title: 'Visão do mundo automotivo',
          topics: ['ECUs e arquitetura do veículo', 'LIN e Automotive Ethernet', 'OBD-II e UDS', 'AUTOSAR', 'Software-defined vehicle'],
        },
        {
          id: 'ethernet-industrial',
          title: 'Ethernet industrial',
          topics: ['Por que Ethernet na indústria', 'EtherCAT', 'PROFINET', 'OPC UA', 'Time-Sensitive Networking'],
        },
      ],
    },
    {
      id: 'controle-confiabilidade',
      title: 'Controle, Hardware e Confiabilidade',
      summary: 'Controlar o mundo físico, projetar a placa e garantir que nada falhe quando importa.',
      weeks: [
        {
          id: 'controle',
          title: 'Controle e processamento de sinais',
          topics: ['Malha aberta e fechada', 'Controle PID', 'Motores DC, servo e passo', 'Encoders', 'Amostragem e Nyquist', 'Filtros digitais', 'Ponto fixo'],
        },
        {
          id: 'pcb',
          title: 'Projeto de hardware',
          topics: ['Do esquemático à placa', 'KiCad', 'Alimentação e desacoplamento', 'Layout e EMC', 'Fabricação e montagem', 'Bring-up da placa'],
        },
        {
          id: 'seguranca-funcional',
          title: 'Segurança funcional e normas',
          topics: ['O que é segurança funcional', 'IEC 61508', 'ISO 26262 (automotivo)', 'IEC 62304 (médico)', 'DO-178C (aviação)', 'FMEA e análise de riscos'],
        },
        {
          id: 'validacao',
          title: 'Testes e validação',
          topics: ['Modelo V', 'Testes unitários e de integração', 'MIL, SIL e HIL', 'Testes de bancada e ambientais', 'Rastreabilidade de requisitos'],
        },
        {
          id: 'areas',
          title: 'Edge AI e áreas de atuação',
          topics: ['TinyML', 'Robótica e ROS 2', 'IoT de consumo', 'Indústria 4.0', 'Automotivo e veículos elétricos', 'Médico e aeroespacial'],
        },
      ],
    },
  ],
  companiesTitle: 'Empresas que trabalham com sistemas embarcados',
  companies: [
    { name: 'Bosch', how: 'Sensores, ECUs automotivas e eletrônica industrial; centro de engenharia em Campinas.' },
    { name: 'WEG', how: 'Motores, inversores de frequência e automação industrial com firmware próprio.' },
    { name: 'Embraer', how: 'Aviônica e sistemas embarcados críticos em aeronaves.' },
    { name: 'Intelbras', how: 'Câmeras, controle de acesso, roteadores e dispositivos de casa inteligente.' },
    { name: 'Positivo Tecnologia', how: 'Hardware, dispositivos e soluções de IoT.' },
    { name: 'CESAR', how: 'Centro de inovação em Recife com projetos de hardware, firmware e IoT.' },
    { name: 'Instituto Eldorado', how: 'Centro de P&D em Campinas com projetos de hardware e firmware.' },
    { name: 'Stellantis', how: 'Fiat, Jeep, Peugeot e outras marcas; polo de engenharia em Betim (MG).' },
    { name: 'Siemens', how: 'Automação industrial, CLPs e redes industriais.' },
    { name: 'Espressif', how: 'Fabricante do ESP32, um dos microcontroladores mais usados em IoT.' },
    { name: 'STMicroelectronics', how: 'Fabricante da família STM32 de microcontroladores ARM.' },
    { name: 'NXP', how: 'Microcontroladores e processadores para automotivo, indústria e IoT.' },
  ],
  projects: [
    {
      id: 'blink-registradores',
      title: 'Pisca-pisca por registradores',
      level: 'Iniciante',
      description: 'Pisque o LED da placa STM32 escrevendo direto nos registradores, sem HAL. Depois faça o mesmo com timer e interrupção.',
      skills: ['C', 'GPIO', 'Datasheet e reference manual', 'Timers'],
    },
    {
      id: 'semaforo',
      title: 'Semáforo com botão de pedestre',
      level: 'Iniciante',
      description: 'Máquina de estados com LEDs, botão com debounce por interrupção e tempos controlados por timer.',
      skills: ['Máquina de estados', 'Interrupções', 'Debounce', 'Timers'],
    },
    {
      id: 'estacao-sensores',
      title: 'Estação de sensores I2C',
      level: 'Iniciante',
      description: 'Leia temperatura e umidade por I2C, mostre num display e envie pela UART. Confira os sinais no analisador lógico.',
      skills: ['I2C', 'UART', 'Drivers de sensor', 'Analisador lógico'],
    },
    {
      id: 'datalogger-rtos',
      title: 'Datalogger com FreeRTOS',
      level: 'Intermediário',
      description: 'Tarefas separadas para leitura de sensores, gravação em cartão SD e interface, comunicando por filas.',
      skills: ['FreeRTOS', 'Filas', 'SPI', 'Sistema de arquivos'],
    },
    {
      id: 'sensor-iot',
      title: 'Sensor IoT com bateria',
      level: 'Intermediário',
      description: 'ESP32 que acorda, mede, publica via MQTT com TLS e volta a dormir. Meça o consumo e estime a duração da bateria.',
      skills: ['ESP32', 'MQTT', 'TLS', 'Baixo consumo'],
    },
    {
      id: 'rede-can',
      title: 'Rede CAN com duas placas',
      level: 'Intermediário',
      description: 'Uma placa simula sensores e outra um painel, trocando mensagens CAN definidas num arquivo DBC. Base para automotivo e máquinas.',
      skills: ['CAN', 'DBC', 'SocketCAN', 'Tratamento de erros'],
    },
    {
      id: 'modbus',
      title: 'Escravo Modbus RTU',
      level: 'Intermediário',
      description: 'Microcontrolador que expõe sensores e saídas como registradores Modbus num barramento RS-485, testado com um mestre no PC.',
      skills: ['RS-485', 'Modbus', 'UART', 'CRC'],
    },
    {
      id: 'motor-pid',
      title: 'Controle de velocidade de motor com PID',
      level: 'Avançado',
      description: 'Motor DC com encoder, ponte H e PID em tempo real, com ajuste de ganhos e gráfico da resposta.',
      skills: ['PID', 'PWM', 'Encoder', 'Tempo real'],
    },
    {
      id: 'bootloader-ota',
      title: 'Bootloader com atualização segura',
      level: 'Avançado',
      description: 'Bootloader próprio que recebe firmware por UART ou rede, verifica a assinatura e volta à versão anterior se a nova falhar.',
      skills: ['Bootloader', 'Secure boot', 'Linker script', 'Partições A/B'],
    },
    {
      id: 'carro-robo',
      title: 'Robô com Linux embarcado',
      level: 'Avançado',
      description: 'Raspberry Pi com câmera para decisão e um microcontrolador para motores e sensores, conversando por UART ou CAN.',
      skills: ['Linux embarcado', 'Arquitetura distribuída', 'ROS 2', 'Visão computacional'],
    },
  ],
}
