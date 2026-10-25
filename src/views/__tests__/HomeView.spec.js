import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

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
        id: "saved-news-123",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: HomeView },
        { path: "/docEdit/:id", component: { template: "<main />" } },
      ],
    });
    await router.push("/");
    await router.isReady();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
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
    expect(wrapper.find(".news-chat__create-paragraph").exists()).toBe(true);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "paragraph-456" }),
    });
    await wrapper.find(".news-chat__create-paragraph").trigger("click");
    await flushPromises();

    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.example.test/news/topNews/createTopNews/saved-news-123",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ mode: "5098996f-226c-4898-8fc6-346837896c97" }),
      }),
    );
    expect(router.currentRoute.value.fullPath).toBe("/docEdit/paragraph-456");
  });
});
