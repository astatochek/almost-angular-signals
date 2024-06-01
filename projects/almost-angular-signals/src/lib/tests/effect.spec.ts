import { ChangeDetectionStrategy, Component } from '@angular/core';
import { expect, suite, beforeEach, test, vi, MockInstance } from 'vitest';
import { $signal } from '../signal';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { $effect } from '../effect';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  selector: 'counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: ``,
})
class CounterComponent {
  readonly counter = $signal(0);
  readonly effectFn = () => void 0;

  constructor() {
    $effect(() => this.effectFn(), { counter: this.counter });
  }
}

suite('CounterComponent', () => {
  let spectator: Spectator<CounterComponent>;
  let spy: MockInstance<[], undefined>;

  const createFn = createComponentFactory(CounterComponent);

  beforeEach(() => {
    spectator = createFn();
    spy = vi.spyOn(spectator.component, 'effectFn');
  });

  test('should run on creation', () => {
    expect(spy).toHaveBeenCalledOnce();
  });

  test('should run on value changes', async () => {
    spectator.component.counter.set(1);
    await delay(0);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
