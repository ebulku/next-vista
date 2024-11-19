import { File, Note } from '@prisma/client'
import { FileDownIcon } from 'lucide-react'
import Link from 'next/link'
import Zoom from 'react-medium-image-zoom'

import { formatDateToLocal, isImageType } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'

import '@/styles/zoom.css'

type TimelineItemType = Note | File

export default function OrderTimeline({
  notes,
  files,
}: {
  notes: Note[]
  files: File[]
}) {
  const allNotes: TimelineItemType[] = [...notes, ...files].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <>
      <Timeline>
        {allNotes.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineHeading variant="secondary">
              {formatDateToLocal(item.createdAt)}
            </TimelineHeading>
            <TimelineDot />
            <TimelineLine />
            <TimelineContent className="pt-4">
              {'url' in item && item.url && (
                <>
                  {isImageType(item.type) ? (
                    <Zoom>
                      <img
                        src={`/dashboard/api/files/${item.id}`}
                        alt="Uploaded File"
                        className="object-cover rounded"
                      />
                    </Zoom>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        asChild
                        className="w-36 h-52 [&_svg]:size-10"
                        variant={'secondary'}
                      >
                        <Link
                          href={`/dashboard/api/files/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileDownIcon />
                        </Link>
                      </Button>
                      <a
                        href={`/dashboard/api/files/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </div>
                  )}
                </>
              )}
              {'body' in item && item.body && <>{item.body}</>}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  )
}
