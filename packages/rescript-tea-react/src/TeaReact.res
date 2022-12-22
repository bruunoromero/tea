type dispatch<'a> = 'a => unit
type contextState<'a, 'b> = ('a, dispatch<'b>)
type useTea<'a, 'b> = unit => contextState<'a, 'b>

module Context = {
  type t<'a, 'b>

  @get
  external provider: t<'a, 'b> => React.component<{
    "create": unit => Tea.t<'a, 'b>,
    "children": React.element,
  }> = "Provider"

  @send
  external useContext: t<'a, 'b> => contextState<'a, 'b> = "useContext"
}

@module("@bruunoromero/tea-react")
external create: Tea.t<'a, 'b> => useTea<'a, 'b> = "create"

@module("@bruunoromero/tea-react")
external createContext: unit => Context.t<'a, 'b> = "createContext"
