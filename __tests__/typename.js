const { typeName } = require('../index.js')

class Car { }
class Vector extends Array {
  constructor() { super(3) }
}
test("null", () => {
  expect(typeName(null)).toBe('null')
})
test("undefined", () => {
  expect(typeName(undefined)).toBe('undefined')
})
test("Object", () => {
  expect(typeName({})).toBe('Object')
})
test("Car", () => {
  expect(typeName(new Car)).toBe('Car')
})
test("Vector", () => {
  expect(typeName(new Vector)).toBe('Vector')
})
test("Array", () => {
  expect(typeName([])).toBe('Array')
})
test("Function", () => {
  expect(typeName(function(){})).toBe('Function')
})
test("AsyncFunction", () => {
  expect(typeName(async function(){})).toBe('AsyncFunction')
})
test("GeneratorFunction", () => {
  expect(typeName(function*(){})).toBe('GeneratorFunction')
})