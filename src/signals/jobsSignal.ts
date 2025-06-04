import { signal } from "@preact/signals-react";
import { Job } from "../utils/types";

export const jobsSignal = signal<Record<string, Job>>({});
