import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

vi.mock("../../components/overview.vue", () => ({
  default: { render: () => null },
}));

import HomeView from "../HomeView.vue";

describe("HomeView Find news chat", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the prompt and displays the agent response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        agentResponse: "Here are the latest headlines.",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const wrapper = mount(HomeView, {
      global: {
        config: {
          globalProperties: {
            backendPath: "https://api.example.test",
          },
        },
      },
    });

    await wrapper.find(".find-news-button").trigger("click");
    await wrapper.find("textarea").setValue("Latest climate news");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/agent/search_and_save",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ prompt: "Latest climate news" }),
      }),
    );
    expect(wrapper.text()).toContain("Latest climate news");
    expect(wrapper.text()).toContain("Here are the latest headlines.");
  });
});
