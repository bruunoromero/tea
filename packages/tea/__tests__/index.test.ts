import { asyncExpectations, initAsyncModel } from "../__utils__/async";
import {
  initSimpleModel,
  simpleDec,
  simpleExpectations,
  simpleInc,
  simpleMsgs,
} from "../__utils__/sync";
import { createAsyncTea } from "../__fixtures__/async";
import { createSimpleTea } from "../__fixtures__/sync";

jest.useFakeTimers();

describe("tea", () => {
  it("should produce the correct states when sync", () => {
    const tea = createSimpleTea(initSimpleModel);
    let expectationIndex = 0;

    tea.subscribe((model) => {
      const expected = simpleExpectations[expectationIndex];
      if (expected) {
        expect(model).toEqual(expected);
      }

      expectationIndex += 1;
    });

    simpleMsgs.forEach((msg) => {
      tea.dispatch(msg);
    });
  });

  it("should produce the correct states when async", (done) => {
    const tea = createAsyncTea(initAsyncModel);

    let expectationIndex = 0;

    tea.subscribe((model) => {
      jest.runAllTimers();
      const expected = asyncExpectations[expectationIndex];
      if (expected) {
        expect(model).toEqual(expected);
      }

      if (model.done) {
        done();
      }

      expectationIndex += 1;
    });
  });
});

describe("subscribe", () => {
  it("should produce to observer as soon as it subscribes", () => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    tea.subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);
  });

  it("should be triggered after a dispatch is called", () => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    tea.subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);

    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(2);

    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(3);
  });

  it("should stop producing to observer when it unsubscribes", () => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    const unsubscriber = tea.subscribe(observer);

    tea.dispatch(simpleInc());

    unsubscriber();

    tea.dispatch(simpleInc());
    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(2);
  });
});

describe("complete", () => {
  it("should stop producing to observers", () => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();

    const tea = createSimpleTea(initSimpleModel);

    tea.subscribe(observer1);
    tea.subscribe(observer2);

    expect(observer1).toHaveBeenCalledTimes(1);
    expect(observer2).toHaveBeenCalledTimes(1);

    tea.complete();

    tea.dispatch(simpleInc());
    tea.dispatch(simpleInc());

    expect(observer1).toHaveBeenCalledTimes(1);
    expect(observer2).toHaveBeenCalledTimes(1);
  });
});

describe("getState", () => {
  it("should return the current state", () => {
    const tea = createSimpleTea(initSimpleModel);

    expect(tea.getState()).toEqual(initSimpleModel);

    tea.dispatch(simpleInc());

    expect(tea.getState()).toEqual({ ...initSimpleModel, counter: 1 });
  });

  it("should be idempotent", () => {
    const tea = createSimpleTea(initSimpleModel);

    expect(tea.getState()).toBe(tea.getState());

    tea.dispatch(simpleDec());

    expect(tea.getState()).toBe(tea.getState());
  });
});
