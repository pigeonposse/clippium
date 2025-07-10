import { parseFunctionJavascript } from './js'

const code = `
/**
 * Suma dos números
 * @param a {number} primer número
 * @param b {number} segundo número
 * @returns {number} resultado de la suma
 */
export function add(a, b) {
  return a + b;
}

/**
 * Función por defecto
 */
export default () => {}
`

console.dir( await parseFunctionJavascript( code, 'add' ), { depth: null } )
