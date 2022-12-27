import {
  Screen as TestingScreen,
  queries,
  fireEvent,
} from "@testing-library/react";
import { AsyncModel, failedError, successTasks } from "../__fixtures__/async";

type Screen = TestingScreen<typeof queries>;

export const asyncFetchTasks = (screen: Screen) =>
  fireEvent.click(screen.getByTestId("tasks:button"));

export const asyncExpectations: AsyncModel[] = [
  { tasks: [], error: "", loading: true },
  { tasks: [], error: failedError, loading: true },
  { tasks: successTasks, error: "", loading: false },
];
