'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { NotebookPenIcon } from 'lucide-react'
import { AddNoteState, addNoteToOrder } from '@/lib/actions'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateNoteSchema } from '@/lib/forms'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

export default function AddNote({ orderId }: { orderId: string }) {
  const initialState: AddNoteState = {
    message: '',
    errors: {},
    success: false,
  }

  const [open, setOpen] = useState(false)

  const addNoteToOrderWithId = addNoteToOrder.bind(null, orderId)

  const [state, formAction] = useActionState(addNoteToOrderWithId, initialState)

  const form = useForm<z.infer<typeof CreateNoteSchema>>({
    resolver: zodResolver(CreateNoteSchema),
  })

  function onSubmit(values: z.infer<typeof CreateNoteSchema>) {
    startTransition(() => formAction(values))
  }

  useEffect(() => {
    if (state?.success) {
      form.reset()
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <NotebookPenIcon />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogDescription className="hidden">
          Add a note to this order.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a new Note</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="py-4">
                  <FormControl>
                    <Textarea rows={20} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state?.message && (
              <div className="text-sm text-red-500">{state.message}</div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Note</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
