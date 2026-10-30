import type { Metadata } from "next";
import { CreateCustomizer } from "@/components/create-customizer";
import { CREATE_FONTS } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Create",
  description: "Personalize o tema do Mosaico e veja o resultado nos componentes.",
};

export default function Page() {
  return <CreateCustomizer fonts={CREATE_FONTS} />;
}
