# Controle, Hardware e Confiabilidade: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 29 a 33

## Comece por aqui

Esta etapa fecha o roadmap com o que transforma um protótipo em produto: **controlar** o mundo físico com precisão (motores, temperatura, posição), **projetar a própria placa**, garantir que o sistema **não cause danos quando falhar** (segurança funcional) e **provar** que ele funciona (testes e validação). No final, um mapa das áreas de atuação para você escolher onde aprofundar: IoT, indústria, automotivo, médico, aeroespacial, robótica e IA embarcada.

### Por que isso vale ouro no mercado

- Controle de motores e PID aparece em robótica, drones, automação, eletrodomésticos e veículos elétricos.
- Saber projetar uma placa simples dá autonomia total para os seus projetos e conversa melhor com o time de hardware.
- Normas de segurança funcional (ISO 26262, IEC 61508, IEC 62304, DO-178C) abrem as portas dos setores mais exigentes e mais bem pagos.

### Como esta apostila funciona

1. Para controle, um motor DC com encoder, uma ponte H (ex.: TB6612FNG ou DRV8833) e a sua placa STM32.
2. Para hardware, o **KiCad** (gratuito) e um fabricante de placas online.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** controle instável? Antes de mexer nos ganhos, confira se a malha roda em **período fixo**, se o sinal do sensor está certo (sentido e escala) e se o atuador responde no sentido esperado. Metade das "instabilidades" é sinal invertido.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 29 | Tema 1: Controle e processamento de sinais |
| 30 | Tema 2: Projeto de hardware |
| 31 | Tema 3: Segurança funcional e normas |
| 32 | Tema 4: Testes e validação |
| 33 | Tema 5: Edge AI e áreas de atuação + projeto final |

## Tema 1: Controle e processamento de sinais

**Objetivo:** controlar grandezas físicas e tratar sinais de sensores.

### 1.1 Malha aberta e fechada

- **Malha aberta:** aplica um comando sem conferir o resultado ("PWM em 60%" e torce para o motor ir a 1000 rpm). Simples, mas não corrige carga, bateria fraca ou desgaste.
- **Malha fechada:** mede o resultado (sensor), compara com o desejado (**setpoint**) e corrige continuamente o comando. O **erro** = setpoint − medida.

> **Analogia:** dirigir de olhos fechados (malha aberta) vs olhar a estrada e corrigir o volante o tempo todo (malha fechada).

### 1.2 Controle PID

O controlador mais usado no mundo. O comando é a soma de três termos:

| Termo | Reage a | Efeito |
|---|---|---|
| **P** (proporcional) | Erro atual | Responde rápido; sozinho costuma deixar um erro residual |
| **I** (integral) | Erro acumulado | Elimina o erro residual; em excesso, causa oscilação e *windup* |
| **D** (derivativo) | Velocidade de variação do erro | Amortece, reduz o sobressinal; sensível a ruído |

Versão discreta, rodando em **período fixo** `dt`:

```c
typedef struct {
    float kp, ki, kd;
    float integral, medida_anterior;
    float saida_min, saida_max;
} Pid;

float pid_calcular(Pid *c, float setpoint, float medida, float dt) {
    float erro = setpoint - medida;

    float derivada = -(medida - c->medida_anterior) / dt;   // derivada da MEDIDA: evita "chute" ao mudar o setpoint
    c->medida_anterior = medida;

    float saida = c->kp * erro + c->integral + c->kd * derivada;

    // anti-windup: só acumula a integral se a saída não estiver saturada (ou se ajudar a sair da saturação)
    if ((saida < c->saida_max || erro < 0.0f) && (saida > c->saida_min || erro > 0.0f)) {
        c->integral += c->ki * erro * dt;
    }

    if (saida > c->saida_max) saida = c->saida_max;
    if (saida < c->saida_min) saida = c->saida_min;
    return saida;
}
```

Ajuste prático (sintonia): comece só com P até responder rápido com leve oscilação; reduza um pouco; adicione I até eliminar o erro residual; adicione D se houver sobressinal. Métodos como Ziegler-Nichols dão um ponto de partida. **Sempre** registre os dados (setpoint, medida, saída) e veja em gráfico.

