import type { Roadmap } from '../types'
import { java } from './java'
import { llm } from './llm'
import { qa } from './qa'
import { react } from './react'

export const roadmaps: Roadmap[] = [java, react, qa, llm]

export const findRoadmap = (id: string | undefined) => roadmaps.find((r) => r.id === id)
