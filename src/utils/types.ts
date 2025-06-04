export type JobStatus = "pending" | "in-progress" | "completed";

export enum StatusLabels {
  "pending" = "Pending",
  "in-progress" = "In Progress",
  "completed" = "Completed",
}

export type Job = {
  id: string;
  name?: string;
  progress: number;
  status: JobStatus;
};
