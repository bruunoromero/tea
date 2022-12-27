import { Cmd, create } from "@bruunoromero/tea";

export type SyncTask = { name: string; desc: string };

export type SyncModel = {
  counter: number;
  user: string;
  tasks: SyncTask[];
};

export type SyncInc = { type: "Inc" };
export type SyncDec = { type: "Dec" };
export type SyncSetUser = { type: "SetUser"; user: string };
export type SyncAddTask = { type: "AddTask"; task: SyncTask };
export type SyncRemoveTask = { type: "RemoveTask"; task: SyncTask };

export type SyncMsg =
  | SyncInc
  | SyncDec
  | SyncSetUser
  | SyncAddTask
  | SyncRemoveTask;

const update = (model: SyncModel, msg: SyncMsg): [SyncModel, Cmd<SyncMsg>] => {
  switch (msg.type) {
    case "Inc":
      return [{ ...model, counter: model.counter + 1 }, Cmd.none];
    case "Dec":
      return [{ ...model, counter: model.counter - 1 }, Cmd.none];
    case "SetUser":
      return [{ ...model, user: msg.user }, Cmd.none];
    case "AddTask":
      return [{ ...model, tasks: [...model.tasks, msg.task] }, Cmd.none];
    case "RemoveTask":
      return [
        { ...model, tasks: model.tasks.filter((task) => msg.task !== task) },
        Cmd.none,
      ];
  }
};

export const initSyncModel: SyncModel = {
  counter: 0,
  tasks: [],
  user: "Han Solo",
};

export const createSyncTea = () => create([initSyncModel, Cmd.none], update);
