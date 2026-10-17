# Projeto Final: Apostila Prática

Roadmap Ciência da Computação · Semanas 113 a 116 (ou mais)

## Comece por aqui

Toda graduação termina com um trabalho que junta o que se aprendeu num problema de verdade: o **TG** (Trabalho de Graduação) do ITA, a *Senior Thesis* de Harvard, o projeto de MEng e os UROPs do MIT, o *Part C project* de Oxford. Este é o seu. A diferença entre o projeto final e os projetos das etapas é que **ninguém definiu o problema para você**: escolher uma boa pergunta, delimitá-la, buscar o que já existe, construir, **avaliar com honestidade** e comunicar o resultado são habilidades de quem está formado, seja para a indústria, para a pesquisa ou para empreender.

As 4 semanas são o mínimo para um projeto pequeno. Um projeto ambicioso leva de 3 a 6 meses em paralelo com outras atividades, como os TGs reais. Esta apostila é um guia de **processo**: o conteúdo técnico vem das etapas anteriores.

### Equivalências

| Universidade | Equivalente |
|---|---|
| ITA | TG: Trabalho de Graduação |
| MIT | Advanced Undergraduate Research (SuperUROP), projeto de MEng |
| Harvard | Senior Thesis em Computer Science |
| Oxford | Part C Project (4º ano do MCompSci) |

### Como esta apostila funciona

1. Cada tema corresponde a uma fase do projeto e termina com um **entregável**.
2. Procure um **orientador**: um professor, um profissional experiente da área, ou pelo menos um colega mais avançado que leia o seu trabalho a cada fase. Feedback externo é o que separa um projeto bom de um mediano.
3. Trabalhe em público: repositório aberto, diário de bordo, e uma apresentação no fim.

> **Regra dos 20 minutos:** travou? Escreva em uma frase qual é a pergunta que o projeto responde e qual seria um resultado que te surpreenderia. Se não conseguir, o problema está no escopo, não no código.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 113 | Tema 1: Problema e proposta |
| 114 | Tema 2: Desenvolvimento |
| 115 | Tema 3: Avaliação |
| 116 | Tema 4: Escrita e apresentação |

## Tema 1: Problema e proposta

**Objetivo:** escolher um problema relevante e viável, conhecer o que já existe e escrever uma proposta clara.

### 1.1 Escolha do problema

Um bom projeto final está na interseção de três coisas: o que **te interessa** (você vai passar meses com ele), o que é **relevante** (alguém se beneficia, ou responde uma pergunta que importa) e o que é **viável** (cabe no seu tempo, conhecimento e recursos).

Tipos de projeto:

| Tipo | Pergunta | Exemplo |
|---|---|---|
| **Sistema** | Dá para construir X com as propriedades Y? | Um armazenamento chave-valor replicado com Raft que tolera partições |
| **Empírico** | Como A se compara a B em tal situação? | Comparar estruturas de índice em dados de séries temporais reais |
| **Algorítmico** | Existe um método melhor para o problema Z? | Uma heurística para rotas de coleta de lixo urbana |
| **Aplicado** | Dá para resolver um problema real de um grupo de pessoas? | Um sistema de triagem para uma ONG de saúde |
| **Reprodução** | Os resultados do artigo W se confirmam em outro contexto? | Reproduzir um artigo de ML com dados brasileiros |
| **Contribuição em software livre** | Que funcionalidade ou melhoria importante falta no projeto P? | Implementar e fazer aceitar uma melhoria relevante num projeto conhecido |

Sugestões de temas (do plano da trilha): um sistema distribuído tolerante a falhas; um compilador para uma linguagem própria; um otimizador de rotas; um modelo de aprendizado de máquina aplicado a um problema brasileiro (dados públicos do SUS, do INPE, do IBGE, do TSE, de diários oficiais); uma contribuição relevante para um projeto de software livre.

**Delimite.** O erro mais comum é escolher um problema grande demais ("um sistema que detecta notícias falsas"). Afunile até uma pergunta respondível ("um classificador de manchetes enganosas em português, comparando três abordagens num conjunto de 5.000 manchetes rotuladas, com análise de erros"). Defina o que fica **fora**.

**Riscos:** liste o que pode inviabilizar o projeto (os dados não existem ou não estão disponíveis, a API muda, o algoritmo não escala) e ataque o maior risco **primeiro**, com um experimento pequeno.

### 1.2 Revisão do estado da arte

Antes de construir, descubra o que já existe. Você vai encontrar trabalhos parecidos: isso é bom, significa que o problema importa, e mostra onde está a sua **contribuição** (o que o seu trabalho faz de diferente).

