
type RequestOperation<T> = () => Promise<T>;

const inFlightRequests = new Map<string, Promise<unknown>>();

export function runSharedClientRequest<T>(
  key: string,
  operation: RequestOperation<T>
): Promise<T> {
  const existing = inFlightRequests.get(key);

  if (existing) {
    return existing as Promise<T>;
  }

  const requestPromise = Promise.resolve().then(operation);

  inFlightRequests.set(key, requestPromise);

  void requestPromise.then(
    () => {
      if (inFlightRequests.get(key) === requestPromise) {
        inFlightRequests.delete(key);
      }
    },
    () => {
      if (inFlightRequests.get(key) === requestPromise) {
        inFlightRequests.delete(key);
      }
    }
  );

  return requestPromise;
}
