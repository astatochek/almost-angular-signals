export class SignalNode {
  private readonly weakObservable = new WeakObservable<SignalNode>();
  private readonly strongObservable = new StrongObservable<void>();
  private dirty = false;

  markAsDirty(skipCheck: boolean): void {
    if (!skipCheck && this.dirty) return;
    this.dirty = true;
    this.weakObservable.emit(SignalNode.propagateDirtyStatus);
    this.strongObservable.emit();
  }

  markAsPristine(): void {
    this.dirty = false;
  }

  isDirty(): boolean {
    return this.dirty;
  }

  addWeakListener(node: SignalNode): void {
    this.weakObservable.subscribe(node);
  }

  addStrongListener(
    observer: () => void,
  ): ReturnType<StrongObservable<void>["subscribe"]> {
    return this.strongObservable.subscribe(observer);
  }

  private static propagateDirtyStatus(node: SignalNode): void {
    node.markAsDirty(false);
  }
}

class StrongObservable<T> {
  private subscribers = new Set<(value: T) => void>();

  emit(value: T): void {
    this.subscribers.forEach((observer) => observer(value));
  }

  subscribe(observer: (value: T) => void): { unsubscribe: () => void } {
    this.subscribers.add(observer);
    return {
      unsubscribe: () => this.subscribers.delete(observer),
    };
  }
}

class WeakObservable<T extends WeakKey> {
  private key = 0;
  private subscribers = new Map<number, WeakRef<T>>();

  emit(consumer: (target: T) => void): void {
    this.subscribers.forEach((ref, key, map) => {
      const target = ref.deref();
      if (target) {
        consumer(target);
      } else {
        map.delete(key);
      }
    });
  }

  subscribe(target: T): void {
    this.subscribers.set(this.key++, new WeakRef(target));
  }
}
