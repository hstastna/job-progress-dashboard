import { DEFAULT_PERIOD, MAX_PERIOD, MIN_PERIOD } from "./constants";

export const getWebSocketUrlWithPeriod = (
  url: string,
  period = DEFAULT_PERIOD
) => {
  const validPeriod =
    period < MIN_PERIOD || period > MAX_PERIOD ? DEFAULT_PERIOD : period;

  return `${url}?period=${validPeriod}`;
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => func(...args), delay);
  };
};
