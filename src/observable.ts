export type SubscriberFn<T> = (data: T) => void;

export type SubscriberObj<T> = {
  next: SubscriberFn<T>;
  complete: () => void;
};

export type Subscriber<T> = SubscriberFn<T> | SubscriberObj<T>;

export type Unsubscriber = () => void;

export type Subscribe<T> = (subscriber: Subscriber<T>) => Unsubscriber;

export type Observable<T> = {
  next: (data: T) => void;
  complete: () => void;
  subscribe: Subscribe<T>;
};

const isSubscriberFn = <T>(
  subscriber: Subscriber<T>
): subscriber is SubscriberFn<T> => {
  return typeof subscriber === "function";
};

const liftSubscriber = <T>(subscriber: Subscriber<T>): SubscriberObj<T> => {
  if (!isSubscriberFn(subscriber)) {
    return subscriber;
  }

  return {
    next: subscriber,
    complete: () => {},
  };
};

export const observableFromPromise = <T>(
  promise: Promise<T>
): Observable<T> => {
  const obs = createObservable<T>();

  promise.then((message) => {
    obs.next(message);
    obs.complete();
  });

  return obs;
};

export const mergeObservables = <T>(
  observables: Observable<T>[]
): Observable<T> => {
  const obs = createObservable<T>();
  let remaining = observables.length;

  if (remaining === 0) {
    obs.complete();
  }

  for (const observable of observables) {
    observable.subscribe({
      next: (message) => {
        obs.next(message);
      },
      complete: () => {
        remaining -= 1;

        if (remaining === 0) {
          obs.complete();
        }
      },
    });
  }

  return obs;
};

export const mapObservable = <T, D>(
  observable: Observable<T>,
  mapper: (message: T) => D
): Observable<D> => {
  const obs = createObservable<D>();

  observable.subscribe({
    next: (message) => {
      obs.next(mapper(message));
    },
    complete: () => {
      obs.complete();
    },
  });

  return obs;
};

export const createObservable = <T>(): Observable<T> => {
  let data: T;
  let hasData = false;
  let isCompleted = false;
  let subscribers: SubscriberObj<T>[] = [];

  const unsubscribe = (subscriber: SubscriberObj<T>) => {
    const index = subscribers.indexOf(subscriber);

    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };

  const subscribe: Subscribe<T> = (subscriber) => {
    const lifted = liftSubscriber(subscriber);

    if (hasData) {
      lifted.next(data);
    }

    if (isCompleted) {
      lifted.complete();

      return () => {};
    }

    subscribers.push(lifted);

    return () => unsubscribe(lifted);
  };

  const next = (newData: T) => {
    if (isCompleted) return;

    hasData = true;
    data = newData;
    subscribers.forEach((subscriber) => {
      subscriber.next(newData);
    });
  };

  const complete = () => {
    isCompleted = true;

    subscribers.forEach((subscriber) => {
      subscriber.complete();
    });

    subscribers = [];
  };

  return {
    next,
    complete,
    subscribe,
  };
};
