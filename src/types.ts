/* eslint @typescript-eslint/no-explicit-any: 0 */

/**
 * Callable type with the "new" operator
 * that allows class and constructor types.
 */
export interface Constructor<T = unknown> {
  new (...args: any[]): T;
}

/**
 * Flatten.
 */
type Identity<T> = T;
export declare type Flatten<T> = Identity<{[k in keyof T]: T[k]}>;
