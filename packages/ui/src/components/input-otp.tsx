"use client";

import { MinusIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

function InputOTP({
  className,
  containerClassName,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  // O input-otp repassa `defaultValue` ao <input> junto com `value`, e o React avisa que o
  // campo é controlado e não controlado ao mesmo tempo. Por isso o modo não controlado é
  // tratado aqui e a biblioteca sempre recebe `value`.
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue === undefined ? "" : String(defaultValue),
  );
  const isControlled = value !== undefined;

  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      value={isControlled ? value : uncontrolledValue}
      onChange={(next: string) => {
        if (!isControlled) setUncontrolledValue(next);
        onChange?.(next);
      }}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-field has-aria-invalid:**:data-[slot=input-otp-slot]:border-destructive/60",
        className,
      )}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-9 items-center justify-center border border-input bg-transparent -ml-px text-sm transition-[color,box-shadow,background-color] outline-none first:ml-0 first:rounded-l-field last:rounded-r-field data-[active=true]:z-10 data-[active=true]:border-ring/60 data-[active=true]:ring-1 data-[active=true]:ring-ring/60 data-[active=true]:aria-invalid:border-destructive/60 data-[active=true]:aria-invalid:ring-destructive/60",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