> **Cuidado! Cai na entrevista:** "O que é integral windup?" Quando o atuador satura (PWM em 100%) e o erro continua, a integral cresce sem parar; quando o sistema enfim alcança o setpoint, a integral enorme causa um grande sobressinal. Solução: limitar ou parar a integração durante a saturação (anti-windup).

### 1.3 Motores DC, servo e passo

| Motor | Como controlar | Uso |
|---|---|---|
| **DC escovado** | PWM numa **ponte H** (permite inverter o sentido) | Robôs, ventiladores, brinquedos |
| **Servo de modelismo** | Pulso de 1 a 2 ms a cada 20 ms (posição) | Braços simples, direção de carrinho |
| **Passo (stepper)** | Driver dedicado (pulsos de passo e direção) | Impressoras 3D, CNC; posição sem sensor |
| **BLDC / PMSM** | Inversor trifásico com comutação ou controle vetorial (FOC) | Drones, veículos elétricos, eletrodomésticos eficientes |

Nunca ligue motor direto no pino do microcontrolador. Ponte H, diodo de proteção (muitos drivers já têm), fonte separada para o motor e GND comum.

### 1.4 Encoders

Sensores que medem rotação. O **encoder incremental de quadratura** gera dois sinais (A e B) defasados 90°: pela ordem das bordas, sabe-se o **sentido**; contando as bordas, a **posição**. Contando as 4 bordas de cada ciclo, a resolução é 4 × PPR (pulsos por revolução).

Timers de STM32 têm **modo encoder**: contam sozinhos em hardware.

```c
// velocidade a cada 10 ms
int16_t atual = (int16_t)TIM3->CNT;
int16_t delta = (int16_t)(atual - anterior);   // funciona mesmo quando o contador dá a volta
anterior = atual;
float rpm = (delta / (4.0f * PPR)) / 0.010f * 60.0f;
```

### 1.5 Amostragem e Nyquist

Para representar um sinal sem perda, a frequência de amostragem precisa ser **maior que o dobro** da maior frequência do sinal (teorema de **Nyquist**). Na prática, use de 5 a 10 vezes.

Amostrar devagar demais causa **aliasing**: frequências altas "aparecem" como frequências baixas falsas (como a roda de carro que parece girar ao contrário no vídeo). Prevenção: **filtro analógico anti-aliasing** antes do ADC (um RC simples já ajuda) e frequência de amostragem adequada.

### 1.6 Filtros digitais

- **Média móvel:** média das últimas N amostras. Simples, reduz ruído, atrasa a resposta.
- **Filtro passa-baixa de primeira ordem (IIR):** uma linha, quase sem memória:

```c
// alfa entre 0 e 1: menor = mais suave e mais lento
filtrado = filtrado + alfa * (amostra - filtrado);
```

Com período de amostragem `dt` e constante de tempo desejada `RC`: `alfa = dt / (RC + dt)`.

- **FIR:** soma ponderada das últimas amostras (coeficientes calculados por ferramentas); fase linear, mais processamento.
- **Mediana:** remove picos isolados (ruído impulsivo).

### 1.7 Ponto fixo

Muitos microcontroladores não têm unidade de ponto flutuante (ou ela é lenta para certas contas). **Ponto fixo** representa frações com inteiros, com uma escala implícita:

- **Q15:** valores de −1 a quase 1 num `int16_t`; o valor real = inteiro / 32768. Exemplo: 0,5 = **16384**.
- **Q16.16:** 16 bits inteiros e 16 fracionários num `int32_t`.
- Multiplicação: `(int32_t)a * b >> 15` (em Q15), cuidando de estouro e arredondamento.

Também é comum trabalhar em **unidades inteiras** (milivolts, décimos de grau, centésimos de rpm) e evitar frações.

### Atividades de fixação do Tema 1

