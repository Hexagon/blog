---
title: "Prototypes and Inheritance in JavaScript"
title_short: "Prototypes and Inheritance"
part: 13
updated: "2026-11-26T12:00:00Z"
intro: "In this article, we'll delve into prototypes and inheritance in JavaScript, explaining how they provide a powerful way to create and manage objects. We'll also compare them with other forms of inheritance, particularly the class-based approach seen in languages like Java and C++."
---

## Introduction

Prototypes and inheritance are fundamental aspects of JavaScript that often
perplex beginners. Unlike languages like Java and C++, which use class-based
inheritance, JavaScript relies on prototypes. Even the `class` keyword, which
we'll get to at the end, is built on top of prototypes. This article aims to
demystify these concepts.

## Prototype, Function, and Object: What's the Difference?

Before diving into prototypes, it's essential to distinguish between three key
terms: prototype, function, and object.

- **Prototype**: A prototype is essentially a "parent" object that other objects
  can inherit properties and methods from.
- **Function**: Functions in JavaScript can be used as constructors, called with
  the `new` keyword. Every regular function has a `prototype` property, which
  becomes the prototype of the objects it constructs.
- **Object**: Objects can be created in many ways, for example with an object
  literal (`{}`) or with `new` and a constructor function. They have their own
  properties and methods, and they also inherit from their prototype.

### What is a prototype?

A prototype is an object from which other objects inherit properties. Almost
every object in JavaScript has a prototype. At the end of every chain sits
`Object.prototype`, whose own prototype is `null`.

```javascript
// Function: A constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Object: An instance created by the Person function
const alice = new Person("Alice", 30);

// Prototype: The "parent" object for all Person objects
console.log(Object.getPrototypeOf(alice) === Person.prototype); // Output: true
```

### Accessing an Object's Prototype

The recommended way to get an object's prototype is `Object.getPrototypeOf()`.
You'll also see the older `__proto__` property in code around the web. It still
works in browsers, but it's deprecated, so avoid it in new code.

```javascript
const john = new Person("John", 30);
console.log(Object.getPrototypeOf(john)); // Output: {} (Person.prototype)
```

## Prototype Members vs. Instance Members

You can add members (properties or methods) to objects in two primary ways: by
adding them directly to each object instance, or by adding them to the
prototype.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  // Instance member: every Person gets its own copy of this function
  this.greet = function () {
    console.log("Hello, my name is " + this.name);
  };
}

// Prototype member: one function, shared by all Person objects
Person.prototype.sayGoodbye = function () {
  console.log("Goodbye from " + this.name);
};

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 40);

console.log(alice.greet === bob.greet); // Output: false, two separate functions
console.log(alice.sayGoodbye === bob.sayGoodbye); // Output: true, the same function
```

If you create thousands of objects, prototype members save a lot of memory, as
the method only exists once. They are also easier to change, as updating the
prototype updates every object at once.

## The Prototype Chain

The prototype chain is a series of linked prototypes. When you try to access a
property or method on an object, JavaScript first looks for it on the object
itself. If it doesn't find it there, it checks the object's prototype, then the
prototype's prototype, and so on, until it reaches `null`.

### Prototype Chain in Action

```javascript
const alice = new Person("Alice", 30);

// 'name' is found directly on alice
console.log(alice.name); // Output: "Alice"

// 'sayGoodbye' is not on alice, but on Person.prototype
alice.sayGoodbye(); // Output: "Goodbye from Alice"

// 'toString' is not on alice or Person.prototype, but on Object.prototype
console.log(alice.toString()); // Output: "[object Object]"

// 'fly' is nowhere in the chain
console.log(alice.fly); // Output: undefined

console.log(alice.hasOwnProperty("name")); // Output: true
console.log(alice.hasOwnProperty("sayGoodbye")); // Output: false
```

## Inheritance in JavaScript

Inheritance allows objects to inherit properties and methods from other objects.
With constructor functions, you link the prototypes yourself:

```javascript
function Employee(name, age, position) {
  // Run the Person constructor on this object
  Person.call(this, name, age);
  this.position = position;
}

// Make Employee.prototype inherit from Person.prototype
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

Employee.prototype.describe = function () {
  console.log(this.name + " works as " + this.position);
};

const charlie = new Employee("Charlie", 50, "Manager");
charlie.greet(); // Output: "Hello, my name is Charlie"
charlie.sayGoodbye(); // Output: "Goodbye from Charlie", found on Person.prototype
charlie.describe(); // Output: "Charlie works as Manager"
console.log(charlie instanceof Person); // Output: true
```

The chain for `charlie` is now: `charlie` → `Employee.prototype` →
`Person.prototype` → `Object.prototype` → `null`.

### ES6 Classes

ES6 introduced the `class` keyword, which gives you the same thing with a much
cleaner syntax. This will look familiar if you come from Java or C++, but under
the hood, it's still prototypes.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Methods in a class body end up on Person.prototype
  sayGoodbye() {
    console.log("Goodbye from " + this.name);
  }
}

class Employee extends Person {
  constructor(name, age, position) {
    super(name, age); // Calls the Person constructor
    this.position = position;
  }

  describe() {
    console.log(this.name + " works as " + this.position);
  }
}

const charlie = new Employee("Charlie", 50, "Manager");
charlie.sayGoodbye(); // Output: "Goodbye from Charlie"
charlie.describe(); // Output: "Charlie works as Manager"
```

For new code, classes are usually the better choice. Knowing how prototypes work
is still valuable, as it explains what classes actually do, and you'll find
constructor functions in lots of existing code.

## Related Articles

For a more comprehensive understanding, you may refer to other related articles
such as:

- [Working with Objects in JavaScript](/posts/guide-to-js/objects-in-javascript/)
- [The Evolution of JavaScript and Why It Matters](/posts/guide-to-js/evolution-of-javascript/)

## Further Reading

If you wish to dive deeper into the topics of prototypes and inheritance,
consider the following resources:

- [Inheritance and the prototype chain, on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [Eloquent JavaScript by Marijn Haverbeke](https://eloquentjavascript.net/), free to read online

## Conclusion

Understanding prototypes and inheritance is crucial for anyone looking to do
advanced work in JavaScript. They allow for a flexible and powerful
object-oriented programming paradigm that offers its own set of advantages. By
mastering these concepts, you'll be well-equipped to write cleaner, more
efficient, and more maintainable JavaScript code.
