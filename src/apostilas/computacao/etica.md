# Computação, Ética e Sociedade: Apostila Prática

Roadmap Ciência da Computação · Semanas 111 e 112

## Comece por aqui

Software decide quem recebe crédito, que notícia você lê, quanto custa a sua corrida, se o seu currículo chega a um recrutador, quem é abordado pela polícia. Quem programa tem um poder enorme sobre a vida de pessoas que nunca vai conhecer, e boa parte dos danos não vem de má intenção, mas de **não pensar** nas consequências. Harvard criou o *Embedded EthiCS*, que coloca módulos de ética **dentro** das disciplinas técnicas; o MIT tem o SERC (*Social and Ethical Responsibilities of Computing*); as diretrizes da ACM incluem ética como área obrigatória. Esta etapa não dá respostas prontas: dá ferramentas para **raciocinar** sobre dilemas, e o conhecimento mínimo de leis e práticas que todo profissional de computação no Brasil precisa ter.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | Disciplinas de Humanidades e Ciências Sociais do curso (ética profissional) |
| MIT | SERC (módulos em várias disciplinas); 6.4590 e cursos do programa STS |
| Harvard | Embedded EthiCS (módulos dentro das disciplinas de CS) |
| Oxford | Ethics and the Computer Science profession (módulos do curso) |
| ACM/IEEE CS2023 | Área SEP: Society, Ethics, and the Profession |

### Como esta apostila funciona

1. Leia, discuta e escreva. Ética se aprende argumentando: se possível, discuta cada caso com outras pessoas, de preferência com opiniões diferentes da sua.
2. Para cada caso, identifique os **afetados**, os **valores em conflito** e as **alternativas**, antes de concluir.
3. Atividades no fim de cada tema; o gabarito traz critérios e pontos que uma boa resposta considera, não "a resposta certa".

> **Regra dos 20 minutos:** travou num dilema? Pergunte: "quem ganha, quem perde, e quem **não estava na sala** quando isso foi decidido?". As pessoas ausentes da decisão costumam ser as mais afetadas.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 111 | Tema 1: Privacidade, vieses e sociedade |
| 112 | Tema 2: A profissão + projeto |

## Tema 1: Privacidade, vieses e sociedade

**Objetivo:** reconhecer os impactos sociais da computação e raciocinar sobre eles com ferramentas éticas.

### Ferramentas para pensar

Três tradições da filosofia moral ajudam a examinar um dilema por ângulos diferentes:

| Tradição | Pergunta central | Risco se usada sozinha |
|---|---|---|
| **Consequencialismo** (utilitarismo) | Que ação produz as **melhores consequências** para todos os afetados? | Justificar sacrificar poucos pelo bem de muitos |
| **Deontologia** (Kant) | Que **deveres e direitos** estão em jogo? Eu trataria as pessoas como fins, e não só como meios? | Seguir regras mesmo quando o resultado é desastroso |
| **Ética das virtudes** (Aristóteles) | O que uma pessoa **íntegra e sábia** faria? Que tipo de profissional eu quero ser? | Ser vaga em casos concretos |

Um bom raciocínio passa pelas três e explicita onde elas concordam e onde divergem. Acrescente a perspectiva da **justiça**: os benefícios e os prejuízos são distribuídos de forma justa, ou recaem sobre os mais vulneráveis?

### 1.1 Privacidade e LGPD

Privacidade não é "esconder algo errado": é o direito de controlar informações sobre si mesmo, base da autonomia, da liberdade de expressão e da proteção contra discriminação. A ideia de **integridade contextual** (Helen Nissenbaum) ajuda: a mesma informação pode ser apropriada num contexto (o seu diagnóstico para o seu médico) e uma violação em outro (o mesmo diagnóstico para o seu empregador).

Por que dados pessoais são delicados em computação:

- **Agregação:** dados inofensivos isolados (cidade, horário de academia, compras) juntos revelam muito (saúde, religião, rotina, endereço).
- **Reidentificação:** "anonimizar" removendo o nome raramente basta. Latanya Sweeney mostrou que CEP, data de nascimento e sexo identificam a maioria das pessoas nos EUA; dados de localização com poucos pontos identificam quase qualquer pessoa.
- **Permanência e reuso:** dados coletados para um fim acabam usados para outro, vazam, ou são vendidos.

