/**
 * Blog Plugin Manifest
 * Plugin para blog com posts, categorias e tags.
 *
 * onActivate:
 *  1. Injeta seção blogPostGrid na home page (antes do footer)
 *  2. Cria página "Blog" com navbar + grid de posts + footer
 *  3. Cria página "Post" com navbar + detalhe do post + footer
 *
 * onDeactivate:
 *  1. Remove a seção injetada na home page
 *  2. Remove as páginas do plugin
 */

import type { PluginRegistration } from "../../types";
import type { SiteDocument, Block, BlockType } from "../../../schema/siteDocument";
import { pluginRegistry } from "../../pluginRegistry";
import { logger } from "../../../../utils/logger";

// ─── ID usado para a seção de blog injetada na home page ───
const BLOG_HOME_SECTION_ID = "plugin-blog-home-grid";

// ─── Sample blog cards para preview ───
const SAMPLE_BLOG_CARDS = [
  {
    title: "Feira de Ciências 2026: Inovação e Criatividade",
    excerpt:
      "Nossos alunos apresentaram projetos incríveis na Feira de Ciências deste ano. Confira os destaques e premiações!",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
    category: "Eventos",
    date: "05 Fev 2026",
    linkHref: "/site/p/blog/feira-de-ciencias-2026",
    linkText: "Ler mais",
  },
  {
    title: "Matrículas Abertas para o Segundo Semestre",
    excerpt:
      "Garanta a vaga do seu filho na melhor escola da região. Condições especiais para matrículas antecipadas.",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop",
    category: "Institucional",
    date: "01 Fev 2026",
    linkHref: "/site/p/blog/matriculas-segundo-semestre",
    linkText: "Ler mais",
  },
  {
    title: "5 Dicas para Preparar seu Filho para o Ano Letivo",
    excerpt:
      "Dicas práticas para uma transição tranquila e um início de ano produtivo para toda a família.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    category: "Educação",
    date: "28 Jan 2026",
    linkHref: "/site/p/blog/dicas-preparar-ano-letivo",
    linkText: "Ler mais",
  },
  {
    title: "Projeto de Robótica Conquista Prêmio Regional",
    excerpt:
      "Nossa equipe de robótica conquistou o primeiro lugar na competição regional. Saiba como foi essa jornada!",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    category: "Conquistas",
    date: "22 Jan 2026",
    linkHref: "/site/p/blog/robotica-premio-regional",
    linkText: "Ler mais",
  },
  {
    title: "Como a Tecnologia Transforma a Educação",
    excerpt:
      "Descubra como ferramentas digitais e metodologias ativas estão revolucionando o aprendizado em sala de aula.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
    category: "Educação",
    date: "18 Jan 2026",
    linkHref: "/site/p/blog/tecnologia-educacao",
    linkText: "Ler mais",
  },
  {
    title: "Calendário Escolar 2026: Datas Importantes",
    excerpt:
      "Confira todas as datas importantes do ano letivo 2026, incluindo feriados, provas e eventos especiais.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop",
    category: "Institucional",
    date: "10 Jan 2026",
    linkHref: "/site/p/blog/calendario-escolar-2026",
    linkText: "Ler mais",
  },
  {
    title: "Atividades Extracurriculares: Inscrições Abertas",
    excerpt:
      "Música, esportes, artes e idiomas. Conheça as atividades disponíveis e inscreva seu filho!",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=400&fit=crop",
    category: "Novidades",
    date: "05 Jan 2026",
    linkHref: "/site/p/blog/atividades-extracurriculares",
    linkText: "Ler mais",
  },
  {
    title: "Parceria com Universidades para Projetos de Pesquisa",
    excerpt:
      "Alunos do Ensino Médio agora podem participar de projetos de iniciação científica em parceria com universidades da região.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
    category: "Conquistas",
    date: "28 Dez 2025",
    linkHref: "/site/p/blog/parceria-universidades",
    linkText: "Ler mais",
  },
  {
    title: "Semana da Leitura: Escritores Visitam a Escola",
    excerpt:
      "Autores renomados da literatura infanto-juvenil participaram de bate-papos e oficinas com nossos alunos.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    category: "Eventos",
    date: "20 Dez 2025",
    linkHref: "/site/p/blog/semana-leitura",
    linkText: "Ler mais",
  },
  {
    title: "Olimpíada de Matemática: Resultados Impressionantes",
    excerpt:
      "Nossos alunos conquistaram 5 medalhas de ouro e 8 de prata na Olimpíada Regional de Matemática 2025.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
    category: "Conquistas",
    date: "15 Dez 2025",
    linkHref: "/site/p/blog/olimpiada-matematica",
    linkText: "Ler mais",
  },
  {
    title: "Nova Biblioteca Digital para Alunos e Professores",
    excerpt:
      "A escola lança plataforma digital com mais de 10.000 livros, artigos e materiais didáticos acessíveis de qualquer dispositivo.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop",
    category: "Novidades",
    date: "10 Dez 2025",
    linkHref: "/site/p/blog/biblioteca-digital",
    linkText: "Ler mais",
  },
  {
    title: "Formatura do Ensino Médio: Celebrando Conquistas",
    excerpt:
      "Uma noite emocionante de celebração para os formandos de 2025. Confira os melhores momentos da cerimônia.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=400&fit=crop",
    category: "Eventos",
    date: "05 Dez 2025",
    linkHref: "/site/p/blog/formatura-2025",
    linkText: "Ler mais",
  },
  {
    title: "Projeto Horta Escolar: Aprendendo com a Natureza",
    excerpt:
      "Alunos do Fundamental cultivam alimentos orgânicos e aprendem sobre sustentabilidade, nutrição e trabalho em equipe.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    category: "Educação",
    date: "28 Nov 2025",
    linkHref: "/site/p/blog/horta-escolar",
    linkText: "Ler mais",
  },
];

