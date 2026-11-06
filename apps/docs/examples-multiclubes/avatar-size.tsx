import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";

export default function AvatarSizeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  );
}
