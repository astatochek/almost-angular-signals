import { expect, suite, test } from 'vitest';
import { $reducer } from '../signal';

suite('$reducer', () => {
  test('should get value', () => {
    const count = $reducer(0, {});
    expect(count.get()).toEqual(0);
  });

  test('should increment value', () => {
    const count = $reducer(0, {
      increment: (state) => state + 1,
    });
    count.increment();
    expect(count.get()).toEqual(1);
  });

  test('should increment value with args', () => {
    const count = $reducer(0, {
      increment: (state: number, value: number) => state + value,
    });
    count.increment(5);
    expect(count.get()).toEqual(5);
  });
});
