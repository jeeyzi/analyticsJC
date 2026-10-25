"use client";

import { useEffect } from "react";
import { createAcquisitionSession } from "@/lib/lead/acquisition";

// Vida del documento, no sesión GA4. No cookies/localStorage/sessionStorage.
const session = createAcquisitionSession();
export function acquisitionSnapshot() { return session.snapshot(); }
export function AcquisitionCapture() {
  useEffect(() => { session.capture(window.location.href, document.referrer); }, []);
  return null;
}
