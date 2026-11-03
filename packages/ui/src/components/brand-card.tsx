import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

// Cartão de destaque com "macarrões": traços grossos e fluidos que atravessam o cartão, com
// curvas largas e uma ou outra volta, como os da tela de "olá" da Apple, em 2D e nas cores da
// marca. Os traços saem de um sorteio com semente (`seed`): cada cartão tem o seu desenho, e o
// mesmo seed sempre dá o mesmo desenho (servidor e navegador iguais). As cores vêm de
// --brand-card-mark-1, -2 e -3, definidas pela variante e trocáveis por className.
const brandCardVariants = cva(
  "@container/brand-card relative isolate flex min-h-56 flex-col overflow-hidden rounded-surface shadow-md",
  {
    variants: {
      variant: {
        highlight:
          "bg-highlight text-highlight-foreground [--brand-card-mark-1:var(--color-primary)] [--brand-card-mark-2:white] [--brand-card-mark-3:color-mix(in_oklab,var(--color-primary)_45%,white)]",
        primary:
          "bg-primary text-primary-foreground [--brand-card-mark-1:var(--color-highlight)] [--brand-card-mark-2:white] [--brand-card-mark-3:color-mix(in_oklab,var(--color-primary)_40%,white)]",
        card: "bg-card text-card-foreground ring-1 ring-foreground/5 [--brand-card-mark-1:var(--color-primary)] [--brand-card-mark-2:var(--color-highlight)] [--brand-card-mark-3:color-mix(in_oklab,var(--color-primary)_45%,white)] dark:ring-foreground/10",
      },
    },
    defaultVariants: { variant: "highlight" },
  },
);

/** Gerador pseudoaleatório com semente (mulberry32): o mesmo seed dá a mesma sequência. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS = ["--brand-card-mark-1", "--brand-card-mark-2", "--brand-card-mark-3"];

const WIDTH = 320;
const HEIGHT = 180;

/**
 * Macarrão: anda em passos curtos, e a cada passo a direção vira um pouco. A curvatura é a
 * soma de duas ondas com fases sorteadas (trechos quase retos, curvas largas e uma ou outra
 * volta) mais uma puxada para o ponto de saída, que cresce com a distância percorrida. O
 * traço nasce fora do cartão e só acaba quando sai de novo: nenhuma ponta fica à mostra.
 * Devolve também o ponto mais baixo do traço na metade direita do cartão.
 */
function noodle(next: () => number, from: [number, number], to: [number, number]) {
  const step = 3;
  const amp1 = 0.015 + next() * 0.02;
  const amp2 = 0.01 + next() * 0.015;
  const freq1 = 0.015 + next() * 0.015;
  const freq2 = 0.03 + next() * 0.02;
  const phase1 = next() * Math.PI * 2;
  const phase2 = next() * Math.PI * 2;
  let [x, y] = from;
  let angle = Math.atan2(to[1] - y, to[0] - x) + (next() - 0.5) * 1.6;
  const points: string[] = [];
  let lowest = Number.NEGATIVE_INFINITY;
  let entered = false;
  for (let s = 0; s < 1200; s += step) {
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (x > WIDTH / 2 && x < WIDTH) lowest = Math.max(lowest, y);
    const inside = x > -4 && x < WIDTH + 4 && y > -4 && y < HEIGHT + 4;
    if (inside) entered = true;
    // Saiu do cartão (com folga para a espessura do traço): para.
    const out = x < -24 || x > WIDTH + 24 || y < -24 || y > HEIGHT + 24;
    if (entered && out) break;
    const wave = amp1 * Math.sin(s * freq1 + phase1) + amp2 * Math.sin(s * freq2 + phase2);
    const target = Math.atan2(to[1] - y, to[0] - x);
    const turn = Math.atan2(Math.sin(target - angle), Math.cos(target - angle));
    angle += step * wave + turn * Math.min(0.12, s * 0.0004);
    x += step * Math.cos(angle);
    y += step * Math.sin(angle);
  }
  return { d: `M${points.join("L")}`, lowest };
}

