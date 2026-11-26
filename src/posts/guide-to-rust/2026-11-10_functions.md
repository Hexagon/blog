---
title: "Functions in Rust"
title_short: "Functions"
part: 4
intro: "Functions bundle code into reusable pieces. In Rust, they also are where the type system shows up the most, as every parameter and return value has a type that is written out. Let's look at how they work, and at the difference between statements and expressions."
---

## Creating and Calling Functions

You've already seen one function, `main`. Here's another:

```rust
fn say_hello() {
    println!("Hello Rust!");
}

fn main() {
    say_hello();
}
```

Functions are declared with `fn`, and by convention, their names are written in
`snake_case`. It doesn't matter if a function is defined before or after the
place where it's used.

## Parameters

Parameters must always have their types written out. Rust infers types inside
functions, but never in the function signature. The signature is a contract,
and it should be readable on its own.

```rust
fn greet(name: &str) {
    println!("Hello, {name}!");
}

fn print_sum(a: i32, b: i32) {
    println!("{a} + {b} = {}", a + b);
}

fn main() {
    greet("Bob");
    print_sum(2, 3);
}
```

`&str` is a borrowed piece of text. We'll get to what "borrowed" means in the
next article.

## Returning Values

The return type is written after an arrow, `->`:

```rust
fn square(number: i32) -> i32 {
    number * number
}

fn main() {
    let squared_value = square(4);
    println!("{squared_value}"); // Output: 16
}
```

Notice that there's no `return`, and no semicolon after `number * number`. The
last expression in a function is automatically its return value.

## Statements and Expressions

This is worth understanding properly, as it shows up everywhere in Rust.

- An **expression** gives back a value: `5`, `a + b`, `square(4)`, an `if`, a
  `match` and even a block `{ ... }`.
- A **statement** does something, but gives back no value. `let x = 5;` is a
  statement.

Adding a semicolon to an expression turns it into a statement, and throws its
value away. That's why this doesn't compile:

```rust
fn square(number: i32) -> i32 {
    number * number; // Error! The semicolon throws the value away
}

fn main() {
    square(4);
}
```

The compiler is helpful here, and suggests that you remove the semicolon.

A block is also an expression, so you can compute a value in a few steps
without leaking temporary variables:

```rust
fn main() {
    let total = {
        let price = 100;
        let tax = 25;
        price + tax
    };
    println!("{total}"); // Output: 125
}
```

## Early Returns

You can still use `return`, to leave a function early:

```rust
fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        return 0.0;
    }
    a / b
}

fn main() {
    println!("{}", divide(10.0, 4.0)); // Output: 2.5
    println!("{}", divide(10.0, 0.0)); // Output: 0
}
```

Returning `0.0` for a division by zero isn't great, as the caller can't tell it
apart from a real result. Rust has much better tools for this, and we'll see
them in the article about error handling.

## The Unit Type

A function without `->` returns `()`, called "unit". It's an empty value, used
when there's nothing to return. It's roughly what `undefined` is for a
JavaScript function that doesn't return anything. You'll see it in error
messages, as in "expected `i32`, found `()`", which usually means a missing
value or an extra semicolon.

## Returning Several Values

Use a tuple:

```rust
fn min_max(numbers: [i32; 4]) -> (i32, i32) {
    let mut min = numbers[0];
    let mut max = numbers[0];
    for n in numbers {
        if n < min {
            min = n;
        }
        if n > max {
            max = n;
        }
    }
    (min, max)
}

fn main() {
    let (min, max) = min_max([3, 9, 1, 4]);
    println!("min {min}, max {max}"); // Output: min 1, max 9
}
```

## No Dynamic Types, No Type Guards

In the JavaScript guide, we spent some time on type guards, checking with
`typeof` that a function got the type it expected. In Rust, that's not needed.
If a function takes an `i32`, the compiler makes sure that it gets an `i32`,
and nothing else. A call like `square("4")` never gets to run.

When you actually want a function to accept several types, Rust has generics and
traits, which are covered later in the series.

## Conclusion

To really understand functions, you need to create some yourself. Let's fix the
traffic light example from the last lesson:

```rust
fn handle_traffic_light(color: &str) {
    println!("The traffic light is {color}.");

    match color {
        "red" => println!("Stop the car!"),
        "yellow" => println!("Slow down, get ready to stop."),
        "green" => println!("Go, you're good to go!"),
        _ => println!("Invalid traffic light color. Be cautious!"),
    }
}

fn main() {
    handle_traffic_light("red");
    handle_traffic_light("yellow");
    handle_traffic_light("green");
}
```

There's still one problem: nothing stops someone from calling
`handle_traffic_light("purple")`. We'll fix that properly with an enum later in
the series. Up next is the most important article in the series: ownership.
