import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function FormInput({
  name,
  field,
  required = false,
}: {
  name: string
  field: any
  required?: boolean
}) {
  const placeholder = name + ' ' + (required ? '*' : '(optional)')
  return (
    <FormItem>
      <FormControl>
        <div className="grid grid-cols-4 items-center gap-4">
          <FormLabel className="text-right">{name}</FormLabel>
          <Input
            placeholder={placeholder}
            {...field}
            required={required}
            className="col-span-3"
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
