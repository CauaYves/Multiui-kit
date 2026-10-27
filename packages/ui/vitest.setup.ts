import "@testing-library/jest-dom/vitest";

// APIs de navegador que o jsdom não implementa.

// input-otp: detecção de gerenciadores de senha.
document.elementFromPoint ??= () => null;

// date-wheel-picker: posicionamento das colunas.
Element.prototype.scrollTo ??= () => {};
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// use-mobile e prefers-reduced-motion. Sem layout, toda media query é falsa.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
