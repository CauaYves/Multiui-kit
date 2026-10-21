import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renderiza com as classes da variante padrão", () => {
    render(<Button>Salvar</Button>);

    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("bg-primary");
  });

  it("aplica variante e className extra", () => {
    render(
      <Button variant="outline" className="w-full">
        Cancelar
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Cancelar" });
    expect(button).toHaveClass("border-border", "w-full");
    expect(button).not.toHaveClass("bg-primary");
  });

  it("dispara onClick e respeita disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Enviar</Button>);

    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Enviar
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
