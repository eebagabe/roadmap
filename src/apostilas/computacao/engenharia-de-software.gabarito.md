# Gabarito: Engenharia de Software e Projeto em Grupo

Abra só depois de tentar. Nesta etapa, muitas respostas dependem do seu projeto: o gabarito traz respostas-modelo e critérios para você avaliar a sua.

## Tema 1

1. Exemplos:
   - **Como** paciente, **quero** ver os horários livres de um médico **para** escolher o que me convém. *Dado* que o Dr. Lima atende de 8h às 12h com consultas de 30 min e tem 3 consultas marcadas, *quando* abro a agenda dele para amanhã, *então* vejo os 5 horários restantes.
   - **Como** paciente, **quero** cancelar uma consulta até 24 h antes **para** liberar o horário. *Dado* uma consulta daqui a 30 h, *quando* cancelo, *então* ela some da minha lista e o horário volta a ficar livre. *Dado* uma consulta daqui a 10 h, *quando* tento cancelar, *então* vejo a mensagem pedindo para ligar para a clínica.
   - **Como** recepcionista, **quero** marcar consultas por telefone em nome do paciente.
   - **Como** médico, **quero** ver a minha agenda do dia ao chegar.
   - **Como** paciente, **quero** receber um lembrete na véspera **para** não esquecer.
   Critérios bons são verificáveis por alguém de fora do time, com valores concretos.
2. (a) Não funcional (segurança). Testável: "senhas guardadas com hash bcrypt ou Argon2; sessões expiram após 30 min sem uso; todo acesso a dados de pacientes fica registrado com usuário e horário; nenhuma vulnerabilidade alta no OWASP ZAP". (b) **Funcional.** Testável: "o usuário exporta a lista de consultas de um período em CSV e PDF". (c) Não funcional (usabilidade). Testável: "5 pacientes sem treinamento marcam uma consulta em menos de 2 minutos, em teste com usuários; a interface passa nos critérios WCAG 2.1 nível AA". (d) Não funcional (desempenho e escala). Testável: "com 5 mil requisições por segundo por 1 hora, 99% respondem em menos de 500 ms e a taxa de erro fica abaixo de 0,1%".
3. Exemplo: *Must*: ver horários livres, marcar, cancelar (sem isso não existe produto). *Should*: lembrete na véspera, marcação pela recepção. *Could*: agenda do médico no celular. *Won't* (agora): pagamento online, teleconsulta. MVP: paciente vê horários, marca e cancela; recepção vê a agenda. Uma clínica pode começar a usar e dar feedback.
4. Os novos membros precisam de semanas para entender o sistema e consomem tempo dos antigos com dúvidas; algumas tarefas não se dividem (uma gestação leva 9 meses, não importa quantas pessoas); e os canais de comunicação passam de 4 × 3/2 = 6 para 8 × 7/2 = **28**, aumentando a coordenação. Resultado provável: não termina em 5 semanas e pode até atrasar. Alternativas: reduzir o escopo, priorizar o MVP, remover impedimentos do time atual.
5. Critérios: a entrevista foi com alguém que **vive o problema** (não só quem paga); o documento de visão diz claramente o que está **fora do escopo**; o backlog tem histórias pequenas o bastante para caber numa sprint e está ordenado por valor e risco.

## Tema 2

1. **Contexto:** o sistema da clínica no centro; atores: paciente, recepcionista, médico; sistemas externos: serviço de e-mail/SMS para lembretes. **Contêineres:** aplicação web (navegador do paciente e da recepção), API (backend), banco de dados relacional, um processo de tarefas agendadas (envio de lembretes), e o serviço externo de mensagens. Setas com o protocolo (HTTPS/JSON, SQL, API do provedor de SMS).
2. Para uma clínica, **monólito modular** quase com certeza: um só processo para implantar e monitorar, testes de integração simples, transações no mesmo banco (marcar consulta e bloquear horário de forma atômica), custo de hospedagem baixo, primeira versão muito mais rápida. Microsserviços só compensariam com muitas equipes e partes com necessidades de escala muito diferentes. ADR exemplo: *Contexto:* equipe de 4 pessoas, prazo de 2 meses, carga pequena. *Decisão:* monólito modular com módulos agenda, pacientes e notificações, cada um com sua interface. *Consequências:* implantação e testes simples; se um módulo precisar escalar sozinho no futuro, as fronteiras já existem para extraí-lo.
3. Problemas: verbos na URL (`getConsultas`, `criar`), `POST` para apagar (deveria ser `DELETE`, que é idempotente), parâmetro de identificação na *query* em vez do caminho, e **200 com erro no corpo**, que quebra caches, monitoramento e clientes HTTP. Versão melhor:
   ```
   GET    /consultas?medico=12&data=2025-06-10
   POST   /consultas                 → 201 Created, Location: /consultas/57
   GET    /consultas/57
   DELETE /consultas/57              → 204 No Content
   erros: 404 (não existe), 409 (horário já ocupado), 422 (dados inválidos),
          com corpo {"erro": "horario_ocupado", "mensagem": "..."}
   ```
