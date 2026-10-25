"use client";

import { useEffect } from "react";
import { installGtmHead } from "@/lib/measurement/gtm";

export function GtmHead({ containerId, preview = false }: { containerId: string; preview?: boolean }) {
  // Inserción DOM en HEAD; ningún <script> se devuelve al render de React.
  useEffect(() => {
    installGtmHead(document, window.location.hostname, containerId, preview);
  }, [containerId, preview]);
  return null;
}
