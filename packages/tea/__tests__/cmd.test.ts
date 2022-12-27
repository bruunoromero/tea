import { TestScheduler } from "rxjs/testing";
import { Cmd } from "../src";

let scheduler: TestScheduler;

beforeEach(() => {
  scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});

describe("none", () => {
  it("should not produce", () => {
    const source$ = Cmd.none;
    const expected = "|";

    scheduler.run(({ expectObservable }) => {
      expectObservable(source$).toBe(expected);
    });
  });
});

describe("task", () => {
  it("should take a task and wrap it in an observable", () => {
    const task = async () => 10;
    const source$ = Cmd.task(task);
    const expected = "(a|)";

    scheduler.run(({ expectObservable }) => {
      expectObservable(source$).toBe(expected, { a: task });
    });
  });
});

describe("batch", () => {
  it("should take an array of cmd and merge them", () => {
    const task1 = async () => 10;
    const task2 = async () => 20;
    const task3 = async () => 30;

    const source$ = Cmd.batch([
      Cmd.task(task1),
      Cmd.task(task2),
      Cmd.task(task3),
    ]);

    const expected = "(abc|)";

    scheduler.run(({ expectObservable }) => {
      expectObservable(source$).toBe(expected, {
        a: task1,
        b: task2,
        c: task3,
      });
    });
  });

  it("should be able to merge batches", () => {
    const task1 = async () => 10;
    const task2 = async () => 20;
    const task3 = async () => 30;
    const task4 = async () => 40;
    const task5 = async () => 50;
    const task6 = async () => 60;

    const source$ = Cmd.batch([
      Cmd.batch([Cmd.task(task1), Cmd.task(task2), Cmd.task(task3)]),
      Cmd.task(task4),
      Cmd.batch([Cmd.task(task5), Cmd.task(task6)]),
    ]);

    const expected = "(abcdef|)";

    scheduler.run(({ expectObservable }) => {
      expectObservable(source$).toBe(expected, {
        a: task1,
        b: task2,
        c: task3,
        d: task4,
        e: task5,
        f: task6,
      });
    });
  });
});

describe("map", () => {
  it("should take an cmd and maps it with a mapper function", () => {
    expect.assertions(1);
    const original$ = Cmd.task(async () => "abced");
    const source$ = Cmd.map(original$, (value) => value.length);

    source$.subscribe((task) => {
      task().then((value) => {
        expect(value).toBe(5);
      });
    });
  });

  it("should be able to map a batch", () => {
    expect.assertions(6);

    let expectedIndex = 0;
    const expectations = [7, 3, 4, 5, 6, 15];

    const task1 = async () => "testing";
    const task2 = async () => "map";
    const task3 = async () => "with";
    const task4 = async () => "batch";
    const task5 = async () => "should";
    const task6 = async () => "work perfeclty!";

    const original$ = Cmd.batch([
      Cmd.batch([Cmd.task(task1), Cmd.task(task2), Cmd.task(task3)]),
      Cmd.task(task4),
      Cmd.batch([Cmd.task(task5), Cmd.task(task6)]),
    ]);

    const source$ = Cmd.map(original$, (value) => value.length);

    source$.subscribe((task) => {
      const actual = expectations[expectedIndex];

      task().then((value) => {
        expect(value).toBe(actual);
      });

      expectedIndex += 1;
    });
  });
});
