import React from "react";
import { createContext } from "../src";
import { AsyncModel, AsyncMsg, createAsyncTea } from "./async";

const { Provider, useContext } = createContext<AsyncModel, AsyncMsg>();

const Loading: React.FC = () => {
  const [state] = useContext();

  return (
    <div data-testid="loading:value">
      {state.loading ? "is loading..." : "loaded!"}
    </div>
  );
};

const Tasks: React.FC = () => {
  const [state, dispatch] = useContext();

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
  const [state] = useContext();

  return <div data-testid="error:value">{state.error}</div>;
};

export const AsyncProviderComponent: React.FC = () => {
  return (
    <Provider create={() => createAsyncTea()}>
      <div>
        <Loading />
        <Tasks />
        <Error />
      </div>
    </Provider>
  );
};