4. Defina interfaces no núcleo, por exemplo `RepositorioDeConsultas` (com `horario_livre`, `salva`) e `Notificador` (com `envia_confirmacao`). O serviço `AgendarConsulta` recebe implementações pelo construtor. Em produção, passam-se a implementação com PostgreSQL e a que usa o provedor de e-mail; nos testes, implementações em memória (*fakes*). Assim, a regra "não marcar em horário ocupado" é testada em milissegundos, sem banco nem rede.
5. Critérios: as tecnologias têm justificativa ligada aos requisitos e ao conhecimento da equipe (não "porque é moda"); os ADRs têm contexto, opções consideradas e consequências; a especificação da API tem exemplos de pedido e resposta, inclusive de erros.

## Tema 3

1. Exemplos de bons comentários: "**Obrigatório:** se `lista` vier vazia, `max()` lança `ValueError`; a especificação diz para devolver `None`. Pode adicionar um teste para esse caso?". "**Sugestão:** `dados2` não diz o que guarda; que tal `consultas_do_dia`?". "**Pergunta:** essa consulta roda dentro de um laço por paciente: com 500 pacientes são 500 consultas ao banco. Dá para buscar tudo de uma vez?". Comentários ruins: "isso está errado" (sem dizer o quê), "eu faria diferente" (sem motivo), discussões de formatação que um formatador resolveria.
2. **Unitários:** horário livre aceito; horário ocupado recusado; horário fora do expediente recusado; consulta no passado recusada; duração respeitando o intervalo de almoço; paciente com consulta no mesmo horário com outro médico. **Integração:** marcar grava no banco e o horário deixa de aparecer como livre; **duas marcações simultâneas no mesmo horário** resultam em uma só (restrição única no banco, a etapa de Bancos de Dados); o lembrete é enfileirado. **E2E:** paciente entra, escolhe médico e horário, confirma e vê a consulta na lista.
3. Sequência típica de TDD: (1) consulta de 30 min às 9h termina às 9h30 (implementação trivial: soma); (2) consulta de 30 min às 11h45 termina às **13h15** (falha; agora trata o almoço: se o intervalo cruza 12h, soma 1 h); (3) consulta que **começa** às 12h10 é recusada (ou empurrada para 13h, conforme a regra combinada); (4) consulta de 90 min às 11h termina às 13h30; (5) refatore, com os testes verdes. Cada teste novo nasce vermelho e motiva só o código necessário.
4. Um teste intermitente ensina o time a **ignorar** falhas ("deve ser aquele teste de novo"), e então uma falha real passa despercebida; além disso, faz perder tempo rodando o CI de novo. Causas comuns: dependência de **tempo** (`datetime.now()`, esperas com `sleep`, fusos horários), **ordem** de execução e estado compartilhado entre testes (banco não limpo), **concorrência** (condições de corrida), e **dependências externas** (rede, serviços de terceiros, dados aleatórios sem semente fixa).
5. Critérios: um PR com teste quebrado é **bloqueado** automaticamente; o ambiente de demonstração atualiza sozinho a cada merge; o tempo do CI é curto o bastante (menos de 10 minutos) para não atrapalhar o fluxo.

## Tema 4

1. Exemplo: "Canal principal: grupo da equipe; urgente só por ligação. Respondemos mensagens em até 24 h nos dias úteis. Reunião rápida segunda, quarta e sexta, 15 min, às 19h. Decisões técnicas: quem está na tarefa propõe no PR; divergência vira uma discussão de 15 min e, se continuar, decide quem é o responsável pela área. **Pronto** = código revisado por 1 pessoa, testes passando no CI, documentação atualizada, implantado no ambiente de demonstração."
2. Critério: as ações são **concretas, com responsável e prazo** ("Ana configura o modelo de PR até quarta"), não intenções vagas ("comunicar melhor"). Na retrospectiva seguinte, verifique se as ações foram feitas.
3. Exemplos: "não há testes no módulo de lembretes" (juro: medo de mexer, bugs que voltam; pagar na próxima sprint antes de mudar o módulo); "a senha do banco está fixa no código" (juro: risco de segurança alto, pagar **já**); "consulta de agenda sem índice" (juro: fica lenta quando houver muitos dados; pagar quando passar de 10 mil consultas, monitorando o tempo).
4. Pelo versionamento semântico, a mudança do **MAJOR** (2 → 3) indica **mudanças que quebram compatibilidade**. Antes de atualizar: ler as notas de versão e o guia de migração; atualizar numa branch própria; rodar toda a suíte de testes; procurar no código os usos das funções alteradas ou removidas; atualizar de forma isolada (não junto com outras mudanças), para facilitar a reversão.
5. Critério: a contribuição seguiu o guia do projeto (formato de commit, testes, assinatura), foi pequena e focada, e você respondeu aos comentários da revisão. Mesmo que não seja aceita, o registro do processo vale o aprendizado.

## Projeto da etapa

Sinais de que o projeto foi bem conduzido:

- O cliente **usou** a versão entregue e o feedback dele mudou o backlog pelo menos uma vez (prova de que o processo iterativo funcionou).
- O histórico do Git mostra **commits de todos**, PRs pequenos e revisados, e nenhum "commit gigante na véspera da entrega".
- O CI esteve verde na maior parte do tempo, e as quebras foram consertadas em horas, não dias.
- A demonstração final roda no ambiente implantado, não no notebook de alguém.
- Os relatórios individuais são honestos sobre o que deu errado: é o melhor sinal de que a equipe aprendeu.

Erros comuns a evitar: passar as primeiras semanas só planejando sem nada funcionando; uma pessoa fazendo quase tudo; deixar a integração das partes para o final; não falar com o cliente entre o início e a entrega.
