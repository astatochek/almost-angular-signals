import { DestroyRef, inject } from '@angular/core';
import { ReadonlySignal, getSignalNode, isSignal } from './signal';
import { SignalDependenciesRecord, getSignalValues } from './utils';

export function $effect<D extends Record<string, unknown>>(
  effectFn: (deps: D) => void,
  deps: SignalDependenciesRecord<D>,
): void {
  const runEffect = () => effectFn(getSignalValues(deps));

  let isRerunScheduled = false;

  function scheduleRerun(): void {
    if (isRerunScheduled) return;
    isRerunScheduled = true;
    queueMicrotask(() => {
      runEffect();
      isRerunScheduled = false;
    });
  }

  for (const source of Object.values(deps)) {
    if (!isSignal(source))
      throw new Error(`${source} is not a signal`, {
        cause: 'Cannot add a no-signal as a Computed dependency',
      });
  }

  scheduleRerun();

  const subscriptions = Object.values<ReadonlySignal<unknown>>(deps).map(
    (source) =>
      getSignalNode(
        source,
        'Cannot use a non-signal as an Effect dependency',
      ).addStrongListener(scheduleRerun),
  );

  inject(DestroyRef).onDestroy(() => {
    for (const s of subscriptions) {
      s.unsubscribe();
    }
  });
}
