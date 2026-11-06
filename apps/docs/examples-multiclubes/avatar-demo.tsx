import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  );
}
