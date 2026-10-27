"use client";

import { DateWheelPicker } from "@multiclubes/ui/components/date-wheel-picker";
import { addDays, format } from "date-fns";
import * as React from "react";

export default function DateWheelPickerLimits() {
  // Ex.: agendamento de uso de quadra, de hoje até 30 dias à frente. As datas são
  // calculadas no navegador: na página gerada no build, "hoje" seria o dia do build.
  const [range, setRange] = React.useState<{ min: string; max: string } | null>(null);

  React.useEffect(() => {
    const today = new Date();
    setRange({
      min: format(today, "yyyy-MM-dd"),
      max: format(addDays(today, 30), "yyyy-MM-dd"),
    });
  }, []);

  return (
    <div className="w-full max-w-xs">
      {range ? (
        <DateWheelPicker
          aria-label="Data do agendamento"
          defaultValue={range.min}
          minDate={range.min}
          maxDate={range.max}
        />
      ) : (
        <div className="h-55" />
      )}
    </div>
  );
}
