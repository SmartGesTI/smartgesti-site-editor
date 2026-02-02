/**
 * Keyboard Shortcuts Hook
 * Gerencia atalhos de teclado para o editor
 */

import { useEffect } from "react";

export interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
}

/**
 * Hook para gerenciar atalhos de teclado do editor
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onUndo: handleUndo,
 *   onRedo: handleRedo,
 *   onSave: handleSave,
 *   onDelete: handleDeleteBlock,
 * });
 * ```
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ignorar se estiver digitando em input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Exceto Ctrl+S que queremos capturar sempre
        if (!(modKey && e.key === "s")) {
          return;
        }
      }

      // Ctrl/Cmd + Z = Undo
      if (modKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
        return;
      }

      // Ctrl/Cmd + Shift + Z = Redo
      // ou Ctrl/Cmd + Y = Redo (Windows style)
      if (
        (modKey && e.key === "z" && e.shiftKey) ||
        (modKey && e.key === "y")
      ) {
        e.preventDefault();
        handlers.onRedo?.();
        return;
      }

      // Ctrl/Cmd + S = Save
      if (modKey && e.key === "s") {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // Delete / Backspace = Delete block (não em inputs)
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        handlers.onDelete?.();
        return;
      }

      // Ctrl/Cmd + D = Duplicate
      if (modKey && e.key === "d") {
        e.preventDefault();
        handlers.onDuplicate?.();
        return;
      }

      // Ctrl/Cmd + C = Copy
      if (modKey && e.key === "c" && !e.shiftKey) {
        // Deixar comportamento padrão se houver texto selecionado
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
        e.preventDefault();
        handlers.onCopy?.();
        return;
      }

      // Ctrl/Cmd + V = Paste
      if (modKey && e.key === "v") {
        // Permitir paste em inputs
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        handlers.onPaste?.();
        return;
      }

      // Ctrl/Cmd + A = Select All
      if (modKey && e.key === "a") {
        e.preventDefault();
        handlers.onSelectAll?.();
        return;
      }

      // Esc = Deselect
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.onDeselect?.();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers]);
}

/**
 * Retorna descrição dos atalhos de teclado para exibição ao usuário
 */
export function getKeyboardShortcutsHelp(): Array<{
  keys: string;
  description: string;
}> {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  return [
    { keys: `${modKey}+Z`, description: "Desfazer" },
    { keys: `${modKey}+Shift+Z ou ${modKey}+Y`, description: "Refazer" },
    { keys: `${modKey}+S`, description: "Salvar" },
    { keys: `Delete ou Backspace`, description: "Remover bloco" },
    { keys: `${modKey}+D`, description: "Duplicar bloco" },
    { keys: `${modKey}+C`, description: "Copiar bloco" },
    { keys: `${modKey}+V`, description: "Colar bloco" },
    { keys: `${modKey}+A`, description: "Selecionar tudo" },
    { keys: `Esc`, description: "Desselecionar" },
  ];
}
