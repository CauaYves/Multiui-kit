import { Avatar, AvatarFallback, AvatarGroup } from "@multiclubes/ui/components/avatar";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";

export default function AvatarGroupExample() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
    </AvatarGroup>
  );
}
