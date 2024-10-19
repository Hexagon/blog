---
title: Strings and Numbers in JavaScript
title_short: Strings and Numbers
part: 7
intro: "In this post, we will explore two of the most common data types in JavaScript:
strings and numbers. Strings are used to store text, while numbers are used to
store numerical values. We will also learn how to manipulate strings and numbers
using various methods and operators, how to avoid overflows using BigInts, and
how to represent binary and hexadecimal numbers."
---

There is a lot to cover here, from simple string manipulation to advanced
bitwise operations. But take your time and experiment with each section using
your favorite browser or runtime environment, and carry on to the next section
if you feel like things are getting out of hand. You can always come back later
and take on the advanced stuff when you're ready.

## What are strings?

Strings are sequences of characters enclosed by quotation marks. For normal
strings, you can use single quotes (' ') or double quotes (" ") to create them.

Let's take a simple example showing the first two alternatives that essentialy
works the same.

```javascript
let name = "Alice";
let greeting = "Hello";
```

To contatenate (join) strings, you use `+`.

```javascript
let message = greeting + ", " + name;
console.log(message); // Output: "Hello, Alice"
```

You can also use template literals to create strings with placeholders. Template
literals are enclosed by backticks (\`\`) and allow you to use `${variableName}`
to insert values.

Template literals make code a lot cleaner as soon as you need to piece together
many things, the only downside (that you don't really have to care about
nowadays) is that it isn't supported by older enviroments pre ES6. More on this
later.

```javascript
let message = `${greeting}, ${name}`;
console.log(message); // Output: "Hello, Alice"
```

## Methods for manipulating strings

Strings have many built-in methods that allow you to perform various operations
on them. Here are some examples:

- **length**: returns the number of characters in a string.
- **toUpperCase()**: returns a new string with all uppercase letters.
- **toLowerCase()**: returns a new string with all lowercase letters.
- **indexOf(\<substring\>)**: returns the index of the first occurrence of a
  substring in a string, or -1 if not found.
- **slice(\<number\>,\<number\>)**: returns a substring of a string from a start
  index to an end index (exclusive).
- **split(\<string\>)**: splits a string into an array of substrings based on a
  separator.
- **replace(\<string\>,\<string\>)**: replaces a substring in a string with a
  new substring.

```javascript
let name = "Alice";
console.log(name.length); // Output: 5
console.log(name.toUpperCase()); // Output: "ALICE"
console.log(name.toLowerCase()); // Output: "alice"
console.log(name.indexOf("c")); // Output: 2
console.log(name.slice(1, 4)); // Output: "lic"
console.log(name.split("")); // Output: ["A", "l", "i", "c", "e"]
console.log(name.replace("c", "k")); // Output: "Alike"
```

## Numbers

Numbers in JavaScript are numerical values that can be integers or decimals. You
can use the standard arithmetic operators (`+`, `-`, `*`, `/\`,`%`) to perform
calculations with numbers.

```javascript
let x = 10;
let y = 3;
console.log(x + y); // Output: 13
console.log(x - y); // Output: 7
console.log(x * y); // Output: 30
console.log(x / y); // Output: 3.3333333333333335
console.log(x % y); // Output: 1
```

You can use the Math object to access more advanced mathematical constants and
functions.

```javascript
console.log(Math.PI); // Output: 3.141592653589793
console.log(Math.sqrt(25)); // Output: 5
console.log(Math.pow(2, 3)); // Output: 8
console.log(Math.round(3.6)); // Output: 4
console.log(Math.floor(3.6)); // Output: 3
console.log(Math.ceil(3.6)); // Output: 4
```

### Number Methods

Numbers have some built-in methods that allow you to convert them to other
formats or perform other operations on them. Here are some examples:

- **toString**: returns a string representation of a number.
- **toFixed**: returns a string representation of a number with a fixed number
  of decimal places.
- **parseInt**: parses a string into an integer number.
- **parseFloat**: parses a string into a decimal number.

```javascript
let x = 10;
let y = 3.14;
console.log(x.toString()); // Output: "10"
console.log(y.toFixed(2)); // Output: "3.14"
console.log(parseInt("42")); // Output: 42
console.log(parseFloat("3.14")); // Output: 3.14
```

### Number limitations and BigInt

JavaScript uses the IEEE 754 standard to represent numbers as 64-bit
floating-point values. This means that there is a limit to how large or small a
number can be, and how precise it can be.

The largest possible number in JavaScript is `Number.MAX_VALUE`, which is
approximately `1.7976931348623157e+308`. The smallest possible number is
`Number.MIN_VALUE`, which is approximately `5e-324`.

If you try to use a number larger than `Number.MAX_VALUE` or `Number.MIN_VALUE`,
the result is not deterministic. Never trust values outside of range.

For example, in Chrome, `Number.MAX_VALUE + 2` become `1.7976931348623157e+308`
while `Number.MAX_VALUE * 2` become `Infinity`. Additionally
`(Number.MAX_VALUE + 2)>Number.MAX_VALUE` resolve to `false`, which is wrong.

The precision of a number is limited by the number of bits used to store its
fractional part. This can cause some very unexpected results when performing
arithmetic operations.

```javascript
let x = 0.1 + 0.2;
console.log(x); // All major runtimes will oddly enough output: 0.30000000000000004
```

```javascript
console.log((0.1 + 0.2) === 0.3); // All major runtimes will oddly enough output: false
```

To avoid some of these limitations, JavaScript introduced a new data type called
BigInt in ES2020. A BigInt is an arbitrary-precision integer that can represent
any whole number, no matter how large.

To create a BigInt, you can append the letter n to the end of an integer
literal, or use the BigInt function to convert a string, number, or boolean to a
BigInt.

```javascript
let x = 10n; // A BigInt literal
let y = BigInt(10); // A BigInt from a number
let z = BigInt("10"); // A BigInt from a string

console.log(typeof x); // Output: "bigint"
console.log(typeof y); // Output: "bigint"
console.log(typeof z); // Output: "bigint"

console.log(x); // Output: 10n
console.log(y); // Output: 10n
console.log(z); // Output: 10n
```

You can use the same arithmetic operators with BigInts as with numbers, except
for the division operator (/). To divide two BigInts, you have to use the floor
division operator (/) instead, which returns the quotient without the remainder.

```javascript
let x = 10n;
let y = 3n;

console.log(x + y); // Output: 13n
console.log(x - y); // Output: 7n
console.log(x * y); // Output: 30n
console.log(x / 3); // Output: Error: Cannot mix BigInt and other types
console.log(x / y); // Output: 3n
```

### Hexadecimal and Binary Representation of Numbers

Sometimes, you may want to represent numbers in different bases, such as
hexadecimal (base 16) or binary (base 2). Hexadecimal numbers use the digits
from 0 to 9 and the letters from A to F to represent values from 0 to 15. Binary
numbers use only the digits 0 and 1 to represent values.

To create a hexadecimal or binary number in JavaScript, you can use the prefix
0x or 0b before the digits.

```javascript
let x = 0xFF; // A hexadecimal number
let y = 0b1010; // A binary number

console.log(x); // Output: 255
console.log(y); // Output: 10
```

You can also convert a number to a hexadecimal or binary string using the
toString method with the base as an argument.

```javascript
let x = 255;
let y = 10;

console.log(x.toString(16)); // Output: "ff"
console.log(y.toString(2)); // Output: "1010"
```

### Binary Operators

Binary operators are used to perform arithmetic or logical operations on two
operands. For example, the addition operator
(``+) adds the values of its operands, while the equality operator (`==``)
compares the values of its operands and returns true or false.

