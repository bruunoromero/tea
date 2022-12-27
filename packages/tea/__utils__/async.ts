import { Cmd, create } from "../src";
import { createDoneableTea, Done } from "./tea";

export type AsyncModel = {
  error: string;
  tasks: string[];
};

export type AsyncFetchTasksSuccess = {
  type: "FetchTasksSuccess";
  tasks: string[];
};

export type AsyncFetchTasksFailed = {
  type: "FetchTasksFailed";
  error: string;
};

export type AsyncMsg = AsyncFetchTasksSuccess | AsyncFetchTasksFailed;

export const successTasks = ["abc", "def", "ghi"];

export const failedError = "abcdef";

const delay = (msg: AsyncMsg, timeout: number) => {
  return new Promise<AsyncMsg>((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(msg);
    }, timeout);
  });
};

const fetchTaskSuccess = Cmd.task(() =>
  delay({ type: "FetchTasksSuccess", tasks: successTasks }, 500)
);

const fetchTasksFailed = Cmd.task(() =>
  delay({ type: "FetchTasksFailed", error: failedError }, 500)
);

const update = (_: AsyncModel, msg: AsyncMsg): [AsyncModel, Cmd<AsyncMsg>] => {
  switch (msg.type) {
    case "FetchTasksSuccess":
      return [{ tasks: msg.tasks, error: "" }, Cmd.none];
    case "FetchTasksFailed":
      return [{ tasks: [], error: msg.error }, fetchTaskSuccess];
  }
};

export const createAsyncTea = (model: AsyncModel) =>
  create([model, fetchTasksFailed], update);
