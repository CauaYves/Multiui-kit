"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * Chave do tema das páginas em /view (blocos e demos em iframe). Elas rodam na mesma
 * origem do site, e o next-themes sincroniza a sua chave entre todas as janelas pelo evento
 * de storage: com a mesma chave, trocar o tema dentro de um bloco trocaria o site inteiro.
 * O BlockViewer copia o tema do site para esta chave, então o bloco abre no tema do site e o
 * acompanha, mas o que muda dentro dele fica só nele.
 */
export const VIEW_THEME_STORAGE_KEY = "mosaico-view-theme";

export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const storageKey = pathname?.startsWith("/view/") ? VIEW_THEME_STORAGE_KEY : undefined;

  return <NextThemesProvider storageKey={storageKey} {...props} />;
}
