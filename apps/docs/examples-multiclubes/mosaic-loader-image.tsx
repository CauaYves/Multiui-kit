import { MosaicLoader } from "@multiclubes/ui/components/mosaic-loader";

export default function MosaicLoaderImage() {
  return (
    <div className="flex items-center gap-10">
      {/* Qualquer imagem vira o mosaico: aqui, uma das imagens do site. */}
      <MosaicLoader src="/mosaico-lettering.png" className="size-28" />
      <MosaicLoader className="size-12" />
    </div>
  );
}
