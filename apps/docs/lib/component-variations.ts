// Variações dos componentes: usos que se repetem entre as aplicações, montados com o próprio
// componente (não são componentes à parte). Cada entrada vira uma seção "Variações" no fim da
// página do componente, inclusive nas páginas geradas do shadcn, e a contagem aparece na
// galeria. A chave é o nome do componente (o arquivo da página, ex. "card"); `example` é o
// nome de um exemplo em examples/ ou examples-multiclubes/.

export type ComponentVariation = {
  title: string;
  description: string;
  example: string;
};

export const COMPONENT_VARIATIONS: Record<string, ComponentVariation[]> = {
  avatar: [
    {
      title: "Cliente verificado",
      description:
        "Avatar do cliente com o selo de cliente Multiclubes verificado no canto inferior direito (AvatarVerified), com tooltip.",
      example: "avatar-verified",
    },
  ],
  card: [
    {
      title: "Métrica",
      description:
        "Indicador para dashboards: título, valor em destaque, ícone e variação, nas partes do Card (CardDescription, CardTitle, CardAction e CardFooter).",
      example: "metric-card-variants",
    },
  ],
};

export function getComponentVariations(name: string): ComponentVariation[] {
  return COMPONENT_VARIATIONS[name] ?? [];
}
