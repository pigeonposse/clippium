// src/index.ts
import { ParserArgv } from './core'

console.log( '--- Ejemplos de uso del Parser ---' )

// Ejemplo 1: Argumentos simples
console.log( '\n--- Ejemplo 1: Argumentos simples ---' )
const args1   = [
	'--name=Alice',
	'-v',
	'command1',
	'file.txt',
]
const parser1 = new ParserArgv( args1 )
const parsed1 = parser1.run()
console.log( 'Input:', args1 )
console.log( 'Parsed:', parsed1 )
/*
Output:
{
  _: [ 'command1', 'file.txt' ],
  name: 'Alice',
  v: true
}
*/

// Ejemplo 2: Argumentos con valores espaciados
console.log( '\n--- Ejemplo 2: Argumentos con valores espaciados ---' )
const args2   = [
	'--host',
	'localhost',
	'-p',
	'8080',
	'--debug',
]
const parser2 = new ParserArgv( args2 )
const parsed2 = parser2.run()
console.log( 'Input:', args2 )
console.log( 'Parsed:', parsed2 )
/*
Output:
{
  _: [],
  host: 'localhost',
  p: '8080',
  debug: true
}
*/

// Ejemplo 3: Argumentos combinados de guion simple
console.log( '\n--- Ejemplo 3: Argumentos combinados ---' )
const args3   = [ '-abc', 'pos_arg' ]
const parser3 = new ParserArgv( args3 )
const parsed3 = parser3.run()
console.log( 'Input:', args3 )
console.log( 'Parsed:', parsed3 )
/*
Output:
{
  _: [ 'pos_arg' ],
  a: true,
  b: true,
  c: true
}
*/

// Ejemplo 4: Simulación de process.argv (para ejecutar desde la terminal)
console.log( '\n--- Ejemplo 4: Usando process.argv.slice(2) ---' )
// Para probar este ejemplo, comenta los anteriores y ejecuta en tu terminal:
// npm start -- command --user=John --force -xyz file1 file2
const realArgv = process.argv.slice( 2 ) // Elimina 'node' y el nombre del script
if ( realArgv.length > 0 ) {

	const parserReal = new ParserArgv( realArgv )
	const parsedReal = parserReal.run()
	console.log( 'Input (from process.argv):', realArgv )
	console.log( 'Parsed (from process.argv):', parsedReal )

}
else {

	console.log( 'No argumentos pasados en process.argv. Ejecuta: npm start -- <your args>' )

}

console.log( '\n--- Fin de ejemplos ---' )
