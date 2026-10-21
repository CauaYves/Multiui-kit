"use client";

import { DateWheelPicker } from "@multiclubes/ui/components/date-wheel-picker";

export default function DateWheelPickerFormat() {
  return (
    <div className="grid w-full max-w-lg gap-6 sm:grid-cols-2">
      <DateWheelPicker defaultValue="1990-02-01" monthFormat="short" visibleCount={3} />
      <DateWheelPicker
        defaultValue="1990-02-01"
        monthFormat="numeric"
        order={["year", "month", "day"]}
        visibleCount={3}
      />
    </div>
  );
}
