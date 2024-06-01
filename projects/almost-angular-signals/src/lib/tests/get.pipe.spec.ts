import { ChangeDetectionStrategy, Component } from '@angular/core';
import { expect, suite, beforeEach, test } from 'vitest';
import { $signal } from '../signal';
import { GetPipe } from '../get.pipe';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';

@Component({
  selector: 'counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GetPipe],
  template: `{{ counter | get }}`,
})
class CounterComponent {
  readonly counter = $signal(0);
}

suite('CounterComponent', () => {
  let spectator: Spectator<CounterComponent>;

  const createFn = createComponentFactory(CounterComponent);

  beforeEach(() => {
    spectator = createFn();
  });

  test('should render', () => {
    expect(spectator.query(byText(0))).not.toBeNull();
  });

  test('should rerender after signal update', () => {
    spectator.component.counter.set(1);
    spectator.detectChanges();
    expect(spectator.query(byText(1))).not.toBeNull();
  });
});
