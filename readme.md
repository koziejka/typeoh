# Install

Install with [npm](https://www.npmjs.com/):
```
$ npm install --save typeoh
```

# Usage

## Check if object is of type 'a
```javascript
const { is } = require('typeoh')

const isString = is.string

isString('foo')    //? true


is.object(new Car) //? true (is of type object)
is.Object(new Car) //? false (is constructed using Object)
is.Object({}) //? true
is.object({}) //? true

is.function(async () => {})           //? true
is.Function(async () => {})           //? false
is.AsyncFunction(async () => {})      //? true
is.GeneratorFunction(function* () {}) //? true

```

### Naming convention:   
* primitive types - lowercase  
  - `boolean`
  - `number`
  - `string`
  - `null`
  - `undefined`
* other types - PascalCase

### Exceptions from the rule:
* `is.object` check if value is any kind of object
* `is.function` check if value is any kind of function


## Create custom is check
```javascript
const isCar = is(Car)         // compares constructors 
const isCar = is('Car')       // compares type symbols
const isCar = is(type('Car')) // compares type symbols
```

## Create custom "Type" - beta

`createType([compiled type name], ["constructor" function], ...[type extensions])`

### Constructors
```javascript
const { createType } = require('typeoh')

const Vector = createType('Vector', (state, x, y) => {
  state.x = x
  state.y = y
})

// allows for 2 types of call
Vector(1, 2)     //? Vector { x: 1, y: 2 }
new Vector(1, 2) //? Vector { x: 1, y: 2 }
```

### Async constructors
```javascript
const { createType } = require('typeoh')

const User = createType('User', async (state, u_name, foo) => {
  const { name, age } =await fetch('userdata', { u_name, foo })
  state.age = age
  state.name = name
})

User('fosa', [1,2])     //? then User { age: 10, name: 'John' }
new User('fosa', [1,2]) //? then User { age: 10, name: 'John' }

```


### Type extensions
```javascript
const { createType } = require('typeoh')

const Vector = createType('Vector', (state, x, y) => {
  state.x = x
  state.y = y
}, function length({ x, y }) { // first argument will always be state
  return Math.sqrt(x*x + y*y)
}, { 
  add(state, { x = 0, y = 0 }) {
    state.x += x
    state.y += y
    return state
  }
})

Vector(3, 4).length()       //? 5
Vector.length(Vector(3, 4)) //? 5

[Vector(1, 2), Vector(2, 3), Vector(3, 4), Vector(4, 5)]
  .map(Vector.length) //? [2.23606797749979, 3.605551275463989, 5, 6.4031242374328485]

[Vector(1, 2), Vector(2, 3), Vector(3, 4), Vector(4, 5)]
  .reduce(Vector.add) //? Vector { x: 10, y: 14 }

```


```javascript
const { createType } = require('typeoh')

class Entity {
  draw() { ... }
  update() { ... }
}

const Player = createType('Player', (state) => { ... }, Entity)

Player.draw(new Player)
Player.update(Player())

```

### Future:  
* automatic class conversion: `createType(Car)`
* asign properties and values 
```javascript
const Vector = createType('Vector', () => {}, { 
  get length({ x, y }) { }
  set length({ x, y }) { }
})

const vec = Vector(3, 4)
vec.length                  //? 5
vec.length = 1              //? 1
vec                         //? Vector { x: 0.6, y: 0.8 }
Vector.length(Vector(3, 4)) //? 5

[Vector(1, 2), Vector(2, 3), Vector(3, 4), Vector(4, 5)]
  .map(Vector.length) //? [2.23606797749979, 3.605551275463989, 5, 6.4031242374328485]
```


## Get type Name
```javascript
const { typeName } = require('typeoh')
typeName('string')              //? 'string'
typeName(undefined)             //? 'undefined'
typeName(null)                  //? 'null'

typeName(new Car)               //? 'Car'
typeName(() => {}))             //? 'Function'
typeName(async () => {}))       //? 'AsyncFunction'
typeName(function*() {}))       //? 'GeneratorFunction'
typeName(async function*() {})) //? 'AsyncGeneratorFunction'
```

## Get type Symbol
```javascript
const typeoh = require('typeoh')
typeoh('string')              //? Symbol(string)
typeoh(undefined)             //? Symbol(undefined)
typeoh(null)                  //? Symbol(null)

typeoh(new Car)               //? Symbol(Car)
typeoh(() => {}))             //? Symbol(Function)
typeoh(async () => {}))       //? Symbol(AsyncFunction)
typeoh(function*() {}))       //? Symbol(GeneratorFunction)
typeoh(async function*() {})) //? Symbol(AsyncGeneratorFunction)
```

## Get type Symbol from name 
```javascript
const { type } = require('typeoh')
type('string') //? Symbol(string)
type('Car')    //? Symbol(Car)
```

## Raw type Symbols comparison
```javascript
const { type } = typeoh = require('typeoh')

typeoh('foo') === type('string') //? true
typeoh(1) === type('number')     //? true

typeoh(new Car) === type('Car')  //? true
```