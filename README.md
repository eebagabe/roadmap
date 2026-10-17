# Roadmap

Roadmaps de estudo em português, inspirados no [roadmap.sh](https://roadmap.sh) e no formato de mapa por semanas. Cada trilha tem tópicos para marcar, uma apostila prática (com gabarito) por etapa, empresas que usam a tecnologia e projetos para o portfólio.

## Trilhas

| Trilha | Semanas | Etapas |
|---|---|---|
| ☕ Java Backend | 24 | Fundamentos, LeetCode, Backend, Java Backend, Sistemas Distribuídos, System Design |
| ⚛️ Frontend React | 18 | Fundamentos da Web, JavaScript e TypeScript, React, Tailwind CSS, Ecossistema React, Performance e Arquitetura |
| 🧪 QA | 15 | Fundamentos de Teste, Testes Manuais, Automação Web, Testes de API, Performance e Segurança, CI/CD e Qualidade Contínua |
| 📊 Analista e Engenheiro de Dados | 19 | Fundamentos, SQL e Modelagem, Análise de Dados e BI, Engenharia de Dados, Cloud e Big Data, Governança e Arquitetura |
| 🤖 LLMs e Agents | — | Em breve |

## Funcionalidades

- Mapa por etapas com semanas à esquerda e à direita, ligadas ao nó central.
- Marcar tópicos ou a semana inteira; recolher e expandir semanas ("Recolher tudo").
- Botão "Próximo tópico" que leva ao primeiro tópico ainda não estudado.
- Apostila por etapa com sumário, quadros de destaque, atividades, aba de gabarito e impressão/PDF.
- Empresas que usam cada tecnologia e projetos práticos por nível.
- Progresso salvo no `localStorage` do navegador.

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run lint
```

## Estrutura

```
src/
  data/roadmaps/        → um arquivo por trilha (semanas, tópicos, empresas, projetos)
  apostilas/<trilha>/   → <etapa>.md e <etapa>.gabarito.md
  components/           → mapa, cards de semana, apostila, etc.
  lib/storage.ts        → persistência (localStorage)
  lib/progress.ts       → estado do progresso
  pages/                → Home, Roadmap, Apostila
```

### Adicionar uma apostila

Crie `src/apostilas/<id-da-trilha>/<id-da-etapa>.md` (e opcionalmente `.gabarito.md`). O link aparece sozinho no roadmap. Quadros de destaque usam citações com a primeira palavra em negrito:

```markdown
> **Cuidado! Cai na entrevista:** texto...
> **Analogia:** texto...
> **Na prática:** texto...
> **Regra dos 20 minutos:** texto...
```

### Trocar o armazenamento

O progresso passa pela interface `ProgressStorage` em `src/lib/storage.ts`. Para salvar num backend, implemente `load`/`save` com a API e troque a instância exportada em `progressStorage`.

## Deploy

Funciona em qualquer hospedagem estática. Na Vercel, o `vercel.json` redireciona todas as rotas para o `index.html` (necessário para o React Router).
