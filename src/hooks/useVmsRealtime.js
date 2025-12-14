"use client";

import { useEffect, useState } from "react";
import { generateFakeVms } from "@/utils/fakeInit";
import { updateRealtime } from "@/utils/fakeRealtime";

export function useVmsRealtime(count = 10) {
  const [vms, setVms] = useState(() => generateFakeVms(count));

  useEffect(() => {
    const timer = setInterval(() => {
      setVms((prev) => updateRealtime(prev));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return vms;
}
