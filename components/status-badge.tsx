import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs capitalize',
        {
          'bg-gray-100 text-gray-800': status !== 'paid',
          'bg-green-500 text-white': status === 'paid',
        }
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'paid' ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : (
        <>{status}</>
      )}
    </span>
  )
}
