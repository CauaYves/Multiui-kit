"use client";

import { DateField } from "@multiclubes/ui/components/date-field";
import { Field, FieldError, FieldLabel } from "@multiclubes/ui/components/field";
import * as React from "react";

export default function DateFieldInvalid() {
  const [birthDate, setBirthDate] = React.useState("31/02/1990");

  return (
    <Field data-invalid className="w-full max-w-xs">
      <FieldLabel htmlFor="birth-date-invalid">Data de nascimento</FieldLabel>
      <DateField
        id="birth-date-invalid"
        label="Data de nascimento"
        value={birthDate}
        onChange={setBirthDate}
        aria-invalid
        aria-describedby="birth-date-invalid-error"
      />
      <FieldError id="birth-date-invalid-error">Informe uma data válida.</FieldError>
    </Field>
  );
}
