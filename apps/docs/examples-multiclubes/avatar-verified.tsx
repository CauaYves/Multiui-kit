import { Avatar, AvatarFallback, AvatarVerified } from "@multiclubes/ui/components/avatar";

// PROVISÓRIO: iniciais "FLA" em vermelho até o arquivo do logo real do cliente ser entregue.
function ClienteAvatar({ size }: { size?: "sm" | "default" | "lg" }) {
  return (
    <Avatar
      size={size}
      className="size-auto data-[size=default]:size-16 data-[size=lg]:size-24 data-[size=sm]:size-10"
    >
      <AvatarFallback className="bg-[#c4161c] font-heading font-bold text-white">
        FLA
      </AvatarFallback>
      <AvatarVerified />
    </Avatar>
  );
}

export default function AvatarVerifiedExample() {
  return (
    <div className="flex items-end gap-6">
      <ClienteAvatar size="sm" />
      <ClienteAvatar />
      <ClienteAvatar size="lg" />
    </div>
  );
}