There are different types of binary operators in JavaScript, such as:

- **Arithmetic operators**: perform basic mathematical operations, such as
  addition (`+`), subtraction (`-`), multiplication
  (``*`), division (`/`), and modulus (`%``).
- **Assignment operators**: assign the value of the right operand to the left
  operand, such as equal (`=`), plus equal (`+=`), minus equal (`-=`), and so
  on.
- **Comparison operators**: compare the values of the operands and return a
  boolean value, such as equal (`==`), not equal (`!=`), greater than (`>`),
  less than (`<`), and so on.
- **Logical operators**: perform logical operations on boolean values, such as
  and (`&&`), or (`||`), and not (`!`).
- **Bitwise operators**: perform operations on individual bits of the operands,
  such as and (`&`), or (`|`), xor (`^`), not (`~`), left shift (`<<`), right
  shift (`>>`), and so on.

What's the use of all this?

- **AND**: The bitwise AND operation (`&`) performs a logical AND on each pair
  of corresponding bits of the operands. It can be used to check if a certain
  bit is set or not, or to mask out unwanted bits. For example, if you want to
  check if the third bit (from right to left) of a number is 1, you can use the
  expression `x & 4`, where `4` is `0100` in binary. If the result is non-zero,
  then the bit is 1, otherwise it is 0.
