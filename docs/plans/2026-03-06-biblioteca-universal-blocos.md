# Biblioteca Universal de Blocos - Fase 1: Inventario e Padronizacao

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Inventario completo de todos os blocos e templates, com proposta de nomes em portugues para usuario final.

**Architecture:** Fase 1 e apenas levantamento e padronizacao — nenhum codigo sera alterado. O resultado e um documento de referencia para Fase 2 (UI do Modal) e Fase 3 (compatibilidade cross-template).

**Tech Stack:** N/A (documento de referencia)

---

## 1. Templates Existentes

| ID | Nome | Categoria | Descricao |
|----|------|-----------|-----------|
| escola-premium | Colegio Vanguarda | education | Hero fullscreen, video, FAQ, pricing, depoimentos |
| escola-edvi | Edvi | education | Countdown admissao, carousel, blog, equipe, contato |
| escola-zilom | Template Chat | education | Cursos, categorias, depoimentos, newsletter |
| escola-blog | Escola Blog | education | Template simples com blog integrado (plugin) |
| smartgesti-admin | SmartGesti Admin | business | Modulos, beneficios, contato, depoimentos |
| *generator* | Gerador Automatico | N/A | `generateCompleteLandingPage()` — template programatico |

---

## 2. Inventario Completo de Blocos (53 tipos)

### 2.1 Layout (5 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| container | Container | Contêiner | Area com largura maxima e margens | layout |
| stack | Stack | Pilha Flexivel | Empilha elementos na vertical ou horizontal | layout |
| grid | Grid | Grade | Layout em colunas responsivo | layout |
| box | Box | Caixa | Area generica com estilos customizaveis | layout |
| spacer | Spacer | Espacador | Espaco vazio entre elementos | layout |

### 2.2 Conteudo (11 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| heading | Heading | Titulo | Titulo de H1 a H6 | content |
| text | Text | Texto | Paragrafo de texto | content |
| image | Image | Imagem | Imagem com alt text | content |
| button | Button | Botao | Botao com link e estilo | content |
| link | Link | Link | Link de texto | content |
| divider | Divider | Divisor | Linha horizontal separadora | content |
| badge | Badge | Etiqueta | Tag colorida | content |
| icon | Icon | Icone | Icone SVG (Lucide) | content |
| avatar | Avatar | Avatar | Foto circular com fallback por iniciais | content |
| video | Video | Video | Embed de video (YouTube/Vimeo) | content |
| socialLinks | Social Links | Redes Sociais | Links para redes sociais com icones | content |

### 2.3 Composicao (2 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| section | Section | Secao | Container de secao com fundo | composition |
| card | Card | Cartao | Card com cabecalho, conteudo e rodape | composition |

### 2.4 Formularios (4 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| form | Form | Formulario | Container de formulario com envio | forms |
| input | Input | Campo de Texto | Campo de entrada (texto, email, tel) | forms |
| textarea | Textarea | Campo de Texto Longo | Area de texto para mensagens | forms |
| formSelect | Select | Menu Suspenso | Dropdown com opcoes | forms |

### 2.5 Secoes Principais (20 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| navbar | Navbar | Barra de Navegacao | Menu principal do site | sections |
| hero | Hero | Banner Principal | Secao de destaque com titulo, imagem e botoes | sections |
| footer | Footer | Rodape | Rodape do site com links e redes sociais | sections |
| featureGrid | Feature Grid | Grade de Recursos | Grid com icones e descricoes de recursos | sections |
| feature | Feature | Recurso | Card individual de recurso/diferencial | sections |
| pricing | Pricing | Planos e Precos | Tabela de precos com planos | sections |
| pricingCard | Pricing Card | Cartao de Preco | Card individual de plano | sections |
| testimonialGrid | Testimonial Grid | Grade de Depoimentos | Grid com depoimentos de clientes | sections |
| testimonial | Testimonial | Depoimento | Card individual de depoimento | sections |
| faq | FAQ | Perguntas Frequentes | Secao de perguntas e respostas | sections |
| faqItem | FAQ Item | Pergunta | Item individual do FAQ | sections |
| stats | Stats | Estatisticas | Secao com numeros e indicadores | sections |
| statItem | Stat Item | Indicador | Item individual de estatistica | sections |
| cta | CTA | Chamada para Acao | Secao com botao de acao destacado | sections |
| logoCloud | Logo Cloud | Logos de Parceiros | Grid de logos de empresas/parceiros | sections |
| countdown | Countdown | Contagem Regressiva | Contador para eventos e prazos | sections |
| carousel | Carousel | Carrossel de Slides | Slider com slides de conteudo | sections |
| imageGallery | Galeria de Imagens | Galeria de Imagens | Galeria com lightbox, zoom e 5 layouts | sections |
| teamGrid | Team Grid | Equipe | Grid com membros da equipe | sections |
| teamCard | Team Card | Membro da Equipe | Card individual de membro | sections |

