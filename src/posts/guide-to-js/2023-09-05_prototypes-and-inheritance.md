---
title: "Prototypes and Inheritance in JavaScript"
title_short: "Prototypes and Inheritance"
part: 13
intro: "In this article, we'll delve into prototypes and inheritance in JavaScript, explaining how they provide a powerful way to create and manage objects. We'll also compare them with other forms of inheritance, particularly the class-based approach seen in languages like Java and C++."
---

## Introduction

Prototypes and inheritance are fundamental aspects of JavaScript that often
perplex beginners. Unlike languages like Java and C++, which use class-based
inheritance, JavaScript relies on prototypes. This article aims to demystify
these concepts.

## Prototype, Function, and Object: What's the Difference?

Before diving into prototypes, it's essential to distinguish between three key
terms: prototype, function, and object.

- **Prototype**: A prototype is essentially a "parent" object that other objects
  can inherit properties and methods from.
- **Function**: Functions in JavaScript can be constructors. They can create
  objects and also have properties, including their own "prototype."
- **Object**: Objects are instances of functions created using the `new`
  keyword. They can have their own properties and methods, and they also inherit
  from their function's "prototype."

### What is a prototype?

A prototype is an object from which other objects inherit properties. Every
object in JavaScript has a prototype, except the base object, which has its
prototype set to null.

```javascript
// Function: A constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Object: An instance of the Person function
const alice = new Person("Alice", 30);

// Prototype: The "parent" object for all Person objects
console.log(Person.prototype);
```

### Accessing an Object's Prototype

You can access an object's prototype in two ways: using the
`Object.getPrototypeOf()` method or the `__proto__` property.

```javascript
const john = new Person("John", 30);
console.log(Object.getPrototypeOf(john)); // Output: Person { ... }
```

## Prototypes and Memory Efficiency

The `prototype` property allows you to add new methods to object constructors.
These methods will be shared among all instances of the constructor, making your
code more memory-efficient and easier to manage.

```javascript
// Adding a member directly to an object instance
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    console.log("Hello, my name is " + this.name);
  };
}

// Adding a member to the object's prototype
Person.prototype.sayGoodbye = function () {
  console.log("Goodbye, " + this.name);
};
```

### Prototype Members vs. Instance Members

In JavaScript, you can add members (properties or methods) to an object in two
primary ways: by adding them directly to each object instance or by adding them
to the object's prototype.

```javascript
// Adding a member directly to an object instance
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    console.log("Hello, my name is " + this.name);
  };
}

// Adding a member to the object's prototype
Person.prototype.sayGoodbye = function () {
  console.log("Goodbye, " + this.name);
};
```

## The Prototype Chain

The prototype chain is a series of linked prototypes. When you try to access a
property or method on an object, JavaScript first looks for it on the object
itself. If it doesn't find it there, it checks the object's prototype, and so on
up the prototype chain.

### Prototype Chain in Action

Here, we'll look at a practical example that demonstrates the prototype chain.

## Inheritance in JavaScript

Inheritance allows objects to inherit properties and methods from other objects.
This is a fundamental concept in object-oriented programming.

```javascript
function Employee(name, age, position) {
  Person.call(this, name, age);
  this.position = position;
}

Employee.prototype = Object.create(Person.prototype);

let charlie = new Employee("Charlie", 50, "Manager");
charlie.greet(); // Output: "Hello, my name is Charlie"
```

### Inheritance Patterns in JavaScript

JavaScript offers multiple ways to implement inheritance, including prototypal
inheritance and ES6 classes.

## Related Articles

For a more comprehensive understanding, you may refer to other related articles
such as:

- [Working with Objects in JavaScript](#)
- [ES6 Features in JavaScript](#)

## Further Reading

If you wish to dive deeper into the topics of prototypes and inheritance,
consider the following resources:

- [JavaScript: The Good Parts by Douglas Crockford](#)
- [Eloquent JavaScript by Marijn Haverbeke](#)

## Conclusion

Understanding prototypes and inheritance is crucial for anyone looking to do
advanced work in JavaScript. They allow for a flexible and powerful
object-oriented programming paradigm that offers its own set of advantages. By
mastering these concepts, you'll be well-equipped to write cleaner, more
efficient, and more maintainable JavaScript code.
