'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound } from 'lucide-react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ChangePasswordState, changePassword } from '@/lib/actions'
import { ChangePasswordSchema } from '@/lib/forms'

import FormInput from '@/components/form-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form, FormField } from '@/components/ui/form'

export function ChangePassword() {
  const [open, setOpen] = useState(false)

  const initialState: ChangePasswordState = {
    message: '',
    errors: {},
    success: false,
  }

  const [state, formAction] = useActionState(changePassword, initialState)
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Handle server action response
  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      setOpen(false)
      form.reset()
    }
  }, [state, form])

  function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    startTransition(() => formAction(values))
  }

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <KeyRound className="mr-2 size-4" />
        Change Password
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription className="hidden">
              Change your password
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onSubmit)()
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormInput
                    label="Current Password"
                    type="password"
                    error={state.errors?.currentPassword?.[0]}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormInput
                    label="New Password"
                    type="password"
                    error={state.errors?.newPassword?.[0]}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    error={state.errors?.confirmPassword?.[0]}
                    field={field}
                  />
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? 'Changing...'
                    : 'Change Password'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
