export const BOARD_EMAIL_STATUSES = [
  "scheduled",
  "skipped_not_configured",
  "failed",
] as const;

export type BoardEmailStatus = (typeof BOARD_EMAIL_STATUSES)[number];

export type BoardOpenResult = {
  boardPath: string;
  propertiesUrl: string;
  email: string;
  emailStatus: BoardEmailStatus;
  message: string;
};

export type ViewBoardOutcome = BoardOpenResult & {
  navigated: boolean;
  navError: string | null;
  href: string;
};

/**
 * Schedule the landlord email first, then navigate.
 * Email success is not required for navigation, and a navigation throw does
 * not cancel the open() call that already queued the send.
 */
export async function runViewBoardClick(input: {
  open: () => Promise<BoardOpenResult>;
  navigate: (path: string) => void | Promise<void>;
}): Promise<ViewBoardOutcome> {
  const opened = await input.open();
  const href = withEmailStatus(opened.boardPath, opened.emailStatus);
  try {
    await Promise.resolve(input.navigate(href));
    return { ...opened, navigated: true, navError: null, href };
  } catch {
    return {
      ...opened,
      navigated: false,
      navError: "Couldn't open the board. Your email is still being sent.",
      href,
    };
  }
}

export function withEmailStatus(
  boardPath: string,
  status: BoardEmailStatus,
): string {
  const url = new URL(boardPath, "https://demo-vergesnag.goverge.app");
  url.searchParams.set("email", status);
  return `${url.pathname}${url.search}`;
}

export function boardEmailNotice(status: string | undefined): string | null {
  switch (status) {
    case "scheduled":
      return "Sending your properties link. You can move issues on this board now.";
    case "skipped_not_configured":
      return "Email is not configured (SES_FROM_EMAIL), so nothing was sent. You can move issues on this board now.";
    case "failed":
      return "The email could not be started. You can move issues on this board now.";
    default:
      return null;
  }
}
