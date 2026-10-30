"use client";

import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@multiclubes/ui/components/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@multiclubes/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@multiclubes/ui/components/popover";
import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import {
  ArrowSquareOutIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  FileCodeIcon,
  FileCssIcon,
  IconContext,
  type IconWeight,
  MagnifyingGlassIcon,
  StarIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";
import { ColorPicker, hexToRgb } from "@/components/color-picker";
import { CREATE_ITEMS, type CreateItem } from "@/components/create-previews";
import type { CreateFont } from "@/lib/fonts";

type Color = {
  name: string;
  /** Amostra mostrada no seletor. */
  swatch: string;
  /** Ponto de partida do seletor de cor personalizada. */
  hex: string;
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

const CUSTOM_COLOR = "Personalizada";

/** Texto claro ou escuro, o que tiver mais contraste com a cor (WCAG). */
function foregroundFor(hex: string) {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Contraste com branco (1.05 / (L + 0.05)) contra preto ((L + 0.05) / 0.05).
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05
    ? "oklch(0.985 0 0)"
    : "oklch(0.205 0 0)";
}

/** Cor escolhida no seletor: a mesma nos modos claro e escuro. */
function customColor(hex: string): Color {
  const vars = { primary: hex, "primary-foreground": foregroundFor(hex), ring: hex };
  return { name: CUSTOM_COLOR, swatch: hex, hex, light: vars, dark: vars };
}

// Cores do primary. A primeira é a do tema (packages/ui/src/styles/globals.css) e não
// gera nada para sobrescrever.
const COLORS: Color[] = [
  { name: "Azul", swatch: "oklch(0.44 0.213 263)", hex: "#0540c5" },
  {
    name: "Verde",
    swatch: "oklch(0.527 0.154 150.069)",
    hex: "#15803d",
    light: { primary: "oklch(0.527 0.154 150.069)", ring: "oklch(0.627 0.17 149.214)" },
    dark: { primary: "oklch(0.627 0.17 149.214)", ring: "oklch(0.627 0.17 149.214)" },
  },
  {
    name: "Violeta",
    swatch: "oklch(0.491 0.27 292.581)",
    hex: "#6d28d9",
    light: { primary: "oklch(0.491 0.27 292.581)", ring: "oklch(0.606 0.25 292.717)" },
    dark: { primary: "oklch(0.606 0.25 292.717)", ring: "oklch(0.606 0.25 292.717)" },
  },
  {
    name: "Laranja",
    swatch: "oklch(0.646 0.222 41.116)",
    hex: "#ea580c",
    light: { primary: "oklch(0.646 0.222 41.116)", ring: "oklch(0.705 0.213 47.604)" },
    dark: { primary: "oklch(0.705 0.213 47.604)", ring: "oklch(0.705 0.213 47.604)" },
  },
  {
    name: "Grafite",
    swatch: "oklch(0.205 0 0)",
    hex: "#171717",
    light: { primary: "oklch(0.205 0 0)", ring: "oklch(0.556 0 0)" },
    dark: {
      primary: "oklch(0.922 0 0)",
      "primary-foreground": "oklch(0.205 0 0)",
      ring: "oklch(0.556 0 0)",
    },
  },
];

const DEFAULT_RADIUS = "0.625";
const RADII = ["0", "0.3", "0.5", "0.625", "0.75", "1"];

// Pesos do Phosphor (phosphoricons.com), a biblioteca de ícones do kit. Regular é o padrão.
const DEFAULT_WEIGHT: IconWeight = "regular";
const WEIGHTS: IconWeight[] = ["thin", "light", "regular", "bold", "fill", "duotone"];

function weightLabel(weight: string) {
  return weight.charAt(0).toUpperCase() + weight.slice(1);
}

/** Valor de "Títulos" que segue a fonte do texto. */
const SAME_FONT = "";

const VIEWPORTS = [
  { value: "desktop", label: "Desktop", icon: DesktopIcon, width: "100%" },
  { value: "tablet", label: "Tablet", icon: DeviceTabletIcon, width: "48rem" },
  { value: "mobile", label: "Celular", icon: DeviceMobileIcon, width: "24rem" },
];

function block(selector: string, vars: Record<string, string>) {
  const lines = Object.entries(vars).map(([name, value]) => `  --${name}: ${value};`);
  return lines.length ? `${selector} {\n${lines.join("\n")}\n}` : "";
}

/** CSS com o que muda em relação ao tema padrão. */
function themeCss(color: Color, radius: string, root = ":root", dark = ".dark") {
  const rootVars = { ...(radius !== DEFAULT_RADIUS && { radius: `${radius}rem` }), ...color.light };
  return [block(root, rootVars), block(dark, color.dark ?? {})].filter(Boolean).join("\n\n");
}

/** Trecho do app/layout.tsx que carrega as fontes escolhidas, ou null se nada muda. */
function layoutCode(sans: CreateFont, heading: CreateFont | null, defaultFont: CreateFont) {
  const fonts: [string, CreateFont, string][] = [];
  if (sans !== defaultFont) fonts.push(["fontSans", sans, "--font-sans"]);
  if (heading && heading !== sans) fonts.push(["fontHeading", heading, "--heading-font"]);
  if (fonts.length === 0) return null;

  const loaders = [...new Set(fonts.map(([, font]) => font.loader))].join(", ");
  return [
    `import { ${loaders} } from "next/font/google";`,
    "",
    ...fonts.map(
      ([name, font, variable]) =>
        `const ${name} = ${font.loader}({ subsets: ["latin"], variable: "${variable}" });`,
    ),
    "",
    "// No <html> do RootLayout:",
    `<html lang="pt-BR" className={\`${fonts.map(([name]) => `\${${name}.variable}`).join(" ")}\`}>`,
  ].join("\n");
}

/** Provider que aplica o peso dos ícones, ou null se for o padrão. */
function iconProviderCode(weight: IconWeight) {
  if (weight === DEFAULT_WEIGHT) return null;
  return [
    '"use client";',
    "",
    'import { IconContext } from "@phosphor-icons/react";',
    "",
    "// Envolva a aplicação com este provider no app/layout.tsx.",
    "export function IconProvider({ children }: { children: React.ReactNode }) {",
    `  return <IconContext.Provider value={{ weight: "${weight}" }}>{children}</IconContext.Provider>;`,
    "}",
  ].join("\n");
}

export function CreateCustomizer({ fonts }: { fonts: CreateFont[] }) {
  const defaultFont = fonts[0] as CreateFont;
  const [query, setQuery] = React.useState("");
  const [itemName, setItemName] = React.useState(CREATE_ITEMS[0]?.name ?? "");
  const [colorName, setColorName] = React.useState(COLORS[0]?.name ?? "");
  const [customHex, setCustomHex] = React.useState(COLORS[0]?.hex ?? "#000000");
  const [radius, setRadius] = React.useState(DEFAULT_RADIUS);
  const [fontName, setFontName] = React.useState(defaultFont.name);
  const [headingName, setHeadingName] = React.useState(SAME_FONT);
  const [weight, setWeight] = React.useState<IconWeight>(DEFAULT_WEIGHT);
  const [viewport, setViewport] = React.useState("desktop");

  const search = query.trim().toLowerCase();
  const items = CREATE_ITEMS.filter((entry) =>
    [entry.title, entry.name, ...entry.keywords].some((term) =>
      term.toLowerCase().includes(search),
    ),
  );
  const item =
    CREATE_ITEMS.find((entry) => entry.name === itemName) ?? (CREATE_ITEMS[0] as CreateItem);
  const Preview = item.preview;
  const color =
    colorName === CUSTOM_COLOR
      ? customColor(customHex)
      : (COLORS.find((entry) => entry.name === colorName) ?? (COLORS[0] as Color));
  const sans = fonts.find((entry) => entry.name === fontName) ?? defaultFont;
  const heading = fonts.find((entry) => entry.name === headingName) ?? null;
  const width = VIEWPORTS.find((entry) => entry.value === viewport)?.width ?? "100%";

  const css = themeCss(color, radius) || "/* Tema padrão: não há nada para sobrescrever. */";
  const layout = layoutCode(sans, heading, defaultFont);
  const iconProvider = iconProviderCode(weight);
  const iconContext = React.useMemo(() => ({ weight }), [weight]);
  // A prévia recebe o mesmo tema, com os seletores restritos a ela. --surface-radius e
  // --heading-font são calculados no :root, então precisam ser recalculados aqui.
  const previewCss = [
    `[data-create-preview] { --surface-radius: calc(var(--radius) * 3.2); font-family: ${sans.family}; --heading-font: ${(heading ?? sans).family}; }`,
    themeCss(color, radius, "[data-create-preview]", ".dark [data-create-preview]"),
  ].join("\n");

  return (
    <div
      data-slot="create"
      className="flex flex-1 flex-col gap-4 p-4 lg:h-[calc(100svh-var(--header-height))] lg:flex-row lg:pt-0"
    >
      <aside className="flex shrink-0 flex-col overflow-hidden rounded-surface border bg-card lg:w-72">
        <div className="border-b p-3">
          <InputGroup>
            <InputGroupInput
              type="search"
              placeholder="Pesquisar componentes..."
              aria-label="Pesquisar componentes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-4 p-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <nav aria-label="Componentes" className="flex flex-col gap-1">
            <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Componentes</p>
            {items.map((entry) => (
              <Button
                key={entry.name}
                variant="ghost"
                size="sm"
                aria-current={entry.name === item.name ? "page" : undefined}
                className="justify-start aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
                onClick={() => setItemName(entry.name)}
              >
                {entry.title}
              </Button>
            ))}
            {items.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                Nenhum componente encontrado.
              </p>
            )}
          </nav>
          <div className="flex flex-col gap-2 border-t pt-4">
            <ColorRow
              color={color}
              onPreset={setColorName}
              onCustom={(hex) => {
                setCustomHex(hex);
                setColorName(CUSTOM_COLOR);
              }}
            />
            <Picker
              label="Arredondamento"
              value={radius}
              onChange={setRadius}
              display={`${radius} rem`}
              indicator={
                <span
                  className="size-4 border-t-2 border-r-2 border-foreground"
                  style={{ borderTopRightRadius: `${Number(radius) * 10}px` }}
                />
              }
              options={RADII.map((value) => ({
                value,
                label: value === DEFAULT_RADIUS ? `${value} rem (padrão)` : `${value} rem`,
              }))}
            />
            <Picker
              label="Fonte"
              value={fontName}
              onChange={setFontName}
              indicator={<span style={{ fontFamily: sans.family }}>Aa</span>}
              group="Sans"
              options={fonts.map((font) => ({
                value: font.name,
                label: font.name,
                note: font.note,
                style: { fontFamily: font.family },
              }))}
            />
            <Picker
              label="Títulos"
              value={headingName}
              onChange={setHeadingName}
              display={heading?.name ?? "Igual ao texto"}
              indicator={<span style={{ fontFamily: (heading ?? sans).family }}>Aa</span>}
              group="Sans"
              options={[
                { value: SAME_FONT, label: "Igual ao texto" },
                ...fonts.map((font) => ({
                  value: font.name,
                  label: font.name,
                  note: font.note,
                  style: { fontFamily: font.family },
                })),
              ]}
            />
            <Picker
              label="Ícones"
              value={weight}
              onChange={(next) => setWeight(next as IconWeight)}
              display={`Phosphor · ${weightLabel(weight)}`}
              indicator={<StarIcon weight={weight} className="size-4" />}
              group="Phosphor"
              options={WEIGHTS.map((entry) => ({
                value: entry,
                label: weightLabel(entry),
                note: entry === DEFAULT_WEIGHT ? "Padrão" : undefined,
                prefix: <StarIcon weight={entry} />,
              }))}
            />
          </div>
        </div>
        <div className="border-t p-3">
          <ThemeDialog css={css} layout={layout} iconProvider={iconProvider} />
        </div>
      </aside>
      <section
        aria-label="Prévia"
        className="flex min-h-128 min-w-0 flex-1 flex-col overflow-hidden rounded-surface border"
      >
        <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-sm font-medium">{item.title}</h1>
            <p className="truncate text-xs text-muted-foreground">{item.description}</p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Dados ilustrativos
          </Badge>
          <ToggleGroup
            variant="outline"
            size="sm"
            aria-label="Largura da prévia"
            value={[viewport]}
            onValueChange={(next) => next[0] && setViewport(next[0])}
            className="hidden md:flex"
          >
            {VIEWPORTS.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
                <Icon />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={item.docs} />}
          >
            Documentação
            <ArrowSquareOutIcon data-icon="inline-end" />
          </Button>
        </div>
        <div className="flex flex-1 overflow-auto bg-muted/40 p-4 sm:p-8">
          <style>{previewCss}</style>
          <div
            data-create-preview
            className="@container/preview m-auto w-full transition-[max-width] duration-300"
            style={{ maxWidth: width }}
          >
            <IconContext.Provider value={iconContext}>
              <Preview />
            </IconContext.Provider>
          </div>
        </div>
      </section>
    </div>
  );
}

type PickerOption = {
  value: string;
  label: string;
  note?: string;
  prefix?: React.ReactNode;
  style?: React.CSSProperties;
};

const ROW_CLASS =
  "flex w-full items-center gap-3 rounded-field border bg-background px-3 py-2 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-accent";

function RowContent({
  label,
  value,
  indicator,
}: {
  label: string;
  value: string;
  indicator: React.ReactNode;
}) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="truncate text-sm font-medium">{value}</span>
      </span>
      <span aria-hidden className="flex shrink-0 items-center text-base font-medium">
        {indicator}
      </span>
    </>
  );
}

