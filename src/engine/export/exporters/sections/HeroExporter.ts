/**
 * Hero Section Exporter
 * Exporta Hero com múltiplas variações e customizações avançadas
 * Mobile-first responsive: split layout collapses to stack in mobile
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { PLACEHOLDER_IMAGE_URL, CAROUSEL_PLACEHOLDER_IMAGES } from "../../../presets/heroVariations";
import { dataBlockIdAttr, blockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import { generateCarouselCSS } from "../../../shared/carouselAnimation";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";
import { gridPresetMap, type ImageGridItem, type ImageGridPreset } from "../../../shared/imageGrid";
import {
  generateTypographyStyles,
  mergeTypographyWithDefaults,
  heroTitleDefaults,
  heroSubtitleDefaults,
  heroDescriptionDefaults,
  type TypographyConfig,
} from "../../../shared/typography";
import { imageShadowMap } from "../../../shared/shadowConstants";
import { contentPositionMap, blockGapConfig } from "../../../shared/layoutConstants";

export function exportHero(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    variation,
    variant = "centered",
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    badge,
    align = "center",
    contentPosition = "center",
    contentSpacing = "default",
    blockGap = "default",
    minHeight = "80vh",
    image,
    overlay,
    overlayColor,
    background,
    // Typography colors (legacy)
    titleColor,
    subtitleColor,
    descriptionColor,
    // Typography config (novo sistema)
    titleTypography,
    subtitleTypography,
    descriptionTypography,
    // Badge styling
    badgeColor,
    badgeTextColor,
    // Layout
    contentMaxWidth = "800px",
    paddingY,
    // Image styling
    imageRadius = 16,
    imageShadow = "lg",
    imagePosition = "right",
    // Button size
    buttonSize = "md",
    // Primary button styling
    primaryButtonVariant = "solid",
    primaryButtonColor,
    primaryButtonTextColor,
    primaryButtonRadius = 8,
    // Secondary button styling
    secondaryButtonVariant = "outline",
    secondaryButtonColor,
    secondaryButtonTextColor,
    secondaryButtonRadius = 8,
    // Button hover effects
    buttonHoverEffect = "scale",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
    // Decorative
    showWave,
    waveColor = "rgba(255,255,255,0.1)",
    // Image Grid
    imageGridEnabled,
    imageGridPreset = "four-equal",
    imageGridImages = [],
    imageGridGap = 8,
    // Carousel
    carouselImages,
    carouselInterval = 5,
    carouselTransition = "crossfade",
  } = (block as any).props;

  // Determine variation types
  const heroImage = image || PLACEHOLDER_IMAGE_URL;
  const isSplit = variation === "hero-split" || variant === "split";
  const isParallax = variation === "hero-parallax";
  const isOverlayVariant = variation === "hero-overlay";
  const isGradient = variation === "hero-gradient";
  const isMinimal = variation === "hero-minimal";
  const isCard = variation === "hero-card";
  const isCarousel = variation === "hero-carousel";
  const isImageBg = (variant === "image-bg" || isOverlayVariant || isParallax || isCard || isCarousel) && heroImage;
  const isOverlay = isImageBg && overlay;

  // Determine if dark background context
  const hasDarkBg = isOverlay || isGradient || isOverlayVariant || isCarousel;

  // Theme colors
  const themePrimaryColor = theme?.colors?.primary || "#3b82f6";
  const themePrimaryText = theme?.colors?.primaryText || "#ffffff";

  // Text colors (fallback)
  const defaultTextColor = hasDarkBg ? "#ffffff" : "var(--sg-text, #1f2937)";
  const defaultMutedColor = hasDarkBg ? "rgba(255,255,255,0.85)" : "var(--sg-muted-text, #6b7280)";

  // Merge typography configs with defaults (retrocompatível com titleColor, etc.)
  const mergedTitleTypo = mergeTypographyWithDefaults(
    titleTypography as TypographyConfig | undefined,
    { ...heroTitleDefaults, color: titleColor as string | undefined }
  );
  const mergedSubtitleTypo = mergeTypographyWithDefaults(
    subtitleTypography as TypographyConfig | undefined,
    { ...heroSubtitleDefaults, color: subtitleColor as string | undefined }
  );
  const mergedDescriptionTypo = mergeTypographyWithDefaults(
    descriptionTypography as TypographyConfig | undefined,
    { ...heroDescriptionDefaults, color: descriptionColor as string | undefined }
  );

  // Generate typography CSS strings
  const titleTypoStyles = generateTypographyStyles(mergedTitleTypo, defaultTextColor);
  const subtitleTypoStyles = generateTypographyStyles(mergedSubtitleTypo, defaultMutedColor);
  const descriptionTypoStyles = generateTypographyStyles(mergedDescriptionTypo, defaultMutedColor);

  // Badge colors
  const finalBadgeColor = badgeColor || themePrimaryColor;
  const finalBadgeTextColor = badgeTextColor || "#ffffff";

  // Button colors
  const finalPrimaryBtnColor = primaryButtonColor || themePrimaryColor;
  const finalPrimaryBtnTextColor = primaryButtonTextColor || themePrimaryText;
  const finalSecondaryBtnColor = secondaryButtonColor || (hasDarkBg ? "#ffffff" : themePrimaryColor);
  const finalSecondaryBtnTextColor = secondaryButtonTextColor || finalSecondaryBtnColor;

  // Section classes
  const sectionClasses = [
    "sg-hero",
    variation ? `sg-hero--${String(variation).replace("hero-", "")}` : "",
    isSplit ? "sg-hero--split" : "",
    isParallax ? "sg-hero--parallax" : "",
    isOverlayVariant ? "sg-hero--overlay" : "",
    isGradient ? "sg-hero--gradient" : "",
    isMinimal ? "sg-hero--minimal" : "",
    isCard ? "sg-hero--card" : "",
    isCarousel ? "sg-hero--carousel" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Build background style
  let bgStyle = "";
  if (background) {
    bgStyle = `background: ${background};`;
  } else if (isImageBg && !isSplit) {
    bgStyle = `background-image: url(${escapeHtml(heroImage)}); background-size: cover; background-position: center;`;
    if (isParallax) bgStyle += " background-attachment: fixed;";
  } else {
    bgStyle = "background-color: var(--sg-bg, #fff);";
  }

  // Padding
  const paddingStyle = paddingY ? `padding: ${paddingY} 2rem;` : "padding: 6rem 2rem;";

  // Content position mapping for flexbox justify-content
  const justifyContent = contentPositionMap[contentPosition] || "center";

  // Determine if layout has two blocks (content + image) - these should always be centered
  const hasTwoBlocks = isSplit || isCard;
  // Note: shouldShowImageGrid is checked later, so we'll handle it in each section

  // Content spacing map - controls margin between elements
  const spacingMap: Record<string, { title: string; subtitle: string; description: string; badge: string; actions: string }> = {
    compact: { title: "0.75rem", subtitle: "0.5rem", description: "1.25rem", badge: "1rem", actions: "0.25rem" },
    default: { title: "1.25rem", subtitle: "1rem", description: "2.5rem", badge: "1.5rem", actions: "0.5rem" },
    spacious: { title: "2.25rem", subtitle: "2rem", description: "3.5rem", badge: "2.5rem", actions: "1.5rem" },
  };
  const spacing = spacingMap[contentSpacing] || spacingMap.default;

  // Block gap configuration
  const blocksConfig = blockGapConfig[blockGap] || blockGapConfig.default;
  const blocksJustify = blocksConfig.justify;
  const blocksMaxWidth = blocksConfig.blockMaxWidth;
  const containerMaxWidth = blocksConfig.containerMaxWidth;
  const blocksGap = blocksConfig.gap;

  // Overlay HTML
  const overlayStyle = overlayColor
    ? `position: absolute; inset: 0; background: ${overlayColor}; z-index: 0;`
    : "position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%); z-index: 0;";
  const overlayHtml = isOverlay
    ? `<div class="sg-hero__overlay" style="${overlayStyle}"></div>`
    : "";

  // Wave SVG
  const waveHtml = showWave
    ? `<div style="position: absolute; bottom: 0; left: 0; right: 0; height: 150px; overflow: hidden; z-index: 1;">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="position: absolute; bottom: 0; width: 100%; height: 100%;">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="${waveColor}" opacity="0.5"/>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="${waveColor}" opacity="0.3"/>
        </svg>
      </div>`
    : "";

  // Badge HTML
  const badgeHtml = badge
    ? `<span class="sg-hero__badge" style="display: inline-block; padding: 0.5rem 1.25rem; background: ${finalBadgeColor}; color: ${finalBadgeTextColor}; border-radius: 999px; font-size: 0.875rem; font-weight: 600; margin-bottom: ${spacing.badge};">${escapeHtml(badge)}</span>`
    : "";

  // Title HTML - usa tipografia customizada com clamp para responsividade
  const titleFontSize = mergedTitleTypo.fontSize || 48;
  const titleHtml = title
    ? `<h1 class="sg-hero__title" style="${titleTypoStyles.cssString} font-size: clamp(2rem, 5vw, ${titleFontSize}px); line-height: 1.1; margin-bottom: ${spacing.title}; letter-spacing: -0.02em;">${escapeHtml(title)}</h1>`
    : "";

  // Subtitle HTML - usa tipografia customizada com clamp para responsividade
  const subtitleFontSize = mergedSubtitleTypo.fontSize || 24;
  const subtitleHtml = subtitle
    ? `<h2 class="sg-hero__subtitle" style="${subtitleTypoStyles.cssString} font-size: clamp(1.125rem, 2.5vw, ${subtitleFontSize}px); line-height: 1.3; margin-bottom: ${spacing.subtitle};">${escapeHtml(subtitle)}</h2>`
    : "";

  // Description HTML - usa tipografia customizada
  const descHtml = description
    ? `<p class="sg-hero__description" style="max-width: 650px; margin: ${align === "center" ? `0 auto ${spacing.description}` : `0 0 ${spacing.description}`}; ${descriptionTypoStyles.cssString} line-height: 1.7;">${escapeHtml(description)}</p>`
    : "";

  // Button styles
  const buttonStyles = resolveHeroButtonStyles({
    theme,
    blockId: block.id,
    buttonSize,
    primaryButtonVariant,
    primaryButtonColor: finalPrimaryBtnColor,
    primaryButtonTextColor: finalPrimaryBtnTextColor,
    primaryButtonRadius,
    secondaryButtonVariant,
    secondaryButtonColor: finalSecondaryBtnColor,
    secondaryButtonTextColor: finalSecondaryBtnTextColor,
    secondaryButtonRadius,
    hoverEffect: buttonHoverEffect,
    hoverIntensity: buttonHoverIntensity,
    hoverOverlay: buttonHoverOverlay,
    hoverIconName: buttonHoverIconName,
  });

  // Buttons HTML
  const primaryHref = primaryButton ? resolveHref(primaryButton.href || "#", basePath) : "#";
  const secondaryHref = secondaryButton ? resolveHref(secondaryButton.href || "#", basePath) : "#";
  const primaryBtnHtml = primaryButton
    ? `<a href="${escapeHtml(primaryHref)}"${linkTargetAttr(primaryHref, basePath)} class="sg-hero__btn sg-hero__btn--primary" style="${buttonStyles.primary}">${escapeHtml(primaryButton.text)}</a>`
    : "";
  const secondaryBtnHtml = secondaryButton
    ? `<a href="${escapeHtml(secondaryHref)}"${linkTargetAttr(secondaryHref, basePath)} class="sg-hero__btn sg-hero__btn--secondary" style="${buttonStyles.secondary}">${escapeHtml(secondaryButton.text)}</a>`
    : "";
  const buttonsHtml =
    primaryButton || secondaryButton
      ? `<div class="sg-hero__actions" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: ${align === "center" ? "center" : "flex-start"}; margin-top: ${spacing.actions};">${primaryBtnHtml}${secondaryBtnHtml}</div>`
      : "";

  // Content block
  const contentBlock = `${badgeHtml}${titleHtml}${subtitleHtml}${descHtml}${buttonsHtml}`;

  // Style block (hover effects)
  const styleBlock = buttonStyles.css ? `<style>${buttonStyles.css}</style>` : "";

  // Image fallback
  const imgFallback = `this.onerror=null;this.src='${escapeHtml(PLACEHOLDER_IMAGE_URL)}';`;

  // =========================================================================
  // IMAGE GRID EXPORT HELPER
  // =========================================================================
  const exportImageGrid = (
    images: ImageGridItem[],
    preset: ImageGridPreset,
    gap: number,
    radius: number,
    shadow: string,
    gridId: string
  ): { html: string; css: string } => {
    const config = gridPresetMap[preset];
    const shadowValue = imageShadowMap[shadow] || imageShadowMap.lg;

    // Generate grid items HTML
    const itemsHtml = config.positions
      .map((pos, idx) => {
        const img = images[idx];
        const imgSrc = img?.src || PLACEHOLDER_IMAGE_URL;
        const imgAlt = img?.alt || `Imagem ${idx + 1}`;
        const imgScale = img?.scale ?? 1;
        const scaleStyle = imgScale !== 1 ? ` transform: scale(${imgScale}); z-index: 1;` : "";

        return `<div class="sg-hero__grid-item" style="grid-column: ${pos.col}; grid-row: ${pos.row}; overflow: hidden; border-radius: ${radius}px;${scaleStyle}">
          <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(imgAlt)}" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="${imgFallback}" />
        </div>`;
      })
      .join("");

    const gridHtml = `<div id="${gridId}" class="sg-hero__image-grid" style="display: grid; grid-template: ${config.gridTemplate}; gap: ${gap}px; width: 100%; max-width: 500px; aspect-ratio: 1 / 1;">
      ${itemsHtml}
    </div>`;

    // Responsive CSS: collapse to single column on mobile
    const gridCss = `
      @media (max-width: 767px) {
        #${gridId} {
          grid-template: auto / 1fr !important;
          aspect-ratio: auto !important;
        }
        #${gridId} .sg-hero__grid-item {
          grid-column: 1 / -1 !important;
          grid-row: auto !important;
          aspect-ratio: 16 / 9;
        }
      }
    `;

    return { html: gridHtml, css: gridCss };
  };

  // Determine if we should use image grid (works in ANY variation now)
  const hasValidGridImages = imageGridImages && imageGridImages.length > 0 && (imageGridImages as ImageGridItem[]).some((img: ImageGridItem) => img?.src);
  const shouldShowImageGrid = imageGridEnabled && hasValidGridImages;

  // =========================================================================
  // RENDER: Carousel Layout (crossfade image background)
  // =========================================================================
  if (isCarousel) {
    const resolvedImages = (carouselImages && carouselImages.length >= 2)
      ? (carouselImages as string[])
      : CAROUSEL_PLACEHOLDER_IMAGES;
    const carouselScopeId = generateScopedId(block.id || "", "hero-carousel");

    const carouselCss = generateCarouselCSS(
      `#${carouselScopeId}`,
      resolvedImages.length,
      carouselInterval as number,
    );

    // Generate carousel images HTML
    const carouselImagesHtml = resolvedImages
      .map((imgSrc: string, i: number) =>
        `<img src="${escapeHtml(imgSrc)}" alt="Slide ${i + 1}" class="sg-carousel__img" ${i === 0 ? 'style="opacity: 1;"' : ''} onerror="${imgFallback}" />`
      )
      .join("");

    // Dot indicators HTML
    const dotsHtml = `<div class="sg-carousel__dots">${resolvedImages.map(() => '<span class="sg-carousel__dot"></span>').join("")}</div>`;

    // Overlay for carousel
    const carouselOverlayStyle = overlayColor
      ? `position: absolute; inset: 0; background: ${overlayColor}; z-index: 1;`
      : "position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%); z-index: 1;";
    const carouselOverlayHtml = overlay
      ? `<div class="sg-hero__overlay" style="${carouselOverlayStyle}"></div>`
      : "";

    const carouselContentHtml = `<div style="max-width: ${contentMaxWidth}; width: 100%; padding: 0 2rem; text-align: ${align}; position: relative; z-index: 2;">${contentBlock}</div>`;

    // Combine all CSS (carousel animation + button hover effects)
    const allCss = `<style>${carouselCss}${buttonStyles.css ? "\n" + buttonStyles.css : ""}</style>`;

    return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; ${paddingStyle} display: flex; align-items: center; justify-content: ${justifyContent}; position: relative; overflow: hidden; background: #000;" data-variation="${escapeHtml(variation || variant || "")}">${allCss}<div id="${carouselScopeId}" style="position: absolute; inset: 0; z-index: 0;">${carouselImagesHtml}${dotsHtml}</div>${carouselOverlayHtml}${carouselContentHtml}</section>`;
  }

  // =========================================================================
  // RENDER: Split Layout (without image grid)
  // =========================================================================
  if (isSplit && heroImage && !shouldShowImageGrid) {
    const splitId = generateScopedId(block.id || "", "hero-split");
    const isImageLeft = imagePosition === "left";
    const imgShadow = imageShadowMap[imageShadow] || imageShadowMap.lg;

    const splitCss = `
      @media (max-width: 1023px) {
        #${splitId} {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
          padding: 0 1rem !important;
        }
        #${splitId} .sg-hero__split-image {
          order: -1;
        }
      }
    `;

    const splitBgStyle = background ? `background: ${background};` : "background-color: var(--sg-bg, #fff);";
    const imgStyle = `width: 100%; max-width: 500px; height: auto; border-radius: ${imageRadius}px; box-shadow: ${imgShadow}; object-fit: cover;`;
    const imageDiv = `<div class="sg-hero__split-image" style="display: flex; justify-content: center; flex: 0 1 auto; max-width: ${blocksMaxWidth};"><img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title || "")}" class="sg-hero__img" style="${imgStyle}" onerror="${imgFallback}" /></div>`;
    const contentDiv = `<div class="sg-hero__split-content" style="text-align: ${align}; position: relative; z-index: 1; max-width: ${blocksMaxWidth}; flex: 0 1 auto;">${contentBlock}</div>`;

    const innerHtml = isImageLeft
      ? `<style>${splitCss}</style><div id="${splitId}" class="sg-hero__split-inner" style="display: flex; justify-content: ${blocksJustify}; gap: ${blocksGap}; align-items: center; max-width: ${containerMaxWidth}; width: 100%; padding: 0 2rem;">${imageDiv}${contentDiv}</div>`
      : `<style>${splitCss}</style><div id="${splitId}" class="sg-hero__split-inner" style="display: flex; justify-content: ${blocksJustify}; gap: ${blocksGap}; align-items: center; max-width: ${containerMaxWidth}; width: 100%; padding: 0 2rem;">${contentDiv}${imageDiv}</div>`;

    return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; ${paddingStyle} display: flex; align-items: center; justify-content: ${justifyContent}; position: relative; overflow: hidden; ${splitBgStyle}" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${innerHtml}</section>`;
  }

  // =========================================================================
  // RENDER: Card Layout (supports both with and without Image Grid)
  // Card always stays on the left (original position), Grid on the right
  // =========================================================================
  if (isCard && heroImage) {
    const cardBg = background || "#ffffff";
    const cardPadding = paddingY ? `${paddingY} 3rem` : "6rem 3rem";

    // With Image Grid: Card on left + Grid on right (preserves original card position)
    if (shouldShowImageGrid) {
      const cardGridLayoutId = generateScopedId(block.id || "", "hero-card-grid");
      const gridId = generateScopedId(block.id || "", "hero-grid");

      const gridResult = exportImageGrid(
        imageGridImages as ImageGridItem[],
        imageGridPreset as ImageGridPreset,
        imageGridGap as number,
        imageRadius,
        imageShadow,
        gridId
      );

      const cardHtml = `<div class="sg-hero__card" style="max-width: 500px; background: ${cardBg}; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); position: relative; z-index: 2; text-align: ${align}; flex: 0 1 auto;">${contentBlock}</div>`;
      const gridWrapperHtml = `<div class="sg-hero__grid-wrapper" style="position: relative; z-index: 3; display: flex; justify-content: center; align-items: center; flex: 0 1 auto; max-width: ${blocksMaxWidth};">${gridResult.html}</div>`;

      // Card always left, Grid always right
      const innerHtml = `${cardHtml}${gridWrapperHtml}`;

      // Responsive CSS
      let layoutCss = `
        @media (max-width: 1023px) {
          #${cardGridLayoutId} {
            flex-direction: column !important;
            gap: 2rem !important;
          }
          #${cardGridLayoutId} .sg-hero__grid-wrapper {
            order: -1;
          }
        }
      `;
      layoutCss += gridResult.css;

      const cardGridLayoutHtml = `<style>${layoutCss}</style><div id="${cardGridLayoutId}" class="sg-hero__card-grid-layout" style="display: flex; width: 100%; max-width: ${containerMaxWidth}; align-items: center; justify-content: ${blocksJustify}; position: relative; z-index: 2; padding: 0 2rem; gap: ${blocksGap};">${innerHtml}</div>`;

      return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses} sg-hero--with-grid" style="min-height: ${minHeight}; padding: ${cardPadding}; display: flex; align-items: center; justify-content: center; background-image: url(${escapeHtml(heroImage)}); background-size: cover; background-position: center; position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${cardGridLayoutHtml}</section>`;
    }

    // Without Image Grid: Original card layout
    const cardHtml = `
      <div class="sg-hero__card" style="max-width: ${contentMaxWidth}; width: 100%; background: ${cardBg}; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); position: relative; z-index: 2; text-align: ${align};">
        ${contentBlock}
      </div>
    `;

    return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; padding: ${cardPadding}; display: flex; align-items: center; justify-content: center; background-image: url(${escapeHtml(heroImage)}); background-size: cover; background-position: center; position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${cardHtml}</section>`;
  }

  // =========================================================================
  // RENDER: With Image Grid (any variation) - Floating grid alongside content
  // =========================================================================
  if (shouldShowImageGrid) {
    const gridLayoutId = generateScopedId(block.id || "", "hero-grid-layout");
    const gridId = generateScopedId(block.id || "", "hero-grid");
    const isGridLeft = imagePosition === "left";

    const gridResult = exportImageGrid(
      imageGridImages as ImageGridItem[],
      imageGridPreset as ImageGridPreset,
      imageGridGap as number,
      imageRadius,
      imageShadow,
      gridId
    );

    const gridWrapperHtml = `<div class="sg-hero__grid-wrapper" style="position: relative; z-index: 3; display: flex; justify-content: center; align-items: center; flex: 1 1 0%; max-width: ${blocksMaxWidth};">${gridResult.html}</div>`;
    const contentSideHtml = `<div class="sg-hero__content-side" style="max-width: ${blocksMaxWidth}; flex: 1 1 0%; text-align: ${align}; position: relative; z-index: 2;">${contentBlock}</div>`;

    // Responsive CSS for the grid layout
    let layoutCss = `
      @media (max-width: 1023px) {
        #${gridLayoutId} {
          flex-direction: column !important;
          gap: 2rem !important;
        }
        #${gridLayoutId} .sg-hero__grid-wrapper,
        #${gridLayoutId} .sg-hero__content-side {
          max-width: 100% !important;
        }
        #${gridLayoutId} .sg-hero__grid-wrapper {
          order: -1;
        }
      }
    `;
    layoutCss += gridResult.css;

    const innerHtml = isGridLeft
      ? `${gridWrapperHtml}${contentSideHtml}`
      : `${contentSideHtml}${gridWrapperHtml}`;

    const gridLayoutHtml = `<style>${layoutCss}</style><div id="${gridLayoutId}" class="sg-hero__grid-layout" style="display: flex; justify-content: ${blocksJustify}; gap: ${blocksGap}; max-width: ${containerMaxWidth}; width: 100%; align-items: center; position: relative; z-index: 2; padding: 0 2rem;">${innerHtml}</div>`;

    return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses} sg-hero--with-grid" style="min-height: ${minHeight}; ${paddingStyle} display: flex; align-items: center; justify-content: ${justifyContent}; ${bgStyle} position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${waveHtml}${gridLayoutHtml}</section>`;
  }

  // =========================================================================
  // RENDER: Default (centered, gradient, minimal, parallax, overlay)
  // =========================================================================
  const contentWrapHtml = `<div style="max-width: ${contentMaxWidth}; width: 100%; padding: 0 2rem; text-align: ${align}; position: relative; z-index: 2;">${contentBlock}</div>`;

  return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; ${paddingStyle} display: flex; align-items: center; justify-content: ${justifyContent}; ${bgStyle} position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${waveHtml}${contentWrapHtml}</section>`;
}

/**
 * Resolve hero button styles with independent customization for primary and secondary
 */
