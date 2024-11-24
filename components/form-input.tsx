import { FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function FormInput({
  label,
  field,
  required = false,
  error,
  type = 'text',
}: {
  label: string
  field: FieldValues
  required?: boolean
  error?: string
  type?: string
}) {
  const placeholder = label + ' ' + (required ? '*' : '')
  return (
    <FormItem>
      <FormControl>
        <div className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">{label}</FormLabel>
          <Input
            placeholder={placeholder}
            {...field}
            type={type}
            required={required}
            className="col-span-3"
          />
        </div>
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}
