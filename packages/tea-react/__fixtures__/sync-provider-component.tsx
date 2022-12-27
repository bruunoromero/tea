import React, { useState } from "react";
import { createContext } from "../src";
import { createSyncTea, SyncModel, SyncMsg } from "./sync";

const { Provider, useContext } = createContext<SyncModel, SyncMsg>();

const User: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [state, dispatch] = useContext();

  return (
    <div>
      <h1>
        <span>Hello, </span>
        <span data-testid="user:value">{state.user}</span>
      </h1>
      <input
        data-testid="user:input"
        onInput={(evt: React.ChangeEvent<HTMLInputElement>) =>
          setUserInput(evt.target.value)
        }
      />
      <button
        data-testid="user:button"
        onClick={() => {
          dispatch({ type: "SetUser", user: userInput });
          setUserInput("");
        }}
      >
        set user
      </button>
    </div>
  );
};

const Counter: React.FC = () => {
  const [state, dispatch] = useContext();

  return (
    <div>
      <button
        data-testid="counter:dec"
        onClick={() => dispatch({ type: "Dec" })}
      >
        -
      </button>
      <span data-testid="counter:value">{state.counter}</span>
      <button
        data-testid="counter:inc"
        onClick={() => dispatch({ type: "Inc" })}
      >
        +
      </button>
    </div>
  );
};

const Tasks: React.FC = () => {
  const [state, dispatch] = useContext();
  const [taskInput, setTaskInput] = useState("");

  return (
    <div>
      <div>
        <input
          data-testid="tasks:input"
          onInput={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setTaskInput(evt.target.value)
          }
        />
        <button
          data-testid="tasks:button"
          onClick={() => {
            dispatch({ type: "AddTask", task: { name: taskInput, desc: "" } });
            setTaskInput("");
          }}
        >
          set user
        </button>
      </div>
      <li data-testid="tasks:container">
        {state.tasks.map((task) => {
          return (
            <ul key={task.name}>
              <span data-testid={`tasks:value:${task.name}`}>{task.name}</span>
              <button
                data-testid={`tasks:remove:${task.name}`}
                onClick={() => dispatch({ type: "RemoveTask", task })}
              >
                x
              </button>
            </ul>
          );
        })}
      </li>
    </div>
  );
};

export const SyncProviderComponent: React.FC = () => {
  return (
    <Provider create={() => createSyncTea()}>
      <div>
        <User />
        <Counter />
        <Tasks />
      </div>
    </Provider>
  );
};
