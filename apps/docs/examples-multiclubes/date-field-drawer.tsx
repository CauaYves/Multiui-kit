"use client";

import { DateField } from "@multiclubes/ui/components/date-field";
import { Field, FieldLabel } from "@multiclubes/ui/components/field";
import * as React from "react";

export default function DateFieldDrawer() {
  const [birthDate, setBirthDate] = React.useState("01/02/1990");

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="birth-date-drawer">Data de nascimento</FieldLabel>
      <DateField
        id="birth-date-drawer"
        mode="drawer"
        label="Data de nascimento"
        value={birthDate}
        onChange={setBirthDate}
      />
    </Field>
  );
}
