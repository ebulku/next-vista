import { generateInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const UserAvatar = ({
  imageUrl,
  name,
}: {
  imageUrl: string | undefined
  name: string | undefined | null
}) => {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt={`${name}'s profile picture`} />
      <AvatarFallback>{name && generateInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
