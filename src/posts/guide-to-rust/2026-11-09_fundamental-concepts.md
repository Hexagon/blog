---
title: Fundamental Concepts of Rust
title_short: Fundamental Concepts
part: 2
intro: "In this section we'll cover the key elements that are essential to working with Rust. We'll look at variables, mutability, the basic types, and how to print things while you debug. Let's dive in!"
---

## Variables in Rust

### What are variables?

Just like in JavaScript, variables are buckets that hold data. The big
difference is that Rust is **statically typed**. Every variable has a type
that's known when the program is compiled, and it can never change. A bucket
for numbers will always hold numbers.

That sounds like a lot of typing, but most of the time, Rust figures out the
type by itself. This is called **type inference**.

### Declaring variables

You declare variables with `let`:

```rust
fn main() {
    let name = "Hexagon"; // Rust infers that this is a string slice, &str
    let year = 2026; // Rust infers a 32-bit integer, i32
    let pi: f64 = 3.14159; // You can also write the type yourself

    println!("{name} says hello in {year}, pi is about {pi}");
}
```

### Immutable by default

Here's the first surprise. Variables in Rust can't be changed by default. If you
try, the program won't even compile:

```rust
fn main() {
    let score = 10;
    score = 20; // Error!
}
```

The compiler tells you exactly what's wrong:

```
error[E0384]: cannot assign twice to immutable variable `score`
```

To make a variable changeable, add `mut`:

```rust
fn main() {
    let mut score = 10;
    println!("Score: {score}");
    score = 20;
    println!("Score: {score}");
}
```

This is the opposite of JavaScript, where `let` can change and `const` can't. In
Rust, you have to opt in to change. It sounds like a small thing, but when you
read code, every `mut` tells you that this value will change somewhere below.
Everything else stays the same.

### Shadowing

You can declare a new variable with the same name as an old one. The new one
"shadows" the old one:

```rust
fn main() {
    let input = "42"; // A string
    let input: i32 = input.parse().unwrap(); // Now a number, with the same name
    println!("{}", input + 1); // Output: 43
}
```

This is different from `mut`. With shadowing, you create a new variable, and it
can even have a different type. It's handy when you convert a value from one
form to another. Don't worry about `.parse().unwrap()` yet, we'll get to both
later in the series.

### Constants

Constants are declared with `const`. They must always have a type written out,
and their value must be known at compile time. By convention, they're written in
upper case:

```rust
const MAX_ATTEMPTS: u32 = 3;

fn main() {
    println!("You have {MAX_ATTEMPTS} attempts");
}
```

## Basic Types

### Integers

Rust has integers of different sizes. Types starting with `i` can be negative,
types starting with `u` (unsigned) can't.

| Size    | Signed  | Unsigned | Unsigned range            |
| ------- | ------- | -------- | ------------------------- |
| 8 bit   | `i8`    | `u8`     | 0 to 255                  |
| 16 bit  | `i16`   | `u16`    | 0 to 65 535               |
| 32 bit  | `i32`   | `u32`    | 0 to about 4.3 billion    |
| 64 bit  | `i64`   | `u64`    | 0 to about 18 quintillion |
| 128 bit | `i128`  | `u128`   | 0 to a very big number    |
| Pointer | `isize` | `usize`  | Depends on the computer   |

If you don't say otherwise, integers are `i32`. `usize` is used for indexes and
lengths, as it matches the size of memory addresses on the computer.

### Floating point numbers

`f64` is the default, and `f32` is the smaller version. These work just like
numbers in JavaScript, which are always 64-bit floats.

### Booleans and characters

```rust
fn main() {
    let is_active: bool = true;
    let letter: char = 'R'; // Single quotes for characters
    let emoji: char = '🦀'; // A char is a Unicode character, not just a byte
    println!("{is_active} {letter} {emoji}");
}
```

Note that single quotes are for `char`, and double quotes are for strings. In
JavaScript, they're the same, but in Rust they're different types.

### Tuples

A tuple groups a few values of different types together:

```rust
fn main() {
    let point: (i32, i32, &str) = (10, 20, "start");

    // Access by position
    println!("x is {}", point.0);

    // Or take it apart, called destructuring
    let (x, y, label) = point;
    println!("{label} is at {x}, {y}");
}
```

### Arrays

An array holds a fixed number of values of the same type:

```rust
fn main() {
    let scores: [i32; 3] = [85, 92, 78];
    let zeros = [0; 5]; // Five zeros: [0, 0, 0, 0, 0]

    println!("First score: {}", scores[0]);
    println!("Number of zeros: {}", zeros.len());
}
```

The size of an array is part of its type, and can never change. For lists that
grow and shrink, you'll use `Vec`, which we'll cover in the article about
collections.

If you try to read outside of an array, Rust stops the program with an error,
called a panic, instead of returning `undefined` or reading random memory.

## Comments

Comments work like in JavaScript:

```rust
// This is a single-line comment

/* This is a
multi-line comment */

/// This is a documentation comment. It describes the item below it,
/// and shows up in the generated documentation and in your editor.
fn documented() {}

fn main() {
    documented();
}
```

## Printing and Debugging

`println!` takes a format string, where `{}` marks a place to insert a value.
You can put variable names directly inside the braces:

```rust
fn main() {
    let name = "Alice";
    let age = 30;

    println!("{} is {} years old", name, age); // Values after the string
    println!("{name} is {age} years old"); // Variable names inside the braces
    println!("{:.2}", 3.14159); // Two decimals: 3.14
    println!("{:>8}|", "right"); // Pad to 8 characters, aligned right
    eprintln!("This goes to standard error, like console.error");
}
```

Not every type can be printed with `{}`. For debugging, use `{:?}`, which works
on most types, or `{:#?}` for a prettier version over several lines:

```rust
fn main() {
    let scores = [85, 92, 78];
    let point = (10, 20);

    println!("{:?}", scores); // Output: [85, 92, 78]
    println!("{point:?}"); // Output: (10, 20)
}
```

There's also the `dbg!` macro. It prints the file, line number, the expression
and its value, and then returns the value, so you can wrap it around almost
anything:

```rust
fn main() {
    let width = 30;
    let area = dbg!(width * 2) * 10;
    // Prints: [src/main.rs:3:16] width * 2 = 60
    println!("{area}");
}
```

## In Summary

Below is a code snippet that wraps up what we've learned in this article:

```rust
const MAX_ATTEMPTS: u32 = 3;

fn main() {
    // An immutable variable
    let username = "JohnDoe";

    // A mutable variable
    let mut attempts = 0;

    println!("Username is: {username}");
    println!("Maximum login attempts: {MAX_ATTEMPTS}");

    attempts += 1;
    println!("Attempts used: {attempts} of {MAX_ATTEMPTS}");

    // This would not compile, as username isn't mutable
    // username = "JaneDoe";

    // Tuples and arrays
    let scores = [("JohnDoe", 42), ("JaneDoe", 37)];
    println!("{scores:?}");
}
```

Keep an eye out for the next part in this series, where we'll make our programs
take decisions!
