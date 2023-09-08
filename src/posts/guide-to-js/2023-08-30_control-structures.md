---
title: "Control Structures in JavaScript"
part: 3
intro: "Control structures in JavaScript dictate how your code runs. They decide the
flow of operations based on conditions and can repeat sections of code multiple
times. Let's get a better understanding of these structures and their uses."
---

But first things first - before looking at control structures, it's important to
know how conditions work.

## Basic Conditions

Here are common conditions you'll use:

- **Equality (==)**: Checks if values are the same but ignores the type.
- **Strict Equality (===):** Checks if values and their types are the same.
- **Inequality (!=):** Checks if values are not the same.
- **Strict Inequality (!==):** Checks if values and their types aren't the same.
- **Greater Than (>):** Checks if the left value is bigger than the right one.
- **Less Than (<):** Checks if the left value is smaller than the right one.
- **Greater Than or Equal (>=):** Checks if the left value is bigger than or the
  same as the right one.
- **Less Than or Equal (<=):** Checks if the left value is smaller than or the
  same as the right one.
- **Logical AND (&&):** Both conditions must be true for the whole condition to
  be true.
- **Logical OR (||):** If one condition is true, the whole condition is true.

As you can see, in JavaScript, there are two main ways to compare values: `==`
and `===`. It's important to know the difference.

- **Double Equals (==)**: Compares values, but not their types. This can
  sometimes lead to unexpected results.

```javascript
let number = 5;
let string = "5";

if (number == string) {
  console.log("These are seen as equal with ==");
}
```

- **Triple Equals (===)**: Compares both value and type. This is more
  predictable and is generally recommended.

```javascript
if (number === string) {
  // This block won't run
} else {
  console.log("These are not equal with ===");
}
```

The same applies to inequality and strict inequality.

## Conditional Statements

Now, let's see how conditional statements help your code make decisions:

1. **If Statement**: Tests a condition. If the condition is true, the code
   inside its block runs.

```javascript
let age = 25;
if (age > 18) {
  console.log("You are an adult");
}
```

2. **If...else**: This adds an alternative. If the condition in the 'if' part
   isn't met, the 'else' part runs.

```javascript
if (age > 18) {
  console.log("You are an adult");
} else {
  console.log("You are a minor");
}
```

3. **If...else if...else**: Handles multiple conditions sequentially.

```javascript
if (age < 13) {
  console.log("You are a child");
} else if (age >= 13 && age < 18) {
  console.log("You are a teenager");
} else {
  console.log("You are an adult");
}
```

4. **Switch Statement**: A cleaner way to check multiple conditions, especially
   when dealing with many potential outcomes. Also lets you combine multiple
   conditions for a single outcome.

```javascript
let fruit = "apple";
switch (fruit) {
  case "apple":
    console.log("You chose a red fruit");
    break;
  case "banana":
  case "lemon":
    console.log("You chose a yellow fruit");
    break;
  default:
    console.log("Unknown fruit");
}
```

## Loops

Loops allow you to run the same section of code multiple times:

1. **For Loop**: This loop uses a counter. It keeps running as long as a
   condition is true.

```javascript
for (let i = 0; i < 5; i++) {
  console.log("This is iteration number " + i);
}
```

2. **While Loop**: This will keep going as long as its condition is true. It
   checks the condition before each iteration.

```javascript
let i = 0;
while (i < 5) {
  console.log("This is iteration number " + i);
  i++;
}
```

3. **Do...While Loop**: Similar to the `while` loop, but it guarantees the
   execution of the code block at least once.

```javascript
let j = 0;
do {
  console.log("This is iteration number " + j);
  j++;
} while (j < 5);
```

4. **For...of Loop**: A concise way to iterate over iterable objects, like
   arrays.

```javascript
let colors = ["red", "blue", "green"];
for (let color of colors) {
  console.log(color);
}
```

5. **For...in Loop**: Used to iterate over the properties of an object.

```javascript
let person = { name: "John", age: 25, city: "Paris" };
for (let key in person) {
  console.log(key + ": " + person[key]);
}
```

## A Call to Action

Control structures are tools to make your code smarter. Play around with the
examples given, tweak the conditions, and watch the results. The best way to
grasp these structures is by practice. This is an example covering what we've
learned so far:

```javascript
// Declare a variable for the traffic light color
// It could be "red", "yellow", or "green"
let trafficLight = "red";

// Log the current light color
console.log("The traffic light is " + trafficLight + ".");

// Use if...else if...else statements to decide what the car should do
if (trafficLight === "red") {
  console.log("Stop the car!");
} else if (trafficLight === "yellow") {
  console.log("Slow down, get ready to stop.");
} else if (trafficLight === "green") {
  console.log("Go, you're good to go!");
} else {
  console.log("Invalid traffic light color. Be cautious!");
}

// Let's show how the advice changes if the light were yellow
trafficLight = "yellow";
console.log("The traffic light is now " + trafficLight + ".");
if (trafficLight === "red") {
  console.log("Stop the car!");
} else if (trafficLight === "yellow") {
  console.log("Slow down, get ready to stop.");
} else if (trafficLight === "green") {
  console.log("Go, you're good to go!");
} else {
  console.log("Invalid traffic light color. Be cautious!");
}
```

You might notice that the if...else if...else... control structure appears
twice, using exactly the same code. In the next lesson, we'll learn how to
optimize this.
