import {
  initSimpleModel,
  simpleExpectations,
  simpleInc,
  simpleMsgs,
} from "../__fixtures__/simple";
import { createSimpleTea } from "../__utils__/simple";
import { doneMsg } from "../__utils__/tea";

describe("subscribe", () => {
  it("should produce to observer as soon as it subscribes", (done) => {
    const tea = createSimpleTea(initSimpleModel, done);
    const observer = jest.fn();

    tea.subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);

    done();
  });

  it("should be triggered after a dispatch is called", (done) => {
    const tea = createSimpleTea(initSimpleModel, done);
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
    const tea = createSimpleTea(initSimpleModel, done);
    const observer = jest.fn();

    const unsubscriber = tea.subscribe(observer);

    tea.dispatch(simpleInc());

    unsubscriber();

    tea.dispatch(simpleInc());
    tea.dispatch(simpleInc());

    expect(observer).toHaveBeenCalledTimes(2);

    done();
  });

  it("should produce the correct states", (done) => {
    const tea = createSimpleTea(initSimpleModel, done);
    let subscriptionIndex = 0;

    tea.subscribe((model) => {
      const expected = simpleExpectations[subscriptionIndex];
      if (expected) {
        expect(model).toEqual(expected);
      }

      subscriptionIndex += 1;
    });

    simpleMsgs.forEach((msg) => {
      tea.dispatch(msg);
    });

    tea.dispatch(doneMsg());
  });
});
