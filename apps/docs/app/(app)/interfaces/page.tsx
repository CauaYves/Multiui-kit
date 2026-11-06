import type { Metadata } from "next";
import { ComponentsGallery, type GalleryItem } from "@/components/components-gallery";
import { INTERFACE_CATEGORIES, INTERFACES } from "@/interfaces";

export const metadata: Metadata = {
  title: "Interfaces",
  description: "Seções de interface prontas para produção, montadas com os componentes do Mosaico.",
};

// Galeria das seções de interface (interfaces/index.ts). Cada cartão abre a página da seção,
// com a prévia em tamanho real e o código.
export default function Page() {
  const items: GalleryItem[] = INTERFACES.map((entry) => ({
    name: entry.name,
    title: entry.title,
    description: entry.description,
    url: `/interfaces/${entry.name}`,
    category: entry.category,
    multiclubes: false,
    isNew: false,
    variations: 0,
    preview: entry.name,
  }));

  return (
    <div className="container-wrapper flex flex-1 flex-col px-6">
      <div className="mx-auto flex w-full max-w-350 flex-1 flex-col pb-16">
        <ComponentsGallery
          items={items}
          categories={INTERFACE_CATEGORIES}
          eyebrow="Interfaces"
          title="Interfaces de aplicação"
          description="Seções de interface prontas para produção, montadas com os componentes do Mosaico. Veja a prévia, copie o código e adapte à sua aplicação."
        />
      </div>
    </div>
  );
}
