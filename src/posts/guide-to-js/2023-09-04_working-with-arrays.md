---
title: "Working with Arrays in JavaScript"
part: 5
intro: "In this section, we will explore arrays in JavaScript. You'll learn how to create arrays, access their elements, manipulate array data, and work with common array methods like push, pop, shift, and unshift. Understanding arrays is crucial as they are used extensively in JavaScript for storing and managing collections of data."
---

## Declaring and initializing arrays

In JavaScript, arrays are versatile data structures used to store collections of
values. They are declared and initialized in various ways, giving you
flexibility in how you work with data. Let's explore the different methods of
declaring and initializing arrays:

**The normal way**

```javascript
// Empty array
let emptyArray = [];

// Array with elements
let fruits = ["apple", "banana", "cherry"];
```

Array literal notation is the most common way to create arrays. You can declare
an empty array or initialize it with elements by enclosing them in square
brackets [ ].

## Using the Array() Constructor

```javascript
// Creating an empty array
let colors = new Array();

// Initializing an array with elements
let daysOfWeek = new Array("Monday", "Tuesday", "Wednesday");
```

You can also create an array using the `Array()` constructor. To initialize it
with elements, you can pass them as arguments to the constructor.

Beware that you can not use this variant with a single number, as this has a
special meaning covered in the next section:

## Array constructor with length

```javascript
// Creating an array with a specified length
let numArray = new Array(5);
```

## Array constructor with length and default values

You can use the specified length constructor with `.fill()` to create an array
where every item is set to a specific value.

```javascript
// Creating an array with a specified length and filling it with a value
let filledArray = new Array(3).fill("default value");
```

This will generate an array containing
`["default value","default value","default value"]`.

## Accessing array elements

Once you've declared and initialized an array, you'll often need to access its
elements for reading or manipulation. JavaScript provides several methods for
doing so:

### By index

The most common way to access array elements is by their index, which represents
their position within the array. The index starts at 0 for the first element and
increments by 1 for each subsequent element.

You use square brackets [] with the index inside to retrieve the value stored at
that position in the array.

```javascript
let fruits = ["apple", "banana", "cherry"];

// Accessing the first element
let firstFruit = fruits[0]; // 'apple'

// Accessing the second element
let secondFruit = fruits[1]; // 'banana'
```

### By searching

In addition to accessing elements by index, you can also search for elements
within an array using various methods:

#### `indexOf()`

The indexOf() method returns the index of the first occurrence of a specified
value. If the value is not found, it returns -1.

### `includes()`

This is another, more recent way of checking if an item exists in a array.

```javascript
const pets = ["cat", "dog", "bat"];

console.log(pets.includes("cat"));
// Expected output: true

console.log(pets.includes("at"));
// Expected output: false
```

### `find()`

The find() method allows you to search for an element based on a provided
condition. It returns the first element in the array that satisfies the
condition.

```javascript
let students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 92 },
  { name: "Charlie", score: 78 },
];

let highScorer = students.find((student) => student.score > 90); // { name: 'Bob', score: 92 }
```

There is also various ways to find an item by iterating, but that will be
covered in a separate section below.

## Modifying arrays

Arrays are not static; you can modify their content by adding, removing, or
updating elements in a variety of ways:

### Adding elements

1. Push: The push() method adds one or more elements to the end of an array.

```javascript
let fruits = ["apple", "banana"];

fruits.push("cherry");
// fruits is now ['apple', 'banana', 'cherry']
```

2. Unshift: The unshift() method adds one or more elements to the beginning of
   an array.

```javascript
let fruits = ["apple", "banana"];

fruits.push("cherry");
// fruits is now ['apple', 'banana', 'cherry']
```

3. Splice: The splice() method can add elements at a specific index and/or
   remove elements simultaneously.

```javascript
let fruits = ["apple", "cherry"];

fruits.splice(1, 0, "banana");
// fruits is now ['apple', 'banana', 'cherry']
```

### Removing Elements

1. Pop: The pop() method removes the last element from an array and returns it.

```javascript
let fruits = ["apple", "banana", "cherry"];

let removedFruit = fruits.pop();
// removedFruit is 'cherry', and fruits is ['apple', 'banana']
```

