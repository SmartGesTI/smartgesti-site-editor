---
name: code-quality
description: Skill de qualidade de código — build, lint, testes e boas práticas antes de commits
description: build, lint, verificar código, qualidade, antes de commitar, testar
---

# Skill: Qualidade de Código

## Quando Usar

- Antes de qualquer commit
- Ao finalizar uma feature ou task
- Quando o código precisa de revisão

## Checklist Pré-Commit (Obrigatório)

### 1. Build
```bash
npm run build          # ou build:frontend + build:backend
```
- ❌ Se falhar: corrigir TODOS os erros antes de prosseguir
- ❌ NUNCA commitar com build quebrado
- ✅ Build limpo = prosseguir

### 2. Lint
```bash
npm run lint
```
- Corrigir warnings relevantes
- Erros de lint = corrigir obrigatoriamente

### 3. Verificação de Tipos
- TypeScript strict mode
- Sem `any` desnecessário
- Interfaces/types explícitos para props e retornos

### 4. Formato de Commit
```
tipo(escopo): descrição em português

Tipos válidos:
- feat: nova funcionalidade
- fix: correção de bug
- refactor: refatoração sem mudança de comportamento
- docs: documentação
- style: formatação, sem mudança de lógica
- test: testes
- chore: manutenção, dependências
```

## Regras de Código

### TypeScript
- Tipagem explícita em funções públicas
- Evitar `any` — usar `unknown` quando necessário
- Interfaces para objetos complexos
- Enums para conjuntos fixos de valores

### React (Frontend)
- Hooks ANTES de early returns
- Componentes funcionais (sem classes)
- Props tipadas com interface
- Keys únicas em listas
- Sem side effects em render

### NestJS (Backend)
- Services com injeção de dependência
- DTOs com class-validator
- Guards para autenticação/autorização
- Error handling com HttpException

### Database
- Migrations idempotentes (IF NOT EXISTS)
- RLS policies em todas as tabelas
- Soft delete (deleted_at IS NULL)
- Índices para queries frequentes

## REGRA CRÍTICA

**NUNCA commitar sem aprovação explícita do Bruno.**

Workflow:
1. Implementar
2. Build obrigatório (frontend + backend)
3. Verificar zero erros
4. Solicitar aprovação do Bruno
5. Só então commitar
