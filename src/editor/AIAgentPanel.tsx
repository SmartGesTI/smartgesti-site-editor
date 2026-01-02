/**
 * AI Agent Panel - Painel de geração de sites por IA
 * Permite ao usuário descrever o site desejado e gerar automaticamente
 */

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2, AlertCircle, ChevronDown, X } from 'lucide-react'
import { cn } from '../utils/cn'
import type { SiteDocumentV2 } from '../shared/schema'

// ============================================================================
// Types
// ============================================================================

/** JSON Patch Operation (RFC 6902) */
interface PatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: any
  from?: string
}

export interface AIAgentPanelProps {
  /** Callback quando um site é gerado com sucesso (modo gerar novo) */
  onGenerate: (document: SiteDocumentV2) => void
  /** Callback quando patches são gerados (modo edição rápida) */
  onApplyPatches?: (patches: PatchOperation[]) => void
  /** URL do endpoint de geração (opcional - pode ser configurado externamente) */
  apiEndpoint?: string
  /** Token de autenticação (opcional) */
  authToken?: string
  /** Callback para fechar o painel */
  onClose?: () => void
  /** Documento atual do editor (se fornecido, habilita modo edição) */
  currentDocument?: SiteDocumentV2
}

interface GenerationOptions {
  tone: 'formal' | 'informal' | 'technical' | 'friendly'
  language: string
  maxSections: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ============================================================================
// Templates sugeridos
// ============================================================================

const SUGGESTED_PROMPTS = [
  {
    label: 'SaaS / Software',
    prompt: 'Crie uma landing page moderna para um software de gestão empresarial, com foco em automação e produtividade',
  },
  {
    label: 'Escola / Curso',
    prompt: 'Crie uma landing page para uma escola de programação online, destacando os cursos e depoimentos de alunos',
  },
  {
    label: 'Portfolio',
    prompt: 'Crie uma landing page de portfolio para um designer UX/UI freelancer, com projetos em destaque',
  },
  {
    label: 'Empresa',
    prompt: 'Crie uma landing page para uma consultoria empresarial, destacando serviços e casos de sucesso',
  },
  {
    label: 'Evento',
    prompt: 'Crie uma landing page para uma conferência de tecnologia, com palestrantes e venda de ingressos',
  },
]

// ============================================================================
// Component
// ============================================================================

export function AIAgentPanel({
  onGenerate,
  onApplyPatches,
  apiEndpoint = '/api/sites/generate',
  authToken,
  onClose,
  currentDocument,
}: AIAgentPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [editMode, setEditMode] = useState(!!currentDocument)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [options, setOptions] = useState<GenerationOptions>({
    tone: 'formal',
    language: 'pt-BR',
    maxSections: 6,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll quando mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, descreva o site que deseja criar')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // MODO EDIÇÃO RÁPIDA: usar endpoint de patches
      if (editMode && currentDocument && onApplyPatches) {
        const patchEndpoint = apiEndpoint.replace('/generate', '/patch')
        
        const response = await fetch(patchEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            document: currentDocument,
            instruction: prompt.trim(),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Erro ao gerar patches')
        }

        console.log('[AIAgentPanel] Resultado da API:', result)
        
        if (result.patches && result.patches.length > 0) {
          console.log('[AIAgentPanel] Patches recebidos:', JSON.stringify(result.patches, null, 2))
          
          // Adicionar mensagem do usuário ao chat
          const userMessage = prompt.trim()
          setMessages(prev => [...prev, { role: 'user', content: userMessage }])
          
          // Aplicar patches
          onApplyPatches(result.patches)
          
          // Adicionar resposta do assistente
          const responseMessages = [
            'Pronto! Fiz a alteração. O que mais posso ajudar?',
            'Feito! Quer ajustar mais alguma coisa?',
            'Alteração aplicada! Posso ajudar com algo mais?',
            'Pronto! Ficou bom? Posso fazer outros ajustes.',
          ]
          const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)]
          setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
          
          setPrompt('')
        } else {
          throw new Error('Nenhuma alteração foi gerada')
        }
        return
      }

      // MODO GERAR NOVO: usar endpoint de geração
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          options: {
            tone: options.tone,
            language: options.language,
            maxSections: options.maxSections,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao gerar site')
      }

      if (result.document) {
        onGenerate(result.document)
        setPrompt('')
      }
    } catch (err: any) {
      console.error('Erro ao gerar site:', err)
      setError(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Agente Gerador de Sites
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Descreva e gere automaticamente
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-3 rounded-lg text-sm',
                  msg.role === 'user'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 ml-4'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-4'
                )}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Mode Toggle */}
        {currentDocument && (
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setEditMode(true)}
              className={cn(
                'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                editMode
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              ✏️ Editar Atual
            </button>
            <button
              onClick={() => setEditMode(false)}
              className={cn(
                'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                !editMode
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              ✨ Gerar Novo
            </button>
          </div>
        )}

        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {editMode ? 'Descreva a alteração que deseja fazer' : 'Descreva o site que deseja criar'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder={editMode 
              ? "Ex: Mude a cor do navbar para verde, adicione uma seção de depoimentos, remova a seção de preços..."
              : "Ex: Crie uma landing page para uma startup de tecnologia, com seção de features, preços e depoimentos..."
            }
            rows={4}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg border transition-all resize-none',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-gray-100',
              'placeholder-gray-400 dark:placeholder-gray-500',
              error
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500',
              'focus:ring-2 focus:outline-none'
            )}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Pressione <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Enter</kbd> para gerar
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Options Toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showOptions && 'rotate-180')} />
          Opções avançadas
        </button>

        {/* Options */}
        {showOptions && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
            {/* Tone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tom do texto
              </label>
              <select
                value={options.tone}
                onChange={(e) => setOptions({ ...options, tone: e.target.value as any })}
                className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="formal">Formal / Corporativo</option>
                <option value="informal">Informal / Descontraído</option>
                <option value="technical">Técnico / Especializado</option>
                <option value="friendly">Amigável / Acolhedor</option>
              </select>
            </div>

            {/* Max Sections */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de seções
              </label>
              <input
                type="range"
                min="4"
                max="10"
                value={options.maxSections}
                onChange={(e) => setOptions({ ...options, maxSections: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Mínimo (4)</span>
                <span className="font-medium">{options.maxSections} seções</span>
                <span>Máximo (10)</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sugestões rápidas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                disabled={isLoading}
                className={cn(
                  'px-2 py-1 text-xs rounded-full transition-all',
                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                  'hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Generate Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className={cn(
            'w-full py-2.5 rounded-lg text-sm font-medium transition-all',
            'bg-gradient-to-r from-purple-500 to-blue-600 text-white',
            'hover:from-purple-600 hover:to-blue-700 hover:shadow-lg',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
            'flex items-center justify-center gap-2'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando site...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Gerar Site com IA
            </>
          )}
        </button>
        
        {isLoading && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Isso pode levar alguns segundos...
          </p>
        )}
      </div>
    </div>
  )
}

export default AIAgentPanel
