import { Cmd } from "./cmd";
import { createObservable, Subscribe } from "./observable";

export type Update<S, M> = (state: S, message: M) => [S, Cmd<M>];

export type Dispatch<M> = (message: M) => void;

export type Tea<S, M> = {
  getState: () => S;
  subscribe: Subscribe<S>;
  dispatch: Dispatch<M>;
  complete: () => void;
};

export { Cmd } from "./cmd";

export const create = <S, M>(
  initialState: S,
  update: Update<S, M>
): Tea<S, M> => {
  let state: S;
  let isCompleted = false;
  const stateObs = createObservable<S>();
  const cmdObs = createObservable<M>();

  const getState = () => state;

  const subscribe: Subscribe<S> = (subscriber) =>
    stateObs.subscribe(subscriber);

  const next = (newState: S) => {
    if (newState !== state) {
      state = newState;
      stateObs.next(newState);
    }
  };

  const dispatch = (message: M) => {
    if (isCompleted) return;
    const [newState, cmd] = update(state, message);

    next(newState);
    cmd().subscribe((message) => {
      cmdObs.next(message);
    });
  };

  const complete = () => {
    isCompleted = true;
    stateObs.complete();
    cmdObs.complete();
  };

  cmdObs.subscribe((message) => {
    dispatch(message);
  });

  next(initialState);

  return {
    getState,
    subscribe,
    dispatch,
    complete,
  };
};
