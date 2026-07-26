import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import createFetchMock from "vitest-fetch-mock";
import ResourceForm from "../ResourceForm";
import rootReducer from "../../../../store/rootSlice";
import resourceFormReducer, {
  setTargetLanguage,
} from "../../../../store/resourceFormSlice";
import {
  michaelisResource,
  resourcesResponse,
  supportedLanguagesResponse,
  wordReferenceResource,
} from "./mocks";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

function createTestStore() {
  return configureStore({
    reducer: { root: rootReducer, resourceForm: resourceFormReducer },
  });
}

/**
 * Mocks the two requests the form makes on mount, plus each resource's health
 * route. `healthResponders` maps a resource's healthRoute to a function that
 * returns its response, or rejects to simulate an unreachable server.
 */
function mockFetchRoutes(healthResponders: {
  [healthRoute: string]: () => Promise<{ body: string; status: number }>;
}) {
  fetchMocker.mockResponse((req: Request) => {
    const url = decodeURIComponent(req.url);
    if (url.includes("api/supported-languages")) {
      return Promise.resolve(JSON.stringify(supportedLanguagesResponse));
    }
    if (url.includes("api/resources/")) {
      return Promise.resolve(JSON.stringify(resourcesResponse));
    }
    for (const [healthRoute, responder] of Object.entries(healthResponders)) {
      if (url.includes(decodeURIComponent(healthRoute))) {
        return responder();
      }
    }
    return Promise.resolve("");
  });
}

const healthy = () => Promise.resolve({ body: "", status: 200 });
const unhealthy = () => Promise.resolve({ body: "", status: 500 });
const unreachable = () => Promise.reject(new Error("Failed to fetch"));

function renderForm(store: ReturnType<typeof createTestStore>) {
  // targetLanguage set with no nativeLanguage keeps the form on the
  // "languages" step, which is what triggers the health checks.
  store.dispatch(setTargetLanguage("português"));
  render(
    <Provider store={store}>
      <ResourceForm />
    </Provider>
  );
}

describe("ResourceForm.tsx", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    window.scrollTo = vi.fn();
  });

  describe("When every resource's health check succeeds", () => {
    it("Then marks all resources as healthy", async () => {
      // Arrange
      mockFetchRoutes({
        [wordReferenceResource.healthRoute]: healthy,
        [michaelisResource.healthRoute]: healthy,
      });
      const store = createTestStore();
      // Act
      renderForm(store);
      // Assert
      await waitFor(() => {
        expect(store.getState().resourceForm.languageResources.length).toEqual(
          2
        );
      });
      const resources = store.getState().resourceForm.languageResources;
      expect(resources.map((resource) => resource.isHealthy)).toEqual([
        true,
        true,
      ]);
    });
  });

  describe("When a resource's health check returns an error status", () => {
    it("Then marks that resource as unhealthy", async () => {
      // Arrange
      mockFetchRoutes({
        [wordReferenceResource.healthRoute]: unhealthy,
        [michaelisResource.healthRoute]: healthy,
      });
      const store = createTestStore();
      // Act
      renderForm(store);
      // Assert
      await waitFor(() => {
        expect(store.getState().resourceForm.languageResources.length).toEqual(
          2
        );
      });
      const resources = store.getState().resourceForm.languageResources;
      expect(resources.map((resource) => resource.isHealthy)).toEqual([
        false,
        true,
      ]);
    });
  });

  describe("When a resource's health check request fails", () => {
    it("Then still resolves and marks that resource as unhealthy", async () => {
      // Arrange
      mockFetchRoutes({
        [wordReferenceResource.healthRoute]: unreachable,
        [michaelisResource.healthRoute]: healthy,
      });
      const store = createTestStore();
      // Act
      renderForm(store);
      // Assert
      await waitFor(() => {
        expect(store.getState().resourceForm.languageResources.length).toEqual(
          2
        );
      });
      const resources = store.getState().resourceForm.languageResources;
      expect(resources.map((resource) => resource.isHealthy)).toEqual([
        false,
        true,
      ]);
    });
  });

  describe("When every resource's health check request fails", () => {
    it("Then still dispatches the resources rather than hanging", async () => {
      // Arrange
      mockFetchRoutes({
        [wordReferenceResource.healthRoute]: unreachable,
        [michaelisResource.healthRoute]: unreachable,
      });
      const store = createTestStore();
      // Act
      renderForm(store);
      // Assert
      await waitFor(() => {
        expect(store.getState().resourceForm.languageResources.length).toEqual(
          2
        );
      });
      const resources = store.getState().resourceForm.languageResources;
      expect(resources.map((resource) => resource.isHealthy)).toEqual([
        false,
        false,
      ]);
    });
  });

  describe("When the health checks are requested", () => {
    it("Then each one is given a timeout signal", async () => {
      // Arrange
      mockFetchRoutes({
        [wordReferenceResource.healthRoute]: healthy,
        [michaelisResource.healthRoute]: healthy,
      });
      const store = createTestStore();
      // Act
      renderForm(store);
      // Assert
      await waitFor(() => {
        expect(store.getState().resourceForm.languageResources.length).toEqual(
          2
        );
      });
      const healthRoutes = [
        wordReferenceResource.healthRoute,
        michaelisResource.healthRoute,
      ];
      const healthCalls = fetchMocker.mock.calls.filter(([input]) =>
        healthRoutes.includes(input as string)
      );
      expect(healthCalls.length).toEqual(2);
      healthCalls.forEach(([, init]) => {
        expect(init?.signal).toBeInstanceOf(AbortSignal);
      });
    });
  });
});