/** Linha "Cor": cores prontas e um seletor livre, com Hex e RGB. */
function ColorRow({
  color,
  onPreset,
  onCustom,
}: {
  color: Color;
  onPreset: (name: string) => void;
  onCustom: (hex: string) => void;
}) {
  const isCustom = color.name === CUSTOM_COLOR;

  return (
    <Popover>
      <PopoverTrigger render={<button type="button" className={ROW_CLASS} />}>
        <RowContent
          label="Cor"
          value={isCustom ? color.hex.toUpperCase() : color.name}
          indicator={
            <span
              className="size-4 rounded-full ring-1 ring-foreground/10"
              style={{ backgroundColor: color.swatch }}
            />
          }
        />
      </PopoverTrigger>
      <PopoverContent side="right" align="start" sideOffset={8} className="w-72 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Cores prontas</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((entry) => (
              <button
                key={entry.name}
                type="button"
                title={entry.name}
                aria-label={entry.name}
                aria-pressed={entry.name === color.name}
                onClick={() => onPreset(entry.name)}
                className="size-7 rounded-full ring-1 ring-foreground/10 ring-offset-2 ring-offset-popover outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-foreground"
                style={{ backgroundColor: entry.swatch }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground">Personalizada</p>
          <ColorPicker value={color.hex} onChange={onCustom} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Linha do aside: rótulo e valor atual, abre um menu com as opções. */
function Picker({
  label,
  value,
  display,
  indicator,
  options,
  group,
  onChange,
}: {
  label: string;
  value: string;
  /** Texto do valor atual, quando difere do rótulo da opção. */
  display?: string;
  indicator: React.ReactNode;
  options: PickerOption[];
  group?: string;
  onChange: (value: string) => void;
}) {
  const current = display ?? options.find((option) => option.value === value)?.label ?? value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" className={ROW_CLASS} />}>
        <RowContent label={label} value={current} indicator={indicator} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={8} className="min-w-52">
        <DropdownMenuGroup>
          {group && <DropdownMenuLabel>{group}</DropdownMenuLabel>}
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} style={option.style}>
                {option.prefix}
                {option.label}
                {option.note && (
                  <span className="ml-auto text-xs text-muted-foreground">{option.note}</span>
                )}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeDialog({
  css,
  layout,
  iconProvider,
}: {
  css: string;
  layout: string | null;
  iconProvider: string | null;
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="w-full" />}>Usar este tema</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Usar este tema</DialogTitle>
          <DialogDescription>
            Cole o CSS no CSS global da aplicação, depois do import do tema do Mosaico.
            {layout && " As fontes entram no layout, no lugar da Geist."}
          </DialogDescription>
        </DialogHeader>
        <Snippet title="app/globals.css" icon={<FileCssIcon />} code={css} />
        {layout && <Snippet title="app/layout.tsx" icon={<FileCodeIcon />} code={layout} />}
        {iconProvider && (
          <Snippet
            title="components/icon-provider.tsx"
            icon={<FileCodeIcon />}
            code={iconProvider}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Snippet({ title, icon, code }: { title: string; icon: React.ReactNode; code: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>
          {icon}
          {title}
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>{code}</CodeBlockContent>
    </CodeBlock>
  );
}
