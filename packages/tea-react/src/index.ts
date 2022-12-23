import { Dispatch, Tea } from "@bruunoromero/tea";
import {
  PropsWithChildren,
  createContext as createReactContext,
  createElement,
  useRef,
  useContext as useReactContext,
  useEffect,
  useMemo,
} from "react";

import { useSyncExternalStore } from "use-sync-external-store/shim";

export type ContextState<S, M> = [S, Dispatch<M>];

export type UseContext<S, M> = () => ContextState<S, M>;

export type ProviderProps<S, M> = PropsWithChildren<{
  create: () => Tea<S, M>;
}>;

export type Provider<S, M> = React.FC<ProviderProps<S, M>>;

export type Context<S, M> = {
  Provider: Provider<S, M>;
  useContext: UseContext<S, M>;
};

const useTea = <S, M>(tea: Tea<S, M>): ContextState<S, M> => {
  const state = useSyncExternalStore(tea.subscribe, tea.getState, tea.getState);

  return useMemo(() => [state, tea.dispatch], [state]);
};

export const create = <S, M>(tea: Tea<S, M>): UseContext<S, M> => {
  return () => {
    return useTea(tea);
  };
};

export const createContext = <S, M>(): Context<S, M> => {
  const context = createReactContext<[S, Dispatch<M>] | undefined>(undefined);

  const Provider: Provider<S, M> = ({ create, children }) => {
    const storeRef = useRef<Tea<S, M>>();

    if (!storeRef.current) {
      storeRef.current = create();
    }

    const value = useTea(storeRef.current);

    return createElement(context.Provider, { value }, children);
  };

  const useContext = () => {
    const tea = useReactContext(context);

    if (!tea) {
      throw new Error(
        "Seems like you have not used tea provider as an ancestor."
      );
    }

    return tea;
  };

  return { Provider, useContext };
};
