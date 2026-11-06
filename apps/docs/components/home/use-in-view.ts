"use client";

import * as React from "react";

/**
 * Estado de entrada na tela. Começa "visível" (no servidor e sem JS o conteúdo aparece);
 * depois de montar, o que está fora da tela fica escondido até entrar nela.
 * `hidden` é `true` só nesse intervalo.
 */
export function useInView<T extends Element>(threshold = 0) {
  const ref = React.useRef<T>(null);
  const [state, setState] = React.useState<"idle" | "waiting" | "seen">("idle");

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setState("seen");
      return;
    }
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("seen");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, state !== "waiting"] as const;
}
