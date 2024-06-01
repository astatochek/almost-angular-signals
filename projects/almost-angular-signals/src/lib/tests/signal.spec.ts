import { expect, suite, test } from 'vitest';
import { $signal } from '../signal';

suite('$signal', () => {
  test('should get value', () => {
    const count = $signal(0);
    expect(count.get()).toEqual(0);
  });

  test('should set value', () => {
    const count = $signal(0);
    count.set(1);
    expect(count.get()).toEqual(1);
  });

  test('should update value', () => {
    const count = $signal(0);
    count.update((prev) => prev + 1);
    expect(count.get()).toEqual(1);
  });
});
