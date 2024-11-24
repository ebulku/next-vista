import { CommandIcon } from 'lucide-react'

export default function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <CommandIcon className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="font-semibold">Next Vista</span>
        <span className="text-xs">Prisma | Shadcn</span>
      </div>
    </div>
  )
}
