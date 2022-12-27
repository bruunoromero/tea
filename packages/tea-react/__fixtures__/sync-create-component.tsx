import React, { useState } from "react";
import { create } from "../src";
import { createSyncTea } from "./sync";

const useTea = create(createSyncTea());

const User: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [state, dispatch] = useTea();

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
  const [state, dispatch] = useTea();

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
  const [taskInput, setTaskInput] = useState("");
  const [state, dispatch] = useTea();

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

export const SyncCreateComponent: React.FC = () => {
  return (
    <div>
      <User />
      <Counter />
      <Tasks />
    </div>
  );
};
