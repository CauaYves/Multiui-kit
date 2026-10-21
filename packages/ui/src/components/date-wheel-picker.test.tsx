import { fireEvent, render, screen, within } from "@testing-library/react";
import { DateWheelPicker } from "./date-wheel-picker";

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
});
