import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";
import { Examples } from "@/examples/__index__";
import { MulticlubesExamples } from "@/examples-multiclubes";

export async function ComponentPreview({
  name,
  type,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  caption,
}: {
  name: string;
  /** "block": demos de página inteira (ex.: sidebar), exibidos em iframe. */
  type?: "block" | "component" | "example";
  className?: string;
  previewClassName?: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  chromeLessOnMobile?: boolean;
  caption?: string;
}) {
  if (type === "block") {
    return (
      <div
        data-not-typeset
        className="relative mt-6 aspect-[4/2.5] w-full overflow-hidden rounded-2xl border md:-mx-1"
      >
        {/* Largura de desktop fixa, para o demo não cair no layout mobile; a moldura recorta. */}
        <div className="absolute inset-0 w-[1600px] bg-background">
          <iframe src={`/view/${name}`} title={name} loading="lazy" className="size-full" />
        </div>
      </div>
    );
  }

  const load = Examples[name] ?? MulticlubesExamples[name];
  if (!load) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Exemplo <code>{name}</code> não encontrado.
      </p>
    );
  }
  const { default: Demo } = await load();

  const content = (
    <ComponentPreviewTabs
      className={className}
      previewClassName={previewClassName}
      align={align}
      hideCode={hideCode}
      chromeLessOnMobile={chromeLessOnMobile}
      component={<Demo />}
      source={<ComponentSource demo={name} collapsible={false} />}
      sourcePreview={<ComponentSource demo={name} collapsible={false} maxLines={3} />}
    />
  );

  if (!caption) return content;
  return (
    <figure data-hide-code={hideCode} className="flex flex-col data-[hide-code=true]:gap-4">
      {content}
      <figcaption className="-mt-8 text-center text-sm text-muted-foreground data-[hide-code=true]:mt-0">
        {caption}
      </figcaption>
    </figure>
  );
}
