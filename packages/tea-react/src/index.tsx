import { Dispatch, Tea } from "@bruunoromero/tea";
import React, {
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";

export type TeaProvider = React.FC<PropsWithChildren>;

export type UseTea<S, M> = () => [S, Dispatch<M>];

export type TeaReact<S, M> = {
  Provider: TeaProvider;
  Consumer: React.Consumer<[S, Dispatch<M>]>;
  useTea: UseTea<S, M>;
};

export const create = <S, M>(tea: Tea<S, M>): TeaReact<S, M> => {
  const dispatch: Dispatch<M> = (message) => tea.dispatch(message);
  const context = createContext<[S, Dispatch<M>]>([tea.getState(), dispatch]);

  const useTea = () => useContext(context);

  const { Provider: InternalProvider, Consumer } = context;

  const Provider: TeaProvider = ({ children }) => {
    const [state, setState] = useState(tea.getState());

    useEffect(() => {
      const unsubscribe = tea.subscribe((newState) => {
        if (state !== newState) {
          setState(newState);
        }
      });

      return () => unsubscribe();
    }, [setState]);

    return (
      <InternalProvider value={[state, dispatch]}>{children}</InternalProvider>
    );
  };

  return { Provider, Consumer, useTea };
};