A **LGPD** (Lei Geral de Proteção de Dados, Lei 13.709/2018), fiscalizada pela **ANPD**, é a lei brasileira (inspirada no GDPR europeu). O essencial para quem desenvolve sistemas:

- **Bases legais:** só se pode tratar dados pessoais com uma das hipóteses da lei (consentimento, cumprimento de obrigação legal, execução de contrato, legítimo interesse, proteção da vida, entre outras).
- **Princípios:** **finalidade** (propósito específico e informado), **adequação**, **necessidade** (coletar o mínimo: **minimização**), livre acesso, qualidade dos dados, **transparência**, **segurança**, prevenção, não discriminação e responsabilização.
- **Dados sensíveis** (origem racial ou étnica, religião, opinião política, saúde, vida sexual, dados genéticos e biométricos) têm proteção reforçada.
- **Direitos do titular:** confirmar se há tratamento, acessar, corrigir, anonimizar ou eliminar dados desnecessários, portabilidade, informação sobre compartilhamento, revogar consentimento e **pedir revisão de decisões tomadas unicamente com base em tratamento automatizado**.
- **Incidentes de segurança** relevantes devem ser comunicados à ANPD e aos titulares.
- Dados de crianças e adolescentes exigem cuidado especial.

Na prática, isso vira requisitos de engenharia: **privacidade desde a concepção e por padrão** (*privacy by design*): coletar só o necessário, guardar pelo tempo necessário, cifrar, controlar acessos, registrar quem acessou, permitir exportar e apagar, e documentar o tratamento (relatório de impacto quando o risco é alto).

### 1.2 Vigilância

A tecnologia tornou a vigilância **barata e em massa**: câmeras com reconhecimento facial, rastreamento de celulares, interceptação de comunicações, perfis de comportamento montados por empresas de publicidade. Shoshana Zuboff chamou de **capitalismo de vigilância** o modelo de negócio que extrai dados do comportamento para prever e influenciar decisões.

Tensões reais: segurança pública contra liberdades civis; combate ao crime contra o risco de perseguição de opositores, jornalistas e minorias; conveniência contra controle. Casos para conhecer: as revelações de Edward Snowden (2013) sobre vigilância em massa; o escândalo Cambridge Analytica (2018), com dados de dezenas de milhões de perfis do Facebook usados em campanhas políticas; o uso de reconhecimento facial em estádios, metrôs e policiamento no Brasil e os casos de pessoas presas por engano.

**Criptografia** de ponta a ponta protege a privacidade de todos, inclusive de criminosos: propostas de "portas dos fundos" para a polícia enfraquecem a segurança de todos os usuários (uma brecha para "os mocinhos" também serve aos atacantes). É um dos debates centrais de política tecnológica.

### 1.3 Viés algorítmico

Algoritmos não são neutros. Vieses entram por vários caminhos:

- **Dados históricos** que refletem discriminação passada (um modelo de contratação treinado com quem foi contratado antes repete os critérios de antes).
- **Dados não representativos** (sistemas de reconhecimento facial treinados com poucos rostos negros erram muito mais com eles: estudo *Gender Shades*, de Joy Buolamwini e Timnit Gebru, 2018).
- **Variáveis substitutas** (*proxies*): mesmo sem usar raça, o CEP pode funcionar como substituto dela.
- **Escolha do objetivo:** um algoritmo de saúde nos EUA usava o **gasto** com saúde como medida de necessidade; como pacientes negros historicamente recebiam menos atendimento, o sistema os considerava menos doentes (Obermeyer e colegas, 2019).
- **Ciclos de realimentação:** policiamento preditivo manda mais policiais a um bairro, que registra mais ocorrências, que "confirmam" a previsão.

O caso **COMPAS** (avaliação de risco de reincidência usada em tribunais nos EUA) mostrou que **diferentes definições de justiça são matematicamente incompatíveis** quando as taxas de base diferem entre grupos: o sistema tinha calibração parecida para negros e brancos, mas taxas de falso positivo muito diferentes. Não existe "o" algoritmo justo: escolher a métrica é uma decisão **de valores**, que precisa ser explícita e discutida com os afetados, não escondida no código.