interface ButtonStylesConfig {
  theme?: ThemeTokens;
  blockId: string;
  buttonSize: string;
  primaryButtonVariant: string;
  primaryButtonColor: string;
  primaryButtonTextColor: string;
  primaryButtonRadius: number;
  secondaryButtonVariant: string;
  secondaryButtonColor: string;
  secondaryButtonTextColor: string;
  secondaryButtonRadius: number;
  hoverEffect: string;
  hoverIntensity: number;
  hoverOverlay: string;
  hoverIconName: string;
}

function resolveHeroButtonStyles(config: ButtonStylesConfig): { primary: string; secondary: string; css: string } {
  const {
    blockId,
    buttonSize,
    primaryButtonVariant,
    primaryButtonColor,
    primaryButtonTextColor,
    primaryButtonRadius,
    secondaryButtonVariant,
    secondaryButtonColor,
    secondaryButtonTextColor,
    secondaryButtonRadius,
    hoverEffect,
    hoverIntensity,
    hoverOverlay,
    hoverIconName,
  } = config;

  // Size-based styles
  const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
    sm: { padding: "0.625rem 1.25rem", fontSize: "0.875rem" },
    md: { padding: "0.875rem 2rem", fontSize: "1rem" },
    lg: { padding: "1rem 2.5rem", fontSize: "1.125rem" },
  };
  const size = sizeStyles[buttonSize] || sizeStyles.md;

  // Base button styles
  const baseStyles = [
    `padding: ${size.padding}`,
    "font-weight: 600",
    `font-size: ${size.fontSize}`,
    "text-decoration: none",
    "display: inline-flex",
    "align-items: center",
    "justify-content: center",
    "gap: 0.5rem",
    "transition: all 0.2s ease",
    "position: relative",
    "overflow: hidden",
    "cursor: pointer",
  ];

  // Primary button styles
  const primaryStyles = [...baseStyles, `border-radius: ${primaryButtonRadius}px`];
  switch (primaryButtonVariant) {
    case "outline":
      primaryStyles.push(`background-color: transparent`, `border: 2px solid ${primaryButtonColor}`, `color: ${primaryButtonColor}`);
      break;
    case "ghost":
      primaryStyles.push(`background-color: transparent`, `border: none`, `color: ${primaryButtonColor}`);
      break;
    default: // solid
      primaryStyles.push(`background-color: ${primaryButtonColor}`, `border: 2px solid ${primaryButtonColor}`, `color: ${primaryButtonTextColor}`);
  }

  // Secondary button styles
  const secondaryStyles = [...baseStyles, `border-radius: ${secondaryButtonRadius}px`];
  switch (secondaryButtonVariant) {
    case "solid":
      secondaryStyles.push(`background-color: ${secondaryButtonColor}`, `border: 2px solid ${secondaryButtonColor}`, `color: ${secondaryButtonTextColor}`);
      break;
    case "ghost":
      secondaryStyles.push(`background-color: transparent`, `border: none`, `color: ${secondaryButtonTextColor}`);
      break;
    default: // outline
      secondaryStyles.push(`background-color: transparent`, `border: 2px solid ${secondaryButtonColor}`, `color: ${secondaryButtonTextColor}`);
  }

  const scope = blockId ? `[data-block-id="${blockId}"]` : "";
  let css = "";

  // Hover effects
  if (hoverEffect !== "none") {
    // Primary button hover
    const primaryHoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: primaryButtonColor,
      buttonTextColor: primaryButtonVariant === "solid" ? primaryButtonTextColor : primaryButtonColor,
      variant: primaryButtonVariant as "solid" | "outline" | "ghost",
    });

    // Secondary button hover
    const secondaryHoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: secondaryButtonColor,
      buttonTextColor: secondaryButtonVariant === "solid" ? secondaryButtonTextColor : secondaryButtonColor,
      variant: secondaryButtonVariant as "solid" | "outline" | "ghost",
    });

    if (primaryHoverResult.base) {
      css += `${scope} .sg-hero__btn--primary { ${primaryHoverResult.base} }\n`;
    }
    if (secondaryHoverResult.base) {
      css += `${scope} .sg-hero__btn--secondary { ${secondaryHoverResult.base} }\n`;
    }

    css += `
      ${scope} .sg-hero__btn--primary:hover { ${primaryHoverResult.hover} }
      ${scope} .sg-hero__btn--secondary:hover { ${secondaryHoverResult.hover} }
    `;

    css += getButtonHoverKeyframes();
  }

  // Overlay effects
  if (hoverOverlay && hoverOverlay !== "none") {
    css += generateButtonOverlayCSS(`${scope} .sg-hero__btn--primary`, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor: primaryButtonColor,
      iconName: hoverIconName,
      textColor: primaryButtonVariant === "solid" ? primaryButtonTextColor : primaryButtonColor,
    });
    css += generateButtonOverlayCSS(`${scope} .sg-hero__btn--secondary`, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor: secondaryButtonColor,
      iconName: hoverIconName,
      textColor: secondaryButtonVariant === "solid" ? secondaryButtonTextColor : secondaryButtonColor,
    });
  }

  return {
    primary: primaryStyles.join("; "),
    secondary: secondaryStyles.join("; "),
    css,
  };
}

