import { Cmd, create } from "../src";

export type AsyncModel = {
  error: string;
  tasks: string[];
  done: boolean;
};

export type AsyncFetchTasksSuccess = {
  type: "FetchTasksSuccess";
  tasks: string[];
};

export type AsyncFetchTasksFailed = {
  type: "FetchTasksFailed";
  error: string;
};

export type AsyncDone = { type: "Done" };

export type AsyncMsg =
  | AsyncFetchTasksSuccess
  | AsyncFetchTasksFailed
  | AsyncDone;

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

const done = Cmd.task<AsyncDone>(async () => ({ type: "Done" }));

const update = (
  model: AsyncModel,
  msg: AsyncMsg
): [AsyncModel, Cmd<AsyncMsg>] => {
  switch (msg.type) {
    case "FetchTasksSuccess":
      return [{ ...model, tasks: msg.tasks, error: "" }, done];
    case "FetchTasksFailed":
      return [{ ...model, tasks: [], error: msg.error }, fetchTaskSuccess];
    case "Done":
      return [{ ...model, done: true }, Cmd.none];
  }
};

export const createAsyncTea = (model: AsyncModel) =>
  create([model, fetchTasksFailed], update);
