"use client";

import type { ComponentProps } from "react";
import { ActionLink } from "@/components/ui/Actions";
import { track } from "@/lib/measurement/runtime";
import type { CtaLocation } from "@/lib/measurement/events";

export function DiagnosisActionLink({ location, onClick, ...props }: ComponentProps<typeof ActionLink> & { location: CtaLocation }) {
  return <ActionLink {...props} data-cta-id="request_diagnosis" data-cta-location={location} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.detail < 2) {
      track({ event: "click_to_action", page_type: "home", cta_id: "request_diagnosis", cta_location: location, target_id: "diagnostico" });
    }
  }} />;
}
