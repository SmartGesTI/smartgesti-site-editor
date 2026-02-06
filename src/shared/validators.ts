/**
 * Validadores para SiteDocument
 * Usados para garantir que documentos gerados por IA são válidos
 */

import type {
  SiteDocument,
  Block,
  BlockType,
  SimpleThemeTokens,
} from "./schema";
import { defaultThemeTokens, AVAILABLE_BLOCK_TYPES } from "./schema";

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Valida um documento SiteDocument completo
 */
export function validateDocument(doc: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Verificar se é objeto
  if (!doc || typeof doc !== "object") {
    errors.push({
      path: "",
      message: "Documento deve ser um objeto",
      severity: "error",
    });
    return { valid: false, errors, warnings };
  }

  const document = doc as Record<string, any>;

  // Validar meta
  if (!document.meta || typeof document.meta !== "object") {
    errors.push({
      path: "meta",
      message: 'Campo "meta" é obrigatório',
      severity: "error",
    });
  } else {
    const meta = document.meta as Record<string, any>;
    if (!meta.title || typeof meta.title !== "string") {
      errors.push({
        path: "meta.title",
        message: 'Campo "meta.title" é obrigatório e deve ser string',
        severity: "error",
      });
    }
  }

  // Validar theme
  if (!document.theme || typeof document.theme !== "object") {
    warnings.push({
      path: "theme",
      message: 'Campo "theme" não encontrado, será usado tema padrão',
      severity: "warning",
    });
  } else {
    validateTheme(document.theme as Record<string, any>, errors, warnings);
  }

  // Validar structure
  if (!document.structure || !Array.isArray(document.structure)) {
    errors.push({
      path: "structure",
      message: 'Campo "structure" é obrigatório e deve ser array',
      severity: "error",
    });
  } else {
    validateBlocks(document.structure, "structure", errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida tema
 */
function validateTheme(
  theme: Record<string, any>,
  _errors: ValidationError[],
  warnings: ValidationError[],
): void {
  // Validar colors
  if (theme.colors && typeof theme.colors === "object") {
    const colors = theme.colors as Record<string, any>;
    const requiredColors = ["primary", "background", "text"];
    for (const color of requiredColors) {
      if (!colors[color]) {
        warnings.push({
          path: `theme.colors.${color}`,
          message: `Cor "${color}" não definida, será usado valor padrão`,
          severity: "warning",
        });
      }
    }
  }

  // Validar typography
  if (theme.typography && typeof theme.typography === "object") {
    const typo = theme.typography as Record<string, any>;
    if (!typo.fontFamily) {
      warnings.push({
        path: "theme.typography.fontFamily",
        message: "fontFamily não definido, será usado padrão",
        severity: "warning",
      });
    }
  }
}

/**
 * Valida array de blocos recursivamente
 */
function validateBlocks(
  blocks: unknown[],
  path: string,
  errors: ValidationError[],
  warnings: ValidationError[],
): void {
  const seenIds = new Set<string>();

  blocks.forEach((block, index) => {
    const blockPath = `${path}[${index}]`;

    if (!block || typeof block !== "object") {
      errors.push({
        path: blockPath,
        message: "Bloco deve ser um objeto",
        severity: "error",
      });
      return;
    }

    const b = block as Record<string, any>;

    // Validar id
    if (!b.id || typeof b.id !== "string") {
      errors.push({
        path: `${blockPath}.id`,
        message: 'Bloco deve ter "id" string',
        severity: "error",
      });
    } else {
      if (seenIds.has(b.id)) {
        errors.push({
          path: `${blockPath}.id`,
          message: `ID duplicado: "${b.id}"`,
          severity: "error",
        });
      }
      seenIds.add(b.id);
    }

    // Validar type
    if (!b.type || typeof b.type !== "string") {
      errors.push({
        path: `${blockPath}.type`,
        message: 'Bloco deve ter "type" string',
        severity: "error",
      });
    } else if (
      !AVAILABLE_BLOCK_TYPES.includes(
        b.type as (typeof AVAILABLE_BLOCK_TYPES)[number],
      )
    ) {
      errors.push({
        path: `${blockPath}.type`,
        message: `Tipo de bloco inválido: "${b.type}"`,
        severity: "error",
      });
    }

    // Validar props
    if (b.props && typeof b.props === "object") {
      const props = b.props as Record<string, any>;

      // Validar children recursivamente
      if (props.children && Array.isArray(props.children)) {
        validateBlocks(
          props.children,
          `${blockPath}.props.children`,
          errors,
          warnings,
        );
      }

      // Validações específicas por tipo
      validateBlockProps(b.type as string, props, blockPath, errors, warnings);
    }
  });
}

/**
 * Valida props específicos por tipo de bloco
 */
function validateBlockProps(
  type: string,
  props: Record<string, any>,
  path: string,
  errors: ValidationError[],
  warnings: ValidationError[],
): void {
  switch (type) {
    case "heading":
      if (!props.text || typeof props.text !== "string") {
        errors.push({
          path: `${path}.props.text`,
          message: 'Heading deve ter "text"',
          severity: "error",
        });
      }
      if (
        !props.level ||
        typeof props.level !== "number" ||
        props.level < 1 ||
        props.level > 6
      ) {
        warnings.push({
          path: `${path}.props.level`,
          message: 'Heading deve ter "level" entre 1-6',
          severity: "warning",
        });
      }
      break;

    case "text":
      if (!props.text || typeof props.text !== "string") {
        errors.push({
          path: `${path}.props.text`,
          message: 'Text deve ter "text"',
          severity: "error",
        });
      }
      break;

    case "image":
      if (!props.src || typeof props.src !== "string") {
        errors.push({
          path: `${path}.props.src`,
          message: 'Image deve ter "src"',
          severity: "error",
        });
      }
      break;

    case "button":
      if (!props.text || typeof props.text !== "string") {
        errors.push({
          path: `${path}.props.text`,
          message: 'Button deve ter "text"',
          severity: "error",
        });
      }
      break;

    case "link":
      if (!props.text || typeof props.text !== "string") {
        errors.push({
          path: `${path}.props.text`,
          message: 'Link deve ter "text"',
          severity: "error",
        });
      }
      if (!props.href || typeof props.href !== "string") {
        errors.push({
          path: `${path}.props.href`,
          message: 'Link deve ter "href"',
          severity: "error",
        });
      }
      break;

    case "hero":
      if (!props.title || typeof props.title !== "string") {
        errors.push({
          path: `${path}.props.title`,
          message: 'Hero deve ter "title"',
          severity: "error",
        });
      }
      break;

    case "feature":
      if (!props.title || typeof props.title !== "string") {
        errors.push({
          path: `${path}.props.title`,
          message: 'Feature deve ter "title"',
          severity: "error",
        });
      }
      if (!props.description || typeof props.description !== "string") {
        errors.push({
          path: `${path}.props.description`,
          message: 'Feature deve ter "description"',
          severity: "error",
        });
      }
      break;

    case "featureGrid":
      if (!props.features || !Array.isArray(props.features)) {
        errors.push({
          path: `${path}.props.features`,
          message: 'FeatureGrid deve ter array "features"',
          severity: "error",
        });
      }
      break;

    case "pricing":
      if (!props.plans || !Array.isArray(props.plans)) {
        errors.push({
          path: `${path}.props.plans`,
          message: 'Pricing deve ter array "plans"',
          severity: "error",
        });
      }
      break;

    case "testimonial":
      if (!props.quote || typeof props.quote !== "string") {
        errors.push({
          path: `${path}.props.quote`,
          message: 'Testimonial deve ter "quote"',
          severity: "error",
        });
      }
      if (!props.author || typeof props.author !== "string") {
        errors.push({
          path: `${path}.props.author`,
          message: 'Testimonial deve ter "author"',
          severity: "error",
        });
      }
      break;

    case "testimonialGrid":
      if (!props.testimonials || !Array.isArray(props.testimonials)) {
        errors.push({
          path: `${path}.props.testimonials`,
          message: 'TestimonialGrid deve ter array "testimonials"',
          severity: "error",
        });
      }
      break;

    case "faq":
      if (!props.items || !Array.isArray(props.items)) {
        errors.push({
          path: `${path}.props.items`,
          message: 'FAQ deve ter array "items"',
          severity: "error",
        });
      }
      break;

    case "faqItem":
      if (!props.question || typeof props.question !== "string") {
        errors.push({
          path: `${path}.props.question`,
          message: 'FAQItem deve ter "question"',
          severity: "error",
        });
      }
      if (!props.answer || typeof props.answer !== "string") {
        errors.push({
          path: `${path}.props.answer`,
          message: 'FAQItem deve ter "answer"',
          severity: "error",
        });
      }
      break;

    case "cta":
      if (!props.title || typeof props.title !== "string") {
        errors.push({
          path: `${path}.props.title`,
          message: 'CTA deve ter "title"',
          severity: "error",
        });
      }
      if (!props.buttonText || typeof props.buttonText !== "string") {
        errors.push({
          path: `${path}.props.buttonText`,
          message: 'CTA deve ter "buttonText"',
          severity: "error",
        });
      }
      break;

    case "stats":
      if (!props.items || !Array.isArray(props.items)) {
        errors.push({
          path: `${path}.props.items`,
          message: 'Stats deve ter array "items"',
          severity: "error",
        });
      }
      break;

    case "navbar":
      if (!props.links || !Array.isArray(props.links)) {
        warnings.push({
          path: `${path}.props.links`,
          message: "Navbar sem links de navegação",
          severity: "warning",
        });
      }
      break;

    case "courseCardGrid":
      if (!props.cards || !Array.isArray(props.cards)) {
        errors.push({
          path: `${path}.props.cards`,
          message: 'CourseCardGrid deve ter array "cards"',
          severity: "error",
        });
      }
      break;

    case "categoryCardGrid":
      if (!props.categories || !Array.isArray(props.categories)) {
        errors.push({
          path: `${path}.props.categories`,
          message: 'CategoryCardGrid deve ter array "categories"',
          severity: "error",
        });
      }
      break;

    case "input":
    case "textarea":
      if (!props.name || typeof props.name !== "string") {
        errors.push({
          path: `${path}.props.name`,
          message: `${type} deve ter "name"`,
          severity: "error",
        });
      }
      break;

    case "formSelect":
      if (!props.name || typeof props.name !== "string") {
        errors.push({
          path: `${path}.props.name`,
          message: 'FormSelect deve ter "name"',
          severity: "error",
        });
      }
      if (!props.options || !Array.isArray(props.options)) {
        errors.push({
          path: `${path}.props.options`,
          message: 'FormSelect deve ter array "options"',
          severity: "error",
        });
      }
      break;
  }
}

/**
 * Tenta corrigir erros comuns em documentos gerados por IA
 */
export function sanitizeDocument(doc: unknown): SiteDocument | null {
  if (!doc || typeof doc !== "object") {
    return null;
  }

  const document = doc as Record<string, any>;

  // Garantir estrutura básica com tema padrão
  const sanitized: SiteDocument = {
    meta: {
      title: "Untitled Site",
    },
    theme: { ...defaultThemeTokens },
    structure: [],
  };

  // Merge meta
  if (document.meta && typeof document.meta === "object") {
    const meta = document.meta as Record<string, any>;
    if (meta.title && typeof meta.title === "string") {
      sanitized.meta.title = meta.title;
    }
    if (meta.description && typeof meta.description === "string") {
      sanitized.meta.description = meta.description;
    }
    if (meta.favicon && typeof meta.favicon === "string") {
      sanitized.meta.favicon = meta.favicon;
    }
    if (meta.language && typeof meta.language === "string") {
      sanitized.meta.language = meta.language;
    }
  }

  // Merge theme
  if (document.theme && typeof document.theme === "object") {
    const theme = document.theme as Record<string, any>;

    if (theme.colors && typeof theme.colors === "object") {
      sanitized.theme.colors = {
        ...sanitized.theme.colors,
        ...(theme.colors as SimpleThemeTokens["colors"]),
      };
    }

    if (theme.typography && typeof theme.typography === "object") {
      sanitized.theme.typography = {
        ...sanitized.theme.typography,
        ...(theme.typography as SimpleThemeTokens["typography"]),
      };
    }

    if (theme.spacing && typeof theme.spacing === "object") {
      sanitized.theme.spacing = {
        ...sanitized.theme.spacing,
        ...(theme.spacing as SimpleThemeTokens["spacing"]),
      };
    }

    if (theme.effects && typeof theme.effects === "object") {
      sanitized.theme.effects = {
        ...sanitized.theme.effects,
        ...(theme.effects as SimpleThemeTokens["effects"]),
      };
    }
  }

  // Sanitize structure
  if (document.structure && Array.isArray(document.structure)) {
    sanitized.structure = sanitizeBlocks(document.structure);
  }

  return sanitized;
}

/**
 * Sanitiza array de blocos
 */
function sanitizeBlocks(blocks: unknown[]): Block[] {
  const sanitized: Block[] = [];
  const usedIds = new Set<string>();
  let idCounter = 1;

  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;

    const b = block as Record<string, any>;

    // Garantir type válido
    const type =
      typeof b.type === "string" &&
      AVAILABLE_BLOCK_TYPES.includes(
        b.type as (typeof AVAILABLE_BLOCK_TYPES)[number],
      )
        ? (b.type as BlockType)
        : "box";

    // Garantir id único
    let id = typeof b.id === "string" ? b.id : `${type}-${idCounter++}`;
    while (usedIds.has(id)) {
      id = `${type}-${idCounter++}`;
    }
    usedIds.add(id);

    // Sanitizar props
    const props =
      b.props && typeof b.props === "object"
        ? sanitizeProps(b.props as Record<string, any>)
        : {};

    sanitized.push({
      id,
      type,
      props,
    } as Block);
  }

  return sanitized;
}

/**
 * Sanitiza props de um bloco
 */
function sanitizeProps(
  props: Record<string, any>,
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "children" && Array.isArray(value)) {
      sanitized.children = sanitizeBlocks(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Gera IDs únicos para blocos que não têm
 */
export function ensureBlockIds(blocks: Block[]): Block[] {
  const usedIds = new Set<string>();
  let counter = 1;

  function processBlock(block: Block): Block {
    // Gerar ID se não existir ou se for duplicado
    let id = block.id;
    if (!id || usedIds.has(id)) {
      id = `${block.type}-${counter++}`;
      while (usedIds.has(id)) {
        id = `${block.type}-${counter++}`;
      }
    }
    usedIds.add(id);

    // Processar children
    const props = { ...block.props } as Record<string, any>;
    if (props.children && Array.isArray(props.children)) {
      props.children = (props.children as Block[]).map(processBlock);
    }

    return { ...block, id, props };
  }

  return blocks.map(processBlock);
}
