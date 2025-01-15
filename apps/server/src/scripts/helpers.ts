export const sleep = async (durationInMs: number) =>
  new Promise((resolve) => setTimeout(() => resolve('done'), durationInMs));

export const batch = <T = any>(items: T[], size: number): T[][] => {
  return items.reduce((acc, item, index) => {
    const batchIndex = Math.floor(index / size);

    if (!acc[batchIndex]) acc[batchIndex] = [];
    acc[batchIndex].push(item);

    return acc;
  }, []);
};

export const asyncBatch = async <T = any>(
  items: T[],
  size: number,
  callback: (item: T) => Promise<any>,
  sleepDuration?: number,
): Promise<void> => {
  const batches = batch(items, size);
  const count = batches.length - 1;

  console.log(`Processing ${count} in batches of ${size}`);

  for (let i = 0; i < batches.length; i++) {
    try {
      console.log(`Starting batch ${i} of ${count}`);
      const batch = batches[i];
      await Promise.all(batch.map(callback));

      console.log(`Processed batch ${i} of ${count}`);
      if (!sleepDuration) continue;

      console.log(`Sleeping for ${sleepDuration} milliseconds`);
      await sleep(sleepDuration);
    } catch (error) {
      console.log(`Error on batch ${i} of ${count}`);
      console.log(error.message);
    }
  }
};

export const faultTolerantAsyncBatch = async <T = any>(
  items: T[],
  size: number,
  callback: (item: T) => Promise<any>,
  sleepDuration?: number,
): Promise<PromiseSettledResult<any>[]> => {
  const batches = batch(items, size);
  const count = batches.length - 1;

  const results: PromiseSettledResult<T>[] = [];

  console.log(`Processing ${count} in batches of ${size}`);

  for (let i = 0; i < batches.length; i++) {
    try {
      console.log(`Starting batch ${i} of ${count}`);
      const batch = batches[i];

      // Doesn't stop processing if one of the promises fails
      const batchResults = await Promise.allSettled(batch.map(callback));

      results.concat(batchResults);

      console.log(`Processed batch ${i} of ${count}`);
      if (!sleepDuration) continue;

      console.log(`Sleeping for ${sleepDuration} milliseconds`);
      await sleep(sleepDuration);
    } catch (error) {
      console.log(`Error on batch ${i} of ${count}`);
      console.log(error.message);
    }
  }

  return results;
};
