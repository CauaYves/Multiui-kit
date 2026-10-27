"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@multiclubes/ui/components/button"
import { Calendar } from "@multiclubes/ui/components/calendar"
import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@multiclubes/ui/components/popover"

export function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Field className="mx-auto w-44">
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-simple"
              className="justify-start font-normal"
            />
          }
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
