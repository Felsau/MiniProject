import type { Job } from "@prisma/client";

export interface JobWithCount extends Job {
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
  _count?: {
    applications: number;
  };
}