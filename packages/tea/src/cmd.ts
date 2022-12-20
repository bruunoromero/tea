import {
  mapObservable,
  mergeObservables,
  Observable,
  observableFromPromise,
} from "./observable";

export type Cmd<M> = () => Observable<M>;

const batch = <M>(cmds: Cmd<M>[]): Cmd<M> => {
  return () => {
    return mergeObservables(cmds.map((cmd) => cmd()));
  };
};

const task = <M>(task: () => Promise<M>): Cmd<M> => {
  return () => {
    return observableFromPromise(task());
  };
};

const map = <M, N>(cmd: Cmd<N>, mapper: (message: N) => M): Cmd<M> => {
  return () => mapObservable(cmd(), mapper);
};

export const Cmd = {
  map,
  task,
  batch,
  none: batch<any>([]),
};
