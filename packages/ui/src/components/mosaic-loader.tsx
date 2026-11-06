import { cn } from "cn";
import type * as React from "react";

// Carregamento em mosaico: uma imagem (por padrão, o ícone da marca) dividida em 3×3 peças que
// pulsam em onda diagonal. É o carregamento de troca de página: com `overlay`, cobre a tela com
// um fundo translúcido e desfocado enquanto a página seguinte carrega. A animação está no
// styles.css do kit (mosaic-loader-pulse).

const SIZE = 3;

/** Símbolo da marca (o "m") em traço cheio, na caixa 175×128 que começa em y=15. */
const MARK_PATH =
  "M169.04,64.95c-3.38-13.53-8.17-24.49-14.24-32.57-8.52-11.36-19.85-17.36-32.76-17.36-11.2,0-23.29,5.09-34.82,14.51-11.53-9.42-23.62-14.51-34.82-14.51-12.92,0-24.25,6-32.76,17.36-6.06,8.08-10.85,19.04-14.24,32.57C1.54,80.38.36,95.64,0,103.63c-.14,3.11,2.35,5.71,5.46,5.71h10.56c2.93,0,5.34-2.3,5.47-5.22.96-22.04,7.7-67.6,30.9-67.6,5.65,0,12.6,3.04,19.62,8.41-15.19,18.72-24.29,41.65-23.66,60.6.81,24.47,20.17,37.27,38.87,37.27s38.06-12.8,38.87-37.27c.63-18.95-8.47-41.88-23.66-60.6,7.01-5.37,13.97-8.41,19.62-8.41,23.2,0,29.94,45.56,30.9,67.59.13,2.92,2.54,5.22,5.46,5.22h10.56c3.12,0,5.6-2.6,5.47-5.71-.36-8-1.53-23.25-5.39-38.68ZM104.58,104.83c-.4,12.15-9.6,16.47-17.36,16.47s-16.96-4.31-17.36-16.47c-.43-12.98,6.46-30.15,17.36-44.39,10.9,14.24,17.79,31.41,17.36,44.39Z";

/** Ícone da marca como imagem para as peças: quadrado arredondado com o "m". */
function brandIcon(background: string, mark: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='112' fill='${background}'/><path transform='translate(81 98) scale(2)' fill='${mark}' d='${MARK_PATH}'/></svg>`,
  )}")`;
}

// No claro, fundo amarelo e "m" azul (o favicon); no escuro, as cores invertidas.
const BRAND_ICON_LIGHT = brandIcon("#fee502", "#0540c5");
const BRAND_ICON_DARK = brandIcon("#0540c5", "#fee502");

function MosaicLoader({
  src,
  overlay = false,
  label = "Carregando",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** URL da imagem a dividir em peças. Sem ela, usa o ícone da marca. */
  src?: string;
  /** Cobre a tela com fundo translúcido e desfocado (troca de página). */
  overlay?: boolean;
  /** Texto para leitores de tela. */
  label?: string;
}) {
  const light = src ? `url("${src}")` : BRAND_ICON_LIGHT;
  const dark = src ? light : BRAND_ICON_DARK;

  const grid = (
    <div
      role="status"
      aria-label={label}
      data-slot="mosaic-loader"
      className={cn(
        "grid size-22 grid-cols-3 grid-rows-3 [--mosaic-loader-image:var(--mosaic-loader-light)] dark:[--mosaic-loader-image:var(--mosaic-loader-dark)]",
        className,
      )}
      {...props}
      style={
        {
          "--mosaic-loader-light": light,
          "--mosaic-loader-dark": dark,
          ...props.style,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: SIZE * SIZE }, (_, index) => {
        const row = Math.floor(index / SIZE);
        const column = index % SIZE;
        return (
          <span
            // As peças são fixas e nunca mudam de ordem.
            // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
            key={index}
            className="animate-[mosaic-loader-pulse_1.1s_ease-in-out_infinite] bg-no-repeat motion-reduce:animate-none"
            style={{
              backgroundImage: "var(--mosaic-loader-image)",
              backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
              backgroundPosition: `${(column * 100) / (SIZE - 1)}% ${(row * 100) / (SIZE - 1)}%`,
              // Atraso em diagonal: peças da mesma diagonal pulsam juntas.
              animationDelay: `${(row + column) * 110}ms`,
            }}
          />
        );
      })}
    </div>
  );

  if (!overlay) return grid;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm">
      {grid}
    </div>
  );
}

export { MosaicLoader };
