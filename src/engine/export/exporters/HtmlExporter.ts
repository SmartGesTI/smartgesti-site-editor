/**
 * HTML Export Registry
 * Sistema de registro de exporters de blocos para HTML
 */

import { Block, BlockType } from "../../schema/siteDocument";
import { ThemeTokens } from "../../schema/themeTokens";

/**
 * Tipo de função que exporta um bloco para HTML
 */
export type HtmlBlockExporter = (
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
) => string;

/**
 * Registry de exporters HTML
 */
class HtmlExportRegistryImpl {
  private exporters = new Map<BlockType, HtmlBlockExporter>();

  /**
   * Registra um exporter para um tipo de bloco
   */
  register(type: BlockType, exporter: HtmlBlockExporter): void {
    this.exporters.set(type, exporter);
  }

  /**
   * Obtém o exporter para um tipo de bloco
   */
  get(type: BlockType): HtmlBlockExporter | undefined {
    return this.exporters.get(type);
  }

  /**
   * Verifica se existe um exporter registrado para o tipo
   */
  has(type: BlockType): boolean {
    return this.exporters.has(type);
  }

  /**
   * Retorna todos os tipos registrados
   */
  getRegisteredTypes(): BlockType[] {
    return Array.from(this.exporters.keys());
  }
}

/**
 * Instância singleton do registry
 */
export const htmlExportRegistry = new HtmlExportRegistryImpl();
