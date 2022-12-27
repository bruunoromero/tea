import { AsyncModel, failedError, successTasks } from "../__utils__/async";

export const initAsyncModel: AsyncModel = {
  tasks: [],
  error: "",
};

export const asyncExpectations: AsyncModel[] = [
  initAsyncModel,
  { tasks: [], error: failedError },
  { tasks: successTasks, error: "" },
];