Onde procurar:

- **Google Acadêmico** e **Semantic Scholar** (busca e citações); **arXiv** (pré-publicações de computação); **dblp** (bibliografia de computação); **ACM Digital Library** e **IEEE Xplore** (artigos publicados; muitos abertos); o **Portal de Periódicos da CAPES** (acesso gratuito a partir de universidades brasileiras); o catálogo de teses da CAPES e os repositórios de TGs.
- Projetos de software e conjuntos de dados (GitHub, Papers with Code, Hugging Face, Kaggle).

Como ler artigos com eficiência (o método das três passadas, de S. Keshav): **primeira**, título, resumo, introdução, títulos das seções e conclusão (5 a 10 minutos: vale a pena ler?); **segunda**, o texto todo sem os detalhes das provas, com atenção às figuras; **terceira**, só para os mais importantes, reconstruir o trabalho mentalmente e questionar cada suposição.

Siga as **citações** para trás (o que o artigo cita) e para frente (quem citou o artigo depois). Registre tudo num gerenciador de referências (Zotero, gratuito) com um resumo de cada trabalho: o problema, a abordagem, os resultados, as limitações e a relação com o seu.

A revisão não é uma lista de resumos: é uma **síntese** organizada por abordagem, que mostra onde está a lacuna que o seu trabalho ocupa.

### 1.3 Proposta

A proposta (2 a 4 páginas) é um contrato consigo mesmo e com o orientador:

1. **Título** provisório.
2. **Problema e motivação:** qual é o problema, para quem importa, por que agora.
3. **Pergunta ou objetivo** específico e verificável.
4. **Trabalhos relacionados** (resumo da revisão) e a **contribuição** esperada.
5. **Abordagem:** o que você vai construir ou fazer, com que técnicas.
6. **Avaliação:** como você vai saber se deu certo? Que métricas, comparadas com o quê, em que dados? (Pensar nisso **antes** evita avaliar só o que deu certo.)
7. **Cronograma** com marcos semanais e o que é o mínimo aceitável, o planejado e o "se der tempo".
8. **Riscos** e planos alternativos.

### Atividades de fixação do Tema 1

1. Liste 5 ideias de projeto. Para cada uma, dê uma nota de 1 a 5 para interesse, relevância e viabilidade. Escolha uma e escreva a pergunta em uma frase.
2. Afunile a sua ideia em três níveis de escopo: o mínimo que ainda seria um bom trabalho, o planejado e o ambicioso.
3. Encontre 10 trabalhos relacionados (artigos, sistemas ou projetos), leia-os na primeira passada e escolha 3 para a segunda. Escreva uma síntese de uma página organizada por abordagem.
4. Defina o maior risco do seu projeto e um experimento de no máximo 2 dias para testá-lo.
5. **Entregável:** a proposta completa, revisada pelo orientador ou por um colega.

## Tema 2: Desenvolvimento

**Objetivo:** construir o projeto de forma incremental, com marcos, registro e controle de riscos.

### 2.1 Marcos

Divida o trabalho em **marcos** (*milestones*) curtos, cada um terminando com algo **funcionando e demonstrável**, não com "metade de tudo". Prefira construir uma fatia vertical fina de ponta a ponta primeiro (o "esqueleto ambulante": dados entram, um processamento simples, o resultado sai e é medido) e depois aprofundar cada parte.

Exemplo, para "comparar três modelos de previsão de demanda de energia":

1. Semana 1: dados carregados e limpos; linha de base ingênua (o valor da semana anterior) com a métrica calculada.
2. Semana 2: primeiro modelo de verdade e o protocolo de avaliação completo (validação temporal).
3. Semana 3: os outros dois modelos; ajuste de hiperparâmetros.
4. Semana 4: análise de erros, experimentos adicionais, figuras finais.

Reveja o plano a cada semana com o orientador: o plano vai mudar, e tudo bem, desde que a mudança seja consciente e registrada.

Use as práticas das etapas anteriores: repositório com commits atômicos, testes, CI, README de como reproduzir, e a disciplina de engenharia de software mesmo trabalhando sozinho.

### 2.2 Diário de bordo

Mantenha um **diário de bordo** (um arquivo Markdown no repositório, uma entrada por dia de trabalho): o que fez, o que deu certo, o que deu errado, as decisões e os porquês, as dúvidas, os próximos passos, e os resultados de cada experimento (com o commit e os parâmetros que o geraram).

