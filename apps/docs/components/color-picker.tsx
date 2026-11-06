"use client";

import { Input } from "@multiclubes/ui/components/input";
import { Label } from "@multiclubes/ui/components/label";
import * as React from "react";

type Hsv = { h: number; s: number; v: number };
type Rgb = { r: number; g: number; b: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return { r: f(5), g: f(3), b: f(1) };
}

function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);
  let h = 0;
  if (delta) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max };
}

export function hexToRgb(hex: string): Rgb | null {
  const match = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match?.[1]) return null;
  const digits =
    match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join("") : match[1];
  const value = Number.parseInt(digits, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

/** Seletor de cor no estilo do Canva: área de saturação e brilho, matiz, Hex e RGB. */
export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  // O HSV fica guardado aqui para não perder a matiz quando a cor vira cinza (s = 0).
  // Se o valor mudar por fora (ex. uma cor pronta), o HSV é recalculado.
  const [hsv, setHsv] = React.useState(() => rgbToHsv(hexToRgb(value) ?? { r: 0, g: 0, b: 0 }));
  const [synced, setSynced] = React.useState(value);
  if (value !== synced) {
    setSynced(value);
    const next = hexToRgb(value);
    if (next) setHsv(rgbToHsv(next));
  }

  const rgb = hsvToRgb(hsv);
  const current = rgbToHex(rgb);
  const update = (next: Hsv) => {
    const hex = rgbToHex(hsvToRgb(next));
    setHsv(next);
    setSynced(hex);
    onChange(hex);
  };

  return (
    <div className="flex flex-col gap-3">
      <Area hue={hsv.h} s={hsv.s} v={hsv.v} onChange={(s, v) => update({ ...hsv, s, v })} />
      <HueSlider hue={hsv.h} onChange={(h) => update({ ...hsv, h })} />
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,3.25rem)] gap-2">
        <HexField value={current} onChange={(hex) => onChange(hex)} />
        {(["r", "g", "b"] as const).map((channel) => (
          <ChannelField
            key={channel}
            channel={channel}
            value={rgb[channel]}
            onChange={(next) => onChange(rgbToHex({ ...rgb, [channel]: next }))}
          />
        ))}
      </div>
    </div>
  );
}

/** Arraste com o ponteiro, devolvendo a posição relativa (0 a 1) no elemento. */
function usePointerDrag(onMove: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    onMove(
      clamp((event.clientX - rect.left) / rect.width, 0, 1),
      clamp((event.clientY - rect.top) / rect.height, 0, 1),
    );
  };
  return {
    ref,
    onPointerDown: (event: React.PointerEvent) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      move(event);
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event);
    },
  };
}

function Area({
  hue,
  s,
  v,
  onChange,
}: {
  hue: number;
  s: number;
  v: number;
  onChange: (s: number, v: number) => void;
}) {
  const drag = usePointerDrag((x, y) => onChange(x, 1 - y));

  return (
    <div
      {...drag}
      role="slider"
      tabIndex={0}
      aria-label="Saturação e brilho"
      aria-valuetext={`Saturação ${Math.round(s * 100)}%, brilho ${Math.round(v * 100)}%`}
      aria-valuenow={Math.round(s * 100)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 0.1 : 0.01;
        const moves: Record<string, [number, number]> = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, step],
          ArrowDown: [0, -step],
        };
        const delta = moves[event.key];
        if (!delta) return;
        event.preventDefault();
        onChange(clamp(s + delta[0], 0, 1), clamp(v + delta[1], 0, 1));
      }}
      className="relative h-36 w-full cursor-crosshair touch-none rounded-field outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={{
        backgroundColor: `hsl(${hue} 100% 50%)`,
        backgroundImage:
          "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute size-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]"
        style={{ left: `${s * 100}%`, bottom: `${v * 100}%` }}
      />
    </div>
  );
}

function HueSlider({ hue, onChange }: { hue: number; onChange: (hue: number) => void }) {
  const drag = usePointerDrag((x) => onChange(Math.min(x * 360, 359.9)));

  return (
    <div
      {...drag}
      role="slider"
      tabIndex={0}
      aria-label="Matiz"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown")
          onChange((hue - step + 360) % 360);
        else if (event.key === "ArrowRight" || event.key === "ArrowUp")
          onChange((hue + step) % 360);
        else return;
        event.preventDefault();
      }}
      className="relative h-3 w-full cursor-pointer touch-none rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={{
        backgroundImage: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 size-4 -translate-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]"
        style={{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue} 100% 50%)` }}
      />
    </div>
  );
}

/** Campo Hex: aceita o texto livre enquanto se digita e só aplica uma cor válida. */
function HexField({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const id = React.useId();
  const [draft, setDraft] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        Hex
      </Label>
      <Input
        id={id}
        value={draft ?? value.toUpperCase()}
        spellCheck={false}
        maxLength={7}
        className="h-8 font-mono text-xs uppercase"
        onChange={(event) => {
          setDraft(event.target.value);
          const rgb = hexToRgb(event.target.value);
          if (rgb && event.target.value.replace("#", "").length === 6) onChange(rgbToHex(rgb));
        }}
        onBlur={() => {
          const rgb = draft ? hexToRgb(draft) : null;
          if (rgb) onChange(rgbToHex(rgb));
          setDraft(null);
        }}
      />
    </div>
  );
}

function ChannelField({
  channel,
  value,
  onChange,
}: {
  channel: "r" | "g" | "b";
  value: number;
  onChange: (value: number) => void;
}) {
  const id = React.useId();

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground uppercase">
        {channel}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={255}
        value={value}
        className="h-8 px-2 text-xs tabular-nums"
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(clamp(Math.round(next), 0, 255));
        }}
      />
    </div>
  );
}