### 2.6 Secoes Avancadas (3 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| productShowcase | Product Showcase | Vitrine de Produtos | Produtos com layout alternado imagem/texto | sections |
| aboutSection | About Section | Sobre Nos | Secao institucional com imagem e conquistas | sections |
| contactSection | Contact Section | Contato | Formulario de contato com informacoes | sections |

### 2.7 Blog Nativo (2 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| blogCard | Blog Card | Card de Noticia | Card individual de post/noticia | sections |
| blogCardGrid | Blog Card Grid | Grade de Noticias | Grid de cards de blog/noticias | sections |

### 2.8 Blog Plugin (6 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria | Plugin |
|------|------------|-------------------|--------------|-----------|--------|
| blogPostCard | Blog Post Card | Card de Post | Card de post do blog (dinamico) | sections | blog |
| blogPostGrid | Blog Post Grid | Grade de Posts | Grid de posts com dados dinamicos | sections | blog |
| blogPostDetail | Blog Post Detail | Conteudo do Post | Pagina completa de um post | sections | blog |
| blogCategoryFilter | Blog Category Filter | Filtro de Categorias | Sidebar com filtro por categoria | sections | blog |
| blogSearchBar | Blog Search Bar | Busca do Blog | Barra de busca para posts | sections | blog |
| blogRecentPosts | Posts Recentes | Posts Recentes | Widget com posts mais recentes | sections | blog |
| blogTagCloud | Nuvem de Tags | Nuvem de Tags | Widget com tags dos posts | sections | blog |

### 2.9 Educacao (2 blocos)

| type | Nome Atual | Nome PT (Proposta) | Descricao PT | Categoria |
|------|------------|-------------------|--------------|-----------|
| courseCardGrid | Course Card Grid | Grade de Cursos | Grid de cards de curso com preco e avaliacao | sections |
| categoryCardGrid | Category Card Grid | Grade de Categorias | Grid de categorias com imagem de fundo | sections |

---

## 3. Mapa de Blocos por Template

| Bloco | Premium | Edvi | Zilom | Blog | Admin | Generator |
|-------|---------|------|-------|------|-------|-----------|
| navbar | X | X | X | X | X | X |
| hero | X | X | X | X | X | X |
| footer | X | X | X | X | X | - |
| featureGrid | X | X | X | X | X | X |
| section | X | X | X | - | - | X |
| container | X | X | X | - | - | X |
| heading | X | - | X | - | - | X |
| text | X | - | X | - | - | X |
| stack | - | X | X | - | - | X |
| grid | - | X | X | - | - | X |
| image | - | X | X | - | - | X |
| button | - | X | X | - | - | X |
| box | - | - | X | - | - | X |
| spacer | X | - | - | - | - | - |
| video | X | - | - | - | - | - |
| divider | - | - | - | - | - | X |
| stats | X | - | - | - | X | X |
| testimonialGrid | X | - | X | - | X | X |
| faq | X | - | - | - | X | X |
| pricing | X | - | - | - | - | X |
| cta | - | - | - | X | X | - |
| logoCloud | X | - | - | - | - | X |
| countdown | - | X | - | - | - | - |
| carousel | - | X | - | - | - | - |
| blogCardGrid | - | X | X | - | - | - |
| teamGrid | - | X | - | - | - | - |
| form | - | X | X | - | - | - |
| input | - | X | X | - | - | - |
| formSelect | - | X | - | - | - | - |
| textarea | - | X | - | - | - | - |
| courseCardGrid | - | - | X | - | - | - |
| categoryCardGrid | - | - | X | - | - | - |
| productShowcase | - | - | - | - | X | - |
| aboutSection | - | - | - | - | X | - |
| imageGallery | - | - | - | - | X | - |
| contactSection | - | - | - | - | X | - |

---

## 4. Blocos Duplicados/Equivalentes

