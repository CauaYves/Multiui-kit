"use client";

import { Button } from "@multiclubes/ui/components/button";
import { MosaicLoader } from "@multiclubes/ui/components/mosaic-loader";
import * as React from "react";

export default function MosaicLoaderOverlay() {
  const [loading, setLoading] = React.useState(false);

  // Simula a troca de página: a camada aparece por 2 segundos.
  const start = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <Button onClick={start}>Simular troca de página</Button>
      {loading && <MosaicLoader overlay />}
    </>
  );
}
