const typeohSymbol = Symbol.for('typeoh')

const T_undefined = Symbol.for('undefined')
const T_null = Symbol.for('null')
const T_boolean = Symbol.for('boolean')
const T_string = Symbol.for('string')
const T_number = Symbol.for('number')
const T_Symbol = Symbol.for('Symbol')
const T_Array = Symbol.for('Array')
const T_Date = Symbol.for('Date')
const T_RegExp = Symbol.for('RegExp')
const T_Object = Symbol.for('Object')
const T_Arguments = Symbol.for('arguments')
const T_Function = Symbol.for('Function')
const T_AsyncFunction = Symbol.for('AsyncFunction')
const T_GeneratorFunction = Symbol.for('GeneratorFunction')
const T_AsyncGenerator = Symbol.for('AsyncGeneratorFunction')
const T_Type = Symbol.for('Type')

const isArray = Array.isArray

let AsyncGeneratorConstructor

try { AsyncGeneratorConstructor = Function('return (async function* () { }).constructor')() }
catch (error) { AsyncGeneratorConstructor = Symbol('AsyncGeneratorConstructor') }

const GeneratorConstructor = (function* () { }).constructor
const AsyncConstructor = (async function () { }).constructor

Function[typeohSymbol] = T_Function
AsyncConstructor[typeohSymbol] = T_AsyncFunction
GeneratorConstructor[typeohSymbol] = T_GeneratorFunction
AsyncGeneratorConstructor[typeohSymbol] = T_AsyncGenerator

const isTypeSymbol = Symbol('isType')
const TypeBaseSymbol = Symbol('TypeBaseSymbol')

/** Creates type symbol.
 * @param {*} val 
 * @returns {Symbol}
 */
const typeoh = (val) => {
  if (val === void 0) return T_undefined
  if (val === null) return T_null

  switch (typeof val) {
    case 'boolean': return T_boolean
    case 'string': return T_string
    case 'number': return T_number
    case 'symbol': return T_Symbol
    case 'function':
      if (val[isTypeSymbol]) return T_Type
      return val.constructor[typeohSymbol]
  }

  if (isArray(val) && val.constructor === Array) return T_Array
  if (val instanceof Date) return T_Date
  if (val instanceof RegExp) return T_RegExp

  var constructor = val.constructor
  if (constructor === void 0) return T_Object

  if (typeohSymbol in constructor) return constructor[typeohSymbol]
  else return constructor[typeohSymbol] = Symbol.for(constructor.name)
}

const handler = { construct() { return handler } }
const isConstructor = x => {
  try { return !!(new (new Proxy(x, handler))()) }
  catch (e) { return false }
}

/** Creates highly optimized function for type checking.
 * @param {String|Function|Symbol} val1 Type name, constructor function or type symbol.
 * @returns {(val)=>Boolean}
 */
const is = (val1) => {
  if (isConstructor(val1)) {
    if (val1[isTypeSymbol]) val1 = val1[TypeBaseSymbol]
    return (val) => val instanceof val1
  }
  if (typeof val1 === 'string') {
    const symbol = Symbol.for(val1)
    return (val) => typeoh(val) === symbol
  }
  if (typeof val1 === 'symbol') return (val) => typeoh(val) === val1
  throw new Error('Expected type name, symbol or constructor function')
}

/** Creates Symbol for specified type name or constructor function.
 * @param {String|Function} type Type name or constructor function.
 * @returns {Symbol} 
 */
const type = type => {
  if (typeof type === 'string') return Symbol.for(type)
  if (isConstructor(type)) return Symbol.for(type.name)
  throw new Error('Expected type name or constructor function')
}

