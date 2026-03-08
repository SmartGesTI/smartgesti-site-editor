import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../registry/registry';
import { renderRegistry } from '../render/registry/renderRegistry';
import { htmlExportRegistry } from '../export/exporters/HtmlExporter';

// Forçar auto-registro de tudo
import '../registry/blocks/layout';
import '../registry/blocks/content';
import '../registry/blocks/composition';
import '../registry/blocks/sections';
import '../registry/blocks/forms';
import '../render/renderers';
import '../export/exporters/content';
import '../export/exporters/layout';
import '../export/exporters/sections';
import '../export/exporters/forms';
import '../plugins/builtin/blog';

describe('Dual Rendering Parity — Cross-Registry', () => {
  it('todo block registrado deve ter renderer E exporter', () => {
    const allDefs = componentRegistry.getAll();
    const missingRenderer: string[] = [];
    const missingExporter: string[] = [];

    for (const def of allDefs) {
      if (!renderRegistry.has(def.type)) {
        missingRenderer.push(def.type);
      }
      if (!htmlExportRegistry.has(def.type)) {
        missingExporter.push(def.type);
      }
    }

    expect(
      missingRenderer,
      `Blocks registrados SEM renderer: ${missingRenderer.join(', ')}`,
    ).toEqual([]);

    expect(
      missingExporter,
      `Blocks registrados SEM exporter: ${missingExporter.join(', ')}`,
    ).toEqual([]);
  });

  it('nenhum renderer órfão (sem block definition)', () => {
    const allRenderers = renderRegistry.getAll();
    const orphanRenderers: string[] = [];

    for (const [type] of allRenderers) {
      if (!componentRegistry.get(type)) {
        orphanRenderers.push(type);
      }
    }

    expect(
      orphanRenderers,
      `Renderers sem block definition: ${orphanRenderers.join(', ')}`,
    ).toEqual([]);
  });

  it('nenhum exporter órfão (sem block definition)', () => {
    const registeredTypes = htmlExportRegistry.getRegisteredTypes();
    const orphanExporters: string[] = [];

    for (const type of registeredTypes) {
      if (!componentRegistry.get(type)) {
        orphanExporters.push(type);
      }
    }

    expect(
      orphanExporters,
      `Exporters sem block definition: ${orphanExporters.join(', ')}`,
    ).toEqual([]);
  });

  it('contagem de registros deve ser consistente', () => {
    const defCount = componentRegistry.getAll().length;
    const rendererCount = renderRegistry.getAll().length;
    const exporterCount = htmlExportRegistry.getRegisteredTypes().length;

    expect(rendererCount, `Renderers (${rendererCount}) != Definitions (${defCount})`).toBe(defCount);
    expect(exporterCount, `Exporters (${exporterCount}) != Definitions (${defCount})`).toBe(defCount);
  });
});
