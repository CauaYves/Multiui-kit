import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";

function Otp(props: { value?: string; defaultValue?: string; onChange?: (value: string) => void }) {
  return (
    <InputOTP maxLength={4} aria-label="Código" {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}

describe("InputOTP", () => {
  it("aceita defaultValue sem o aviso de input controlado e não controlado", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Otp defaultValue="12" />);

    expect(screen.getByRole("textbox", { name: "Código" })).toHaveValue("12");
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("no modo não controlado, atualiza o valor e chama onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Otp onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Código" }), "34");
    expect(screen.getByRole("textbox", { name: "Código" })).toHaveValue("34");
    expect(onChange).toHaveBeenLastCalledWith("34");
  });

  it("no modo controlado, respeita o value recebido", () => {
    render(<Otp value="9" onChange={() => {}} />);
    expect(screen.getByRole("textbox", { name: "Código" })).toHaveValue("9");
  });
});
