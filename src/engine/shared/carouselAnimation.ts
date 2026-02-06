/**
 * Carousel Animation CSS Generator
 * Gera CSS keyframes para crossfade de N imagens (puro CSS, sem JS)
 */

/**
 * Gera CSS completo para um carrossel de crossfade com N imagens + indicadores (dots).
 *
 * Fórmula:
 * - Ciclo total = N × intervalSeconds
 * - Cada imagem: fade in → hold → fade out, escalonada por animation-delay: i * T
 * - Primeira imagem começa com opacity: 1 inline (visível antes do CSS carregar)
 * - Dots seguem a mesma animação para indicar o slide ativo
 *
 * @param scopeSelector - Seletor CSS para escopo (ex: "#hero-carousel-abc")
 * @param imageCount - Número de imagens no carrossel (mín 2)
 * @param intervalSeconds - Duração de exibição de cada imagem em segundos
 * @returns String CSS com keyframes e estilos das imagens e dots
 */
export function generateCarouselCSS(
  scopeSelector: string,
  imageCount: number,
  intervalSeconds: number = 5,
): string {
  if (imageCount < 2) return "";

  const totalDuration = imageCount * intervalSeconds;

  // Percentuais para a animação de cada imagem:
  // fadeIn: 0% → holdStart
  // hold: holdStart → holdEnd
  // fadeOut: holdEnd → fadeOutEnd
  // invisible: fadeOutEnd → 100%
  const fadePercent = 10 / imageCount; // ~fade in/out como % do ciclo
  const holdPercent = (100 / imageCount) - (fadePercent * 2);

  // Image crossfade keyframes
  const imageKeyframes = `
@keyframes sg-carousel-fade {
  0% { opacity: 0; }
  ${fadePercent.toFixed(1)}% { opacity: 1; }
  ${(fadePercent + holdPercent).toFixed(1)}% { opacity: 1; }
  ${(fadePercent * 2 + holdPercent).toFixed(1)}% { opacity: 0; }
  100% { opacity: 0; }
}`;

  // Dot indicator keyframes (active = bright/scaled, inactive = dim)
  const dotKeyframes = `
@keyframes sg-carousel-dot-active {
  0% { opacity: 0.4; transform: scale(1); }
  ${fadePercent.toFixed(1)}% { opacity: 1; transform: scale(1); }
  ${(fadePercent + holdPercent).toFixed(1)}% { opacity: 1; transform: scale(1); }
  ${(fadePercent * 2 + holdPercent).toFixed(1)}% { opacity: 0.4; transform: scale(1); }
  100% { opacity: 0.4; transform: scale(1); }
}`;

  // Image styles: all stacked with position absolute
  const imageStyles = `
${scopeSelector} .sg-carousel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: sg-carousel-fade ${totalDuration}s infinite;
}`;

  // Dot container styles
  const dotContainerStyles = `
${scopeSelector} .sg-carousel__dots {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}
${scopeSelector} .sg-carousel__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0;
  cursor: default;
  opacity: 0.4;
  transition: opacity 0.3s;
  animation: sg-carousel-dot-active ${totalDuration}s infinite;
}`;

  // Staggered delays for images and dots
  const delays = Array.from({ length: imageCount }, (_, i) => {
    const delay = i * intervalSeconds;
    const imgRule = `${scopeSelector} .sg-carousel__img:nth-child(${i + 1}) { animation-delay: ${delay}s;${i === 0 ? " opacity: 1;" : ""} }`;
    const dotRule = `${scopeSelector} .sg-carousel__dot:nth-child(${i + 1}) { animation-delay: ${delay}s;${i === 0 ? " opacity: 1;" : ""} }`;
    return `${imgRule}\n${dotRule}`;
  }).join("\n");

  return `${imageKeyframes}\n${dotKeyframes}\n${imageStyles}\n${dotContainerStyles}\n${delays}`;
}
