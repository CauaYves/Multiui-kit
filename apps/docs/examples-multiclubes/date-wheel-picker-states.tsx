"use client";

import { DateWheelPicker } from "@multiclubes/ui/components/date-wheel-picker";

export default function DateWheelPickerStates() {
  return (
    <div className="grid w-full max-w-lg gap-6 sm:grid-cols-2">
      <DateWheelPicker defaultValue="1990-02-01" visibleCount={3} disabled />
      <DateWheelPicker
        defaultValue="1990-02-01"
        visibleCount={3}
        errors={["Informe uma data válida."]}
      />
    </div>
  );
}
