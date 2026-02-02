import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";
import { heroVariations, heroVariationIds } from "../../../presets/heroVariations";

export const heroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero",
  description: "Seção hero completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    variant: "centered",
    title: "Bem-vindo ao Nosso Site",
    subtitle: "Subtitulo incrível aqui",
    description: "Uma descrição breve do seu produto ou serviço.",
    primaryButton: { text: "Começar Agora" },
    secondaryButton: { text: "Saber Mais" },
    align: "center",
  },
  variations: heroVariationIds.reduce(
    (acc, id) => {
      const v = heroVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    variation: {
      label: "Variação",
      inputType: "select",
      options: heroVariationIds.map((id) => ({
        label: heroVariations[id].name,
        value: id,
      })),
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Centralizado", value: "centered" },
        { label: "Dividido", value: "split" },
        { label: "Com Imagem de Fundo", value: "image-bg" },
      ],
      group: "Layout",
    },
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
    image: {
      label: "Imagem de Fundo",
      inputType: "image-upload",
      group: "Mídia",
      description: "Upload de imagem para o hero (recomendado: 1920x1080px)",
    },
    overlay: {
      label: "Overlay sobre a imagem",
      inputType: "checkbox",
      group: "Estilo",
    },
    overlayColor: {
      label: "Cor do Overlay",
      inputType: "text",
      group: "Estilo",
      description:
        "Ex.: linear-gradient(135deg, rgba(37,99,235,0.9), rgba(29,78,216,0.85))",
    },
    background: {
      label: "Background (cor ou gradiente)",
      inputType: "text",
      group: "Estilo",
      description: "Layout split: cor ou gradiente no lado do conteúdo",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(heroBlock);