Benefícios: a escrita final fica muito mais fácil (metade do texto já está no diário), você não repete experimentos que não funcionaram, e consegue explicar ao orientador exatamente onde está. Pesquisadores experientes fazem isso por hábito.

Para experimentos, registre **tudo** que permite reproduzir: versão do código, dados, parâmetros, semente aleatória, ambiente. Ferramentas como MLflow ou Weights & Biases ajudam em projetos de ML; uma planilha bem organizada também serve.

### 2.3 Riscos

Problemas típicos e como lidar:

- **Escopo crescendo:** novas ideias aparecem o tempo todo. Anote numa lista de "trabalhos futuros" e volte ao plano.
- **Travado num problema técnico por dias:** aplique a regra dos 20 minutos em escala maior: depois de um dia sem progresso, peça ajuda (orientador, fóruns, comunidade do projeto) ou contorne com uma simplificação.
- **Resultados negativos:** o método não funciona melhor que a linha de base. Isso **é** um resultado, desde que a avaliação seja honesta e a análise explique por quê. Muitos bons trabalhos mostram que algo que parecia promissor não funciona, e em que condições.
- **Perfeccionismo:** um sistema 80% bem avaliado vale mais que um 100% sem avaliação. Reserve tempo para avaliar e escrever, e proteja esse tempo.
- **Perda de dados ou de código:** tudo versionado e com cópia remota desde o primeiro dia.

### Atividades de fixação do Tema 2

1. Escreva os marcos do seu projeto, cada um com um resultado demonstrável.
2. Construa o "esqueleto ambulante" do projeto: o caminho completo, do início ao fim, na forma mais simples possível.
3. Mantenha o diário de bordo por pelo menos 10 dias de trabalho.
4. Ao fim de cada semana, faça uma retrospectiva curta: planejado contra realizado, riscos novos, ajuste do plano.
5. **Entregável:** uma demonstração ao orientador da versão funcionando, com o repositório organizado e reprodutível.

## Tema 3: Avaliação

**Objetivo:** demonstrar com evidências o que o trabalho alcança e onde ele falha.

### 3.1 Avaliação experimental

Um projeto sem avaliação é uma demonstração; com avaliação, é conhecimento. A avaliação responde à pergunta da proposta com **evidências**.

Desenho do experimento:

- **Hipóteses** claras ("o índice proposto reduz a latência de consultas por intervalo em pelo menos 30% em relação à B+tree, para dados com chegada em ordem temporal").
- **Métricas** adequadas ao objetivo (latência, vazão, acurácia, precisão e revocação, uso de memória, tempo de tarefa e satisfação do usuário, número de usuários atendidos).
- **Dados ou cargas de trabalho** representativos: dados reais quando possível; cargas sintéticas que variem os fatores relevantes (tamanho, distribuição, concorrência).
- **Variáveis:** o que você muda (independentes), o que mede (dependentes) e o que mantém fixo (controles).
- **Repetições** para medir a variação: rode cada configuração várias vezes, relate média (ou mediana) e dispersão, e use intervalos de confiança ou testes estatísticos quando comparar (a etapa de Probabilidade).
- Para sistemas: aqueça antes de medir, isole a máquina, descreva o hardware.
- Para trabalhos com pessoas (estudos com usuários): ética e consentimento, participantes representativos, tarefas padronizadas (a etapa de IHC).

### 3.2 Comparação com alternativas

Resultados só têm significado **em comparação**:

- **Linhas de base** simples (a solução ingênua, o estado atual) e fortes (o melhor método conhecido, ajustado com o mesmo cuidado que o seu: comparar o seu método bem ajustado com uma linha de base mal configurada é desonesto, mesmo sem intenção).
- **Ablação:** remova um componente do seu método de cada vez e meça o impacto. Mostra **o que** de fato contribui.
- **Análise de sensibilidade:** como o resultado varia com os parâmetros e com o tamanho do problema?
- **Análise de erros e limitações:** onde o método falha e por quê. Mostrar os casos difíceis torna o trabalho **mais** confiável, não menos.

Armadilhas: ajustar o método olhando para o conjunto de teste (vazamento, Aprendizado de Máquina); escolher só as métricas em que o seu método ganha; generalizar demais a partir de um único conjunto de dados; confundir correlação com causalidade.

### 3.3 Reprodutibilidade

Outra pessoa (ou você daqui a um ano) deve conseguir reproduzir os resultados:

