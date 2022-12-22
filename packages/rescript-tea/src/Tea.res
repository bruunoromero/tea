type t<'a, 'b>

module Cmd = {
  type t<'a>

  type task<'a> = unit => Js.Promise.t<'a>

  @module("@bruunoromero/tea") @scope("Cmd")
  external none: t<'a> = "none"

  @module("@bruunoromero/tea") @scope("Cmd")
  external task: task<'a> => t<'a> = "task"

  @module("@bruunoromero/tea") @scope("Cmd")
  external batch: array<t<'a>> => t<'a> = "batch"
}

type update<'a, 'b> = ('a, 'b) => ('a, Cmd.t<'b>)

type unsubscriber = unit => unit

type subscriber<'a> = 'a => unit

@module("@bruunoromero/tea")
external create: (('a, Cmd.t<'b>), update<'a, 'b>) => t<'a, 'b> = "create"

@send
external getState: t<'a, 'b> => 'a = "getState"

@send
external subscribe: (t<'a, 'b>, subscriber<'a>) => unsubscriber = "subscribe"

@send
external dispatch: (t<'a, 'b>, 'b) => unit = "dispatch"

@send
external complete: t<'a, 'b> => unit = "complete"
