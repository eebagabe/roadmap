import type { Roadmap } from '../types'
import { dados } from './dados'
import { java } from './java'
import { llm } from './llm'
import { qa } from './qa'
import { react } from './react'

export const roadmaps: Roadmap[] = [java, react, qa, dados, llm]

export const findRoadmap = (id: string | undefined) => roadmaps.find((r) => r.id === id)
