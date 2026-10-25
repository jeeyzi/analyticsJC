"use client";

import { useEffect } from "react";
import { initializeMeasurement } from "@/lib/measurement/runtime";

export function MeasurementBootstrap() {
  useEffect(() => { initializeMeasurement(); }, []);
  return null;
}
