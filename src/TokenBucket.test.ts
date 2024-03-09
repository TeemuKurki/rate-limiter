import { TokenBucket } from "./TokenBucket.ts";
import { wait } from "./clock.ts";

import {
  assertEquals,
  assert,
  assertLess,
} from "https://deno.land/std@0.219.0/assert/mod.ts";

const TIMING_EPSILON = 10;

Deno.test("TokenBucket", async (test) => {
  await test.step("is initialized empty", () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    assertEquals(bucket.bucketSize, 10);
    assertEquals(bucket.tokensPerInterval, 1);
    assertEquals(bucket.content, 0);
  });

  await test.step("removing 10 tokens takes 1 second", async () => {
    const start = +new Date();
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    const remainingTokens = await bucket.removeTokens(10);

    const duration = +new Date() - start;
    const diff = Math.abs(1000 - duration);
    assert(diff < TIMING_EPSILON);
    assertEquals(remainingTokens, 0);
    assertEquals(bucket.content, 0);
  });

  await test.step("removing another 10 tokens takes 1 second", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    await bucket.removeTokens(10);

    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(10);
    const duration = +new Date() - start;
    const diff = Math.abs(1000 - duration);
    assert(diff < TIMING_EPSILON);
    assertEquals(remainingTokens, 0);
    assertEquals(bucket.content, 0);
  });

  await test.step("waiting 2 seconds gives us only 10 tokens", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    await wait(2000);
    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(10);
    const duration = +new Date() - start;
    assert(duration < TIMING_EPSILON);
    assertEquals(remainingTokens, 0);
  });

  await test.step("removing 1 token takes 100ms", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });

    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(1);
    const duration = +new Date() - start;
    const diff = Math.abs(100 - duration);
    assert(diff < TIMING_EPSILON);
    assertLess(remainingTokens, 1);
  });
});
