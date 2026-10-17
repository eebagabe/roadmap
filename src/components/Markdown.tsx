import { Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { slug } from '../lib/progress'

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

// O tipo do quadro vem da primeira palavra em negrito: "> **Cuidado! ...**".
const CALLOUTS: [RegExp, string][] = [
  [/^cuidado/i, 'border-amber-400 bg-amber-50 text-amber-950'],
  [/^analogia/i, 'border-sky-400 bg-sky-50 text-sky-950'],
  [/^(dica|na pr[aá]tica)/i, 'border-emerald-400 bg-emerald-50 text-emerald-950'],
  [/^(regra|aten[cç][aã]o)/i, 'border-rose-400 bg-rose-50 text-rose-950'],
]

const components: Components = {
  h2: ({ children }) => <h2 id={slug(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slug(textOf(children))}>{children}</h3>,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
  blockquote: ({ children }) => {
    const text = textOf(Children.toArray(children)).trim()
    const style = CALLOUTS.find(([re]) => re.test(text))?.[1] ?? 'border-stone-300 bg-stone-50 text-stone-800'
    return <blockquote className={`not-italic rounded-r-xl border-l-4 px-5 py-1 font-normal ${style}`}>{children}</blockquote>
  },
}

export function Markdown({ source }: { source: string }) {
  return (
    <div
      className="prose prose-stone max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-h1:text-3xl prose-h2:mt-14 prose-h2:border-b prose-h2:border-black/10 prose-h2:pb-2 prose-a:text-ink prose-blockquote:not-italic prose-code:rounded prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1f2430] prose-pre:text-[13px] prose-th:bg-black/5 prose-th:px-3 prose-td:px-3 [&_blockquote_p:first-child]:before:content-none [&_blockquote_p:last-child]:after:content-none [&_pre_code]:bg-transparent [&_pre_code]:p-0"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}

export function headings(source: string) {
  return [...source.matchAll(/^## (.+)$/gm)].map((m) => ({ text: m[1].trim(), id: slug(m[1].trim()) }))
}
