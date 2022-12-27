import { Cmd, create } from "@bruunoromero/tea";

export type AsyncModel = {
  error: string;
  tasks: string[];
  loading: boolean;
};

export type AsyncFetchTasksSuccess = {
  type: "FetchTasksSuccess";
  tasks: string[];
};

export type AsyncFetchTasksFailed = {
  type: "FetchTasksFailed";
  error: string;
};

export type AsyncFetchTasks = {
  type: "FetchTasks";
};

export type AsyncMsg =
  | AsyncFetchTasks
  | AsyncFetchTasksSuccess
  | AsyncFetchTasksFailed;

export const initAsyncModel: AsyncModel = {
  tasks: [],
  error: "",
  loading: false,
};

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

const update = (
  model: AsyncModel,
  msg: AsyncMsg
): [AsyncModel, Cmd<AsyncMsg>] => {
  switch (msg.type) {
    case "FetchTasks":
      return [{ ...model, loading: true }, fetchTasksFailed];
    case "FetchTasksSuccess":
      return [{ tasks: msg.tasks, error: "", loading: false }, Cmd.none];
    case "FetchTasksFailed":
      return [{ ...model, error: msg.error }, fetchTaskSuccess];
  }
};

export const createAsyncTea = () => create([initAsyncModel, Cmd.none], update);
