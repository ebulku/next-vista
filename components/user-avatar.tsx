import { generateInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const UserAvatar = ({
  imageUrl,
  name,
}: {
  imageUrl: string | undefined
  name: string
}) => {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt={`${name}'s profile picture`} />
      <AvatarFallback>{generateInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
