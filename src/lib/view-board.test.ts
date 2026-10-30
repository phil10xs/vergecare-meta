import { describe, expect, it } from "vitest";
import { runViewBoardClick } from "./view-board";
import type { BoardOpenResult } from "./view-board";

const opened: BoardOpenResult = {
  boardPath: "/b/tok/p/key/board",
  propertiesUrl: "https://vergesnag.goverge.app/b/tok",
  email: "landlord@acme.co",
  emailStatus: "scheduled",
  message: "Sending your properties link.",
};

describe("runViewBoardClick", () => {
  it("opens the email path before navigating", async () => {
    const order: string[] = [];
    await runViewBoardClick({
      open: async () => {
        order.push("open");
        return opened;
      },
      navigate: () => {
        order.push("navigate");
      },
    });
    expect(order).toEqual(["open", "navigate"]);
  });

  it("navigates when the email could not be started", async () => {
    const paths: string[] = [];
    const outcome = await runViewBoardClick({
      open: async () => ({ ...opened, emailStatus: "failed", message: "nope" }),
      navigate: (path) => {
        paths.push(path);
      },
    });
    expect(paths).toEqual(["/b/tok/p/key/board?email=failed"]);
    expect(outcome.navigated).toBe(true);
  });

  it("navigates when email is not configured", async () => {
    let path = "";
    const outcome = await runViewBoardClick({
      open: async () => ({
        ...opened,
        emailStatus: "skipped_not_configured",
        message: "unset",
      }),
      navigate: (next) => {
        path = next;
      },
    });
    expect(outcome.navigated).toBe(true);
    expect(path).toContain("email=skipped_not_configured");
  });

  it("keeps the email queued when navigation throws", async () => {
    let openedCall = false;
    const outcome = await runViewBoardClick({
      open: async () => {
        openedCall = true;
        return opened;
      },
      navigate: () => {
        throw new Error("nav failed");
      },
    });
    expect(openedCall).toBe(true);
    expect(outcome.navigated).toBe(false);
    expect(outcome.navError).toMatch(/still being sent/);
    expect(outcome.href).toBe("/b/tok/p/key/board?email=scheduled");
  });
});
