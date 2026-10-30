import { DM_Sans, Figtree, Inter, Nunito_Sans, Public_Sans, Roboto } from "next/font/google";

// Fontes oferecidas em /create. Todas são do Google Fonts e o next/font hospeda os
// arquivos junto com o app, então a fonte é a mesma em Windows, macOS, Linux, Android
// e iOS. Fontes de sistema (SF Pro, Segoe UI) ficam de fora: cada uma só existe numa
// plataforma. preload: false porque só a página /create usa estas fontes.
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });
const roboto = Roboto({ subsets: ["latin"], display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false });
const figtree = Figtree({ subsets: ["latin"], display: "swap", preload: false });
const publicSans = Public_Sans({ subsets: ["latin"], display: "swap", preload: false });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], display: "swap", preload: false });

export type CreateFont = {
  name: string;
  /** Nome da função em next/font/google. */
  loader: string;
  /** Valor de font-family. */
  family: string;
  note?: string;
};

export const CREATE_FONTS: CreateFont[] = [
  // A Geist já é a fonte do site (app/layout.tsx), então não é carregada de novo.
  { name: "Geist", loader: "Geist", family: "var(--font-sans)", note: "Padrão" },
  { name: "Inter", loader: "Inter", family: inter.style.fontFamily, note: "Dashboard" },
  { name: "Roboto", loader: "Roboto", family: roboto.style.fontFamily },
  { name: "DM Sans", loader: "DM_Sans", family: dmSans.style.fontFamily },
  { name: "Figtree", loader: "Figtree", family: figtree.style.fontFamily },
  { name: "Public Sans", loader: "Public_Sans", family: publicSans.style.fontFamily },
  { name: "Nunito Sans", loader: "Nunito_Sans", family: nunitoSans.style.fontFamily },
];
