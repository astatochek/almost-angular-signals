import { expect, suite, test, vi } from 'vitest';
import { $signal, $computed } from '../signal';

suite('$computed', () => {
  test('should get value', () => {
    const count = $signal(1);
    const double = $computed(({ count }) => count * 2, { count });
    expect(double.get()).toEqual(2);
  });

  test('should set value', () => {
    const count = $signal(1);
    const double = $computed(({ count }) => count * 2, { count });
    count.set(2);
    expect(double.get()).toEqual(4);
  });

  test('should update value', () => {
    const count = $signal(1);
    const double = $computed(({ count }) => count * 2, { count });
    count.update((prev) => prev + 1);
    expect(double.get()).toEqual(4);
  });

  test('should not do the computation on initialization', () => {
    // arrange
    const helper = {
      computationFn: ({ count }: { count: number }) => count * 2,
    };
    const spy = vi.spyOn(helper, 'computationFn');
    const count = $signal(1);
    const double = $computed(helper.computationFn, { count });

    // assert
    expect(spy).not.toHaveBeenCalled();
  });

  test('should not do the computation on source update', () => {
    // arrange
    const helper = {
      computationFn: ({ count }: { count: number }) => count * 2,
    };
    const spy = vi.spyOn(helper, 'computationFn');
    const count = $signal(1);
    const double = $computed(helper.computationFn, { count });

    // act
    count.set(2);

    // assert
    expect(spy).not.toHaveBeenCalled();
  });

  test('should do the computation after source update if value is requested', () => {
    // arrange
    const helper = {
      computationFn: ({ count }: { count: number }) => count * 2,
    };
    const spy = vi.spyOn(helper, 'computationFn');
    const count = $signal(1);
    const double = $computed(helper.computationFn, { count });

    // act
    count.set(2);
    double.get();

    // assert
    expect(spy).toHaveBeenCalledOnce();
  });
});
