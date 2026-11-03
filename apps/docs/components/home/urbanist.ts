import { Urbanist } from "next/font/google";

// Usada só no palco "Tipografia" da home. preload: false para não pesar as outras páginas.
export const urbanist = Urbanist({ subsets: ["latin"], display: "swap", preload: false });
