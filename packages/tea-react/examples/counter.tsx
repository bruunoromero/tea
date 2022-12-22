import React from "react";
import { Cmd, create } from "@bruunoromero/tea";
import { create as createHook } from "@bruunoromero/tea-react";

enum Msg {
  Inc = "Inc",
  Dec = "Dec",
}

const update = (model: number, msg: Msg): [number, Cmd<Msg>] => {
  if (msg === Msg.Inc) {
    return [model + 1, Cmd.none];
  }

  return [model - 1, Cmd.none];
};

const tea = create([0, Cmd.none], update);

const useTea = createHook(tea);

function App() {
  const [state, dispatch] = useTea();

  return (
    <div>
      <button onClick={() => dispatch(Msg.Dec)}>-</button>
      <span>{state}</span>
      <button onClick={() => dispatch(Msg.Inc)}>+</button>
    </div>
  );
}

export default App;
