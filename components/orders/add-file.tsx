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
import { NotebookPenIcon, UploadIcon } from 'lucide-react'
import { addFileToOrder, AddNoteState, addNoteToOrder } from '@/lib/actions'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateNoteSchema } from '@/lib/forms'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { FileUploader } from '../file-uploader'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export default function AddFile({ orderId }: { orderId: string }) {
  const initialState: AddNoteState = {
    message: '',
    errors: {},
    success: false,
  }

  const [open, setOpen] = useState(false)

  const addFileToOrderWithId = addFileToOrder.bind(null, orderId)

  const [state, formAction] = useActionState(addFileToOrderWithId, initialState)

  // const form = useForm<z.infer<typeof FormData>>({
  //   resolver: zodResolver(CreateNoteSchema),
  // })

  // function onSubmit(values: z.infer<typeof CreateNoteSchema>) {
  //   startTransition(() => formAction(values))
  // }

  useEffect(() => {
    if (state?.success) {
      // form.reset()
      setOpen(false)
    }
  }, [state])

  // const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
  //   'imageUploader',
  //   {
  //     defaultUploadedFiles: [],
  //   }
  // )

  async function uploadImage(formData: FormData) {
    // 'use server'
    const imageFile = formData.get('image') as File
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    })
    revalidatePath('/')
    return blob
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon />
          Add File
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogDescription className="hidden">
          Upload a file to this order.
        </DialogDescription>

        <form
          action={formAction}
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Add a new File</DialogTitle>
          </DialogHeader>
          <label htmlFor="image">Image</label>
          <input type="file" id="image" name="image" required />
          {state?.message && (
            <div className="text-sm text-red-500">{state.message}</div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