1. Com Kp = 2, Ki = 0,5 e Kd = 0,1, erro atual de 10, integral acumulada (já multiplicada por Ki) de 20 e derivada de −5: qual a saída do PID?
2. Um encoder de 600 PPR em quadratura conta 480 bordas em 10 ms. Qual a velocidade em rpm?
3. Um sensor de vibração tem componentes de até 3 kHz. Qual a frequência mínima de amostragem teórica? E uma escolha prática?
4. Calcule `alfa` para um filtro passa-baixa com amostragem a cada 10 ms e constante de tempo de 90 ms.
5. Represente 0,25 e −0,75 em Q15. Qual o resultado em Q15 de 0,5 × 0,5?

## Tema 2: Projeto de hardware

**Objetivo:** desenhar e fabricar uma placa simples com microcontrolador.

### 2.1 Do esquemático à placa

1. **Esquemático:** os componentes e as ligações (o "o quê").
2. **ERC** (Electrical Rules Check): pinos sem ligação, saídas em curto, alimentação sem fonte.
3. **Footprints:** o desenho físico de cada componente na placa (encapsulamento).
4. **Layout:** posicionar componentes e desenhar as trilhas (o "onde").
5. **DRC** (Design Rules Check): distâncias e larguras dentro das capacidades do fabricante.
6. **Gerbers e lista de materiais (BOM):** arquivos para fabricar e montar.
7. **Fabricação e montagem:** fabricantes online produzem lotes pequenos de placas a preços baixos e podem montar os componentes SMD.

### 2.2 KiCad

Ferramenta gratuita e de código aberto, usada profissionalmente. Comece pelos tutoriais oficiais ("Getting Started in KiCad") e por placas simples: um LED com regulador, depois um módulo com microcontrolador. Use bibliotecas de componentes conferidas e **confira cada footprint com o datasheet** (um pino espelhado inutiliza a placa).

### 2.3 Alimentação e desacoplamento

- Escolha o regulador pela diferença de tensão e corrente (linear ou buck, revise a etapa de Eletrônica).
- **Capacitores de desacoplamento** de 100 nF em **cada** pino de alimentação, o mais perto possível, mais um capacitor maior (µF) por chip ou região.
- Proteções na entrada: diodo ou MOSFET contra inversão de polaridade, fusível ou PTC, TVS contra surtos (essencial em ambientes industriais e automotivos, onde a alimentação tem picos).
- Pontos de teste nas tensões principais.

### 2.4 Layout e EMC

**EMC** (compatibilidade eletromagnética): a placa não pode gerar interferência demais nem ser sensível demais a ela. Regras práticas:

- **Plano de GND** contínuo numa camada inteira (placas de 4 camadas facilitam muito).
- Laços de corrente **curtos**: o caminho de ida e de volta (GND) próximos.
- Capacitores de desacoplamento entre o pino e a via de GND, sem trilhas longas.
- Cristal o mais perto possível do microcontrolador, sem trilhas passando por baixo.
- **Pares diferenciais** (USB, CAN, Ethernet) com trilhas paralelas, mesmo comprimento e impedância controlada quando necessário.
- Separe a parte de potência (motores, chaveados) da parte sensível (ADC, sensores).
- Conector de programação (SWD) e UART de debug acessíveis.

### 2.5 Fabricação e montagem

Informe ao fabricante: número de camadas, espessura, acabamento, cor. Para montagem: arquivo de posição (pick and place) e BOM com códigos de peças disponíveis. Peça componentes com sobra; confira prazos e disponibilidade (crises de fornecimento de chips acontecem).

### 2.6 Bring-up da placa

Primeira vez ligando uma placa nova, com calma e método:

1. **Inspeção visual** (lupa): soldas, componentes invertidos, curtos.
2. Com tudo **desligado**, meça a resistência entre cada alimentação e o GND (valores muito baixos indicam curto).
3. Ligue numa **fonte com limite de corrente baixo** e observe o consumo.
4. Meça cada tensão de alimentação.
5. Conecte o **depurador** e veja se o microcontrolador é reconhecido.
6. Firmware de teste: pisca LED, depois cada periférico, um por vez.
7. Anote cada problema e a correção (vira a revisão B da placa).

### Atividades de fixação do Tema 2