- **XOR**: The bitwise XOR operation (`^`) performs a logical XOR on each pair
  of corresponding bits of the operands. It can be used to toggle or invert
  bits, or to implement encryption algorithms. For example, if you want to
  encrypt a message using a secret key, you can use the expression message `^`
  key, where message and key are both numbers. The result will be a different
  number that can only be decrypted by using the same key and XOR operation
  again.
- **NOT**: The bitwise NOT operation (`~`) performs a logical NOT on each bit of
  the operand. It can be used to complement or reverse bits, or to create masks
  for other bitwise operations. For example, if you want to create a mask that
  has all bits set except the last one, you can use the expression `~1`, where
  `1` is `0001` in binary. The result will be `1110` in binary.
- **OR**: The bitwise OR operation (`|`) performs a logical `OR` on each pair of
  corresponding bits of the operands. It can be used to set or merge bits, or to
  create masks for other bitwise operations. For example, if you want to set the
  last bit of a number to `1`, you can use the expression `x | 1`, where `1` is
  `0001` in binary. The result will be the same as `x` except the last bit will
  be `1`.
- **Left/Right shift**: The bitwise left shift operation (`<<`) and right shift
  operation (`>>`) move the bits of the operand to the left or right by a
  certain number of positions. They can be used to multiply or divide by powers
  of two, or to access specific bits of the operand. For example, if you want to
  multiply a number by `8`, you can use the expression `x << 3`, where `3` is
  the number of positions to shift. The result will be the same as `x` but with
  three zeros added at the end. Similarly, if you want to divide a number by
  `4`, you can use the expression `x >> 2`, where `2` is the number of positions
  to shift. The result will be the same as `x` but with two bits removed from
  the end.

Let’s see some examples of using binary operators in JavaScript:

```javascript
let x = 10;
let y = 5;

// Arithmetic operators
console.log(x + y); // Output: 15
console.log(x - y); // Output: 5
console.log(x * y); // Output: 50
console.log(x / y); // Output: 2
console.log(x % y); // Output: 0

// Assignment operators
x += y; // Equivalent to x = x + y
console.log(x); // Output: 15
x -= y; // Equivalent to x = x - y
console.log(x); // Output: 10
x *= y; // Equivalent to x = x * y
console.log(x); // Output: 50
x /= y; // Equivalent to x = x / y
console.log(x); // Output: 10

// Comparison operators
console.log(x == y); // Output: false
console.log(x != y); // Output: true
console.log(x > y); // Output: true
console.log(x < y); // Output: false

// Logical operators
console.log(true && false); // Output: false
console.log(true || false); // Output: true
console.log(!true); // Output: false

// Bitwise operators
console.log(10 & 5); // Output: 0 (binary representation of 10 is 1010, of 5 is 0101, and of 0 is 0000)
console.log(10 | 5); // Output: 15 (binary representation of 15 is 1111)
console.log(10 ^ 5); // Output: 15 (binary representation of 15 is 1111)
console.log(~10); // Output: -11 (binary representation of -11 is 11110101)
console.log(10 << 1); // Output: 20 (binary representation of 20 is 10100)
console.log(10 >> 1); // Output: 5 (binary representation of 5 is 0101)
```
