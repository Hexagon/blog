---
title: "Design Patterns in JavaScript"
title_short: "Design Patterns"
part: 14
intro: "In this article, we'll explore common design patterns in JavaScript and how they can help you write clean, maintainable, and efficient code."
---

## Introduction

Design patterns are proven solutions to common programming challenges. They
offer a structured and reusable way to write code, making it easier to read and
maintain. In JavaScript, design patterns help you manage complexity and improve
the architecture of your applications.

## Common Types of Design Patterns

There are three main types of design patterns: Creational, Structural, and
Behavioral.

### Creational Patterns

Creational patterns focus on object creation. They abstract the instantiation
process, making it more flexible and independent of the system architecture.

1. **Singleton Pattern**
2. **Factory Method Pattern**
3. **Abstract Factory Pattern**
4. **Builder Pattern**
5. **Prototype Pattern**

### Structural Patterns

Structural patterns are about organizing different classes or objects to form
larger structures.

1. **Adapter Pattern**
2. **Bridge Pattern**
3. **Composite Pattern**
4. **Decorator Pattern**
5. **Facade Pattern**
6. **Flyweight Pattern**
7. **Proxy Pattern**

### Behavioral Patterns

Behavioral patterns focus on the responsibilities and communication between
objects.

1. **Observer Pattern**
2. **Mediator Pattern**
3. **Command Pattern**
4. **State Pattern**
5. **Strategy Pattern**
6. **Chain of Responsibility**
7. **Visitor Pattern**

## Popular JavaScript Design Patterns

While the above patterns are common in many languages, JavaScript has its own
set of frequently used design patterns.

### Module Pattern

The Module pattern encapsulates 'privacy', state, and organization using
closures.

```javascript
const myModule = (function () {
  const privateVar = "I am private";

  function privateMethod() {
    console.log(privateVar);
  }

  return {
    publicMethod: function () {
      privateMethod();
    },
  };
})();

myModule.publicMethod(); // Outputs "I am private"
```

### Revealing Module Pattern

A variant of the Module Pattern, the Revealing Module Pattern, exposes only the
properties and methods you want to make public.

```javascript
const revealingModule = (function () {
  const privateVar = "I am private";

  function privateMethod() {
    console.log(privateVar);
  }

  function publicMethod() {
    privateMethod();
  }

  return {
    publicMethod: publicMethod,
  };
})();

revealingModule.publicMethod(); // Outputs "I am private"
```

### Singleton Pattern

Ensures a class has only one instance and provides a global point to access it.

```javascript
const Singleton = (function () {
  let instance;

  function createInstance() {
    return {
      name: "I am an instance",
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // Outputs true
```

### Observer Pattern

Defines a one-to-many relationship between objects so that when one object
changes its state, all its dependents are notified.

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyAll(message) {
    this.observers.forEach((observer) => observer.notify(message));
  }
}

class Observer {
  notify(message) {
    console.log(`Observer received message: ${message}`);
  }
}

const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notifyAll("Hello!"); // Outputs "Observer received message: Hello!" twice
```

## Anti-Patterns to Avoid

Just as there are good design patterns, there are also anti-patterns that you
should avoid.

1. **God Object**: An object that knows too much or does too much.
2. **Spaghetti Code**: Unorganized and hard-to-read code.
3. **Callback Hell**: Deeply nested callbacks making code hard to read and
   maintain.

### Resolving the God Object

Bad practise

```javascript
class GodObject {
  constructor() {
    // Handles too many responsibilities
  }

  readData() {
    // Read data from a file
  }

  processData() {
    // Process the data
  }

  renderUI() {
    // Render user interface
  }
}
```

Good practise

```javascript
class DataReader {
  readData() {
    // Read data from a file
  }
}

class DataProcessor {
  processData() {
    // Process the data
  }
}

class UI {
  renderUI() {
    // Render user interface
  }
}
```

### Resolving spaghetti code

Bad Practise (Spaghetti Code)

```javascript
function doEverything() {
  // Initialization
  // Data processing
  // UI rendering
  // Error handling
}
```

Good Practise (Modular Code)

```javascript
function initialize() {
  // Initialization
}

function processData() {
  // Data processing
}

function renderUI() {
  // UI rendering
}

function handleError() {
  // Error handling
}

function main() {
  initialize();
  processData();
  renderUI();
  handleError();
}
```

### Callback Hell

Bad practise

```javascript
getData(function (a) {
  parseData(a, function (b) {
    validateData(b, function (c) {
      // Deeply nested structure
    });
  });
});
```

Good Practises

```javascript
// Using Promises
getData()
  .then(parseData)
  .then(validateData)
  .catch(handleError);

// Using Async/Await
async function main() {
  try {
    const a = await getData();
    const b = await parseData(a);
    const c = await validateData(b);
  } catch (error) {
    handleError(error);
  }
}
```

## Conclusion

Design patterns offer reusable solutions to common problems in software
development. JavaScript has a rich set of design patterns that can improve code
quality and maintainability. By understanding these patterns, you can write more
robust and effective JavaScript code.
