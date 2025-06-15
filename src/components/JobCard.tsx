import { FC, memo } from "react";
import { Job, StatusLabels } from "../utils/types";

type JobProps = {
  jobData: Job;
};

export const JobCard: FC<JobProps> = memo(({ jobData }) => {
  const { id, name, progress, status } = jobData;

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