1. Liste as etapas, do esquemático à placa montada, e o que é verificado em cada uma.
2. Desenhe no KiCad o esquemático de uma placa com: entrada de 12 V com proteção, regulador de 3,3 V, um STM32 (ou módulo ESP32), cristal, conector SWD, LED e botão.
3. Por que o plano de GND contínuo é tão importante para EMC?
4. Sua placa nova não é reconhecida pelo depurador. Liste 6 verificações, em ordem.
5. Quais proteções você colocaria na entrada de alimentação de uma placa que vai num carro (12 V nominal, com picos)?

## Tema 3: Segurança funcional e normas

**Objetivo:** entender como sistemas críticos são projetados para falhar com segurança.

### 3.1 O que é segurança funcional

**Segurança funcional** é a parte da segurança que depende de o sistema **funcionar corretamente**, inclusive quando algo falha: detectar a falha e levar o sistema a um **estado seguro**. Exemplo: se o sensor de pedal do acelerador der leitura incoerente, o carro reduz a potência em vez de acelerar sozinho.

Não confunda com **cibersegurança** (proteção contra ataques), embora as duas andem juntas.

### 3.2 IEC 61508

Norma "mãe" de segurança funcional para sistemas elétricos, eletrônicos e programáveis. Define níveis de integridade de segurança (**SIL 1 a 4**, sendo 4 o mais exigente) e o ciclo de vida de segurança (análise de riscos, requisitos, projeto, verificação, operação). Várias normas setoriais derivam dela:

| Setor | Norma | Níveis |
|---|---|---|
| Geral / industrial | IEC 61508 | SIL 1 a 4 |
| Automotivo | **ISO 26262** | ASIL A a D (e QM) |
| Dispositivos médicos (software) | **IEC 62304** | Classes A, B, C |
| Aviação (software) | **DO-178C** | DAL A a E |
| Ferroviário | EN 50128 / EN 50716 | SIL 0 a 4 |
| Processos industriais | IEC 61511 | SIL 1 a 4 |
| Máquinas | ISO 13849, IEC 62061 | PL a até e / SIL |

### 3.3 ISO 26262 (automotivo)

A análise começa pela **HARA** (análise de perigos e avaliação de riscos): para cada situação de perigo, avalia-se:

- **Severidade (S0 a S3):** quão graves seriam os ferimentos.
- **Exposição (E0 a E4):** com que frequência o veículo está nessa situação.
- **Controlabilidade (C0 a C3):** se o motorista consegue evitar o dano.

A combinação define o **ASIL** (A, o menos exigente, a D, o mais exigente; ou **QM**, sem requisito especial de segurança). Do ASIL saem **safety goals** (ex.: "evitar aceleração não intencional") e os requisitos de processo, arquitetura, verificação e independência. Exemplo: airbag e freio costumam ter ASIL D; um painel de som, QM.

### 3.4 IEC 62304 (médico) e DO-178C (aviação)

- **IEC 62304:** ciclo de vida do software de dispositivos médicos. A **classe** (A: não pode causar lesão; B: lesão não grave; C: morte ou lesão grave) define o rigor de documentação, arquitetura e testes. Anda junto com a gestão de riscos (ISO 14971). No Brasil, dispositivos médicos são regulados pela **Anvisa**.
- **DO-178C:** software aeronáutico. O **DAL** (A: falha catastrófica a E: sem efeito) define objetivos de verificação; no nível A, exige até cobertura estrutural MC/DC dos testes e forte rastreabilidade.

### 3.5 FMEA e análise de riscos

- **FMEA** (análise de modos de falha e efeitos): de baixo para cima. Para cada componente ou função: como pode falhar, qual o efeito, qual a causa, como é detectado. Classifica pela severidade, ocorrência e detecção para priorizar ações.
- **FTA** (árvore de falhas): de cima para baixo. Parte do evento indesejado ("aceleração não intencional") e decompõe nas combinações de falhas que o causam (portas E/OU).

### 3.6 Mecanismos de segurança

Técnicas usadas no firmware e no hardware:

