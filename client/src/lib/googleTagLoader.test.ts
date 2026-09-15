import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetGoogleTagLoaderForTests,
  scheduleGoogleTag,
} from "./googleTagLoader";

describe("Google tag loader", () => {
  const appendChild = vi.fn();

  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        clearTimeout: vi.fn(),
        setTimeout: vi.fn(),
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        readyState: "complete",
        querySelector: vi.fn(() => null),
        createElement: vi.fn(() => ({ dataset: {} })),
        head: { appendChild },
      },
    });
    appendChild.mockClear();
    __resetGoogleTagLoaderForTests();
  });

  afterEach(() => {
    __resetGoogleTagLoaderForTests();
    vi.restoreAllMocks();
  });

  it("loads the tag immediately so a first page view is measurable", () => {
    scheduleGoogleTag("G-05DW80HCTS");

    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith("script");
  });
});