- Código público com licença, instruções de instalação e um comando que roda os experimentos e gera as figuras e tabelas.
- Dependências com versões fixas (arquivo de *lock*, imagem de container).
- Dados públicos ou instruções para obtê-los (e, se forem dados pessoais, anonimização e respeito à LGPD).
- Sementes aleatórias fixas e registro dos parâmetros.
- Resultados brutos guardados, não só os gráficos.

Muitas conferências de computação hoje premiam artigos com artefatos avaliados como reprodutíveis. É o padrão de qualidade a perseguir.

### Atividades de fixação do Tema 3

1. Escreva o plano de avaliação: hipóteses, métricas, dados, linhas de base, número de repetições e análises.
2. Implemente pelo menos uma linha de base simples e uma forte, com o mesmo cuidado de ajuste que o seu método.
3. Faça um experimento de ablação ou de sensibilidade.
4. Escolha 10 casos em que o seu sistema falha ou tem o pior desempenho e explique cada um.
5. **Entregável:** tabelas e figuras com os resultados, geradas por um script a partir dos dados brutos, e um colega que consiga reproduzir pelo menos um resultado seguindo só o README.

## Tema 4: Escrita e apresentação

**Objetivo:** comunicar o trabalho por escrito e oralmente, e publicar o código.

### 4.1 Relatório em formato de artigo

Estrutura de um artigo de computação (8 a 15 páginas):

1. **Resumo:** um parágrafo com problema, abordagem, principais resultados (com números) e conclusão. É a parte mais lida: escreva por último e com cuidado.
2. **Introdução:** o problema e por que importa, a lacuna, a sua contribuição (em uma lista explícita), e os principais resultados. Muitos leitores param aqui.
3. **Fundamentação e trabalhos relacionados:** o necessário para entender, e a posição do seu trabalho em relação aos outros.
4. **Abordagem:** o que você fez, com detalhe suficiente para alguém reproduzir. Figuras de arquitetura ajudam.
5. **Avaliação:** a metodologia e os resultados, com tabelas e figuras, e a **interpretação**: o que os números significam.
6. **Discussão e limitações:** o que não funciona, ameaças à validade, quando os resultados podem não valer.
7. **Conclusão e trabalhos futuros.**
8. **Referências** completas e consistentes.

Boas práticas de escrita técnica:

- Escreva para um leitor inteligente que não conhece o seu projeto. Defina os termos antes de usar.
- Uma ideia por parágrafo, com a frase principal no início.
- Afirmações apoiadas por evidência ou referência; evite adjetivos vazios ("muito eficiente", "inovador") e dê números.
- Figuras com legendas que se explicam sozinhas, eixos nomeados com unidades, e tamanho de fonte legível.
- **LaTeX** (com o Overleaf, gratuito) é o padrão em computação para artigos e TGs; Markdown com Pandoc também funciona.
- Revise várias vezes, peça leitura a outras pessoas e leia em voz alta para achar frases ruins.
- Uso de assistentes de IA: permitido em muitos contextos para revisar texto, mas o conteúdo, os argumentos e os resultados precisam ser seus, verificados por você e declarados conforme as regras da instituição. Nunca deixe uma ferramenta inventar referências ou resultados.
- **Plágio:** toda ideia, texto, figura ou código de outra pessoa precisa ser citado. Copiar sem citar é desonestidade acadêmica, mesmo com palavras trocadas.

### 4.2 Apresentação pública

Uma apresentação de 15 a 20 minutos (mais perguntas), ao vivo ou em vídeo:

- **Conte uma história:** o problema (por que alguém deveria se importar), o que você fez, o que descobriu, o que isso significa.
- Um slide por ideia, pouco texto, figuras grandes. Os slides apoiam a fala; não são o roteiro para ler.
- Uma **demonstração** ao vivo curta, com um vídeo gravado de reserva caso algo falhe.
- Mostre os resultados principais com clareza e as limitações com honestidade.
- **Ensaie** com cronômetro, várias vezes, de preferência para alguém que faça perguntas difíceis. Prepare-se para as perguntas óbvias ("por que não usou X?", "isso escala?", "como se compara a Y?").

Apresente em público de verdade: um grupo de estudos, um meetup local de tecnologia, um evento universitário, ou um vídeo publicado. Explicar o seu trabalho para pessoas de fora é uma habilidade profissional valiosa.

### 4.3 Publicação do código

Publicar o código e o relatório transforma o projeto em portfólio e em contribuição:

