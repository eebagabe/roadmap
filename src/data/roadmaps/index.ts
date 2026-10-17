import type { Roadmap } from '../types'
import { computacao } from './computacao'
import { dados } from './dados'
import { embarcados } from './embarcados'
import { java } from './java'
import { llm } from './llm'
import { qa } from './qa'
import { react } from './react'

export const roadmaps: Roadmap[] = [java, react, qa, dados, embarcados, computacao, llm]

export const findRoadmap = (id: string | undefined) => roadmaps.find((r) => r.id === id)
