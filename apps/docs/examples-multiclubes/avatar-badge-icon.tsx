import { Avatar, AvatarFallback, AvatarVerified } from "@multiclubes/ui/components/avatar";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";

export default function AvatarBadgeIconExample() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
      <AvatarVerified />
    </Avatar>
  );
}
