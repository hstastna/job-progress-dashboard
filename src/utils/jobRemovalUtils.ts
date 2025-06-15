import { jobsSignal } from "../signals/jobsSignal";
import { REMOVE_JOB_TIMEOUT } from "./constants";
import { Job } from "./types";

const removalTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

export const scheduleJobRemoval = (
  jobId: Job["id"],
  delay = REMOVE_JOB_TIMEOUT
) => {
  if (removalTimeouts[jobId]) return; // don't reschedule if already scheduled

  removalTimeouts[jobId] = setTimeout(() => {
    jobsSignal.value = ((prevJobs) => {
      const rest = Object.fromEntries(
        Object.entries(prevJobs).filter(([key]) => key !== jobId)
      );

      return rest;
    })(jobsSignal.value);

    delete removalTimeouts[jobId];
  }, delay);
};

export const cancelJobRemoval = (jobId: Job["id"]) => {
  if (removalTimeouts[jobId]) {
    clearTimeout(removalTimeouts[jobId]);
    delete removalTimeouts[jobId];
  }
};