O que fazer como engenheiro (ligando com Aprendizado de Máquina): questionar se o problema deve ser automatizado; medir o desempenho **por grupo**; auditar dados e resultados; documentar (*datasheets*, *model cards*); manter revisão humana e canais de contestação em decisões de alto impacto; monitorar depois de implantado.

### 1.4 Automação e trabalho

A automação sempre destruiu e criou empregos; a questão é o ritmo, quem ganha e quem paga a transição. Temas atuais:

- **Plataformas** de trabalho (entregas, transporte por aplicativo): flexibilidade contra precarização, gestão por algoritmo (quem é desativado, quanto se ganha por corrida) sem transparência nem a quem recorrer. O debate sobre a regulamentação do trabalho por aplicativo no Brasil é um exemplo concreto.
- **IA generativa** afetando trabalhos de escrita, arte, tradução, atendimento e o próprio desenvolvimento de software; questões de direitos autorais sobre os dados usados no treino.
- **Trabalho invisível:** pessoas mal pagas que rotulam dados e moderam conteúdo traumático para que sistemas de IA funcionem.
- **Exclusão digital:** serviços públicos que viram só digitais excluem quem não tem acesso, conexão ou habilidade (um desafio grande no Brasil).

Ligado a isso, o impacto em **ecossistemas de informação**: algoritmos de recomendação otimizados para engajamento podem amplificar desinformação e polarização; moderação de conteúdo em escala envolve escolhas difíceis sobre liberdade de expressão, com regras diferentes em cada país.

### Atividades de fixação do Tema 1

1. Analise, pelas três tradições éticas, o seguinte caso: um aplicativo de saúde gratuito financia-se compartilhando dados de uso (anonimizados, segundo ele) com seguradoras.
2. Um sistema de cadastro coleta nome, CPF, data de nascimento, endereço, telefone, renda, religião e "como nos conheceu". O objetivo é enviar um boletim por e-mail. Aplique os princípios de finalidade e necessidade da LGPD.
3. Explique, com um exemplo, por que remover a coluna "raça" de um conjunto de dados não garante que o modelo não discrimine.
4. Pesquise um caso brasileiro de uso de reconhecimento facial em segurança pública e analise: quem se beneficia, quem corre riscos, que salvaguardas existiam.
5. Liste os direitos do titular previstos na LGPD e, para cada um, que funcionalidade um sistema precisa ter para atendê-lo.

## Tema 2: A profissão

**Objetivo:** conhecer as responsabilidades profissionais, o regime de propriedade intelectual e licenças, e a sustentabilidade da computação.

### 2.1 Propriedade intelectual

Formas de proteção relevantes para software (no Brasil):

- **Direito autoral:** o código-fonte é protegido como obra (Lei de Software, 9.609/1998, e Lei de Direitos Autorais, 9.610/1998), automaticamente, sem registro (o registro no INPI é opcional e serve como prova). Protege a **expressão** (o texto do código), não a ideia ou o algoritmo.
- **Patentes:** protegem invenções. No Brasil, programas de computador **em si** não são patenteáveis, mas invenções implementadas por computador podem ser, em certas condições. Nos EUA, patentes de software são mais comuns e polêmicas.
- **Marcas** (nomes e logotipos) e **segredos comerciais** (algoritmos internos, como o de busca do Google).

Na relação de trabalho, em geral, o código produzido no emprego pertence ao empregador. Atenção a contratos de prestação de serviços e a projetos pessoais feitos com recursos da empresa.

Questões atuais: modelos de IA treinados com obras protegidas (texto, imagens, código) sem autorização; a autoria de conteúdo gerado por IA; a cópia de código de terceiros sem respeitar a licença.

### 2.2 Licenças de software livre

Usar código de terceiros é usar **sob uma licença**: código sem licença declarada **não** é livre para usar, por padrão todos os direitos são reservados.

| Licença | Tipo | Exige |
|---|---|---|
| MIT, BSD | Permissiva | Manter o aviso de copyright e a licença |
| Apache 2.0 | Permissiva | Manter avisos; inclui concessão explícita de patentes |
| LGPL | *Copyleft* fraco | Modificações na própria biblioteca ficam livres; pode-se ligar a software fechado |
| GPL v2/v3 | *Copyleft* | Obras derivadas **distribuídas** precisam ter o código aberto sob a GPL |
| AGPL | *Copyleft* de rede | Como a GPL, mas vale também para software oferecido **como serviço** pela rede |
| Creative Commons | Para conteúdo (textos, imagens), não para código | Varia (atribuição, não comercial, compartilha igual...) |

