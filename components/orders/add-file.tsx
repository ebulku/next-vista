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
import { Button } from '../ui/button'
import { UploadIcon } from 'lucide-react'
import { addFileToOrder, AddNoteState } from '@/lib/actions'
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'
import { cn, formatBytes } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function AddFile({ orderId }: { orderId: string }) {
  const { toast } = useToast()

  const initialState: AddNoteState = {
    message: '',
    errors: {},
    success: false,
  }

  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const [state, formAction] = useActionState(
    addFileToOrder.bind(null, orderId),
    initialState
  )

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      setDisabled(false)
      toast({
        title: 'File(s) uploaded successfully',
      })
    }
  }, [state])

  const maxSize = 1024 * 1024 * 4
  const maxFileCount = 5

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setDisabled(true)
      if (acceptedFiles.length > maxFileCount) {
        toast({
          variant: 'destructive',
          title: `Cannot upload more than ${maxFileCount} files`,
        })
        setDisabled(false)
        return
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast({
            variant: 'destructive',
            title: `File ${file.name} was rejected`,
          })
        })
        setDisabled(false)
      }

      if (formAction && acceptedFiles.length > 0) {
        startTransition(() => {
          formAction(acceptedFiles)
        })
      }
    },
    [formAction, maxFileCount]
  )
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
        <DialogHeader>
          <DialogTitle>Add a new File</DialogTitle>
        </DialogHeader>
        <Dropzone
          onDrop={onDrop}
          maxSize={maxSize}
          multiple
          accept={{
            'image/*': [],
            'application/pdf': [],
          }}
          maxFiles={maxFileCount}
          disabled={disabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isDragActive && 'border-muted-foreground/50',
                disabled && 'pointer-events-none opacity-60'
              )}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-medium text-muted-foreground">
                    Drop the files here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col gap-px">
                    <p className="font-medium text-muted-foreground">
                      Drag {`'n'`} drop files here, or click to select files
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      You can upload up to {maxFileCount} file with{' '}
                      {formatBytes(maxSize)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
