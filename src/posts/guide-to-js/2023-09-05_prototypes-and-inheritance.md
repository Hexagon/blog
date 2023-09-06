---
title: "Prototypes and Inheritance in JavaScript"
part: 13
intro: "In this article, we'll explore the intriguing world of prototypes and inheritance in JavaScript. Dive into how objects relate to their prototypes, how inheritance works in JavaScript, and the role of the prototype chain."
---

Prototypes and inheritance are fundamental aspects of JavaScript that often
bewilder beginners. JavaScript uses prototypes for inheritance, which is
different from the class-based inheritance used in languages like Java and C++.
Here, we'll demystify these concepts.

## What is a Prototype?

In JavaScript, a prototype is an object from which other objects inherit
properties. Every object in JavaScript has a prototype except the base object,
which has its prototype set to null.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
```

### Accessing an Object's Prototype

You can access an object's prototype using the `Object.getPrototypeOf()` method
or the `__proto__` property, although the latter is generally not recommended
for production code.

```javascript
const john = new Person("John", 30);
console.log(Object.getPrototypeOf(john)); // Output: Person { ... }
```

## The Prototype Chain

When you attempt to access a property or method on an object, JavaScript will
first look on the object itself. If it can't find it there, it will look on the
object's prototype, and so on up the prototype chain.

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.makeSound = function () {
  console.log(this.name + " makes a sound");
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

### Prototype Chain in Action

Let's see the prototype chain in action with a practical example.

```javascript
const myDog = new Dog("Rex");
myDog.makeSound(); // Output: "Rex makes a sound"
```

## Inheritance Patterns in JavaScript

JavaScript offers multiple ways to implement inheritance:

1. **Prototypal Inheritance**: As discussed, this is the most native form of
   inheritance in JavaScript.
2. **Classical Inheritance using ES6 Classes**: ES6 introduced the `class`
   syntax, which is syntactical sugar over prototypal inheritance.

```javascript
class Cat extends Animal {
  constructor(name) {
    super(name);
  }

  meow() {
    console.log(this.name + " says meow");
  }
}
```

## Conclusion

Understanding prototypes and inheritance is essential for any advanced work in
JavaScript. They allow for a flexible and powerful object-oriented programming
paradigm that, while different from class-based languages, offers its own set of
advantages.
