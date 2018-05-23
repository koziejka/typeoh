const { is } = require('../index.js')

class Car { }


class Vector extends Array {
  constructor() { super(3) }
}

test("is object", () => {
  expect(is.object({})).toBe(true)
  expect(is.object(Object.create(null))).toBe(true)
  expect(is.object(new Car)).toBe(true)
  expect(is.object([])).toBe(true)
  expect(is.object(Promise.resolve(1))).toBe(true)

  expect(is.object(1)).toBe(false)
  expect(is.object('1')).toBe(false)
  expect(is.object(() => { })).toBe(false)
  expect(is.object()).toBe(false)
  expect(is.object(null)).toBe(false)
  expect(is.object(false)).toBe(false)
})
test("is Object", () => {
  expect(is.Object({})).toBe(true)
  expect(is.Object(Object.create(null))).toBe(true)

  expect(is.Object(new Car)).toBe(false)
  expect(is.Object([])).toBe(false)
  expect(is.Object(Promise.resolve(1))).toBe(false)

  expect(is.Object(1)).toBe(false)
  expect(is.Object('1')).toBe(false)
  expect(is.Object(() => { })).toBe(false)
  expect(is.Object()).toBe(false)
  expect(is.Object(null)).toBe(false)
  expect(is.Object(false)).toBe(false)
})
test("is Array", () => {
  expect(is.Array([])).toBe(true)
  expect(is.Array(new Vector)).toBe(true)

  expect(is.Array(Object.create(null))).toBe(false)
  expect(is.Array(new Car)).toBe(false)
  expect(is.Array(Promise.resolve(1))).toBe(false)
  expect(is.Array({})).toBe(false)

  expect(is.Array(1)).toBe(false)
  expect(is.Array('1')).toBe(false)
  expect(is.Array(() => { })).toBe(false)
  expect(is.Array()).toBe(false)
  expect(is.Array(null)).toBe(false)
  expect(is.Array(false)).toBe(false)
})
test("is null", () => {
  expect(is.null([])).toBe(false)
  expect(is.null(new Vector)).toBe(false)

  expect(is.null(Object.create(null))).toBe(false)
  expect(is.null(new Car)).toBe(false)
  expect(is.null(Promise.resolve(1))).toBe(false)
  expect(is.null({})).toBe(false)

  expect(is.null(1)).toBe(false)
  expect(is.null('1')).toBe(false)
  expect(is.null(() => { })).toBe(false)
  expect(is.null()).toBe(false)
  expect(is.null(null)).toBe(true)
  expect(is.null(false)).toBe(false)
})
test("is undefined", () => {
  expect(is.undefined([])).toBe(false)
  expect(is.undefined(new Vector)).toBe(false)

  expect(is.undefined(Object.create(null))).toBe(false)
  expect(is.undefined(new Car)).toBe(false)
  expect(is.undefined(Promise.resolve(1))).toBe(false)
  expect(is.undefined({})).toBe(false)

  expect(is.undefined(1)).toBe(false)
  expect(is.undefined('1')).toBe(false)
  expect(is.undefined(() => { })).toBe(false)
  expect(is.undefined()).toBe(true)
  expect(is.undefined(null)).toBe(false)
  expect(is.undefined(false)).toBe(false)
})
test("is Promise", () => {
  expect(is.Promise([])).toBe(false)
  expect(is.Promise(new Vector)).toBe(false)

  expect(is.Promise(Object.create(null))).toBe(false)
  expect(is.Promise(new Car)).toBe(false)
  expect(is.Promise(Promise.resolve(1))).toBe(true)
  expect(is.Promise({})).toBe(false)

  expect(is.Promise(1)).toBe(false)
  expect(is.Promise('1')).toBe(false)
  expect(is.Promise(() => { })).toBe(false)
  expect(is.Promise()).toBe(false)
  expect(is.Promise(null)).toBe(false)
  expect(is.Promise(false)).toBe(false)
})
test("is string", () => {
  expect(is.string([])).toBe(false)
  expect(is.string(new Vector)).toBe(false)

  expect(is.string(Object.create(null))).toBe(false)
  expect(is.string(new Car)).toBe(false)
  expect(is.string(Promise.resolve(1))).toBe(false)
  expect(is.string({})).toBe(false)

  expect(is.string(1)).toBe(false)
  expect(is.string('1')).toBe(true)
  expect(is.string(() => { })).toBe(false)
  expect(is.string()).toBe(false)
  expect(is.string(null)).toBe(false)
  expect(is.string(false)).toBe(false)
})
test("is number", () => {
  expect(is.number([])).toBe(false)
  expect(is.number(new Vector)).toBe(false)

  expect(is.number(Object.create(null))).toBe(false)
  expect(is.number(new Car)).toBe(false)
  expect(is.number(Promise.resolve(1))).toBe(false)
  expect(is.number({})).toBe(false)

  expect(is.number(1)).toBe(true)
  expect(is.number('1')).toBe(false)
  expect(is.number(() => { })).toBe(false)
  expect(is.number()).toBe(false)
  expect(is.number(null)).toBe(false)
  expect(is.number(false)).toBe(false)
})
test("is boolean", () => {
  expect(is.boolean([])).toBe(false)
  expect(is.boolean(new Vector)).toBe(false)

  expect(is.boolean(Object.create(null))).toBe(false)
  expect(is.boolean(new Car)).toBe(false)
  expect(is.boolean(Promise.resolve(1))).toBe(false)
  expect(is.boolean({})).toBe(false)

  expect(is.boolean(1)).toBe(false)
  expect(is.boolean('1')).toBe(false)
  expect(is.boolean(() => { })).toBe(false)
  expect(is.boolean()).toBe(false)
  expect(is.boolean(null)).toBe(false)
  expect(is.boolean(false)).toBe(true)
})
test("is function", () => {
  expect(is.function([])).toBe(false)
  expect(is.function(new Vector)).toBe(false)

  expect(is.function(Object.create(null))).toBe(false)
  expect(is.function(new Car)).toBe(false)
  expect(is.function(Promise.resolve(1))).toBe(false)
  expect(is.function({})).toBe(false)

  expect(is.function(1)).toBe(false)
  expect(is.function('1')).toBe(false)
  expect(is.function(() => { })).toBe(true)
  expect(is.function(async() => { })).toBe(true)
  expect(is.function(function *() { })).toBe(true)
  expect(is.function()).toBe(false)
  expect(is.function(null)).toBe(false)
  expect(is.function(false)).toBe(false)
})
test("is Function", () => {
  expect(is.Function([])).toBe(false)
  expect(is.Function(new Vector)).toBe(false)

  expect(is.Function(Object.create(null))).toBe(false)
  expect(is.Function(new Car)).toBe(false)
  expect(is.Function(Promise.resolve(1))).toBe(false)
  expect(is.Function({})).toBe(false)

  expect(is.Function(1)).toBe(false)
  expect(is.Function('1')).toBe(false)
  expect(is.Function(() => { })).toBe(true)
  expect(is.Function(async() => { })).toBe(false)
  expect(is.Function(function *() { })).toBe(false)
  expect(is.Function()).toBe(false)
  expect(is.Function(null)).toBe(false)
  expect(is.Function(false)).toBe(false)
})


// is.AsyncFunction = (val) => val && val.constructor === AsyncConstructor
// is.GeneratorFunction = (val) => val && val.constructor === GeneratorConstructor
// is.AsyncGeneratorFunction = (val) => val && val.constructor === AsyncGeneratorConstructor

// is.Set = (val) => val instanceof Set
// is.WeakSet = (val) => val instanceof WeakSet
// is.Map = (val) => val instanceof Map
// is.WeakMap = (val) => val instanceof WeakMap