const name = val => {
  if (val === void 0) return 'undefined'
  if (val === null) return 'null'

  switch (typeof val) {
    case 'boolean': return 'boolean'
    case 'string': return 'string'
    case 'number': return 'number'
    case 'symbol': return 'Symbol'
    case 'function':
      if (val[isTypeSymbol]) return 'Type'
      if (val instanceof GeneratorConstructor) return 'GeneratorFunction'
      if (val instanceof AsyncConstructor) return 'AsyncFunction'
      if (val instanceof AsyncGeneratorConstructor) return 'AsyncGeneratorFunction'
      return 'Function'
  }

  if (isArray(val) && val.constructor === Array) return 'Array'
  if (val instanceof Date) return 'Date'
  if (val instanceof RegExp) return 'RegExp'

  var constructor = val.constructor
  if (constructor === void 0) return 'Object'

  return constructor.name
}

const isFunction = (val) => val && val.constructor === Function
const isAsyncFunction = (val) => val && val.constructor === AsyncConstructor
const isObject = (val) => typeof val === 'object'

// todo: add createType(class)
// todo: add { get prop() {}, set prop() {}}
const createType = (name, constructor, ...types) => {

  const T = Function(`return function ${name}() {}`)()

  const proto = T.prototype
  const createPrototypeFunction = (name, fun) =>
    Function('fun', `return function ${name} (...args) { return fun(this, ...args) }`)(fun)

  const createPrototypeFunctionClass = (name, fun) =>
    Function('fun', `return function ${name} (...args) { return fun.call(this, this, ...args) }`)(fun)

  const isReserved = (name) => ['length', 'arguments', 'caller', 'name'].some(x => name === x)
  if (isAsyncFunction(constructor)) {
    function createInstance(...args) {
      const t = new T()
      return constructor(t, ...args).then(() => t)
    }
  }
  if (isFunction(constructor)) {
    function createInstance(...args) {
      const t = new T()
      constructor(t, ...args)
      return t
    }
  }

  for (const type of types) {
    if (isConstructor(type) && Object.getOwnPropertyNames(type.prototype).length > 1) {
      const protokeys = Object.getOwnPropertyNames(type.prototype)
      protokeys.shift()
      for (const name of protokeys) {
        if (isReserved(name)) Object.defineProperty(createInstance, name, {
          get() {
            return (that, ...args) => type.prototype[name].call(that, ...args)
          }
        })
        else createInstance[name] = type.prototype[name]
        proto[name] = createPrototypeFunctionClass(name, type.prototype[name])
      }
    }
    else if (isFunction(type)) {
      if (!type.name) throw new Error('Expected function with name.')
      if (isReserved(type.name)) Object.defineProperty(createInstance, type.name, { get() { return type } })
      else createInstance[type.name] = type
      proto[type.name] = createPrototypeFunction(type.name, type)
    }
    else if (isObject(type)) {
      for (const name in type) {
        if (isReserved(name)) Object.defineProperty(createInstance, name, { get() { return type[name] } })
        else createInstance[name] = type[name]
        proto[name] = createPrototypeFunction(name, type[name])//?
      }
    }

  }

  createInstance[isTypeSymbol] = true
  createInstance[TypeBaseSymbol] = T
  return createInstance
}

is.undefined = (val) => val === void 0
is.null = (val) => val === null
is.string = (val) => typeof val === 'string'
is.number = (val) => typeof val === 'number'
is.boolean = (val) => typeof val === 'boolean'
is.function = (val) => typeof val === 'function'
is.Function = (val) => Boolean(val) && val.constructor === Function
is.AsyncFunction = (val) => Boolean(val) && val.constructor === AsyncConstructor
is.GeneratorFunction = (val) => Boolean(val) && val.constructor === GeneratorConstructor
is.AsyncGeneratorFunction = (val) => Boolean(val) && val.constructor === AsyncGeneratorConstructor
is.Array = Array.isArray
is.object = (val) => typeof val === 'object' && val !== null
is.Object = (val) => typeoh(val) === T_Object
is.Set = (val) => val instanceof Set
is.WeakSet = (val) => val instanceof WeakSet
is.Map = (val) => val instanceof Map
is.WeakMap = (val) => val instanceof WeakMap
is.Promise = (val) => val instanceof Promise

module.exports = Object.assign(typeoh, { is, type, typeName: name, createType })

