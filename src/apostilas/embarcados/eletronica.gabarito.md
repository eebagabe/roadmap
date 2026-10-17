# Gabarito: Fundamentos de Eletrônica

Abra só depois de tentar.

## Tema 1

1. R = (5 − 2) / 0,010 = **300 Ω**. Valor comercial próximo e seguro: **330 Ω** (o próximo acima, para não passar da corrente). Com 330 Ω: I = 3 / 330 ≈ **9,1 mA**; potência no resistor P = 3 × 0,0091 ≈ **27 mW** (um resistor de 1/4 W sobra).
2. (a) 1.000 + 2.200 = **3,2 kΩ**; (b) **500 Ω**; (c) 330 + 500 = **830 Ω**.
3. Precisamos de Vout/Vin = 3,3/5 = 0,66. Com R2 = 20 kΩ e R1 = 10 kΩ: 5 × 20/30 = **3,33 V** (um pouco acima de 3,3 V; aceitável para muitos ADCs, mas confira o máximo do pino). Com R1 = 10 kΩ e R2 = 18 kΩ: 5 × 18/28 ≈ **3,21 V**, com margem. Valores na faixa de dezenas de kΩ consomem pouca corrente e ainda alimentam bem a entrada do ADC.
4. I = 12/100 = 0,12 A; P = 12 × 0,12 = **1,44 W**, quase 6 vezes o limite de 0,25 W. O resistor esquenta muito, pode escurecer, cheirar a queimado e abrir (queimar).
5. No modo de corrente, o multímetro tem resistência interna quase zero. Ligado em paralelo com a fonte, ele vira um **curto-circuito**: corrente enorme, que queima o fusível do multímetro (ou o próprio aparelho) e pode danificar a fonte ou a bateria.

## Tema 2

1. Os chips consomem corrente em pulsos muito rápidos (a cada borda do clock). As trilhas até a fonte têm indutância e não entregam esses picos a tempo; o capacitor, perto do pino, fornece a energia local e filtra o ruído. Sem ele: quedas de tensão momentâneas, resets aleatórios, leituras de ADC ruidosas, comunicação com erros e problemas de compatibilidade eletromagnética.
2. ```
   +5 V ──┬──────────────┐
          │              │
       [bobina]     diodo (catodo no +5 V,
          │          anodo no coletor)
          ├──────────────┘
          C
   pino ─[1 kΩ]─B  NPN (ou MOSFET N logic-level, com 100 kΩ gate-GND)
          E
          │
   GND da placa = GND da fonte de 5 V (comum)
   ```
   Opcional: resistor de 10 kΩ da base ao GND para garantir o relé desligado durante o boot. Muitos módulos de relé prontos já trazem tudo isso.
3. Com 0,05 Ω: P = 4² × 0,05 = **0,8 W**, aceitável com um pouco de cobre na placa. Com 2 Ω: P = 16 × 2 = **32 W**: o MOSFET queima em segundos. Por isso, com 3,3 V, use MOSFET logic-level e confira o Rds(on) **na tensão de gate que você terá**.
4. 9 V para 5 V a 50 mA: P = 4 × 0,05 = **0,2 W**: um **linear** (LDO) resolve, simples e sem ruído. 24 V para 5 V a 1 A: P = 19 × 1 = **19 W** num linear, inviável: **chaveado (buck)**.
5. τ = 47.000 × 0,00001 = **0,47 s**.

## Tema 3

1. 0x3C = 3 × 16 + 12 = **60** = **0011 1100**. 200 = 12 × 16 + 8 = **0xC8**. 0b1111 0000 = **0xF0**.
2. 2⁸ = **256**; 2¹² = **4.096**; 2¹⁶ = **65.536**.
3. Solto: o pull-up mantém o pino em VCC: lê **1**. Apertado: o botão liga o pino ao GND: lê **0**. (Lógica "invertida", muito comum.)
4. As saídas do I2C são open-drain: só puxam para 0. Sem pull-up, as linhas nunca sobem para 1 (ou sobem devagar demais, se depender só de fugas): a comunicação não funciona ou fica instável. Muitos módulos já trazem os pull-ups na placa; com vários módulos, os resistores ficam em paralelo e o valor efetivo cai, o que também precisa ser observado.
5. Os pinos do ESP32 **não** são 5 V tolerant. Opções: divisor de tensão (ex.: 10 kΩ e 20 kΩ) para sinais lentos; módulo conversor de nível (level shifter); ou alimentar o sensor em 3,3 V, se o datasheet permitir.

## Tema 4

1. Resposta pessoal. Na Nucleo-F446RE, por exemplo, o LED do usuário (LD2) fica no pino **PA5** e o botão do usuário (B1) no **PC13**. Confira os resistores no esquemático da sua placa.
2. Resposta pessoal (para STM32F4, a tensão máxima absoluta de VDD é da ordem de 4 V, e as correntes por pino e total ficam na casa de dezenas e centenas de mA; leia os valores exatos no datasheet do seu modelo). Importam porque acionar um LED forte ou um relé direto num pino, ou muitos pinos ao mesmo tempo, pode ultrapassar o limite e danificar o chip, às vezes de forma silenciosa (o pino "morre" e o resto continua funcionando).
3. Há um **curto-circuito** ou um consumo muito acima do esperado: componente invertido (eletrolítico, regulador, diodo), solda unindo trilhas, fio no lugar errado. Desligue, confira as ligações, meça a continuidade entre VCC e GND com tudo desligado e procure o ponto do curto (o componente culpado costuma esquentar).
4. Prática. No osciloscópio, use as medições automáticas de frequência e duty cycle; no PulseView, selecione um período do sinal para ver tempo e frequência.
5. O **osciloscópio** mostra a forma real da tensão (analógica), com precisão de amplitude, mas em poucos canais: use para ver ruído, sobressinal, rampas, PWM em um motor, fonte oscilando. O **analisador lógico** mostra só 0 e 1, mas em muitos canais e por muito tempo, e decodifica protocolos: use para ver se o I2C está mandando o endereço certo ou se a UART está na velocidade correta.

## Projeto da etapa

O que um avaliador olharia:

- Cálculos dos resistores documentados e conferidos com medições.
- MOSFET adequado para 3,3 V, com pull-down no gate e diodo de roda livre na carga indutiva.
- GND comum entre as fontes.
- Esquemático legível, com valores dos componentes.
