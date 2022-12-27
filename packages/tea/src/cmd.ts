import { EMPTY, Observable, of, merge } from "rxjs";
import { map as RxMap } from "rxjs/operators";

export type Cmd<M> = Observable<() => Promise<M>>;

const batch = <M>(cmds: Cmd<M>[]): Cmd<M> => {
  return merge(...cmds);
};

const task = <M>(task: () => Promise<M>): Cmd<M> => {
  return of(task);
};

const map = <N, M>(cmd: Cmd<N>, mapper: (msg: N) => M): Cmd<M> => {
  return cmd.pipe(RxMap((task) => () => task().then(mapper)));
};

const none: Cmd<never> = EMPTY;

export const Cmd = {
  map,
  task,
  batch,
  none,
};
