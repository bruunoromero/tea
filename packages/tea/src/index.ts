import { BehaviorSubject, Observer as RxObserver } from "rxjs";
import { startWith, map, distinctUntilChanged, mergeAll } from "rxjs/operators";
import { Cmd } from "./cmd";

export type Update<S, M> = (state: S, message: M) => [S, Cmd<M>];

export type Dispatch<M> = (message: M) => void;

export type Observer<S> = Partial<RxObserver<S>> | ((model: S) => void);

export type Unsubscriber = () => void;

export type Tea<S, M> = {
  getState: () => S;
  subscribe: (observer: Observer<S>) => Unsubscriber;
  dispatch: Dispatch<M>;
  complete: () => void;
};

export { Cmd } from "./cmd";

export const create = <S, M>(
  init: [S, Cmd<M>],
  update: Update<S, M>
): Tea<S, M> => {
  let isCompleted = false;
  const state$ = new BehaviorSubject(init);

  const model$ = state$.pipe(
    map((state) => state[0]),
    distinctUntilChanged()
  );

  const cmd$ = state$.pipe(
    startWith(init),
    map((state) => state[1]),
    distinctUntilChanged(),
    mergeAll()
  );

  const getState = () => state$.getValue()[0];

  const dispatch = (msg: M) => {
    if (isCompleted) return;
    const nextState = update(getState(), msg);

    state$.next(nextState);
  };

  const subscribe = (observer: Observer<S>) => {
    const subscription = model$.subscribe(observer);

    return () => subscription.unsubscribe();
  };

  const complete = () => {
    isCompleted = true;
    state$.complete();
  };

  cmd$.subscribe((task) => {
    task().then((msg) => {
      dispatch(msg);
    });
  });

  return {
    getState,
    dispatch,
    subscribe,
    complete,
  };
};
