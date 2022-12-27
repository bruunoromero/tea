import {
  SimpleAddTask,
  SimpleDec,
  SimpleInc,
  SimpleModel,
  SimpleMsg,
  SimpleRemoveTask,
  SimpleSetUser,
  SimpleTask,
} from "../__fixtures__/sync";

export const simpleInc = (): SimpleInc => ({ type: "Inc" });
export const simpleDec = (): SimpleDec => ({ type: "Dec" });
export const simpleSetUser = (user: string): SimpleSetUser => ({
  type: "SetUser",
  user,
});
export const simpleAddTask = (task: SimpleTask): SimpleAddTask => ({
  type: "AddTask",
  task,
});
export const simpleRemoveTask = (task: SimpleTask): SimpleRemoveTask => ({
  type: "RemoveTask",
  task,
});

const task1: SimpleTask = { name: "test tea", desc: "it should work" };
const task2: SimpleTask = { name: "removable task", desc: "I'll be removed" };
const task3: SimpleTask = { name: "assert it works", desc: "it's working" };

export const initSimpleModel: SimpleModel = {
  counter: 0,
  tasks: [],
  user: "Han Solo",
};

export const simpleMsgs: SimpleMsg[] = [
  simpleInc(),
  simpleInc(),
  simpleDec(),
  simpleSetUser("Luke Skywalker"),
  simpleAddTask(task1),
  simpleAddTask(task2),
  simpleSetUser("Leia Organa"),
  simpleRemoveTask(task2),
  simpleAddTask(task3),
  simpleDec(),
  simpleSetUser("Han Solo"),
  simpleRemoveTask(task1),
  simpleRemoveTask(task3),
];

export const simpleExpectations: SimpleModel[] = [
  initSimpleModel,
  { counter: 1, user: "Han Solo", tasks: [] },
  { counter: 2, user: "Han Solo", tasks: [] },
  { counter: 1, user: "Han Solo", tasks: [] },
  { counter: 1, user: "Luke Skywalker", tasks: [] },
  { counter: 1, user: "Luke Skywalker", tasks: [task1] },
  { counter: 1, user: "Luke Skywalker", tasks: [task1, task2] },
  { counter: 1, user: "Leia Organa", tasks: [task1, task2] },
  { counter: 1, user: "Leia Organa", tasks: [task1] },
  { counter: 1, user: "Leia Organa", tasks: [task1, task3] },
  { counter: 0, user: "Leia Organa", tasks: [task1, task3] },
  { counter: 0, user: "Han Solo", tasks: [task1, task3] },
  { counter: 0, user: "Han Solo", tasks: [task3] },
  initSimpleModel,
];
