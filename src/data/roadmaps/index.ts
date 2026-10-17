import type { Roadmap } from '../types'
import { java } from './java'
import { llm } from './llm'

export const roadmaps: Roadmap[] = [java, llm]

export const findRoadmap = (id: string | undefined) => roadmaps.find((r) => r.id === id)
