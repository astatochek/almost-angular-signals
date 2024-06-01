import { SignalNode } from './signal-node';
import {
  SignalDependenciesRecord,
  getSignalValues,
  throwSignalError,
} from './utils';

const NODE = Symbol('SIGNAL_NODE');

export interface ReadonlySignal<T> {
  get(): T;
}

export interface WritableSignal<T> extends ReadonlySignal<T> {
  set(value: T): void;
  update(updateFn: (prev: T) => T): void;
}

export function $signal<T>(defaultValue: T): WritableSignal<T> {
  const node = new SignalNode();
  let _value = defaultValue;
  return {
    [NODE]: node,
    get: () => _value,
    set: (value) => {
      _value = value;
      node.markAsDirty(true);
    },
    update: (updateFn) => {
      _value = updateFn(_value);
      node.markAsDirty(true);
    },
  } as WritableSignal<T>;
}

export function $computed<T, D extends Record<string, unknown>>(
  computationFn: (deps: D) => T,
  dependencies: SignalDependenciesRecord<D>,
): ReadonlySignal<T> {
  const node = new SignalNode();
  const DEFAULT = Symbol('DEFAULT');
  let value: T | typeof DEFAULT = DEFAULT;
  for (const source of Object.values(dependencies)) {
    if (!isSignal(source))
      throwSignalError(
        source,
        'Cannot add a no-signal as a Computed dependency',
      );
    source[NODE].addWeakListener(node);
  }

  return {
    [NODE]: node,
    get: () => {
      if (!node.isDirty() && value !== DEFAULT) return value;
      value = computationFn(getSignalValues(dependencies));
      node.markAsPristine();
      return value;
    },
  } as ReadonlySignal<T>;
}

function isSignal(value: unknown): value is { [NODE]: SignalNode } {
  try {
    return (value as any)[NODE] instanceof SignalNode;
  } catch (e) {
    return false;
  }
}
