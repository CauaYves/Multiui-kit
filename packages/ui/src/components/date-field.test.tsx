import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { DateField } from "./date-field";

function ControlledDateField(props: Partial<React.ComponentProps<typeof DateField>>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <DateField
      label="Data de nascimento"
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

describe("DateField", () => {
  it("no modo input, aplica a máscara dd/mm/aaaa enquanto digita", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledDateField mode="input" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Data de nascimento" }), "01021990");
    expect(screen.getByRole("textbox", { name: "Data de nascimento" })).toHaveValue("01/02/1990");
    expect(onChange).toHaveBeenLastCalledWith("01/02/1990");
  });

  it("no modo drawer, a roda só altera o valor depois do Ok", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledDateField
        mode="drawer"
        value="15/03/2024"
        maxDate="2025-12-31"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Data de nascimento" });
    expect(input).toHaveAttribute("readonly");
    await user.click(input);

    const dialog = await screen.findByRole("dialog");
    const days = within(dialog).getByRole("listbox", { name: "Dia" });
    days.focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Ok" }));
    expect(onChange).toHaveBeenCalledWith("16/03/2024");
    expect(input).toHaveValue("16/03/2024");
  });

  it("com id, deixa o nome acessível para o <label>", () => {
    render(
      <>
        <label htmlFor="nascimento">Nascimento</label>
        <ControlledDateField id="nascimento" mode="input" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Nascimento" })).toBeInTheDocument();
  });
});
