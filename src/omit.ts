import { toModifier, toRaw } from './lib'
import { type DeepKeyOf, type Dictionary, type Omit, type OmitOption, defaultCommonOption } from './type'

/**
 * Returns an object with the specified keys removed from the object.
 *
 * @example
 * ```ts
 * const obj = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: [3, 4]
 *   }
 * }
 *
 * const omitted = omit(obj, ['a', 'b.c'])
 * // omitted is
 * // {
 * //   b: {
 * //     d: [3, 4]
 * //   }
 * // }
 * ```
 *
 * @param obj
 * @param keys
 * @param opt
 */
export function omit<D extends Dictionary, K extends DeepKeyOf<D>>(obj: D, keys: K[], opt?: OmitOption): Omit<D, K>

/**
 *
 * @param obj
 * @param keys
 * @param opt
 */
export function omit<D extends Dictionary, K extends DeepKeyOf<D>>(
  obj: D,
  keys: Array<K | RegExp>,
  opt?: OmitOption,
): Dictionary

export function omit(obj: Dictionary, keys: Array<string | RegExp>, opt?: OmitOption): Dictionary {
  const fixedOption = {
    ...defaultCommonOption,
    ...opt,
  }

  const proxy = toModifier(obj, { ...fixedOption, pruneNil: true })

  for (const key of keys) {
    if (typeof key === 'string') {
      proxy.delete(key)
    }

    if (key instanceof RegExp) {
      for (const k of proxy.keys()) {
        if (key.test(k)) {
          proxy.delete(k)
        }
      }
    }
  }

  return toRaw(proxy)
}
