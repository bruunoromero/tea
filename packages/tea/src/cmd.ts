import { EMPTY, Observable, of, merge } from "rxjs";
import { map as RxMap } from "rxjs/operators";

type Task<M> = () => Promise<M>;

export type Cmd<M> = Observable<Task<M>>;

const batch = <M>(cmds: Cmd<M>[]): Cmd<M> => {
  return merge(...cmds);
};

const task = <M>(task: () => Promise<M>): Cmd<M> => {
  return of(task);
};

const map = <N, M>(cmd: Cmd<N>, mapper: (msg: N) => M): Cmd<M> => {
  const mapTask = (task: Task<N>): Task<M> => {
    return () => task().then(mapper);
  };

  return cmd.pipe(RxMap((task) => mapTask(task)));
};

const none: Cmd<never> = EMPTY;

export const Cmd = {
  map,
  task,
  batch,
  none,
};
