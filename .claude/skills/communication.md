---
name: communication
model: haiku
description: Skill de comunicação com Atlas Manager — notificações, chat protocol, anti-loop
description: notificar atlas, enviar mensagem, reportar, comunicar, am chat
tools: am_send_message, am_add_task_comment, am_update_task
---

# Skill: Comunicação via Atlas Manager

## Quando Usar

- Ao iniciar trabalho em uma task
- Ao concluir uma task ou feature
- Ao encontrar um blocker
- Para perguntas ao Atlas
- Para reportar impacto cross-project

## Formato de Notificação

### Template Base
```
am_send_message(
  channel_id: "<canal do projeto>",
  sender_name: "<Dev Nome>",
  sender_type: "agent",
  content: "@atlas [TIPO] | [resumo] | feature: [uuid ou nome]"
)
```

### Tipos de Mensagem

| Tipo | Quando | Exemplo |
|------|--------|---------|
| `feature_complete` | Feature finalizada | `@atlas feature_complete \| Formulário de login implementado \| feature: uuid` |
| `bug_fixed` | Bug corrigido | `@atlas bug_fixed \| Erro de validação no cadastro \| feature: uuid` |
| `commit` | Commit realizado | `@atlas commit \| feat(auth): implementar magic link \| hash: abc1234` |
| `blocker` | Bloqueio encontrado | `@atlas blocker \| Dependência de API não documentada \| feature: uuid` |
| `question` | Dúvida | `@atlas question \| Qual padrão para paginação? \| feature: uuid` |
| `cross_project_impact` | Impacto cross-project | `@atlas cross_project_impact \| Mudança na API de suporte \| projetos: admin, ensino` |

## Atualização de Tasks

### Ao Iniciar
```
am_update_task(task_id: "<id>", status: "in_progress")
```

### Ao Concluir
```
am_update_task(task_id: "<id>", status: "complete")
am_add_task_comment(task_id: "<id>", content: "Concluído. Commits: [hashes]. Arquivos alterados: [lista]")
```

## Modo Chat Monitor

Quando mensagem `[ATLAS MANAGER | canal:UUID] Nome: conteúdo` chegar na sessão `-chat`:

1. Extrair `channel_id` do UUID
2. Responder via `am_send_message`
3. **TEXTO SIMPLES** — zero markdown
4. Tom direto e objetivo

## Anti-Loop (CRÍTICO)

**NÃO responder a**:
- Confirmações: "Confirmado", "Roger", "Entendido", "Combinado"
- Eco: quando Atlas repete o que você disse
- Status de espera: "Aguardando", "Monitorando"

**RESPONDER apenas quando há**:
- Pergunta direta
- Nova instrução ou task
- Decisão que precisa de input
- Informação que muda o estado

## Regras

1. Toda comunicação em Português (pt-BR)
2. Texto simples no chat (sem markdown)
3. Sempre incluir referência à feature/task
4. Nunca perguntar ao Bruno se a resposta for operacional
5. Atualizar status da task ANTES de notificar
