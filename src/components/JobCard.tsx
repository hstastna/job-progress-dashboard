import { FC, memo, useEffect } from "react";
import { jobsSignal } from "../signals/jobsSignal";
import { Job, StatusLabels } from "../utils/types";

type JobProps = {
  jobData: Job;
};

export const JobCard: FC<JobProps> = memo(({ jobData }) => {
  const { id, name, progress, status } = jobData;

  useEffect(() => {
    if (status === "completed") {
      const timeout = setTimeout(() => {
        jobsSignal.value = ((prevJobs) => {
          const rest = Object.fromEntries(
            Object.entries(prevJobs).filter(([key]) => key !== id)
          );

          return rest;
        })(jobsSignal.value);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [status, id]);

  return (
    <div className="job">
      ID: {id}
      <div className="job-name">{name}</div>
      <div className="progress-bar" role="progressbar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="job-status">{StatusLabels[status]}</div>
    </div>
  );
});
