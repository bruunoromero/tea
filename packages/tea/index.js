const { create, Cmd } = require("./dist/index");

const update = (model, msg) => {
  if (msg === "Inc") {
    return [model + 1, Cmd.none];
  }

  return [model - 1, Cmd.none];
};

const init = [0, Cmd.none];

const tea = create(init, update);

tea.subscribe((model) => {
  console.log(model);
});

tea.dispatch("Inc");
tea.dispatch("Inc");
tea.dispatch("Inc");
tea.dispatch("Dec");
tea.dispatch("Dec");
tea.dispatch("Dec");

tea.complete();

tea.dispatch("Dec");

console.log("ola mundo");
