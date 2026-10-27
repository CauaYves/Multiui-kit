"use client";

import { DateWheelPicker } from "@multiclubes/ui/components/date-wheel-picker";
import * as React from "react";

export default function DateWheelPickerDemo() {
  const [value, setValue] = React.useState("1990-02-01");

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <DateWheelPicker value={value} onValueChange={setValue} />
      <p className="text-center text-sm text-muted-foreground">
        Valor: <code className="font-mono">{value}</code>
      </p>
    </div>
  );
}
