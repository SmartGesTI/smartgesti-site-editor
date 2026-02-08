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
      "https://images.unsplash.com/photo-1567168544230-3b9e5ec47659?w=800&h=400&fit=crop",
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
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
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
      blocks: ["blogPostCard", "blogPostGrid", "blogPostDetail"],

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
            lockedStructure: true,
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

    // ── 1. Injetar seção de blog na home page (antes do footer) ──
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
            cards: SAMPLE_BLOG_CARDS,
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

    // ── 2. Criar página "Blog" (listagem completa) ──
    if (!existingPageIds.has("blog")) {
      const blogPageStructure: Block[] = [];

      // Navbar clonada da home
      if (homeNavbar) {
        blogPageStructure.push(cloneBlock(homeNavbar, "blog-page-navbar"));
      }

      // Hero banner do blog
      blogPageStructure.push({
        id: "blog-page-hero",
        type: "hero",
        props: {
          title: "Blog",
          subtitle: "Novidades & Publicações",
          description:
            "Acompanhe as últimas novidades, eventos e conquistas da nossa comunidade escolar.",
          variant: "centered",
          align: "center",
          overlay: true,
          overlayColor: "rgba(79, 70, 229, 0.9)",
          background: "#4f46e5",
          minHeight: "280px",
        },
      } as Block);

      // Grid de posts
      blogPageStructure.push({
        id: "blog-grid-main",
        type: "blogPostGrid",
        props: {
          title: "",
          subtitle: "",
          columns: 3,
          cards: SAMPLE_BLOG_CARDS,
          variant: "default",
          showViewAll: false,
          viewAllText: "Ver todos",
          viewAllHref: "/blog",
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
        },
      });
      logger.debug("Blog listing page created");
    }

    // ── 3. Criar página "Post" (detalhe) ──
    if (!existingPageIds.has("blog-post")) {
      const postPageStructure: Block[] = [];

      if (homeNavbar) {
        postPageStructure.push(cloneBlock(homeNavbar, "post-page-navbar"));
      }

      postPageStructure.push({
        id: "blog-detail-main",
        type: "blogPostDetail",
        props: {
          title: "Feira de Ciências 2026: Inovação e Criatividade",
          content: SAMPLE_POST_CONTENT,
          featuredImage:
            "https://images.unsplash.com/photo-1567168544230-3b9e5ec47659?w=1200&h=600&fit=crop",
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
          lockedStructure: true,
          nonRemovable: true,
        },
      });
      logger.debug("Blog post detail page created");
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
      // Remover seção de blog injetada na home page
      .map((page) => {
        const hasInjected = page.structure.some(
          (b) => b.id === BLOG_HOME_SECTION_ID,
        );
        if (hasInjected) {
          return {
            ...page,
            structure: page.structure.filter(
              (b) => b.id !== BLOG_HOME_SECTION_ID,
            ),
          };
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
    return undefined;
  },
};

// Auto-registrar o plugin (side effect — como os blocos fazem com componentRegistry)
pluginRegistry.register(blogPlugin);
