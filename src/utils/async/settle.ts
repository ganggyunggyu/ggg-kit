export const waitForAllOrThrow = async <T>(
  promises: Array<Promise<T>>,
): Promise<T[]> => {
  const results = await Promise.allSettled(promises);

  const rejected = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );
  if (rejected) throw rejected.reason;

  return results.map((result) => (result as PromiseFulfilledResult<T>).value);
};
