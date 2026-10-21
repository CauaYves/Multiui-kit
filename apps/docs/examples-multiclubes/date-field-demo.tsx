"use client";

import { DateField } from "@multiclubes/ui/components/date-field";
import { Field, FieldDescription, FieldLabel } from "@multiclubes/ui/components/field";
import * as React from "react";

export default function DateFieldDemo() {
  const [birthDate, setBirthDate] = React.useState("");

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="birth-date">Data de nascimento</FieldLabel>
      <DateField
        id="birth-date"
        label="Data de nascimento"
        value={birthDate}
        onChange={setBirthDate}
      />
      <FieldDescription>No celular, o campo abre a roda de dia, mês e ano.</FieldDescription>
    </Field>
  );
}
