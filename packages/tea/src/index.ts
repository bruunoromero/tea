import { Cmd } from "./cmd";
import { createObservable, Subscribe } from "./observable";

export type Update<S, M> = (state: S, message: M) => [S, Cmd<M>];

export type Tea<S, M> = {
  getState: () => S;
  subscribe: Subscribe<S>;
  dispatch: (message: M) => void;
};

export { Cmd } from "./cmd";

export const create = <S, M>(
  initialState: S,
  update: Update<S, M>
): Tea<S, M> => {
  let state: S;
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
    const [newState, cmd] = update(state, message);

    next(newState);
    cmd().subscribe((message) => {
      cmdObs.next(message);
    });
  };

  cmdObs.subscribe((message) => {
    dispatch(message);
  });

  next(initialState);

  return {
    getState,
    subscribe,
    dispatch,
  };
};
