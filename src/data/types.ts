export type Week = {
  id: string
  title: string
  topics: string[]
}

export type Section = {
  id: string
  title: string
  /** Uma frase simples explicando por que essa etapa importa. */
  summary: string
  weeks: Week[]
}

export type Company = {
  name: string
  /** Como a empresa usa a tecnologia, em linguagem simples. */
  how: string
}

export type ProjectLevel = 'Iniciante' | 'Intermediário' | 'Avançado'

export type Project = {
  id: string
  title: string
  level: ProjectLevel
  description: string
  skills: string[]
}

export type Roadmap = {
  id: string
  title: string
  /** Nome curto para cards e menus. */
  short: string
  icon: string
  /** Cor de destaque do roadmap (hex). */
  accent: string
  objective: string
  /** Conversa inicial: o que é a área e por que vale a pena. */
  intro: string
  status: 'disponivel' | 'em-breve'
  sections: Section[]
  companiesTitle: string
  /** Frase abaixo do título da seção de empresas; há um texto padrão. */
  companiesSubtitle?: string
  companies: Company[]
  projects: Project[]
}