| Grupo | Blocos | Observacao |
|-------|--------|-----------|
| Blog cards | `blogCard` / `blogPostCard` | `blogCard` e nativo, `blogPostCard` e do plugin. Funcionalidade similar mas `blogPostCard` suporta dados dinamicos via ContentProvider |
| Blog grids | `blogCardGrid` / `blogPostGrid` | Mesmo caso — nativo vs plugin. `blogPostGrid` tem mais props (variações, CTA, paginacao) |
| Blocos nunca usados em templates | `link`, `badge`, `icon`, `avatar`, `card`, `socialLinks`, `feature`, `pricingCard`, `testimonial`, `faqItem`, `statItem`, `teamCard` | Sao filhos de blocos compostos (ex: `testimonial` dentro de `testimonialGrid`) ou blocos primitivos disponiveis no editor mas nao usados diretamente em templates |

---

## 5. Blocos Exclusivos por Template

| Template | Blocos Exclusivos |
|----------|-------------------|
| escola-premium | spacer, video |
| escola-edvi | countdown, carousel, teamGrid, formSelect, textarea |
| escola-zilom | courseCardGrid, categoryCardGrid |
| escola-blog | (nenhum — usa subset minimo) |
| smartgesti-admin | productShowcase, aboutSection, imageGallery, contactSection |

---

## 6. Classificacao para Biblioteca Universal

### Blocos Universais (usar em qualquer template)

Todos os 53 blocos devem estar disponiveis na biblioteca. A divisao em categorias para o modal:

| Categoria PT | Blocos | Qtd |
|-------------|--------|-----|
| Estrutura | Contêiner, Pilha Flexivel, Grade, Caixa, Espacador, Secao, Cartao | 7 |
| Texto e Midia | Titulo, Texto, Imagem, Botao, Link, Divisor, Etiqueta, Icone, Avatar, Video, Redes Sociais | 11 |
| Formularios | Formulario, Campo de Texto, Campo de Texto Longo, Menu Suspenso | 4 |
| Banner e Navegacao | Barra de Navegacao, Banner Principal, Rodape | 3 |
| Marketing | Grade de Recursos, Recurso, Planos e Precos, Cartao de Preco, Chamada para Acao, Logos de Parceiros, Contagem Regressiva | 7 |
| Prova Social | Grade de Depoimentos, Depoimento, Estatisticas, Indicador | 4 |
| Galeria e Midia | Galeria de Imagens, Carrossel de Slides | 2 |
| Equipe | Equipe, Membro da Equipe | 2 |
| Institucional | Vitrine de Produtos, Sobre Nos, Contato | 3 |
| Blog e Noticias | Card de Noticia, Grade de Noticias | 2 |
| Blog (Plugin) | Card de Post, Grade de Posts, Conteudo do Post, Filtro de Categorias, Busca do Blog, Posts Recentes, Nuvem de Tags | 7 |
| Educacao | Grade de Cursos, Grade de Categorias | 2 |

### Blocos Especiais (restricoes)

| Bloco | Restricao |
|-------|-----------|
| navbar | Maximo 1 por pagina, sempre no topo |
| footer | Maximo 1 por pagina, sempre no final |
| Blog Plugin (7 blocos) | Requer plugin Blog ativo |

---

## 7. Proximos Passos (Fase 2)

### Task 1: Renomear blocos no registry
Atualizar `name` e `description` em todos os block definitions para portugues (conforme tabela acima).

### Task 2: Adicionar campo `userCategory` ao BlockDefinition
Nova prop para categorizar blocos na biblioteca (ex: "Marketing", "Prova Social").

### Task 3: UI do Modal de Biblioteca
Modal com busca, filtro por categoria, preview de cada bloco, botao "Adicionar".

### Task 4: Logica de insercao cross-template
Ao inserir bloco de outro template, garantir que as props default funcionam sem depender de contexto do template original.

---

## Decisoes Pendentes para Atlas/Bruno

1. **Blog nativo vs plugin**: Manter ambos (`blogCard`/`blogCardGrid` + `blogPostCard`/`blogPostGrid`) ou deprecar o nativo?
2. **Blocos filhos**: Mostrar `feature`, `testimonial`, `faqItem`, etc. na biblioteca? Sao filhos de grids compostos — inserir isolado faz sentido?
3. **Categorias**: As 12 categorias propostas estao adequadas ou simplificar?
4. **Restricoes**: Alem de navbar/footer/blog-plugin, algum bloco deve ter restricao de uso?
