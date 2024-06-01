import { ReadonlySignal } from "./signal";

export function isNil(v: unknown): v is null | undefined {
  return v == null;
}

export function getSignalValues<T extends Record<string, unknown>>(
  obj: SignalDependenciesRecord<T>,
): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = value.get();
    return acc;
  }, {} as any);
}

export type SignalDependenciesRecord<D extends Record<string, unknown>> = {
  [key in keyof D]: ReadonlySignal<D[key]>;
};

export function throwSignalError(value: unknown, cause?: string): never {
  throw new Error(
    `${value} is not a signal`,
    isNil(cause) ? undefined : { cause },
  );
}
