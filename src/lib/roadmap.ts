import type { Roadmap, Section, Week } from '../data/types'
import { topicKey } from './progress'

export type NumberedWeek = Week & { number: number }
export type NumberedSection = Omit<Section, 'weeks'> & { weeks: NumberedWeek[] }

/** Numera as semanas de forma contínua ao longo do roadmap. */
export function numberedSections(roadmap: Roadmap): NumberedSection[] {
  let n = 0
  return roadmap.sections.map((s) => ({ ...s, weeks: s.weeks.map((w) => ({ ...w, number: ++n })) }))
}

export const totalWeeks = (roadmap: Roadmap) => roadmap.sections.reduce((acc, s) => acc + s.weeks.length, 0)

export const weekTopicKeys = (roadmapId: string, week: Week) => week.topics.map((t) => topicKey(roadmapId, week.id, t))

export const sectionTopicKeys = (roadmapId: string, section: Section) =>
  section.weeks.flatMap((w) => weekTopicKeys(roadmapId, w))

export const roadmapTopicKeys = (roadmap: Roadmap) => roadmap.sections.flatMap((s) => sectionTopicKeys(roadmap.id, s))

export const countDone = (keys: string[], done: Record<string, true>) => keys.filter((k) => done[k]).length

export type NextTopic = { section: Section; week: Week; topic: string; key: string }

export function findNextTopic(roadmap: Roadmap, done: Record<string, true>): NextTopic | undefined {
  for (const section of roadmap.sections)
    for (const week of section.weeks)
      for (const topic of week.topics) {
        const key = topicKey(roadmap.id, week.id, topic)
        if (!done[key]) return { section, week, topic, key }
      }
}

export const pad = (n: number) => String(n).padStart(2, '0')
