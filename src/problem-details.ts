export type ProblemDetails = {
  detail?: string;
  instance?: string;
  status?: number;
  title?: string;
  type: string;
} & Record<string, any>;
