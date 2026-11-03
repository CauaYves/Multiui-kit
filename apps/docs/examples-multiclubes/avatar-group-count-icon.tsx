import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@multiclubes/ui/components/avatar";
import { PlusIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";

export default function AvatarGroupCountIconExample() {
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
      <AvatarGroupCount>
        <PlusIcon />
      </AvatarGroupCount>
    </AvatarGroup>
  );
}
