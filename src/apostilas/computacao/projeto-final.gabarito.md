# Gabarito: Projeto Final

Abra só depois de tentar. Como cada projeto é único, este gabarito traz exemplos de respostas bem feitas e listas de verificação para você conferir os seus entregáveis.

## Tema 1

1. Exemplo de pergunta em uma frase, bem formulada: "Uma heurística de busca local com restrições de janela de tempo reduz em pelo menos 15% a distância total das rotas de coleta seletiva de um bairro de Belo Horizonte em relação às rotas atuais, sem aumentar o número de caminhões?" Ela diz **o que** se faz, **onde**, **comparado a quê** e **como** se mede. Exemplo de pergunta ruim: "Usar IA para melhorar a coleta de lixo" (sem objeto, sem medida, sem comparação).
2. Exemplo para "previsão de demanda de energia":
   - **Mínimo:** comparar uma linha de base ingênua com um modelo de *gradient boosting* nos dados públicos do ONS de uma região, com validação temporal correta e análise de erros.
   - **Planejado:** três modelos (incluindo uma rede neural), variáveis climáticas do INMET, análise de feriados e eventos extremos.
   - **Ambicioso:** previsão probabilística (intervalos) e um painel interativo de acompanhamento.
   O mínimo precisa ser, sozinho, um trabalho aceitável: é a garantia contra imprevistos.
3. Uma boa síntese tem parágrafos por **abordagem** ("métodos estatísticos clássicos, como ARIMA, ...; métodos de aprendizado de máquina, ...; trabalhos com dados brasileiros, ...") e termina com a **lacuna** ("nenhum dos trabalhos encontrados avalia X em Y" ou "os resultados de Z não foram reproduzidos com dados reais"). Sinal de alerta: uma lista de resumos sem conexão entre eles e sem chegar a uma lacuna.
4. Exemplo: o maior risco é "os dados de rotas atuais não estão disponíveis". Experimento de 2 dias: pedir os dados ao órgão responsável (ou via Lei de Acesso à Informação) e, em paralelo, montar um conjunto alternativo a partir do OpenStreetMap e de dados públicos de pontos de coleta. Se em 2 dias não houver nenhuma fonte viável, troque o recorte antes de investir mais tempo.
5. Lista de verificação da proposta:
   - [ ] Problema e motivação em menos de uma página, com quem se beneficia.
   - [ ] Pergunta verificável em uma frase.
   - [ ] Pelo menos 5 trabalhos relacionados e a contribuição explícita em relação a eles.
   - [ ] Abordagem com as técnicas e ferramentas previstas.
   - [ ] Plano de avaliação com métricas, dados e linhas de base **definidos antes** de começar.
   - [ ] Cronograma semanal com mínimo, planejado e ambicioso.
   - [ ] Riscos com planos alternativos.
   - [ ] Lida e comentada por outra pessoa.

## Tema 2

1. Bons marcos terminam com algo **verificável por outra pessoa**: "o script baixa os dados de 2015 a 2024 e gera um gráfico da série" é um marco; "estudar o modelo" não é.
2. O esqueleto está pronto quando um único comando roda o caminho inteiro (dados → processamento mínimo → resultado → métrica) e imprime um número. Mesmo que a métrica seja ruim, a partir daqui cada melhoria é mensurável.
3. Exemplo de entrada do diário:
   ```markdown
   ## 2026-10-21
   - Feito: validação temporal (treino até 2022, validação 2023, teste 2024).
   - Resultado: linha de base (semana anterior) MAPE 8,4%; gradient boosting MAPE 5,1% (commit a1b2c3, semente 42).
   - Problema: feriados com erro de até 30%. Hipótese: falta variável de feriado.
   - Decisão: adicionar calendário de feriados nacionais e estaduais; móveis via biblioteca `holidays`.
   - Próximo: rodar com feriados; conferir se o teste não foi usado em nenhuma escolha.
   ```
4. Uma retrospectiva útil registra o desvio entre o planejado e o realizado **e o motivo**, e termina com no máximo três ajustes concretos para a semana seguinte.
5. Lista de verificação do repositório:
   - [ ] README com o que é, como instalar, como rodar e como reproduzir os resultados.
   - [ ] Dependências com versões fixas.
   - [ ] Commits atômicos com mensagens claras; nada de dados pessoais nem segredos versionados.
   - [ ] Testes para as partes críticas e CI rodando.
   - [ ] Diário de bordo atualizado.

## Tema 3