// ─── Conteúdo HTML rico para o post de exemplo ───
const SAMPLE_POST_CONTENT = `
<h2>O que é a Feira de Ciências?</h2>
<p>A Feira de Ciências é um evento anual que celebra a curiosidade, a pesquisa e a criatividade dos nossos alunos. Nesta edição especial de 2026, recebemos mais de <strong>500 visitantes</strong> e contamos com a participação de todas as turmas do Ensino Fundamental e Médio.</p>
<p>Este ano, o tema central foi <em>"Ciência e Sustentabilidade"</em>, incentivando os estudantes a desenvolverem projetos que aliassem inovação tecnológica com responsabilidade ambiental.</p>

<h2>Destaques da Edição 2026</h2>
<p>Entre os mais de 50 projetos apresentados, alguns se destacaram pela originalidade e impacto:</p>
<ul>
  <li><strong>Jardim Sustentável Inteligente</strong> — Alunos do 5º ano desenvolveram um sistema de irrigação automática usando sensores de umidade e placa Arduino.</li>
  <li><strong>Robótica Educacional</strong> — A turma do 8º ano criou um robô que auxilia no ensino de matemática para crianças do 1º ao 3º ano.</li>
  <li><strong>Energia Solar na Escola</strong> — Projeto do 2º ano do Ensino Médio demonstrou como painéis solares poderiam reduzir em 40% o consumo de energia da escola.</li>
</ul>

<blockquote>
  <p>"A Feira de Ciências é um dos momentos mais importantes do nosso calendário escolar. Ver a dedicação e o brilho nos olhos dos alunos ao apresentarem seus projetos nos enche de orgulho e nos motiva a continuar investindo em educação de qualidade."</p>
  <p><strong>— Prof. Maria Silva, Coordenadora Pedagógica</strong></p>
</blockquote>

<h2>Premiações</h2>
<p>O júri, composto por professores universitários e profissionais da área de tecnologia, selecionou os três melhores projetos:</p>
<ol>
  <li><strong>1º Lugar:</strong> Jardim Sustentável Inteligente (5º ano)</li>
  <li><strong>2º Lugar:</strong> Energia Solar na Escola (2º EM)</li>
  <li><strong>3º Lugar:</strong> Robótica Educacional (8º ano)</li>
</ol>

<h2>Próximos Passos</h2>
<p>Os três projetos finalistas representarão nossa escola na <strong>Feira Regional de Ciências</strong>, que acontecerá em março na capital. Os alunos já estão se preparando para levar suas apresentações a um público ainda maior.</p>
<p>Parabéns a todos os participantes, professores orientadores e famílias que apoiaram essa jornada de descobertas!</p>
`.trim();

