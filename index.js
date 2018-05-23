const typeohSymbol = Symbol.for('typeoh')

//#region Type Symbols
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
const T_Function = Symbol.for('Function')
const T_AsyncFunction = Symbol.for('AsyncFunction')
const T_GeneratorFunction = Symbol.for('GeneratorFunction')
const T_AsyncGenerator = Symbol.for('AsyncGeneratorFunction')
const T_Type = Symbol.for('Type')
//#endregion

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

is.undefined = (val) => val === void 0
is.null = (val) => val === null
is.string = (val) => typeof val === 'string'
is.number = (val) => typeof val === 'number'
is.boolean = (val) => typeof val === 'boolean'
is.function = (val) => typeof val === 'function'
is.object = (val) => typeof val === 'object' && val !== null

is.Function = (val) => Boolean(val) && val.constructor === Function
is.AsyncFunction = (val) => Boolean(val) && val.constructor === AsyncConstructor
is.GeneratorFunction = (val) => Boolean(val) && val.constructor === GeneratorConstructor
is.AsyncGeneratorFunction = (val) => Boolean(val) && val.constructor === AsyncGeneratorConstructor
// todo improve native function check 
is.NativeFunction = val => Boolean(val) && `${val}`.length - 29 === val.name.length

is.Array = Array.isArray
is.Object = (val) => typeoh(val) === T_Object
is.Set = (val) => val instanceof Set
is.WeakSet = (val) => val instanceof WeakSet
is.Map = (val) => val instanceof Map
is.WeakMap = (val) => val instanceof WeakMap
is.Promise = (val) => val instanceof Promise

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

const addProtoFunction = (target, name, fn) =>
  target[name] = Function('fn', `return function ${name}(...args) { return fn(this,...args)}`)(fn)

const addTypeFunction = (target, name, fn) => {
  fn = Function('fn', `return function ${name}(target, ...args) { return fn.call(target, target, ...args)}`)(fn)
  if (['length', 'call', 'bind', 'apply'].indexOf(name) !== -1)
    Object.defineProperty(target, name, { get() { return fn } })
  else target[name] = fn
}

// todo: add { get prop() {}, set prop() {}}
const createType = (name, constructor, ...extensions) => {
  let createInstance
  if (typeof name !== 'string') {
    createInstance = createTypeFromClass(name)
    extensions = [constructor, ...extensions]
  }
  else if (is.Function(constructor)) createInstance = createTypeFromFunction(name, constructor)
  else if (is.AsyncFunction(constructor)) createInstance = createTypeFromAsyncFunction(name, constructor)

  const T = createInstance[TypeBaseSymbol]
  const proto = T.prototype

  for (const ext of extensions) {
    if (is.function(ext)) {
      addProtoFunction(proto, ext.name, ext)
      addTypeFunction(createInstance, ext.name, ext)
    }
    else if (is.Object(ext)) {
      // todo
    }
  }

  return createInstance
}
const createTypeFromAsyncFunction = (name, fn) => {
  const T = Function(`return function ${name}() {}`)()

  async function createInstance(...args) {
    const t = new T
    await fn(t, ...args)
    return t
  }

  createInstance[isTypeSymbol] = true
  createInstance[TypeBaseSymbol] = T
  return createInstance
}

const createTypeFromFunction = (name, fn) => {
  const T = Function(`return function ${name}() {}`)()

  function createInstance(...args) {
    const t = new T
    fn(t, ...args)
    return t
  }

  createInstance[isTypeSymbol] = true
  createInstance[TypeBaseSymbol] = T
  return createInstance
}

const createTypeFromClass = (T) => {
  const proto = T.prototype
  const proto_keys = Object.getOwnPropertyNames(proto)

  proto_keys.splice(proto_keys.indexOf('constructor'), 1)

  function createInstance(...args) { return new T(...args) }

  for (const key of proto_keys) {
    const desc = Object.getOwnPropertyDescriptor(proto, key)
    if (desc.get) createInstance[`get_${key}`] = Function(`return function ${key} (target, arg) { return target['${key}'] }`)()
    if (desc.set) createInstance[`set_${key}`] = Function('fun', `return function ${key} (target, arg) { return target['${key}'] = arg }`)(proto[key])
    if (desc.value) createInstance[key] = Function('fun', `return function ${key} (target, ...args) { return fun.call(target, ...args) }`)(proto[key])
  }

  createInstance[isTypeSymbol] = true
  createInstance[TypeBaseSymbol] = T
  return createInstance
}

module.exports = Object.assign(typeoh, { is, type, typeName: name, createType })