# Deploy - SmartGesti Site Editor

## Pré-Publish Checklist

- [ ] `npm run build` → sem erros
- [ ] `npm run lint` → sem warnings críticos
- [ ] `npm run demo` → validação manual OK
- [ ] Dual rendering sync (React + HTML) verificado
- [ ] Changelog atualizado (se relevante)
- [ ] Version bump adequado (patch/minor/major)

## Publishing Workflow

### Patch (Bug fixes)
```bash
npm run version:patch
```

### Minor (New features, backwards compatible)
```bash
npm run version:minor
```

### Major (Breaking changes)
```bash
npm run version:major
```

**O que faz**:
1. Bump version em `package.json`
2. Git commit + tag
3. Git push (origin + tags)
4. NPM publish

## Consumers Update

Após publicar nova versão, consumers (Ensino, Portfolios) devem atualizar:

```bash
# No projeto consumer
npm update @brunoalz/smartgesti-site-editor
npm install
npm run dev  # Testar
```

## Breaking Changes

Se houver breaking changes:
1. **Bump major version** (ex: 1.5.0 → 2.0.0)
2. **Notificar Atlas** via Chat (8cqa2fd-877) para comunicar aos consumers
3. **Documentar migration guide** se necessário
4. **Tag `integracao`** em task do ClickUp

## Local Development (Consumers)

Para testar mudanças antes de publicar:

```bash
# No editor/
npm run build

# No consumer
USE_LOCAL_EDITOR=true npm run setup:editor
npm install
npm run dev
```

## Rollback

Se versão publicada tiver problemas:

1. **Deprecate** versão problemática: `npm deprecate @brunoalz/smartgesti-site-editor@X.Y.Z "reason"`
2. **Publish hotfix**: `npm run version:patch` com correção
3. **Notificar consumers**: Via Atlas Chat

## Monitoramento

- **NPM stats**: `npm view @brunoalz/smartgesti-site-editor`
- **Versão atual**: Verificar em `package.json` ou NPM registry
- **Consumers usando**: Verificar `package.json` de Ensino/Portfolios