Consequências práticas: incluir uma biblioteca GPL num produto fechado distribuído pode obrigar a abrir o produto; empresas mantêm listas de licenças permitidas e usam ferramentas de análise de composição de software para verificar dependências. Movimentos recentes: licenças "fonte disponível" (como a BSL), que não são livres segundo a definição da OSI, adotadas por empresas para impedir que provedores de nuvem vendam o seu software como serviço.

O **software livre** (Free Software Foundation, liberdade como valor) e o **código aberto** (Open Source Initiative, ênfase no modelo de desenvolvimento) mudaram a computação: quase toda a infraestrutura do mundo depende deles, muitas vezes mantida por pouquíssimas pessoas voluntárias (o caso do OpenSSL e do Heartbleed, em 2014, e o do *xz utils*, em 2024, mostram o risco). Contribuir e apoiar financeiramente esses projetos é uma responsabilidade das empresas que os usam.

### 2.3 Responsabilidade profissional

O **Código de Ética e Conduta Profissional da ACM** (2018) resume obrigações do profissional de computação. Princípios gerais:

1. Contribuir para a sociedade e o bem-estar humano, reconhecendo que todas as pessoas são partes interessadas.
2. Evitar danos.
3. Ser honesto e confiável.
4. Ser justo e agir para não discriminar.
5. Respeitar o trabalho necessário para produzir novas ideias, invenções e obras.
6. Respeitar a privacidade.
7. Honrar a confidencialidade.

E responsabilidades profissionais: buscar alta qualidade, manter competência, conhecer e respeitar as leis, aceitar e fazer revisões, avaliar riscos de forma abrangente, trabalhar só dentro da sua competência, comunicar ao público conhecimento relevante.

Casos que todo profissional deveria conhecer:

- **Therac-25** (1985 a 1987): uma máquina de radioterapia com uma **condição de corrida** no software, sem as travas de hardware dos modelos anteriores, aplicou doses massivas de radiação e matou pacientes. Lições: software crítico exige engenharia de segurança, testes, análise de falhas e relatos honestos de incidentes.
- **Boeing 737 MAX** (2018 e 2019): um sistema automático (MCAS) dependente de um único sensor, pouco documentado para os pilotos, contribuiu para dois acidentes com 346 mortos. Lições: pressão comercial contra segurança, e a responsabilidade de quem sabe dos riscos.
- **Volkswagen** (2015): software que detectava testes de emissão e reduzia a poluição só durante eles. Engenheiros foram processados e presos: "foi o chefe que mandou" não é defesa.
- **Escândalo dos Correios britânicos** (*Horizon*): erros de um sistema de contabilidade levaram à condenação injusta de centenas de agentes postais por desvio de dinheiro, ao longo de anos, enquanto a empresa negava os defeitos.

O que fazer quando se é pressionado a fazer algo errado: documentar, levantar a questão pelos canais internos, buscar apoio (colegas, conselhos profissionais, advogados), e, em último caso, recusar ou denunciar (*whistleblowing*), cientes dos custos pessoais. Desenvolver o hábito de perguntar "o que pode dar errado e quem sofre com isso?" nas reuniões de projeto é a forma mais eficaz de ética no dia a dia.

### 2.4 Sustentabilidade

A computação tem custo ambiental real:

- **Energia:** data centers consomem uma fração significativa e crescente da eletricidade mundial, acelerada pelo treinamento e uso de grandes modelos de IA; também usam muita **água** para resfriamento.
- **Lixo eletrônico:** dezenas de milhões de toneladas por ano, com metais tóxicos e baixa taxa de reciclagem; obsolescência programada e dificuldade de reparo agravam.
- **Mineração** de materiais para baterias e chips, com impactos ambientais e sociais em regiões produtoras.

Quem desenvolve pode ajudar: código eficiente (algoritmos melhores economizam energia de verdade em escala), escolher regiões de nuvem com energia mais limpa, desligar recursos ociosos, não treinar modelos maiores do que o problema exige, apoiar o direito ao reparo e manter software compatível com aparelhos mais antigos. A computação também é parte da **solução**: modelagem climática, redes elétricas inteligentes, otimização logística, monitoramento de desmatamento (como os sistemas do INPE).

