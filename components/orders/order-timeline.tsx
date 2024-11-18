import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import { formatDateToLocal, isImageType } from '@/lib/utils'
import { File, Note } from '@prisma/client'
import Zoom from 'react-medium-image-zoom'
import '@/styles/zoom.css'
import { Button } from '../ui/button'
import { FileDownIcon } from 'lucide-react'
import Link from 'next/link'

type TimelineItemType = Note | File

export default function OrderTimeline({
  notes,
  files,
}: {
  notes: Note[]
  files: File[]
}) {
  // TODO: merge notes and files into one array sort by createdAt
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
                        className="w-36 h-52"
                        variant={'secondary'}
                      >
                        <Link
                          href={`/dashboard/api/files/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileDownIcon size={64} />
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