- Repositório com README de qualidade (Ferramentas, Tema 2): o que é, resultados principais, como instalar e reproduzir, como citar.
- **Licença** escolhida conscientemente (a etapa de Ética): MIT ou Apache para máxima reutilização; GPL para garantir que derivados continuem livres.
- Versão marcada (tag `v1.0`) correspondente ao relatório, e um DOI permanente via Zenodo (gratuito, integrado ao GitHub) para que possa ser citado.
- Opcionalmente, submeter a um evento: há trilhas de iniciação científica e de estudantes em congressos brasileiros (como os da Sociedade Brasileira de Computação, SBC) e *workshops* de conferências internacionais. Publicar no arXiv também é possível.

Depois de entregar, faça uma **retrospectiva** final: o que você faria diferente, o que aprendeu sobre o problema e sobre si mesmo. E atualize o repositório da trilha: você chegou ao fim.

### Atividades de fixação do Tema 4

1. Escreva o resumo do seu trabalho em no máximo 200 palavras, com pelo menos um número de resultado.
2. Escreva a lista de contribuições da introdução (3 a 5 itens, cada um verificável no texto).
3. Refaça a figura principal do seu trabalho seguindo as boas práticas (eixos, unidades, legenda autoexplicativa, cores distinguíveis por pessoas com daltonismo).
4. Grave um ensaio da apresentação, assista e liste 5 melhorias.
5. **Entregável:** relatório final, apresentação pública e repositório publicado com licença, tag de versão e instruções de reprodução.

## Projeto da etapa

**O seu TCC, completo:**

1. Proposta aprovada pelo orientador (ou revisada por pares).
2. Repositório com o código, o diário de bordo, os experimentos reprodutíveis e o histórico de commits do projeto inteiro.
3. Relatório final no formato de artigo (8 a 15 páginas), com revisão do estado da arte, abordagem, avaliação com linhas de base e análise de limitações.
4. Apresentação pública de 15 a 20 minutos com demonstração.
5. Código e relatório publicados, com licença e versão citável.
6. Uma reflexão final de uma página: o que você aprendeu ao longo de toda a trilha, que áreas quer aprofundar, e próximos passos (mestrado, área de atuação, projetos).

**Critérios de avaliação** (inspirados em bancas de TG e de *senior thesis*):

| Critério | O que se espera |
|---|---|
| Problema | Relevante, bem delimitado, com contribuição clara em relação ao que existe |
| Execução técnica | Correta, bem engenheirada, usando adequadamente o conteúdo da trilha |
| Avaliação | Hipóteses, linhas de base honestas, análise estatística e de erros, reprodutível |
| Comunicação | Texto claro e bem estruturado, figuras boas, apresentação envolvente |
| Autonomia e processo | Planejamento, diário, uso do feedback, gestão de riscos |
| Integridade | Citações corretas, limitações declaradas, resultados não exagerados |

## Para ir além

- *How to Read a Paper* (S. Keshav) e *How to Write a Great Research Paper* (palestra de Simon Peyton Jones).
- *The Craft of Research* (Booth, Colomb e Williams) e *Writing for Computer Science* (Justin Zobel).
- *Como Elaborar Projetos de Pesquisa* (Antonio Carlos Gil), em português.
- *The Visual Display of Quantitative Information* (Edward Tufte), sobre figuras.
- Os TGs públicos do ITA e as *senior theses* de Harvard e Princeton, para ver exemplos reais.
- Eventos e programas de iniciação científica da SBC e das universidades.

## Resumão

- Escolha na interseção de interesse, relevância e viabilidade. Delimite: uma pergunta respondível e o que fica de fora.
- Ataque o maior risco primeiro, com um experimento pequeno.
- Revise o estado da arte (três passadas, citações para trás e para frente) e sintetize por abordagem para achar a lacuna.
- Proposta: problema, pergunta, contribuição, abordagem, **plano de avaliação**, cronograma em níveis e riscos.
- Marcos curtos com algo funcionando; primeiro o esqueleto ambulante de ponta a ponta.
- Diário de bordo: decisões, experimentos e porquês. Escopo novo vai para "trabalhos futuros".
- Avaliação: hipóteses, métricas, dados representativos, repetições, estatística. Compare com linhas de base honestas; faça ablação e análise de erros.
- Resultados negativos bem avaliados são resultados. Reprodutibilidade é parte do trabalho.
- Artigo: resumo, introdução com contribuições, relacionados, abordagem, avaliação, limitações, conclusão. Números em vez de adjetivos.
- Apresente uma história, com demonstração e ensaio. Publique com licença e versão citável.
- Cite tudo; declare o uso de ferramentas; nunca exagere resultados.
