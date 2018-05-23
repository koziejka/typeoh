const typeoh = require('../index.js')
const { createType, typeName, type } = typeoh

test('create type', () => {
  const T = createType('Name', function (state) {
    state.foo = ['test']
    return state
  })
  expect(new T()).toMatchObject({ foo: ['test'] })
})

test('create type from class', () => {
  const T = createType(class Test {
    constructor() { this.foo = ['bar'] }
    get baz() { return 'test' }
  })
  expect(new T()).toMatchObject({ foo: ['bar'] })
  expect(T.get_baz(new T)).toBe('test')
})

test('type detection', () => {
  const T = createType('Name', function (state) {
    state.foo = ['test']
    return state
  })

  expect(typeoh(T)).toBe(type('Type'))
  expect(typeName(T)).toBe('Type')
  expect(typeoh(new T)).toBe(type('Name'))
  expect(typeName(new T)).toBe('Name')
})

test('extend with function', () => {
  const T = createType(class Vector {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }, function length({ x, y }) {
    return Math.sqrt(x * x + y * y)
  })

  expect(new T(3, 4).length()).toBe(5)
  expect(T.length(new T(3, 4))).toBe(5)
})