/**
 * Deep-clone um bloco com novo ID
 */
function cloneBlock(block: Block, newId: string): Block {
  const cloned: Block = JSON.parse(JSON.stringify(block));
  return { ...cloned, id: newId };
}

export const blogPlugin: PluginRegistration = {
  manifest: {
    id: "blog",
    version: "1.0.0",
    name: "Blog",
    description: "Blog com posts, categorias e tags",
    icon: "FileText",

    capabilities: {
      blocks: ["blogPostCard", "blogPostGrid", "blogPostDetail", "blogCategoryFilter", "blogSearchBar", "blogRecentPosts", "blogTagCloud"],

      pageTemplates: [
        {
          id: "blog-listing",
          name: "Blog",
          slug: "blog",
          pluginId: "blog",
          structure: [],
          dataSource: {
            provider: "blog-posts",
            mode: "list",
          },
        },
        {
          id: "blog-post",
          name: "Post",
          slug: "blog/:slug",
          pluginId: "blog",
          structure: [],
          dataSource: {
            provider: "blog-posts",
            mode: "single",
            paramMapping: { slug: ":slug" },
          },
          editRestrictions: {
            nonRemovable: true,
          },
        },
      ],

      dataSchemas: [
        {
          type: "blog-post",
          label: "Blog Post",
          fields: [
            { name: "title", type: "string", required: true, label: "Title" },
            { name: "slug", type: "string", required: true, label: "Slug" },
            { name: "excerpt", type: "string", label: "Excerpt" },
            { name: "content", type: "richtext", required: true, label: "Content" },
            { name: "featuredImage", type: "image", label: "Featured Image" },
            { name: "category", type: "string", label: "Category" },
            { name: "tags", type: "array", label: "Tags" },
            { name: "authorVariant", type: "string", label: "Author Variant" },
            { name: "readingTime", type: "number", label: "Reading Time" },
            { name: "metaTitle", type: "string", label: "Meta Title (SEO)" },
            { name: "metaDescription", type: "string", label: "Meta Description (SEO)" },
            { name: "ogImage", type: "image", label: "Open Graph Image" },
          ],
        },
      ],

      contentProviders: ["blog-posts", "blog-categories"],
    },

    restrictions: {
      lockedFields: {
        blogPostDetail: ["content", "date"],
      },
      requiredPages: ["blog-listing", "blog-post"],
    },
  },

  onActivate(document: SiteDocument): SiteDocument {
    logger.debug("Blog plugin activating...");

    const existingPageIds = new Set(document.pages.map((p) => p.id));
    const newPages = [...document.pages];

    // ── Encontrar home page para clonar navbar/footer ──
    const homePage =
      document.pages.find((p) => p.slug === "home") || document.pages[0];

    const homeNavbar = homePage?.structure.find((b) => b.type === "navbar");
    const homeFooter = homePage?.structure.find((b) => b.type === "footer");

    // ── 1. Adicionar link "Blog" à navbar da home page ──
    // Preserva os links existentes e apenas insere "Blog" antes do último item.
    if (homePage && homeNavbar) {
      const homeIdx = newPages.findIndex((p) => p.id === homePage.id);
      if (homeIdx >= 0) {
        const navbarProps = homeNavbar.props as Record<string, any>;
        let existingLinks: Array<{ text: string; href: string }> =
          Array.isArray(navbarProps.links) ? [...navbarProps.links] : [];

        // Limpar link antigo com href errado (/p/blog sem /site prefix)
        existingLinks = existingLinks.filter((l) => l.href !== "/p/blog");

        const hasBlogLink = existingLinks.some(
          (l) => l.href === "/site/p/blog",
        );

        if (!hasBlogLink) {
          // Inserir "Blog" antes do último link (geralmente "Contato")
          const insertIdx = existingLinks.length > 0 ? existingLinks.length - 1 : 0;
          existingLinks.splice(insertIdx, 0, { text: "Blog", href: "/site/p/blog" });

          // Atualizar navbar na home page com o novo link
          const updatedStructure = newPages[homeIdx].structure.map((b) => {
            if (b.id === homeNavbar.id) {
              return { ...b, props: { ...b.props, links: existingLinks } } as Block;
            }
            return b;
          });
          newPages[homeIdx] = { ...newPages[homeIdx], structure: updatedStructure };
          logger.debug("Blog link added to home navbar");

          // Atualizar referência para que clones nas páginas do blog usem navbar com link
          // (homeNavbar é const, então criamos a versão atualizada para uso nos clones)
          (homeNavbar as any).props = { ...navbarProps, links: existingLinks };
        }
      }
    }

    // ── 2. Injetar seção de blog na home page (antes do footer) ──
    if (homePage) {
      const homeIdx = newPages.findIndex((p) => p.id === homePage.id);
      const alreadyInjected = homePage.structure.some(
        (b) => b.id === BLOG_HOME_SECTION_ID,
      );

      if (homeIdx >= 0 && !alreadyInjected) {
        const blogHomeSection: Block = {
          id: BLOG_HOME_SECTION_ID,
          type: "blogPostGrid",
          props: {
            title: "Blog",
            subtitle: "Últimas publicações",
            columns: 3,
            cards: SAMPLE_BLOG_CARDS.slice(0, 3),
            variant: "default",
            showViewAll: true,
            viewAllText: "Ver todos os posts",
            viewAllHref: "/site/p/blog",
          },
        } as Block;

        const updatedStructure = [...newPages[homeIdx].structure];
        const footerIdx = updatedStructure.findIndex(
          (b) => b.type === "footer",
        );

        if (footerIdx >= 0) {
          updatedStructure.splice(footerIdx, 0, blogHomeSection);
        } else {
          updatedStructure.push(blogHomeSection);
        }

        newPages[homeIdx] = {
          ...newPages[homeIdx],
          structure: updatedStructure,
        };
        logger.debug("Blog section injected into home page");
      }
    }

    // ── 3. Criar página "Blog" (listagem — layout magazine com sidebar) ──
    if (!existingPageIds.has("blog")) {
      const blogPageStructure: Block[] = [];

      // Navbar clonada da home
      if (homeNavbar) {
        blogPageStructure.push(cloneBlock(homeNavbar, "blog-page-navbar"));
      }

      // Extrair categorias únicas dos sample cards
      const uniqueCategories = [...new Set(SAMPLE_BLOG_CARDS.map((c) => c.category))];

      // Grid layout: conteúdo principal (magazine) + sidebar
      blogPageStructure.push({
        id: "blog-listing-layout",
        type: "grid",
        props: {
          cols: 2,
          colTemplate: "1fr 320px",
          gap: "2.5rem",
          maxWidth: "1200px",
          padding: "2rem",
          paddingTop: "7rem",
          paddingBottom: "6rem",
          bg: "var(--sg-bg)",
          children: [
            // Coluna principal: blogPostGrid com variant "magazine"
            {
              id: "blog-grid-main",
              type: "blogPostGrid",
              props: {
                title: "",
                subtitle: "",
                columns: 3,
                cards: SAMPLE_BLOG_CARDS,
                variant: "magazine",
                showViewAll: false,
              },
            },
            // Sidebar: stack vertical com widgets
            {
              id: "blog-listing-sidebar",
              type: "stack",
              props: {
                direction: "col",
                gap: "1.5rem",
                sticky: true,
                stickyOffset: "100px",
                children: [
                  {
                    id: "blog-listing-search",
                    type: "blogSearchBar",
                    props: {
                      placeholder: "Buscar posts...",
                      variant: "simple",
                      showIcon: true,
                      searchUrl: "/site/p/blog",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-listing-categories",
                    type: "blogCategoryFilter",
                    props: {
                      title: "Categorias",
                      categories: uniqueCategories.map((name) => ({
                        name,
                        slug: name.toLowerCase().replace(/\s+/g, "-"),
                        count: SAMPLE_BLOG_CARDS.filter((c) => c.category === name).length,
                      })),
                      variant: "list",
                      showCount: true,
                      showAll: true,
                      allLabel: "Todas",
                      filterUrl: "/site/p/blog",
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-listing-recent",
                    type: "blogRecentPosts",
                    props: {
                      title: "Posts Recentes",
                      count: 5,
                      showThumbnail: true,
                      showDate: true,
                      showCategory: false,
                      posts: SAMPLE_BLOG_CARDS.map((c) => ({
                        title: c.title,
                        slug: c.linkHref.replace("/site/p/blog/", ""),
                        date: c.date,
                        image: c.image,
                        category: c.category,
                      })),
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-listing-tags",
                    type: "blogTagCloud",
                    props: {
                      title: "Tags",
                      tags: [
                        { name: "Eventos", count: 3 },
                        { name: "Educação", count: 4 },
                        { name: "Institucional", count: 2 },
                        { name: "Tecnologia", count: 2 },
                        { name: "Conquistas", count: 1 },
                        { name: "Sustentabilidade", count: 1 },
                      ],
                      variant: "badges",
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                ],
              },
            },
          ] as Block[],
        },
      } as Block);

      // Footer clonado da home
      if (homeFooter) {
        blogPageStructure.push(cloneBlock(homeFooter, "blog-page-footer"));
      }

      newPages.push({
        id: "blog",
        name: "Blog",
        slug: "blog",
        pluginId: "blog",
        pageTemplateId: "blog-listing",
        structure: blogPageStructure,
        dataSource: {
          provider: "blog-posts",
          mode: "list",
          defaultParams: { limit: 15 },
        },
      });
      logger.debug("Blog listing page created with magazine layout");
    }

    // ── 4. Criar página "Post" (detalhe com sidebar) ──
    if (!existingPageIds.has("blog-post")) {
      const postPageStructure: Block[] = [];

      if (homeNavbar) {
        postPageStructure.push(cloneBlock(homeNavbar, "post-page-navbar"));
      }

      // Grid layout: conteúdo principal + sidebar (com container e espaçamento)
      // paddingTop compensa a navbar fixa (position:fixed sai do fluxo)
      // cols: 2 para que "Iguais" funcione corretamente (2 filhos = 2 colunas)
      postPageStructure.push({
        id: "blog-detail-layout",
        type: "grid",
        props: {
          cols: 2,
          colTemplate: "1fr 320px",
          gap: "2.5rem",
          maxWidth: "1200px",
          padding: "2rem",
          paddingTop: "7rem",
          paddingBottom: "6rem",
          bg: "var(--sg-bg)",
          children: [
            // Coluna principal: blogPostDetail
            {
              id: "blog-detail-main",
              type: "blogPostDetail",
              props: {
                title: "Feira de Ciências 2026: Inovação e Criatividade",
                content: SAMPLE_POST_CONTENT,
                featuredImage:
                  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
                date: "05 Fev 2026",
                category: "Eventos",
                authorVariant: "inline",
                readingTime: "5 min de leitura",
                tags: ["Feira de Ciências", "Eventos", "Sustentabilidade", "Projetos"],
                showFeaturedImage: true,
                showAuthor: true,
                showDate: true,
                showTags: true,
                showReadingTime: true,
                contentMaxWidth: "720px",
              },
            },
            // Sidebar: stack vertical com widgets (sticky por padrão)
            {
              id: "blog-detail-sidebar",
              type: "stack",
              props: {
                direction: "col",
                gap: "1.5rem",
                sticky: true,
                stickyOffset: "100px",
                children: [
                  {
                    id: "blog-sidebar-search",
                    type: "blogSearchBar",
                    props: {
                      placeholder: "Buscar posts...",
                      variant: "simple",
                      showIcon: true,
                      searchUrl: "/site/p/blog",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-sidebar-categories",
                    type: "blogCategoryFilter",
                    props: {
                      title: "Categorias",
                      categories: SAMPLE_BLOG_CARDS.map((c) => ({
                        name: c.category,
                        slug: c.category.toLowerCase().replace(/\s+/g, "-"),
                        count: 1,
                      })),
                      variant: "list",
                      showCount: true,
                      showAll: true,
                      allLabel: "Todas",
                      filterUrl: "/site/p/blog",
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-sidebar-recent",
                    type: "blogRecentPosts",
                    props: {
                      title: "Posts Recentes",
                      count: 5,
                      showThumbnail: true,
                      showDate: true,
                      showCategory: false,
                      posts: SAMPLE_BLOG_CARDS.map((c) => ({
                        title: c.title,
                        slug: c.linkHref.replace("/site/p/blog/", ""),
                        date: c.date,
                        image: c.image,
                        category: c.category,
                      })),
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                  {
                    id: "blog-sidebar-tags",
                    type: "blogTagCloud",
                    props: {
                      title: "Tags",
                      tags: [
                        { name: "Eventos", count: 3 },
                        { name: "Educação", count: 2 },
                        { name: "Institucional", count: 1 },
                        { name: "Sustentabilidade", count: 1 },
                      ],
                      variant: "badges",
                      linkColor: "#374151",
                      linkHoverColor: "#2563eb",
                      borderRadius: "0.75rem",
                      shadow: "sm",
                    },
                  },
                ],
              },
            },
          ] as Block[],
        },
      } as Block);

      if (homeFooter) {
        postPageStructure.push(cloneBlock(homeFooter, "post-page-footer"));
      }

      newPages.push({
        id: "blog-post",
        name: "Post",
        slug: "blog/:slug",
        pluginId: "blog",
        pageTemplateId: "blog-post",
        isDynamic: true,
        structure: postPageStructure,
        dataSource: {
          provider: "blog-posts",
          mode: "single",
          paramMapping: { slug: ":slug" },
        },
        editRestrictions: {
          nonRemovable: true,
        },
      });
      logger.debug("Blog post detail page created with sidebar layout");
    }

    return {
      ...document,
      pages: newPages,
    };
  },

  onDeactivate(document: SiteDocument): SiteDocument {
    logger.debug("Blog plugin deactivating...");

    const newPages = document.pages
      // Remover páginas do plugin
      .filter((page) => page.pluginId !== "blog")
      // Remover seção de blog injetada + link "Blog" da navbar
      .map((page) => {
        let structure = page.structure;

        // Remover seção de blog injetada
        const hasInjected = structure.some(
          (b) => b.id === BLOG_HOME_SECTION_ID,
        );
        if (hasInjected) {
          structure = structure.filter(
            (b) => b.id !== BLOG_HOME_SECTION_ID,
          );
        }

        // Remover link "Blog" (/site/p/blog) da navbar
        structure = structure.map((b) => {
          if (b.type !== "navbar") return b;
          const props = b.props as Record<string, any>;
          const links: Array<{ text: string; href: string }> = Array.isArray(props.links) ? props.links : [];
          const filtered = links.filter((l) => l.href !== "/site/p/blog" && l.href !== "/p/blog");
          if (filtered.length !== links.length) {
            return { ...b, props: { ...props, links: filtered } } as Block;
          }
          return b;
        });

        if (structure !== page.structure) {
          return { ...page, structure };
        }
        return page;
      });

    logger.debug(
      `Removed ${document.pages.length - newPages.length} blog page(s) and injected section`,
    );

    return {
      ...document,
      pages: newPages,
    };
  },

  getEditorRestrictions(blockType: BlockType) {
    if (blockType === "blogPostDetail") {
      return {
        lockedFields: ["content", "date"],
      };
    }
    if (blockType === "blogCategoryFilter") {
      return {
        lockedFields: ["categories"],
      };
    }
    if (blockType === "blogRecentPosts") {
      return {
        lockedFields: ["posts"],
      };
    }
    if (blockType === "blogTagCloud") {
      return {
        lockedFields: ["tags"],
      };
    }
    return undefined;
  },
};

// Auto-registrar o plugin (side effect — como os blocos fazem com componentRegistry)
pluginRegistry.register(blogPlugin);
