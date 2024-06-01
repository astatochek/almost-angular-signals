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
    getSignalNode(
      source,
      'Cannot add a no-signal as a Computed dependency',
    ).addWeakListener(node);
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

export type Reducer<T, Args extends any[]> = (state: T, ...args: Args) => T;

export type Actions<T, Reducers extends Record<string, Reducer<T, any[]>>> = {
  [key in keyof Reducers]: Reducers[key] extends (
    state: T,
    ...args: infer Args
  ) => T
    ? Args extends []
      ? () => void
      : (...args: Args) => void
    : never;
};

export function $reducer<T, Reducers extends Record<string, Reducer<T, any[]>>>(
  defaultValue: T,
  reducers: Reducers,
): ReadonlySignal<T> & Actions<T, Reducers> {
  const _signal = $signal(defaultValue);
  const _actions = Object.entries(reducers).reduce(
    (acc, [key, reducer]) => {
      (acc as any)[key] = (...args: any[]) => {
        _signal.set(reducer(_signal.get(), ...args));
      };
      return acc;
    },
    {} as Actions<T, Reducers>,
  );

  return {
    [NODE]: getSignalNode(_signal, ''),
    get: () => _signal.get(),
    ..._actions,
  } as ReadonlySignal<T> & Actions<T, Reducers>;
}

export function isSignal(value: unknown): value is { [NODE]: SignalNode } {
  try {
    return (value as any)[NODE] instanceof SignalNode;
  } catch (e) {
    return false;
  }
}

export function getSignalNode(
  signal: ReadonlySignal<unknown>,
  throwback: string,
): SignalNode | never {
  if (isSignal(signal)) {
    return signal[NODE];
  }
  throwSignalError(signal, throwback);
}
