import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import { formatDateToLocal } from '@/lib/utils'
import { File, Note } from '@prisma/client'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import '@/styles/zoom.css'

type TimelinItemType = Note | File

export default function OrderTimeline({
  notes,
  files,
}: {
  notes: Note[]
  files: File[]
}) {
  // TODO: merge notes and files into one array sort by createdAt
  const allNotes: TimelinItemType[] = [...notes, ...files]

  allNotes.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

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
            <TimelineContent>
              {'url' in item && item.url && (
                <Zoom>
                  <div className="relative w-[500px] aspect-[500/300] ">
                    <Image
                      src={item.url}
                      alt=""
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                </Zoom>
              )}
              {'body' in item && item.body && <>{item.body}</>}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  )
}
