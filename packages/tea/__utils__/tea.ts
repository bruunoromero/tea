import { Cmd, create, Tea, Update } from "../src";

export type Done = () => void;

export type DoneMsg = { type: "Done" };

export type Doneable<T extends object> = T & { done: boolean };

export type DoneableMsg<T> = T | DoneMsg;

export const doneMsg = (): DoneMsg => ({
  type: "Done",
});

const isMsgDone = (msg: any): msg is DoneMsg => {
  return typeof msg === "object" && msg.type === "Done";
};

export const handleDone = <S extends object, M>(
  model: Doneable<S>
): [Doneable<S>, Cmd<M>] => {
  return [{ ...model, done: true }, Cmd.none];
};

export const updateHandlingDone = <S extends object, M>(
  update: Update<S, M>
): Update<Doneable<S>, DoneableMsg<M>> => {
  return (model, msg) => {
    if (isMsgDone(msg)) {
      return handleDone(model);
    }

    return update(model, msg) as [Doneable<S>, Cmd<DoneableMsg<M>>];
  };
};

export const createDoneableTea = <S extends object, M>(
  [model, cmd]: [S, Cmd<M>],
  update: Update<S, M>,
  done: () => void
): Tea<Doneable<S>, DoneableMsg<M>> => {
  const liftedInit = [{ ...model, done: false }, cmd] as [
    Doneable<S>,
    Cmd<DoneableMsg<M>>
  ];
  const liftedUpdated = updateHandlingDone(update);
  const tea = create(liftedInit, liftedUpdated);

  const subscribe = tea.subscribe;

  tea.subscribe = (observer) =>
    subscribe((model) => {
      if (model.done) {
        done();
        return;
      }

      if (typeof observer === "function") {
        observer(model);
      } else {
        observer.next?.(model);
      }
    });

  return tea;
};

export const liftModel = <S extends object>(model: S): Doneable<S> => {
  return { ...model, done: false };
};

export const liftModels = <S extends object>(models: S[]): Doneable<S>[] =>
  models.map(liftModel);

export const loopMessages = <S extends object, M>(
  tea: Tea<Doneable<S>, DoneableMsg<M>>,
  msgs: DoneableMsg<M>[],
  assert: (index: number, model: S) => void
) => {
  let subscriptionIndex = 0;

  tea.subscribe(({ done, ...model }) => {
    assert(subscriptionIndex, model as S);

    subscriptionIndex += 1;
  });

  msgs.forEach((msg) => {
    tea.dispatch(msg);
  });
};
