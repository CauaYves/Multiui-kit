import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { clampDateToRange, DateWheelPicker } from "./date-wheel-picker";

/**
 * O jsdom não tem layout: dá às opções uma altura (inline, então o
 * getComputedStyle a enxerga) para a roda conseguir converter rolagem em índice.
 */
function setRowHeight(column: HTMLElement, height: string) {
  for (const option of within(column).getAllByRole("option")) {
    option.style.height = height;
    // Como no navegador, offsetHeight arredonda para pixel inteiro.
    Object.defineProperty(option, "offsetHeight", {
      value: Math.round(Number.parseFloat(height)),
      configurable: true,
    });
  }
}

/** O scrollTop do jsdom é sempre 0; fixa um valor para a coluna "estar" rolada. */
function setScrollTop(column: HTMLElement, scrollTop: number) {
  Object.defineProperty(column, "scrollTop", {
    value: scrollTop,
    writable: true,
    configurable: true,
  });
}

/** Simula um gesto do usuário que termina com a coluna parada em `scrollTop`. */
function scrollColumnTo(column: HTMLElement, scrollTop: number) {
  setScrollTop(column, scrollTop);
  fireEvent.scroll(column);
  fireEvent(column, new Event("scrollend"));
}

const optionLabels = (column: HTMLElement) =>
  within(column)
    .getAllByRole("option")
    .map((option) => option.textContent);

