import { AsyncModel, failedError, successTasks } from "../__utils__/async";

export const initAsyncModel: AsyncModel = {
  tasks: [],
  error: "",
  done: false,
};

export const asyncExpectations: AsyncModel[] = [
  initAsyncModel,
  { tasks: [], error: failedError, done: false },
  { tasks: successTasks, error: "", done: false },
  { tasks: successTasks, error: "", done: true },
];
