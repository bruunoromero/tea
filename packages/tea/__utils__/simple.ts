import { Cmd, create } from "../src";

export type SimpleTask = { name: string; desc: string };

export type SimpleModel = {
  counter: number;
  user: string;
  tasks: SimpleTask[];
};

export type SimpleInc = { type: "Inc" };
export type SimpleDec = { type: "Dec" };
export type SimpleSetUser = { type: "SetUser"; user: string };
export type SimpleAddTask = { type: "AddTask"; task: SimpleTask };
export type SimpleRemoveTask = { type: "RemoveTask"; task: SimpleTask };

export type SimpleMsg =
  | SimpleInc
  | SimpleDec
  | SimpleSetUser
  | SimpleAddTask
  | SimpleRemoveTask;

const update = (
  model: SimpleModel,
  msg: SimpleMsg
): [SimpleModel, Cmd<SimpleMsg>] => {
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

export const createSimpleTea = (model: SimpleModel) =>
  create([model, Cmd.none], update);