- **Watchdog** (de preferência externo ou com janela, que também detecta o firmware rodando **rápido demais**).
- **Verificação de plausibilidade:** dois sensores redundantes que precisam concordar; valores dentro de faixas físicas possíveis; taxas de variação possíveis.
- **CRC e contadores** em mensagens (detecta corrupção, repetição e perda) e em dados guardados em memória.
- **Testes automáticos** de RAM, flash (CRC do programa), clock e ADC no boot e periodicamente.
- **Redundância** e diversidade (dois canais, dois algoritmos); núcleos em **lockstep** (dois processadores executando o mesmo e comparando).
- **MPU** para isolar partes críticas do resto do firmware.
- **Estado seguro** bem definido e testado (desligar o motor, abrir o relé, manter a última posição segura).

> **Cuidado! Cai na entrevista:** "Como você garantiria que um sensor com defeito não cause um acidente?" Redundância (dois sensores), verificação de plausibilidade (concordância, faixa, taxa de variação), detecção de fios rompidos ou em curto (faixas inválidas, como 0 mA em 4 a 20 mA), tempo máximo para detectar a falha e reação levando ao estado seguro, tudo coberto por testes de injeção de falhas.

### Atividades de fixação do Tema 3

1. Explique a diferença entre segurança funcional e cibersegurança, com um exemplo de cada num mesmo produto.
2. Faça uma HARA simplificada para "direção elétrica aplica torque sem o motorista pedir, a 100 km/h na estrada". Estime S, E e C e o ASIL provável.
3. Monte uma FMEA de 4 linhas para um sensor de temperatura que controla um aquecedor.
4. Um equipamento médico de infusão tem software que calcula a dose. Em qual classe da IEC 62304 ele provavelmente se enquadra? Por quê?
5. Proponha 5 mecanismos de segurança para o controle de um motor de portão automático.

## Tema 4: Testes e validação

**Objetivo:** provar, com evidências, que o sistema faz o que deve.

### 4.1 Modelo V

```
Requisitos do sistema ───────────────────── Testes de sistema / aceitação
   Arquitetura ──────────────────────── Testes de integração
      Projeto detalhado ─────────── Testes unitários
                   Implementação (código)
```

Cada nível do lado esquerdo (definição) tem um nível de teste correspondente do lado direito (verificação). Muito usado em setores regulados; times ágeis aplicam a mesma ideia em ciclos curtos.

### 4.2 Testes unitários e de integração

- **Unitários:** lógica isolada, rodando no PC (Unity, CppUTest, GoogleTest), revise a etapa de C.
- **Integração:** módulos juntos, no alvo (a placa) ou num simulador.
- **Cobertura** de código mostra o que os testes exercitaram (comandos, decisões; em aviação nível A, MC/DC).
- **Análise estática** (MISRA, cppcheck, ferramentas comerciais) e revisão de código completam.

### 4.3 MIL, SIL e HIL

| Sigla | O que roda | Para quê |
|---|---|---|
| **MIL** (model-in-the-loop) | O modelo do controle (ex.: Simulink) com o modelo da planta | Validar o algoritmo cedo |
| **SIL** (software-in-the-loop) | O código real compilado para o PC, com a planta simulada | Testar o código sem hardware |
| **PIL** (processor-in-the-loop) | O código no processador real, planta simulada | Verificar tempos e efeitos do processador |
| **HIL** (hardware-in-the-loop) | A ECU/placa real ligada a um simulador em tempo real que imita sensores, atuadores e rede | Testar o produto completo, inclusive falhas perigosas, com segurança |

No HIL, dá para simular uma batida, um sensor rompido ou uma bateria a −30 °C sem arriscar nada, repetir milhares de vezes e automatizar.

### 4.4 Testes de bancada e ambientais

- **Bancada:** fontes variando a tensão (subtensão, sobretensão, quedas rápidas como na partida de um carro), cargas reais, instrumentos.
- **Ambientais:** temperatura (câmara térmica), umidade, vibração, choque mecânico.
- **EMC:** emissões (a placa não pode interferir em outros equipamentos) e imunidade (ESD, surtos, campos de rádio), exigidos para certificação (no Brasil, Anatel para equipamentos de radiofrequência e outros, conforme o produto).
- **Durabilidade:** horas de funcionamento contínuo, ciclos liga/desliga.

