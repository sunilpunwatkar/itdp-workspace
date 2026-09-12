export type RetryDecision =
  | "RETRY"
  | "DO_NOT_RETRY";

export function classifyProviderRetryDecision(
  message: string
): RetryDecision {
  if (
    message.includes(
      "Yahoo rate limit (HTTP 429)"
    )
  ) {
    return "RETRY";
  }

  const httpMatch =
    message.match(
      /Yahoo historical HTTP (\d{3})/
    );

  if (httpMatch) {
    const status =
      Number(httpMatch[1]);

    if (
      status >= 500 &&
      status <= 599
    ) {
      return "RETRY";
    }

    return "DO_NOT_RETRY";
  }

  if (
    message.includes(
      "timed out"
    )
  ) {
    return "RETRY";
  }

  return "DO_NOT_RETRY";
}