2. Shift: The shift() method removes the first element from an array and returns
   i

```javascript
let fruits = ["apple", "banana", "cherry"];

let removedFruit = fruits.shift();
// removedFruit is 'apple', and fruits is ['banana', 'cherry']
```

3. Splice: The splice() method can remove elements from a specific index.

```javascript
let fruits = ["apple", "banana", "cherry"];

fruits.splice(1, 1);
// fruits is now ['apple', 'cherry']
```

### Updating Elements

You can update an element in an array by assigning a new value to a specific
index.

```javascript
let fruits = ["apple", "banana", "cherry"];

fruits[1] = "grape";
// fruits is now ['apple', 'grape', 'cherry']
```

### Multiple operations at once

Splice allow you to both insert and remove in the same operation:

```javascript
let fruits = ["apple", "banana", "cherry", "date"];

// Remove 'banana' and 'cherry' and add 'grape' and 'fig'
fruits.splice(1, 2, "grape", "fig");
// fruits is now ['apple', 'grape', 'fig', 'date']
```

The splice() method in JavaScript takes three arguments:

```javascript
array.splice(startIndex, deleteCount, item1, item2, ...);
```

1. **startIndex:** This is the index at which the splice() method starts
   changing the array. Elements before this index will remain unchanged. If the
   index is negative, it counts from the end of the array. For example, -1
   refers to the last element.

2. **deleteCount:** This argument specifies how many elements should be removed
   from the array, starting at the start index. If this argument is set to 0, no
   elements are removed.

3. **item:** After removing elements, you can optionally add new elements to the
   array. These elements are specified as additional arguments to the splice()
   method. If you don't want to add any elements, you can omit this argument.

### Sorting elements

Arrays have a build in method for sorting arrays, called `sort()`. By default,
it sorts the array in place, sorting the elements by their string representation
in alphabetical order. To use a custom order, you can pass a function taking two
arguments and returning a number indicating sort order. Let's take a few
examples:

```javascript
let fruits = ["banana", "apple", "cherry", "date"];

// Sorting alphabetically (default behavior)
fruits.sort();
// fruits is now ['apple', 'banana', 'cherry', 'date']

// Sorting in reverse alphabetical order
fruits.sort(function (a, b) {
  return b.localeCompare(a);
});
// fruits is now ['date', 'cherry', 'banana', 'apple']

// Sorting numerically
let numbers = [40, 100, 1, 5, 25, 10];
numbers.sort(function (a, b) {
  return a - b;
});
// numbers is now [1, 5, 10, 25, 40, 100]
```

- To sort alphabetically in reverse order, we used localeCompare() to compare
  strings in reverse.
- To sort numerically, we provided a comparison function that subtracts b from
  a. This sorts the numbers in ascending order. To sort in descending order, you
  can reverse the subtraction (b - a).

#### Custom Sorting

To sort more complex objects, you can sort an array of objects based on a
property:

```javascript
let students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 92 },
  { name: "Charlie", score: 78 },
];

students.sort(function (a, b) {
  return a.score - b.score;
});
// students are now sorted by score in ascending order
```

## Iterating through arrays using loops and array methods

Iterating through arrays allows you to process each element one by one,
performing various operations such as printing, modifying, or filtering. There
are several ways to iterate through arrays in JavaScript:

1. **For Loop**

A traditional for loop is a common way to iterate through arrays. You can use
the loop variable as an index to access each element.

```javascript
let numbers = [1, 2, 3, 4, 5];

for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
```

2. **For...of Loop**

The for...of loop is a more concise and modern way to iterate through arrays. It
directly iterates over the values of the array.

```javascript
let fruits = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit);
}
```

3. **forEach() Method**

The forEach() method is for exectuting a provided function once for each array
item;

```javascript
let colors = ["red", "green", "blue"];

colors.forEach(function (color) {
  console.log(color);
});
```

**Note:** Be extra careful with this if using asynchronous functions, as it
doesn't await each call before running the next.

## Copying arrays

## Common array methods and their usage

### Map/Filter/Reduce
