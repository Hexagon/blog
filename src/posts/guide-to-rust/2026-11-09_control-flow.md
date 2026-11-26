---
title: "Control Flow in Rust"
title_short: "Control Flow"
part: 3
intro: "Control flow decides which code runs, and how many times. Rust has the usual suspects, if and loops, but with a twist: almost everything is an expression that gives back a value. Let's see what that means."
---

## Conditions

Comparisons in Rust look like in most languages:

- **Equal (==)** and **Not Equal (!=)**
- **Greater Than (>)** and **Less Than (<)**
- **Greater Than or Equal (>=)** and **Less Than or Equal (<=)**
- **Logical AND (&&)**, **Logical OR (||)** and **Logical NOT (!)**

There's no `===` in Rust, and you don't need it. Both sides of a comparison must
have the same type, so comparing the number `5` to the string `"5"` isn't
something that can go wrong at runtime. It's simply a compile error.

Rust also has no "truthy" or "falsy" values. A condition must be a `bool`:

```rust
fn main() {
    let count = 3;

    if count { // Error! expected `bool`, found integer
        println!("Not zero");
    }
}
```

You have to say what you mean, like `if count != 0`.

## If Statements

```rust
fn main() {
    let age = 25;

    if age < 13 {
        println!("You are a child");
    } else if age < 18 {
        println!("You are a teenager");
    } else {
        println!("You are an adult");
    }
}
```

Note that there are no parentheses around the condition, but the curly braces
are always required, even for a single line.

### If is an expression

In Rust, `if` gives back a value. That means you can use it on the right side of
a `let`:

```rust
fn main() {
    let age = 25;
    let group = if age >= 18 { "adult" } else { "minor" };
    println!("You are an {group}");
}
```

This replaces the ternary operator (`condition ? a : b`) from JavaScript, which
Rust doesn't have. Both branches must give back the same type.

## Match

`match` compares a value against a list of patterns, and runs the first one that
fits. Think of it as a `switch` statement, but more powerful:

```rust
fn main() {
    let fruit = "banana";

    match fruit {
        "apple" => println!("You chose a red fruit"),
        "banana" | "lemon" => println!("You chose a yellow fruit"),
        _ => println!("Unknown fruit"),
    }
}
```

The `|` combines several patterns, and `_` matches anything, like `default` in a
`switch`. There's no `break`, and no falling through to the next case.

A `match` must cover every possible value. If you remove the `_` line above, the
program won't compile, as there are many strings that aren't listed. This sounds
strict, but it's one of the best features of Rust, and we'll see why in the
article about enums.

`match` can also check ranges of numbers, and like `if`, it gives back a value:

```rust
fn main() {
    let score = 85;

    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        _ => "F",
    };

    println!("Grade: {grade}"); // Output: Grade: B
}
```

`90..=100` means 90 to 100, including 100.

## Loops

### Loop

`loop` runs forever, until you `break` out of it:

```rust
fn main() {
    let mut count = 0;

    loop {
        count += 1;
        if count == 3 {
            break;
        }
    }

    println!("Stopped at {count}");
}
```

`break` can also give back a value from the loop:

```rust
fn main() {
    let mut n = 1;

    let first_big_power = loop {
        n *= 2;
        if n > 100 {
            break n;
        }
    };

    println!("{first_big_power}"); // Output: 128
}
```

### While

`while` keeps going as long as a condition is true:

```rust
fn main() {
    let mut i = 0;
    while i < 5 {
        println!("This is iteration number {i}");
        i += 1;
    }
}
```

Note that Rust has no `++` operator. Use `+= 1` instead.

### For

`for` loops over anything that can be iterated, like ranges and arrays:

```rust
fn main() {
    // 0..5 is a range from 0 up to, but not including, 5
    for i in 0..5 {
        println!("This is iteration number {i}");
    }

    let colors = ["red", "blue", "green"];
    for color in colors {
        println!("{color}");
    }

    // If you need the index too
    for (index, color) in colors.iter().enumerate() {
        println!("{index}: {color}");
    }
}
```

There's no C-style `for (let i = 0; i < 5; i++)` loop in Rust. Ranges and
iterators cover the same needs, and you can't get the conditions wrong.

`continue` skips to the next round of a loop, just like in JavaScript.

### Loop labels

When you have loops inside loops, you can give a loop a name, and `break` out of
that one directly:

```rust
fn main() {
    'outer: for x in 0..10 {
        for y in 0..10 {
            if x * y == 42 {
                println!("Found it: {x} * {y}");
                break 'outer;
            }
        }
    }
}
```

## A Call to Action

Play around with the examples, tweak the conditions, and watch the results. Here
is an example covering what we've learned so far:

```rust
fn main() {
    // It could be "red", "yellow", or "green"
    let mut traffic_light = "red";

    println!("The traffic light is {traffic_light}.");
    match traffic_light {
        "red" => println!("Stop the car!"),
        "yellow" => println!("Slow down, get ready to stop."),
        "green" => println!("Go, you're good to go!"),
        _ => println!("Invalid traffic light color. Be cautious!"),
    }

    // Let's show how the advice changes if the light were yellow
    traffic_light = "yellow";
    println!("The traffic light is now {traffic_light}.");
    match traffic_light {
        "red" => println!("Stop the car!"),
        "yellow" => println!("Slow down, get ready to stop."),
        "green" => println!("Go, you're good to go!"),
        _ => println!("Invalid traffic light color. Be cautious!"),
    }
}
```

You might notice that the `match` appears twice, using exactly the same code. In
the next lesson, we'll fix that with functions.
