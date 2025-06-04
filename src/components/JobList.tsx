import { useSignalEffect } from "@preact/signals-react";
import { FC, useCallback, useState } from "react";
import { useHandleJob } from "../hooks/useHandleJob";
import { useWebSocket } from "../hooks/useWebSocket";
import { jobsSignal } from "../signals/jobsSignal";
import { periodSignal } from "../signals/periodSignal";
import { WSS_BASE_URL } from "../utils/constants";
import { Job } from "../utils/types";
import { getWebSocketUrlWithPeriod } from "../utils/utils";
import { JobCard } from "./JobCard";

export const JobList: FC = () => {
  const jobs = jobsSignal.value;
  const [, setTick] = useState(0);

  const webSocketUrl = getWebSocketUrlWithPeriod(
    WSS_BASE_URL,
    periodSignal.value
  );

  // force re-render when related values change, due to known issue of using signals with React 19
  useSignalEffect(() => {
    void jobsSignal.value; // resolves ESLint errors for unused expressions
    void periodSignal.value;
    setTick((tick) => tick + 1);
  });

  const handleJobMessage = useCallback(useHandleJob, []); // for stable message handler reference

  useWebSocket(webSocketUrl, handleJobMessage);

  if (Object.keys(jobs).length === 0) {
    return (
      <div className="job-list empty" id="job-list">
        <h2>🚫 No jobs available</h2>
      </div>
    );
  }

  return (
    <div className="job-list" id="job-list">
      {Object.values(jobs).map((job: Job) => (
        <JobCard key={job.id} jobData={job} />
      ))}
    </div>
  );
};