1. Exemplo de plano de avaliação: **hipótese:** o modelo com variáveis climáticas reduz o erro em dias de calor extremo. **Métricas:** MAPE e RMSE no conjunto de teste, geral e por tipo de dia (útil, fim de semana, feriado, calor extremo). **Dados:** ONS 2015 a 2024 e INMET; teste = 2024 inteiro, nunca usado antes do fim. **Linhas de base:** semana anterior (ingênua) e um modelo estatístico clássico bem ajustado (forte). **Repetições:** 5 sementes para os modelos estocásticos; intervalos de confiança por bootstrap (Probabilidade). **Análises:** ablação das variáveis climáticas, sensibilidade ao horizonte de previsão, 10 piores dias explicados.
2. "Mesmo cuidado" significa: o mesmo orçamento de busca de hiperparâmetros, os mesmos dados de entrada disponíveis e o mesmo protocolo de validação. Se a linha de base forte foi usada com os parâmetros padrão e o seu método com 200 combinações testadas, a comparação está viciada.
3. Exemplo de ablação: com todas as variáveis, MAPE 4,6%; sem variáveis climáticas, 5,1%; sem calendário de feriados, 5,8%; sem ambos, 6,3%. Conclusão: o calendário contribui mais que o clima no geral, mas o clima é decisivo nos dias de calor extremo (mostrar a tabela por tipo de dia). Esse tipo de resultado é o que torna um trabalho convincente.
4. Bons casos de falha são **agrupados por causa** ("4 dos 10 piores dias são vésperas de feriados prolongados; 3 coincidem com apagões regionais; 2 com jogos da seleção na Copa") e cada causa sugere uma melhoria ou uma limitação a declarar.
5. O teste de fogo da reprodutibilidade é alguém que não participou do projeto obter os mesmos números (ou números dentro da variação esperada) seguindo apenas o README, numa máquina limpa ou num container. Se precisou perguntar algo, a resposta deve ir para o README.

## Tema 4

1. Exemplo de resumo (com números e sem adjetivos vazios): "A previsão da demanda de energia em dias de calor extremo é difícil porque esses dias são raros nos dados de treino. Este trabalho compara três modelos de previsão diária para a região Sudeste usando dados públicos do ONS e do INMET de 2015 a 2024. Um modelo de *gradient boosting* com variáveis climáticas e de calendário reduziu o erro percentual médio de 8,4% (linha de base ingênua) para 4,6% no ano de teste e, nos dias acima de 35 °C, de 14,2% para 7,9%. A análise de ablação mostra que o calendário de feriados é a variável mais importante no geral, e a temperatura máxima prevista, nos dias extremos. Código e dados processados estão disponíveis publicamente."
2. Exemplo de lista de contribuições: (1) um conjunto de dados limpo e documentado que une as séries do ONS e do INMET para a região Sudeste; (2) uma comparação de três modelos com protocolo temporal e linhas de base ajustadas; (3) uma análise de ablação e de erros em dias de calor extremo; (4) o código aberto que reproduz todos os resultados. Cada item deve apontar para uma seção do texto onde é demonstrado.
3. Lista de verificação da figura:
   - [ ] Título ou legenda que explica sozinha o que a figura mostra e a conclusão principal.
   - [ ] Eixos nomeados com unidades.
   - [ ] Fonte legível no tamanho em que será impressa ou projetada.
   - [ ] Paleta distinguível por pessoas com daltonismo (por exemplo, a do matplotlib "tab10" ou "viridis") e, se possível, marcadores ou estilos de linha diferentes além da cor.
   - [ ] Barras de erro ou intervalos de confiança quando houver variação.
   - [ ] Sem efeitos 3D nem elementos decorativos.
4. Melhorias comuns depois de assistir ao próprio ensaio: começar pelo problema em vez de pela tecnologia; cortar slides de fundamentação; mostrar a demonstração mais cedo; falar mais devagar; terminar com uma conclusão clara em vez de "é isso, perguntas?"; ajustar o tempo (quase sempre o primeiro ensaio passa do limite).
5. Lista de verificação final:
   - [ ] Relatório revisado por pelo menos uma pessoa, com referências completas e todas as fontes citadas.
   - [ ] Limitações e ameaças à validade declaradas.
   - [ ] Uso de ferramentas de IA declarado conforme as regras aplicáveis.
   - [ ] Apresentação feita para um público, com a gravação ou os slides publicados.
   - [ ] Repositório público com licença, tag `v1.0` e DOI (Zenodo).
   - [ ] Repositório da trilha atualizado com o projeto final e a reflexão.

## Projeto da etapa

Parabéns por chegar até aqui. Ao longo da trilha você passou pelo núcleo de uma graduação em Ciência da Computação: matemática, programação em vários paradigmas, algoritmos e teoria, sistemas do transistor à nuvem, engenharia de software, inteligência artificial, segurança, interação e ética. O projeto final é a prova de que você consegue usar tudo isso por conta própria.

Sinais de um projeto final excelente:

- Uma pergunta que você consegue explicar a qualquer pessoa em 30 segundos.
- Uma contribuição clara em relação ao que já existia.
- Uma avaliação que você defenderia diante da pessoa mais cética da banca.
- Limitações declaradas antes que alguém as aponte.
- Código que outra pessoa consegue rodar.
- Um texto e uma apresentação de que você tem orgulho.

Próximos passos possíveis: aprofundar a área do projeto (mestrado no Brasil ou no exterior; os programas da CAPES e as bolsas de iniciação científica são um bom começo), transformar o projeto num produto, contribuir com projetos de software livre ligados a ele, ou seguir para as outras trilhas deste Roadmap. E continue o hábito mais importante: aprender por conta própria, todos os dias.
