---
title: "Objects in JavaScript"
part: 6
---

# Objects in JavaScript

After mastering control structures, let's move on to another concept in JavaScript: objects. Objects help you bundle related data and functions together, making it easier to organize and work with code. I will also cover JSON, and how to convert between JavaScript objects and JSON.

## What Are Objects?

Think of an object as a container that holds related data and functions. In technical terms, an object is a collection of key-value pairs.

```javascript
let person = {
	name: "Alice",
	age: 30,
	greet: function() {
		console.log("Hello, my name is " + this.name);
	}
};
```

Here, `person` is an object with properties `name`, `age`, and a method `greet`.

## Accessing Object Properties

You can access properties in two ways:

1. Dot Notation
```javascript
console.log(person.name);  // Output: "Alice"
```

2. Bracket Notation
```javascript
console.log(person['name']);  // Output: "Alice"
```

## Adding and Updating Properties

You can add new properties or update existing ones easily.

```javascript
// Adding a new property
person.job = "Engineer";

// Updating an existing property
person.age = 31;
```

## Methods in Objects

Methods are functions within an object. The `greet` function in the `person` object is a method.

```javascript
person.greet();  // Output: "Hello, my name is Alice"
```

## Variables and Objects

Unlike primitive data types (like numbers and strings), objects are "reference types". This means when you assign an object to a variable, you're actually assigning a reference to the object, not a copy of the object itself.

```javascript
let person2 = person;
person2.name = "Bob";

console.log(person.name);  // Output: "Bob"
```

Here, both `person` and `person2` point to the same object. Changing one will affect the other.

## Why Use Objects?

1. **Organize Data**: Bundle related properties and methods together.
2. **Readability**: Easier to understand and maintain code.
3. **Reusability**: Create reusable templates via object constructors or classes (more on this later).

## Objects and JSON

JavaScript Object Notation (JSON) is a data format that closely resembles JavaScript objects. It's commonly used for data transfer in web applications. However, while they may look similar, they are not the same.

### Converting Objects to JSON

In JavaScript, you can convert an object to a JSON string using `JSON.stringify()`.

```javascript
let jsonData = JSON.stringify(person);
console.log(jsonData);
// Output: '{"name":"Alice","age":30}'
```

### Converting JSON to Objects

To convert a JSON string back to a JavaScript object, use `JSON.parse()`.

```javascript
let objData = JSON.parse(jsonData);
console.log(objData.name);  // Output: "Alice"
```

### Things to Look Out For

1. **Methods**: JSON data can't have functions. So when you convert an object to JSON, methods are not included.
	
```javascript
// 'greet' method will not be included in the JSON string
let jsonData = JSON.stringify(person);
```

2. **Syntax**: JSON keys must be in double quotes. JavaScript objects are more lenient.
	
```json
// Valid JSON
{"name": "Alice", "age": 30}

// Invalid JSON
{name: 'Alice', age: 30}
```

3. **Date and Custom Types**: `Date` objects, `Regex`, and other custom types can't be directly represented in JSON.

```javascript
let myDate = new Date();
let myJson = JSON.stringify(myDate);
// Output will be a string representation of the date, not a Date object
```

Understanding the relationship between JavaScript objects and JSON is essential for web development and data handling. Make sure to keep these differences and limitations in mind when working with them.


## Conclusion

Understanding objects is crucial for effective JavaScript programming. They allow you to group related data and functions together, making your code more organized and maintainable. So take some time to create and manipulate objects yourself to get a solid grip on this.