### 4.5 Rastreabilidade de requisitos

Cada **requisito** liga ao **projeto** que o atende, ao **código** que o implementa e aos **testes** que o verificam (e ao resultado). Assim, se um requisito muda, você sabe o que retestar; e se um teste falha, sabe qual requisito está em risco. Em setores regulados, é obrigatório e auditado. No setor automotivo, o **Automotive SPICE** (ASPICE) avalia a maturidade desses processos nos fornecedores.

### 4.6 Model-based design

Em controle, especialmente automotivo e aeroespacial, é comum projetar o algoritmo como **modelo** (MATLAB/Simulink, ou alternativas como Scilab/Xcos e Python), simular com o modelo da planta e **gerar o código C** automaticamente. Ganha-se validação antecipada e consistência entre o que foi simulado e o que roda.

### Atividades de fixação do Tema 4

1. Para cada nível do modelo V, dê um exemplo de teste para um controle de temperatura de forno.
2. Qual a diferença entre SIL e HIL? Dê um caso em que só o HIL encontraria o problema.
3. Liste 5 testes de bancada para uma placa que será instalada num caminhão.
4. Monte uma matriz de rastreabilidade com 3 requisitos do seu projeto de motor com PID, ligando a testes.
5. Por que é perigoso testar falhas de sensores do freio diretamente num veículo, e como o HIL resolve isso?

## Tema 5: Edge AI e áreas de atuação

**Objetivo:** conhecer as fronteiras da área e escolher onde aprofundar.

### 5.1 TinyML

**TinyML** é rodar modelos de aprendizado de máquina em microcontroladores, com miliwatts e poucos KB de RAM. Exemplos: detectar uma palavra de ativação ("Ok, ..."), reconhecer gestos com acelerômetro, detectar anomalias de vibração num motor (manutenção preditiva), classificar sons.

Fluxo:

1. Coletar dados do sensor real.
2. Treinar um modelo pequeno no PC (TensorFlow/Keras, PyTorch) ou numa plataforma como o **Edge Impulse**.
3. **Quantizar** (pesos em inteiros de 8 bits em vez de float: cerca de 4 vezes menor e mais rápido).
4. Gerar o código para o microcontrolador (**LiteRT for Microcontrollers**, antigo TensorFlow Lite Micro, ou ferramentas dos fabricantes como o STM32Cube.AI).
5. Medir precisão, tempo de inferência, RAM e consumo **no dispositivo**.

Chips com aceleradores de redes neurais (NPU) e núcleos com extensões vetoriais (Cortex-M55 com Helium) ampliam o que é possível.

### 5.2 Robótica e ROS 2

O **ROS 2** é o padrão aberto de software para robôs (comunicação por tópicos, ferramentas de visualização e simulação, bibliotecas de navegação e manipulação). Normalmente roda em Linux embarcado, enquanto microcontroladores cuidam de motores e sensores em tempo real, integrados pelo **micro-ROS**. Combina tudo deste roadmap: controle, RTOS, Linux, redes (CAN, EtherCAT) e segurança.

### 5.3 IoT de consumo

Casa inteligente, vestíveis, eletrodomésticos conectados. Foco em: **custo** (cada centavo conta em milhões de unidades), **consumo**, **experiência do usuário** (configuração fácil, app), conectividade (Wi-Fi, BLE, Matter) e segurança.

### 5.4 Indústria 4.0

Sensores, gateways, CLPs, inversores e robôs conectados. Foco em: **robustez** (temperatura, ruído, 24 V), **longa vida útil** (10 a 20 anos), redes de campo (Modbus, CAN, EtherCAT, PROFINET), **OPC UA**, manutenção preditiva e segurança funcional de máquinas.

### 5.5 Automotivo e veículos elétricos

ECUs, redes CAN/Ethernet, AUTOSAR, diagnóstico, ISO 26262, cibersegurança (ISO/SAE 21434) e atualização OTA. Nos **veículos elétricos**:

