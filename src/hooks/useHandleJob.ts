import { jobsSignal } from "../signals/jobsSignal";
import { Job } from "../utils/types";

/**
 * Creates a function that batches and applies job updates efficiently.
 * The returned function queues updates and applies them in a single batch per event loop tick.
 */
const createJobUpdateBatcher = () => {
  const queue: Job[] = []; // const to prevent reassignment
  let isFlushScheduled = false;

  const flushQueue = async () => {
    if (queue.length === 0) {
      isFlushScheduled = false;
      return;
    }

    const updatedJobs = { ...jobsSignal.value };

    queue.forEach((job) => {
      updatedJobs[job.id] = {
        ...updatedJobs[job.id],
        ...job,
      };
    });

    queue.length = 0; // clear the array in place
    jobsSignal.value = updatedJobs;
    isFlushScheduled = false;
  };

  return (job: Job) => {
    queue.push(job);

    if (!isFlushScheduled) {
      isFlushScheduled = true;

      Promise.resolve().then(flushQueue); // microtask
    }
  };
};

const batchJobUpdate = createJobUpdateBatcher();

export const useHandleJob = (event: MessageEvent) => {
  let message;

  try {
    message = JSON.parse(event.data);
  } catch {
    console.error("Malformed WebSocket message:", event.data);
    return;
  }

  switch (message.event) {
    case "initial-jobs":
      jobsSignal.value = message.payload.reduce(
        (acc: Record<string, Job>, job: Job) => {
          acc[job.id] = job;
          return acc;
        },
        {}
      );
      break;
    case "job-update":
      batchJobUpdate(message.payload);
      break;
    default:
      break;
  }
};
