import {
  ChangeDetectorRef,
  DestroyRef,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { ReadonlySignal, getSignalNode } from './signal';

@Pipe({ standalone: true, name: 'get', pure: false })
export class GetPipe implements PipeTransform {
  private static readonly DEFAULT_SUBSCRIPTION = { unsubscribe: () => {} };

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private signal?: ReadonlySignal<unknown> = undefined;
  private subscription = GetPipe.DEFAULT_SUBSCRIPTION;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.subscription.unsubscribe());
  }

  transform<T>(signal: ReadonlySignal<T>): T {
    const signalNode = getSignalNode(
      signal,
      'Cannot use a non-signal in GetPipe',
    );
    if (signal !== this.signal) {
      this.subscription.unsubscribe();
      this.signal = signal;
      this.subscription = signalNode.addStrongListener(() =>
        this.changeDetectorRef.markForCheck(),
      );
    }
    return this.signal.get() as T;
  }
}
