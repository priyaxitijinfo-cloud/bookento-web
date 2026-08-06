import { delay, paginate } from "@/mock/helpers";

export async function mockApiCall(fn, ms = 400) {
  await delay(ms);
  return fn();
}

export function createMockService(getData, defaultDelay = 400) {
  return async (...args) => {
    await delay(defaultDelay);
    return getData(...args);
  };
}

export { paginate };
