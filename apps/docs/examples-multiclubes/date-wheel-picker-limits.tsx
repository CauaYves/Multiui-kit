"use client";

import { DateWheelPicker } from "@multiclubes/ui/components/date-wheel-picker";
import { addDays, format } from "date-fns";

const today = new Date();

export default function DateWheelPickerLimits() {
  // Ex.: agendamento de uso de quadra, de hoje até 30 dias à frente.
  return (
    <div className="w-full max-w-xs">
      <DateWheelPicker
        aria-label="Data do agendamento"
        defaultValue={format(today, "yyyy-MM-dd")}
        minDate={format(today, "yyyy-MM-dd")}
        maxDate={format(addDays(today, 30), "yyyy-MM-dd")}
      />
    </div>
  );
}
