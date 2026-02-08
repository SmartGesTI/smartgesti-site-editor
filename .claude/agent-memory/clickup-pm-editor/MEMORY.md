# ClickUp PM Editor - Memória Persistente

## IDs Essenciais

| Recurso | ID |
|---------|-----|
| Space SmartGesTI | 90174029631 |
| Folder Editor | 90176447853 |
| Backlog List | 901710728590 |
| Campo Módulo | f252478b-fb32-4ec6-931d-31942f6ba298 |

### Opções do Campo Módulo
| Módulo | Option ID |
|--------|-----------|
| Integração | 207cd575-71d6-4e98-abff-4f50cc4592bc |
| Editor | b9bb7589-598b-426e-adca-ef7cb92ebb07 |
| Plugins | 537d6df4-200b-46ef-ba36-5a4875eaf928 |
| PLG-Blog | d84ae84c-ebf5-4486-b138-1635cf057d0a |
| PLG-Ecommerce | 58c0c2f5-bcab-41bd-bff3-7427ecb2f21b |

## Padrões de Task Management

### Estrutura de Features
- Features são tasks pai (sem `parent`)
- Subtasks têm `parent` = ID da Feature pai
- Campo Módulo é OBRIGATÓRIO em todas as tasks
- Tags: área (frontend/backend/infraestrutura) + sprint-N + tipo (feature/bug/refactor)

### Sprints (Tags)
- sprint-0: Plugin System Infraestrutura (✅ completo)
- sprint-1: Blog Blocos (✅ completo)
- sprint-2: Blog Editor UI (✅ completo)
- sprint-3: Blog Backend & Data (✅ completo)
- sprint-4: Blog Viewer (✅ completo)
- sprint-5: Blog Admin (✅ completo) + Editor UX Improvements (✅ completo)
- sprint-6: E-commerce Blocos (⏳ backlog)
- sprint-7: E-commerce Admin (⏳ backlog)

### Status Flow
to do → in progress → complete

## Lições Aprendidas

### Acesso ao ClickUp — EXCLUSIVAMENTE via MCP
- **NUNCA** usar CLI, scripts Node.js (.mjs), ou chamadas diretas à API REST
- **SEMPRE** usar as tools MCP `mcp__clickup__*` disponíveis no ambiente
- Tools principais: `clickup_create_task`, `clickup_update_task`, `clickup_get_task`, `clickup_search`, `clickup_get_list`, `clickup_create_task_comment`
- Workspace ID é detectado automaticamente — não precisa passar manualmente

### Descrições de Tasks
- Usar Markdown com seções claras: ## Feito / ## Implementar / ## Critérios
- Incluir contexto técnico (nomes de arquivos, padrões)
- Marcar progresso visualmente (✅ / 🔲)
- Listar dependências entre subtasks quando relevante

### Features Complexas
- Quebrar em subtasks de ~1-2 dias de trabalho
- Agrupar subtasks relacionadas (ex: blocos por categoria)
- Primeira subtask deve ser "Infraestrutura" se aplicável
- Últimas subtasks devem ser "Documentação" ou "Testes"

### Dual Rendering Pattern
- Ao criar tasks de blocos, sempre mencionar "dual rendering"
- Renderer (React) + Exporter (HTML) devem estar sincronizados
- Criar subtask única quando múltiplos blocos compartilham mesmo pattern

## Referências Rápidas

### Criar Feature via MCP
```
mcp__clickup__clickup_create_task({
  list_id: "901710728590",
  name: "Feature Name",
  markdown_description: "Markdown description",
  tags: ["frontend", "feature", "sprint-5"],
  status: "in progress",
  priority: "normal",
  custom_fields: [{ id: "{campo_modulo_id}", value: "{modulo_id}" }]
})
```

### Criar Subtask via MCP
```
mcp__clickup__clickup_create_task({
  list_id: "901710728590",
  name: "Subtask Name",
  markdown_description: "Markdown description",
  parent: "{parent_task_id}",
  tags: ["frontend"],
  status: "to do",
  custom_fields: [{ id: "{campo_modulo_id}", value: "{modulo_id}" }]
})
```

### Buscar Tasks
```
mcp__clickup__clickup_search({ keywords: "blog", filters: { asset_types: ["task"] } })
```

## Features Recentes

### Editor UX - Click-to-Scroll & Overlay (86dzpf8zh) - ✅ Completo
- Sistema de navegação visual entre preview e painel de propriedades
- Click-to-scroll: clicar em sub-seção do preview rola para grupo de propriedades
- Selection overlay: toggle com outline e tooltips
- Group indicator: visual feedback de grupo focado
- data-block-group implementado em 14/14 blocos (dual rendering sync)
- Commits: e0c12b6 (infraestrutura + 4 blocos) + commit atual (10 blocos restantes)

## Próximas Ações

1. Sprint 6: E-commerce Plugin (blocos de produto, carrinho, checkout)
2. Sprint 7: E-commerce Admin (CRUD produtos, catálogo viewer)