/** Cantos onde os traços aparecem; o inferior direito fica livre para o conteúdo. */
const CORNERS = [
  { x: 0, y: 0, sx: 1, sy: 1 },
  { x: WIDTH, y: 0, sx: -1, sy: 1 },
  { x: 0, y: HEIGHT, sx: 1, sy: -1 },
];

/**
 * Sorteia 4 macarrões numa caixa de 320×180. Cada um corta um canto: entra por uma borda
 * perto do canto e sai pela borda vizinha. O superior direito e o inferior esquerdo ganham
 * dois traços; o superior esquerdo, às vezes um. O cartão recorta o que passa das bordas.
 */
function drawStrokes(seed: number) {
  const next = random(seed);
  const between = (min: number, max: number) => min + next() * (max - min);
  const first = Math.floor(next() * COLORS.length);
  const plan = [CORNERS[1], CORNERS[2], CORNERS[1], CORNERS[2]];
  if (next() < 0.5) plan[2] = CORNERS[0];
  return plan.map((corner, index) => {
    const { x, y, sx, sy } = corner as (typeof CORNERS)[number];
    // Um ponto na borda horizontal e outro na vertical, os dois fora do cartão.
    const horizontal: [number, number] = [x + sx * between(50, 170), y - sy * 30];
    const vertical: [number, number] = [x - sx * 30, y + sy * between(40, 130)];
    const [from, to] = next() < 0.5 ? [horizontal, vertical] : [vertical, horizontal];
    const { d, lowest } = noodle(next, from, to);
    return {
      d,
      color: COLORS[(first + index) % COLORS.length] as string,
      width: between(13, 19),
      // Os do canto superior direito sobem só o necessário para a parte mais baixa ficar
      // acima do título (~40% da altura). É um deslocamento depois do sorteio: os desenhos
      // aprovados se mantêm.
      lift: corner === CORNERS[1] ? Math.min(0, 62 - lowest) : 0,
    };
  });
}

/**
 * O desenho é feito para o conteúdo à direita. Com o conteúdo à esquerda (`side="start"`), o
 * mesmo desenho é espelhado na horizontal: o canto livre passa a ser o inferior esquerdo.
 */
function Squiggles({ seed, side }: { seed: number; side: "start" | "end" }) {
  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 size-full"
    >
      <g transform={side === "start" ? `matrix(-1 0 0 1 ${WIDTH} 0)` : undefined}>
        {drawStrokes(seed).map((stroke) => (
          <path
            key={stroke.d}
            d={stroke.d}
            strokeWidth={stroke.width}
            transform={stroke.lift ? `translate(0 ${stroke.lift})` : undefined}
            style={{ stroke: `var(${stroke.color})` }}
          />
        ))}
      </g>
    </svg>
  );
}

function BrandCard({
  className,
  variant,
  seed = 3,
  side = "end",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof brandCardVariants> & {
    /**
     * Semente do desenho dos traços. Troque para ter outro desenho; o mesmo valor repete.
     * Aprovados pelo design: 3 (padrão) e 5.
     */
    seed?: number;
    /**
     * Lado em que fica o conteúdo: "end" (direita, padrão) ou "start" (esquerda). Os traços
     * ficam longe desse lado. Alinhe o BrandCardContent do mesmo jeito.
     */
    side?: "start" | "end";
  }) {
  return (
    <div
      data-slot="brand-card"
      data-variant={variant ?? "highlight"}
      data-side={side}
      className={cn(brandCardVariants({ variant }), className)}
      {...props}
    >
      <Squiggles seed={seed} side={side} />
      {children}
    </div>
  );
}

/** Área de conteúdo do cartão, com o respiro que mantém o texto longe dos símbolos. */
function BrandCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="brand-card-content"
      className={cn("flex flex-1 flex-col gap-3 p-6 @md/brand-card:p-8", className)}
      {...props}
    />
  );
}

export { BrandCard, BrandCardContent, brandCardVariants };
