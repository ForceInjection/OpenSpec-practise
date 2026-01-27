import { test } from "node:test";
import assert from "node:assert";
import { calculateTotal } from "./logic.js";

test("calculateTotal sums up item prices", () => {
  const items = [
    { priceCents: 100, quantity: 2 },
    { priceCents: 50, quantity: 1 },
  ];
  const total = calculateTotal(items);
  assert.strictEqual(total, 250);
});
