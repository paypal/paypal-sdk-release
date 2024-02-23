jest.mock("node-fetch");

import fetch from "node-fetch";
import { readFileSync } from "fs";

import {
  asciiDependencyDiff,
  compareUrl,
  getDependencies,
  getDependencyDiffs,
  getDiff,
} from "./changelog";

const respond = (filename) => ({
  json: () => JSON.parse(readFileSync(filename, "utf-8")),
});

describe("changelog", () => {
  fetch.mockImplementation(() => respond("test/mocks/5.0.423.json"));
  it("gets dependencies for a version", async () => {
    const dependencies = await getDependencies("5.0.423");
    expect(dependencies["@krakenjs/belter"]).toBe("2.4.0");
  });
  it("gets a list of prs from a compare url", async () => {
    fetch.mockImplementation(() => respond("test/mocks/github.json"));
    const diff = await getDiff("https://api.github.com/compare/v1...v2");
    expect(diff.length).toBe(1);
    expect(diff[0].author).toBe("Alice");
    expect(diff[0].htmlUrl).toBe(
      "https://github.com/paypal/paypal-checkout-components/commit/069589f0aa12e8e519a7c1e6f64ad297f57a46c2"
    );
    expect(diff[0].message).toBe("A pull request (#42)");
  });
  it("gets a diff of the dependencies from the previous version", async () => {
    fetch
      .mockReturnValueOnce(respond("test/mocks/5.0.423.json"))
      .mockReturnValueOnce(respond("test/mocks/5.0.422.json"))
      .mockReturnValue(respond("test/mocks/github.json"));
    const diff = await getDependencyDiffs("5.0.422", "5.0.423");
    expect(diff["@krakenjs/belter"].changes).toBeTruthy();
  });
  it("builds compare urls", () => {
    const { api, html } = compareUrl("@krakenjs/belter", "1", "2");
    expect(api).toBe(
      "https://api.github.com/repos/krakenjs/belter/compare/v1...v2"
    );
    expect(html).toBe("https://github.com/krakenjs/belter/compare/v1...v2");
    const { api: api2, html: html2 } = compareUrl(
      "@paypal/checkout-components",
      "1",
      "2"
    );
    expect(api2).toBe(
      "https://api.github.com/repos/paypal/paypal-checkout-components/compare/v1...v2"
    );
    expect(html2).toBe(
      "https://github.com/paypal/paypal-checkout-components/compare/v1...v2"
    );
  });
  it("generates an ascii dependency diff", () => {
    expect(
      asciiDependencyDiff(
        "@example/dep",
        "https://api.github.com/compare/v1...v2"
      )
    ).toBe("@example/dep                  v1 -> v2");
  });
});
