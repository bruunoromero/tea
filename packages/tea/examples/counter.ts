import { create, Cmd } from "@bruunoromero/tea";

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

tea.subscribe((model) => {
  console.log(model);
});

tea.dispatch(Msg.Inc);
tea.dispatch(Msg.Inc);
tea.dispatch(Msg.Inc);
tea.dispatch(Msg.Dec);
tea.dispatch(Msg.Dec);
tea.dispatch(Msg.Dec);

tea.complete();
