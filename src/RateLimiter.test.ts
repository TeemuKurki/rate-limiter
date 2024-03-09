import { RateLimiter } from "./RateLimiter.ts";
import { Interval } from "./TokenBucket.ts";
import {
  assertThrows,
  assertInstanceOf,
} from "https://deno.land/std@0.219.0/assert/mod.ts";

Deno.test("RateLimiter", async (t) => {
  await t.step("invalid interval", () => {
    const junkInterval = "junk" as unknown as Interval;
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "sec" }),
      RateLimiter
    );
    assertThrows(
      () => new RateLimiter({ tokensPerInterval: 1, interval: junkInterval })
    );
  });

  await t.step("valid intervals", () => {
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "sec" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "second" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "min" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "minute" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "hr" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "hour" }),
      RateLimiter
    );
    assertInstanceOf(
      new RateLimiter({ tokensPerInterval: 1, interval: "day" }),
      RateLimiter
    );
  });
});
