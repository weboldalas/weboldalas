'use client'

import { useState } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './select'

type Option = { value: string; label: string }

export function ControlledSelect({
  name,
  options,
  defaultValue = '',
  placeholder = 'Válassz...',
  required,
}: {
  name: string
  options: Option[]
  defaultValue?: string
  placeholder?: string
  required?: boolean
}) {
  const [value, setValue] = useState(defaultValue)
  const label = options.find(o => o.value === value)?.label

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={(v) => setValue(v ?? '')}>
        <SelectTrigger>
          <SelectValue>
            {label ?? <span className="text-muted-foreground">{placeholder}</span>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