A **acessibilidade** (etapa de IHC) também é responsabilidade profissional, assim como a inclusão de pessoas diversas nas equipes, que produzem sistemas que funcionam para mais gente.

### Atividades de fixação do Tema 2

1. Você quer usar três bibliotecas num aplicativo comercial fechado que será vendido: uma MIT, uma LGPL e uma GPL. O que precisa fazer em cada caso?
2. Leia o Código de Ética da ACM e escolha dois princípios. Para cada um, descreva uma situação realista do seu futuro trabalho em que ele seria posto à prova.
3. Analise o caso Therac-25: que falhas técnicas e organizacionais ocorreram? Que práticas desta trilha (testes, concorrência, engenharia de software) poderiam ter evitado as mortes?
4. Seu gerente pede para adicionar ao aplicativo uma coleta de localização em segundo plano "para melhorar anúncios", sem avisar os usuários. Como você responde? Que argumentos técnicos, legais e éticos usaria?
5. Estime a ordem de grandeza da energia economizada por um ano se uma otimização reduz em 10% o tempo de CPU de um serviço que roda em 1.000 servidores de 300 W o tempo todo.

## Projeto da etapa

**Ensaio de análise ética de um sistema real** (3 a 5 páginas):

1. Escolha um sistema real e concreto: um algoritmo de recomendação (vídeos, notícias), reconhecimento facial em segurança pública, concessão de crédito automatizada, um aplicativo de entregas, moderação de conteúdo, um sistema de IA generativa, ou um serviço público digital.
2. **Descreva** o sistema: o que faz, quem o opera, como funciona (o que se sabe), quem são os afetados diretos e indiretos.
3. **Analise** os impactos pelas três tradições éticas e pela perspectiva da justiça; identifique os valores em conflito (eficiência, privacidade, segurança, autonomia, igualdade).
4. **Enquadre** na legislação (LGPD, Código de Defesa do Consumidor, Marco Civil da Internet, legislação específica e propostas em discussão).
5. **Proponha** mudanças concretas, técnicas e organizacionais (auditorias, métricas por grupo, transparência, revisão humana, minimização de dados, canais de contestação), discutindo os custos e as objeções a elas.
6. Use fontes confiáveis (artigos acadêmicos, reportagens investigativas, documentos oficiais) e apresente ao menos uma objeção forte à sua própria posição, respondendo-a.

## Para ir além

- **Harvard Embedded EthiCS:** módulos públicos de ética para disciplinas de computação.
- **MIT Case Studies in Social and Ethical Responsibilities of Computing** (gratuitos, revisados por pares).
- *Algoritmos de Destruição em Massa* (Cathy O'Neil) e *Race After Technology* (Ruha Benjamin).
- *A Era do Capitalismo de Vigilância* (Shoshana Zuboff).
- *Fairness and Machine Learning* (Barocas, Hardt e Narayanan, gratuito online).
- O texto da **LGPD** e os guias da **ANPD**; o Código de Ética da **ACM**.
- Organizações brasileiras que estudam o tema: InternetLab, Data Privacy Brasil, Coding Rights, ITS Rio.

## Resumão

- Analise dilemas por consequências, deveres e virtudes, e pergunte quem ganha, quem perde e quem não foi ouvido.
- Privacidade é controle sobre informações em contexto. Agregação e reidentificação tornam "dados anônimos" frágeis.
- LGPD: bases legais, finalidade, necessidade, transparência, segurança, dados sensíveis, direitos do titular (inclusive revisão de decisões automatizadas). Privacidade desde a concepção.
- Vigilância em massa barata; criptografia forte protege todos.
- Viés vem de dados históricos, amostras não representativas, substitutos, objetivos mal escolhidos e ciclos de realimentação. Definições de justiça podem ser incompatíveis: a escolha é de valores.
- Automação redistribui trabalho e poder; plataformas, trabalho invisível, exclusão digital.
- Direito autoral protege o código; licenças permissivas e copyleft têm obrigações diferentes; código sem licença não é livre.
- Código de Ética da ACM: contribuir, evitar danos, honestidade, justiça, privacidade. Therac-25, 737 MAX, Volkswagen, Horizon.
- Computação consome energia e gera lixo; código eficiente e escolhas conscientes ajudam.
