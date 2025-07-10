
import {
	parseFunctionsTypescript,
	parseFunctionTypescript,
} from './ts'

const code = `
/**
 * Suma dos números
 * @param a {number} primer número
 * @param b {number} segundo número
 * @returns {number} resultado de la suma
 */
export function add(a: number, b: number = 2): number {
  return a + b;
}
export const object = { a: 1, b: 2  }

export const fn = async (opts?: { a: number, b: number }) => {}

/**
 * Default function
 */
export default () => {}

`

console.dir( await parseFunctionsTypescript( code ), { depth: null } )
console.dir( await parseFunctionTypescript( code, 'add' ), { depth: null } )

