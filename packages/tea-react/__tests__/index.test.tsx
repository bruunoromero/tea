import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  AsyncModel,
  failedError,
  initAsyncModel,
  successTasks,
} from "../__fixtures__/async";
import { AsyncCreateComponent } from "../__fixtures__/async-create-component";
import { AsyncProviderComponent } from "../__fixtures__/async-provider-component";
import { initSyncModel, SyncModel } from "../__fixtures__/sync";
import { SyncCreateComponent } from "../__fixtures__/sync-create-component";
import { SyncProviderComponent } from "../__fixtures__/sync-provider-component";
import { asyncExpectations, asyncFetchTasks } from "../__utils__/async";
import { syncEvents, syncExpectations } from "../__utils__/sync";

const assertSyncUi = (model: SyncModel) => {
  expect(screen.getByTestId("counter:value")).toHaveTextContent(
    model.counter.toString()
  );

  if (model.tasks.length === 0) {
    expect(screen.getByTestId("tasks:container")).toBeEmptyDOMElement();
  } else {
    for (const task of model.tasks) {
      expect(screen.getByTestId(`tasks:value:${task.name}`)).toHaveTextContent(
        task.name
      );
    }
  }

  expect(screen.getByTestId("user:value")).toHaveTextContent(model.user);
};

const assertAsyncUi = (model: AsyncModel) => {
  expect(screen.getByTestId("error:value")).toHaveTextContent(model.error);

  if (model.tasks.length === 0) {
    expect(screen.getByTestId("tasks:container")).toBeEmptyDOMElement();
  } else {
    for (const task of model.tasks) {
      expect(screen.getByTestId(`tasks:value:${task}`)).toHaveTextContent(task);
    }
  }

  if (model.loading) {
    expect(screen.getByTestId("loading:value")).toHaveTextContent(
      "is loading..."
    );
  } else {
    expect(screen.getByTestId("loading:value")).toHaveTextContent("loaded!");
  }
};

describe("Sync - Create", () => {
  it("should render correctly", async () => {
    render(<SyncCreateComponent />);

    assertSyncUi(initSyncModel);
  });

  it("should update the ui based on the actions", () => {
    render(<SyncCreateComponent />);

    for (let i = 0; i < syncExpectations.length; i++) {
      const model = syncExpectations[i];
      const event = syncEvents[i];

      event(screen);
      assertSyncUi(model);
    }
  });
});

describe("Sync - Provider", () => {
  it("should render correctly", async () => {
    render(<SyncProviderComponent />);

    assertSyncUi(initSyncModel);
  });

  it("should update the ui based on the actions", () => {
    render(<SyncProviderComponent />);

    for (let i = 0; i < syncExpectations.length; i++) {
      const model = syncExpectations[i];
      const event = syncEvents[i];

      event(screen);
      assertSyncUi(model);
    }
  });
});

describe("Async - Create", () => {
  it("should render correctly", async () => {
    render(<AsyncCreateComponent />);

    assertAsyncUi(initAsyncModel);
  });

  it("should update the ui based on the actions", async () => {
    render(<AsyncCreateComponent />);

    assertAsyncUi(initAsyncModel);

    asyncFetchTasks(screen);

    for (const model of asyncExpectations) {
      await waitFor(() => assertAsyncUi(model));
    }
  });
});

describe("Async - Provider", () => {
  it("should render correctly", async () => {
    render(<AsyncProviderComponent />);

    assertAsyncUi(initAsyncModel);
  });

  it("should update the ui based on the actions", async () => {
    render(<AsyncProviderComponent />);

    assertAsyncUi(initAsyncModel);

    asyncFetchTasks(screen);

    for (const model of asyncExpectations) {
      await waitFor(() => assertAsyncUi(model));
    }
  });
});
