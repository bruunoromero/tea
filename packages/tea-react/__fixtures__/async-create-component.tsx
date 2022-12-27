import React from "react";
import { create } from "../src";
import { createAsyncTea } from "./async";

const useTea = create(createAsyncTea());

const Loading: React.FC = () => {
  const [state] = useTea();

  return (
    <div data-testid="loading:value">
      {state.loading ? "is loading..." : "loaded!"}
    </div>
  );
};

const Tasks: React.FC = () => {
  const [state, dispatch] = useTea();

  return (
    <div>
      <button
        data-testid="tasks:button"
        onClick={() => dispatch({ type: "FetchTasks" })}
      ></button>
      <li data-testid="tasks:container">
        {state.tasks.map((task) => {
          return (
            <ul key={task}>
              <span data-testid={`tasks:value:${task}`}>{task}</span>
            </ul>
          );
        })}
      </li>
    </div>
  );
};
const Error: React.FC = () => {
  const [state] = useTea();

  return <div data-testid="error:value">{state.error}</div>;
};
export const AsyncCreateComponent: React.FC = () => {
  return (
    <div>
      <Loading />
      <Tasks />
      <Error />
    </div>
  );
};
