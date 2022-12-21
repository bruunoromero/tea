type t<'a, 'b>

@module("@bruunoromero/tea-react")
external create: Tea.t<'a, 'b> => t<'a, 'b> = "create"

@get
external provider: t<'a, 'b> => React.component<{"children": React.element}> = "Provider"

@send
external useTea: t<'a, 'b> => ('a, 'b => unit) = "useTea"