- **BMS** (sistema de gerenciamento da bateria): mede tensão de cada célula e temperatura, estima carga (SoC) e saúde (SoH), equilibra as células e protege contra sobrecarga e superaquecimento.
- **Inversor e controle do motor** (controle vetorial, FOC), com eletrônica de potência (IGBT, SiC).
- **Carregamento:** comunicação com o carregador e a rede elétrica (padrões como IEC 61851 e ISO 15118).
- **ADAS:** câmeras, radares e lidars com **fusão de sensores** para frenagem automática, manutenção em faixa e, no limite, condução autônoma.

> **Atenção:** baterias de tração e inversores trabalham com centenas de volts em corrente contínua, perigosos e potencialmente letais. Trabalhar nisso exige treinamento e procedimentos específicos de alta tensão. Nos seus projetos, simule ou use baterias pequenas de baixa tensão.

### 5.6 Médico e aeroespacial

- **Médico:** monitores, bombas de infusão, marca-passos, equipamentos de diagnóstico. IEC 62304, ISO 14971, Anvisa. Rastreabilidade e documentação são tão importantes quanto o código.
- **Aeroespacial e defesa:** aviônica, satélites (incluindo nanossatélites CubeSat, com muitos projetos universitários no Brasil), drones. DO-178C, DO-254 (hardware), tolerância a radiação, redundância.

### Atividades de fixação do Tema 5

1. Treine (com Edge Impulse ou TensorFlow) um modelo que reconheça 3 gestos com um acelerômetro e rode no microcontrolador. Meça o tempo de inferência e a RAM usada.
2. Por que quantizar um modelo para 8 bits é importante em microcontroladores? Qual o custo?
3. Compare os requisitos de um sensor de umidade para casa inteligente e um sensor de pressão para uma linha de produção industrial.
4. Quais são as funções principais de um BMS?
5. Escolha uma área (ou duas) para se especializar e escreva um plano de 6 meses: o que estudar, qual projeto construir e quais empresas procurar.

## Projeto da etapa: projeto final do roadmap

Escolha **um** projeto que combine várias etapas e documente como um produto:

- **Opção A, robótica/controle:** robô diferencial com dois motores com encoder e PID de velocidade (microcontrolador com FreeRTOS), comunicação por CAN ou UART com uma Raspberry Pi que decide a rota (opcional: ROS 2 e micro-ROS).
- **Opção B, industrial:** controlador de temperatura com PID, sensor redundante com verificação de plausibilidade, estado seguro, Modbus RTU para supervisão e gateway Linux publicando por MQTT.
- **Opção C, automotivo:** mini ECU com rede CAN (DBC próprio), respostas a serviços UDS básicos (ler versão, ler e apagar DTCs), bootloader com atualização pela rede e verificação de assinatura, testada contra uma simulação em Python (SIL).
- **Opção D, IoT com IA:** sensor a bateria que detecta anomalia de vibração com TinyML e envia alertas por MQTT com TLS, com OTA.

Em todos: placa própria desenhada no KiCad (ou uma placa de interface simples), requisitos escritos, testes unitários no PC e testes na bancada, rastreabilidade simples requisito → teste, análise de riscos (FMEA curta) e README completo com arquitetura, decisões e resultados medidos. **Esse é o projeto do seu portfólio.**

## Resumão

- Malha fechada corrige; PID: P reage, I elimina erro residual, D amortece. Período fixo e anti-windup.
- Motores sempre com driver; encoders em modo de hardware do timer.
- Nyquist: amostre a mais que o dobro (na prática, 5 a 10 vezes); filtro anti-aliasing.
- Filtros digitais simples resolvem muito; ponto fixo quando não há FPU.
- Placa: esquemático, ERC, footprints, layout, DRC, gerbers. Desacoplamento, plano de GND, laços curtos. Bring-up com método.
- Segurança funcional: detectar falhas e ir ao estado seguro. IEC 61508 e derivadas (ISO 26262, IEC 62304, DO-178C). HARA, FMEA, FTA.
- Validação: modelo V, MIL/SIL/HIL, testes ambientais e de EMC, rastreabilidade.
- Escolha sua área: IoT, indústria, automotivo/elétricos, médico, aeroespacial, robótica, Edge AI.
