import {
  Screen as TestingScreen,
  queries,
  fireEvent,
} from "@testing-library/react";
import { initSyncModel, SyncModel } from "../__fixtures__/sync";

type Screen = TestingScreen<typeof queries>;

export const syncInc = (screen: Screen) =>
  fireEvent.click(screen.getByTestId("counter:inc"));

export const syncDec = (screen: Screen) =>
  fireEvent.click(screen.getByTestId("counter:dec"));

export const syncSetUser = (name: string) => (screen: Screen) => {
  fireEvent.input(screen.getByTestId("user:input"), {
    target: { value: name },
  });
  fireEvent.click(screen.getByTestId("user:button"));
};

export const syncAddTask = (name: string) => (screen: Screen) => {
  fireEvent.input(screen.getByTestId("tasks:input"), {
    target: { value: name },
  });
  fireEvent.click(screen.getByTestId("tasks:button"));
};

export const syncRemoveTask = (name: string) => (screen: Screen) => {
  fireEvent.click(screen.getByTestId(`tasks:remove:${name}`));
};

const task1Name = "test tea";
const task2Name = "removable task";
const task3Name = "assert it works";

const task1 = { name: task1Name, desc: "" };
const task2 = { name: task2Name, desc: "" };
const task3 = { name: task3Name, desc: "" };

export const syncEvents: ((screen: Screen) => void)[] = [
  syncInc,
  syncInc,
  syncDec,
  syncSetUser("Luke Skywalker"),
  syncAddTask(task1Name),
  syncAddTask(task2Name),
  syncSetUser("Leia Organa"),
  syncRemoveTask(task2Name),
  syncAddTask(task3Name),
  syncDec,
  syncSetUser("Han Solo"),
  syncRemoveTask(task1Name),
  syncRemoveTask(task3Name),
];

export const syncExpectations: SyncModel[] = [
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
  initSyncModel,
];
