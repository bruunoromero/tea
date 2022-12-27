import { asyncExpectations, initAsyncModel } from "../__fixtures__/async";
import {
  initSimpleModel,
  simpleExpectations,
  simpleInc,
  simpleMsgs,
} from "../__fixtures__/simple";
import { createAsyncTea } from "../__utils__/async";
import { createSimpleTea } from "../__utils__/simple";

jest.useFakeTimers();

describe("tea", () => {
  it("should produce the correct states when sync", (done) => {
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

    done();
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
  it("should produce to observer as soon as it subscribes", (done) => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    tea.subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);

    done();
  });

  it("should be triggered after a dispatch is called", (done) => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    tea.subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);

    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(2);

    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(3);

    done();
  });

  it("should stop producing to observer when it unsubscribes", (done) => {
    const tea = createSimpleTea(initSimpleModel);
    const observer = jest.fn();

    const unsubscriber = tea.subscribe(observer);

    tea.dispatch(simpleInc());

    unsubscriber();

    tea.dispatch(simpleInc());
    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(2);

    done();
  });
});

describe("complete", () => {
  it("should stop producing to observers", (done) => {
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

    done();
  });
});

describe("getState", () => {
  it("should return the current state", (done) => {
    const tea = createSimpleTea(initSimpleModel);

    expect(tea.getState()).toEqual(initSimpleModel);

    done();
  });

  it("should return the same state if it has not changed", (done) => {
    const tea = createSimpleTea(initSimpleModel);

    expect(tea.getState()).toBe(tea.getState());

    done();
  });
});
