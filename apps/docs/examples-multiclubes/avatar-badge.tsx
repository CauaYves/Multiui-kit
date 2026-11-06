import { Avatar, AvatarFallback, AvatarVerified } from "@multiclubes/ui/components/avatar";

export default function AvatarWithBadge() {
  return (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
      <AvatarVerified />
    </Avatar>
  );
}