describe("DateWheelPicker", () => {
  it("mostra as colunas de dia, mês e ano com o valor selecionado", () => {
    render(<DateWheelPicker value="2024-03-15" maxDate="2025-12-31" />);

    expect(screen.getByRole("group", { name: "Seletor de data" })).toBeInTheDocument();
    for (const [name, selected] of [
      ["Dia", "15"],
      ["Mês", "março"],
      ["Ano", "2024"],
    ]) {
      const column = screen.getByRole("listbox", { name });
      expect(within(column).getByRole("option", { selected: true })).toHaveTextContent(
        selected as string,
      );
    }
  });

  it("muda o dia pelo teclado", () => {
    const onValueChange = vi.fn();
    render(
      <DateWheelPicker value="2024-03-15" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Dia" }), { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith("2024-03-16");
  });

  it("ajusta o dia ao trocar para um mês mais curto", () => {
    const onValueChange = vi.fn();
    render(
      <DateWheelPicker value="2024-01-31" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Mês" }), { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith("2024-02-29");
  });

  it("seleciona uma opção ao clicar", () => {
    const onValueChange = vi.fn();
    render(
      <DateWheelPicker value="2024-03-15" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );

    fireEvent.click(within(screen.getByRole("listbox", { name: "Ano" })).getByText("2020"));
    expect(onValueChange).toHaveBeenCalledWith("2020-03-15");
  });

  it("limita as opções a minDate e maxDate", () => {
    render(<DateWheelPicker value="2024-06-10" minDate="2024-06-05" maxDate="2024-06-20" />);

    expect(optionLabels(screen.getByRole("listbox", { name: "Ano" }))).toEqual(["2024"]);
    expect(optionLabels(screen.getByRole("listbox", { name: "Mês" }))).toEqual(["junho"]);
    const days = optionLabels(screen.getByRole("listbox", { name: "Dia" }));
    expect(days[0]).toBe("5");
    expect(days.at(-1)).toBe("20");
  });

  it("no modo não controlado, guarda o valor escolhido", () => {
    render(<DateWheelPicker defaultValue="2024-03-15" maxDate="2025-12-31" />);

    const days = screen.getByRole("listbox", { name: "Dia" });
    fireEvent.keyDown(days, { key: "ArrowDown" });
    expect(within(days).getByRole("option", { selected: true })).toHaveTextContent("16");
  });

  it("mede linhas de altura fracionária sem acumular erro", () => {
    const onValueChange = vi.fn();
    const picker = () => (
      <DateWheelPicker value="2024-03-15" maxDate="2025-12-31" onValueChange={onValueChange} />
    );
    const { rerender } = render(picker());

    // Fonte base de 18px: 2,75rem = 49,5px. Medir 50px levaria o índice 90 (1990) a 89.
    const years = screen.getByRole("listbox", { name: "Ano" });
    setRowHeight(years, "49.5px");
    // Com altura mensurável, a coluna faz o posicionamento inicial (no navegador,
    // isso já acontece na montagem).
    rerender(picker());
    scrollColumnTo(years, 90 * 49.5);

    expect(onValueChange).toHaveBeenCalledWith("1990-03-15");
  });

  it("respeita o gesto do usuário mesmo durante o alinhamento automático", () => {
    const onValueChange = vi.fn();
    const picker = (value: string) => (
      <DateWheelPicker value={value} maxDate="2025-12-31" onValueChange={onValueChange} />
    );
    const { rerender } = render(picker("2024-03-15"));
    const days = screen.getByRole("listbox", { name: "Dia" });
    setRowHeight(days, "44px");
    // Posicionamento inicial no dia 15 (no navegador, já na montagem).
    rerender(picker("2024-03-15"));

    // O valor muda por fora e a coluna começa a rolar suavemente até o dia 10
    // (o scrollTo do jsdom não move nada: é como se a animação estivesse em curso)...
    rerender(
      <DateWheelPicker value="2024-03-10" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );
    // ...e o usuário rola até o dia 20 antes de o alinhamento terminar.
    scrollColumnTo(days, 19 * 44);

    expect(onValueChange).toHaveBeenCalledWith("2024-03-20");
  });

  it("parte do valor ao navegar pelo teclado durante a animação", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(
      <DateWheelPicker value="2024-03-15" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );
    const days = screen.getByRole("listbox", { name: "Dia" });
    setRowHeight(days, "44px");

    // Meio da animação: o destaque passa pelo dia 14.
    setScrollTop(days, 13 * 44);
    fireEvent.scroll(days);
    fireEvent.keyDown(days, { key: "ArrowDown" });

    expect(onValueChange).toHaveBeenCalledWith("2024-03-16");
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("emite uma vez por tecla, mesmo depois de clicar numa opção", () => {
    const onValueChange = vi.fn();
    render(
      <DateWheelPicker value="2024-03-15" maxDate="2025-12-31" onValueChange={onValueChange} />,
    );
    const option = within(screen.getByRole("listbox", { name: "Dia" })).getByText("15");

    fireEvent.keyDown(option, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("com minDate no futuro e sem maxDate, oferece datas a partir do mínimo", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = [
      tomorrow.getFullYear(),
      String(tomorrow.getMonth() + 1).padStart(2, "0"),
      String(tomorrow.getDate()).padStart(2, "0"),
    ].join("-");
    render(<DateWheelPicker minDate={tomorrowISO} />);

    const years = optionLabels(screen.getByRole("listbox", { name: "Ano" }));
    expect(years[0]).toBe(String(tomorrow.getFullYear()));
    expect(years.length).toBe(101);
    expect(
      within(screen.getByRole("listbox", { name: "Dia" })).getByRole("option", {
        selected: true,
      }),
    ).toHaveTextContent(String(tomorrow.getDate()));
  });

  it("hidrata sem divergência quando o dia muda entre o servidor e o navegador", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2024, 2, 15, 12));
    const html = renderToString(createElement(DateWheelPicker));

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    vi.setSystemTime(new Date(2024, 2, 16, 12));
    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      hydrateRoot(container, createElement(DateWheelPicker), { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector("output")).toHaveTextContent("16 de março de 2024");

    consoleError.mockRestore();
    container.remove();
    vi.useRealTimers();
  });
});

describe("clampDateToRange", () => {
  it("mantém uma data dentro da faixa", () => {
    expect(clampDateToRange("2020-05-10", { maxDate: "2025-12-31" })).toBe("2020-05-10");
  });

  it("leva a data ao limite mais próximo", () => {
    expect(clampDateToRange("2027-03-15", { maxDate: "2025-12-31" })).toBe("2025-12-31");
    expect(clampDateToRange("1995-10-10", { minDate: "2000-01-01", maxDate: "2025-12-31" })).toBe(
      "2000-01-01",
    );
  });

  it("troca data ausente ou inválida pelo dia de hoje dentro da faixa", () => {
    expect(clampDateToRange("2024-02-31", { minDate: "2030-01-01", maxDate: "2030-12-31" })).toBe(
      "2030-01-01",
    );
  });
});
