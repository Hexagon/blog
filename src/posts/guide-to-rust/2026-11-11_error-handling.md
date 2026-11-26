---
title: "Error Handling in Rust"
title_short: "Error Handling"
part: 9
intro: "Rust has no exceptions. Instead, functions that can fail say so in their return type, and the compiler makes sure the caller deals with it. In this article, we'll look at panics, the Result type, the question mark operator, and how to make your own error types."
---

## Two Kinds of Errors

Rust splits errors into two groups:

- **Unrecoverable errors** are bugs, situations that should never happen. The
  program stops with a **panic**.
- **Recoverable errors** are things that can go wrong in normal use: a missing
  file, a network timeout, a user typing "abc" where a number was expected.
  These are returned as values, with the type **`Result`**.

## Panics

A panic stops the current thread, prints a message, and in most programs, ends
the whole program. You've already seen a few things that panic: reading outside
an array, integer overflow in debug builds, and `unwrap()` on a `None`. You can
also panic yourself:

```rust
fn main() {
    let config_loaded = true;
    if !config_loaded {
        panic!("The configuration should have been loaded by now");
    }
    println!("All good");
}
```

Use panics for bugs, not for things a user could cause. If a panic happens,
something in your code needs fixing. Run with `RUST_BACKTRACE=1 cargo run` to
see exactly where it came from.

## Result

`Result` is an enum, much like `Option`:

```rust
enum Result<T, E> {
    Ok(T),  // It worked, here's the value
    Err(E), // It failed, here's the error
}
```

You've seen it already, when parsing numbers:

```rust
fn main() {
    let inputs = ["42", "abc"];

    for input in inputs {
        match input.parse::<i32>() {
            Ok(number) => println!("Got the number {number}"),
            Err(error) => println!("'{input}' is not a number: {error}"),
        }
    }
}
```

This prints:

```
Got the number 42
'abc' is not a number: invalid digit found in string
```

Just like with `Option`, you can't use the value without handling the error
case. There's no way to forget a `try`/`catch`, as there's nothing to catch.
The error is right there in the type.

## Returning a Result

Let's go back to the division function from the article about functions, which
returned `0.0` for division by zero. With `Result`, it can say what went wrong:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err(String::from("Cannot divide by zero"));
    }
    Ok(a / b)
}

fn main() {
    match divide(10.0, 4.0) {
        Ok(result) => println!("Result: {result}"),
        Err(message) => println!("Error: {message}"),
    }

    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {result}"),
        Err(message) => println!("Error: {message}"),
    }
}
```

## The Question Mark Operator

Imagine a function that does several things that can fail, one after another.
Handling each `Result` with a `match` gets long fast. The `?` operator does it
for you:

- If the `Result` is `Ok`, `?` takes the value out, and the function continues.
- If it's `Err`, `?` returns the error from the function, right away.

```rust
use std::num::ParseIntError;

fn add_strings(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x: i32 = a.parse()?; // Returns early if a isn't a number
    let y: i32 = b.parse()?; // Same for b
    Ok(x + y)
}

fn main() {
    println!("{:?}", add_strings("1", "2")); // Output: Ok(3)
    println!("{:?}", add_strings("1", "two")); // Output: Err(ParseIntError { kind: InvalidDigit })
}
```

`?` is a lot like `await` in JavaScript, in that it's a small mark that does a
lot of work. And just like with `await`, you can see every place where the
function might stop early.

`?` only works in a function that returns a `Result` (or an `Option`, for
`Option` values). That includes `main`, which can return a `Result` too:

```rust
use std::fs;

fn main() -> Result<(), std::io::Error> {
    fs::write("hello.txt", "Hello from Rust!")?;
    let content = fs::read_to_string("hello.txt")?;
    println!("{content}");
    fs::remove_file("hello.txt")?;
    Ok(())
}
```

If any step fails, the program ends, and prints the error.

## Unwrap and Expect

Sometimes, handling every error is more than you need:

```rust
fn main() {
    // unwrap: the value, or panic with a generic message
    let a: i32 = "42".parse().unwrap();

    // expect: the value, or panic with your own message
    let b: i32 = "7".parse().expect("the hard-coded number should be valid");

    println!("{}", a + b);
}
```

They're fine in examples, tests and quick scripts, and when you know the value
is valid, like above. In real code, prefer `?` or a `match`. A good rule is to
use `expect` over `unwrap`, and write the message as what you expected to be
true. When it panics, the message tells you which assumption was wrong.

## Your Own Error Types

`String` errors are fine to start with, but the caller can't easily tell
different errors apart. For that, use an enum:

```rust
use std::fmt;

#[derive(Debug)]
enum LoginError {
    UnknownUser(String),
    WrongPassword,
    TooManyAttempts { wait_seconds: u32 },
}

// Display decides how the error looks when printed with {}
impl fmt::Display for LoginError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            LoginError::UnknownUser(name) => write!(f, "no user called {name}"),
            LoginError::WrongPassword => write!(f, "wrong password"),
            LoginError::TooManyAttempts { wait_seconds } => {
                write!(f, "too many attempts, wait {wait_seconds} seconds")
            }
        }
    }
}

// This marks LoginError as a proper error type
impl std::error::Error for LoginError {}

fn login(user: &str, password: &str, attempts: u32) -> Result<String, LoginError> {
    if attempts >= 3 {
        return Err(LoginError::TooManyAttempts { wait_seconds: 30 });
    }
    if user != "alice" {
        return Err(LoginError::UnknownUser(user.to_string()));
    }
    if password != "secret" {
        return Err(LoginError::WrongPassword);
    }
    Ok(format!("Welcome, {user}!"))
}

fn main() {
    let tries = [("bob", "secret", 0), ("alice", "guess", 1), ("alice", "secret", 3), ("alice", "secret", 2)];

    for (user, password, attempts) in tries {
        match login(user, password, attempts) {
            Ok(message) => println!("{message}"),
            Err(LoginError::WrongPassword) => println!("Try again"),
            Err(other) => println!("Login failed: {other}"),
        }
    }
}
```

`impl fmt::Display for LoginError` implements a trait, which we'll explain in
the article about traits. For now, think of it as filling in a form that tells
Rust how to print your type.

The caller can now handle each error differently, like the "Try again" above,
and the compiler makes sure no variant is forgotten.

## Mixing Error Types

What if a function does several things, that fail with different error types?
The simplest answer is `Box<dyn std::error::Error>`, which means "any kind of
error":

```rust
use std::error::Error;

fn parse_and_check(input: &str) -> Result<u32, Box<dyn Error>> {
    let number: u32 = input.trim().parse()?; // A ParseIntError
    if number > 100 {
        return Err("the number must be 100 or less".into()); // A string error
    }
    Ok(number)
}

fn main() {
    for input in ["42", "abc", "500"] {
        match parse_and_check(input) {
            Ok(n) => println!("{n} is fine"),
            Err(e) => println!("'{input}' failed: {e}"),
        }
    }
}
```

`?` converts each error into a `Box<dyn Error>` automatically. This is great
for applications and scripts. In libraries, where callers want to tell errors
apart, an enum like `LoginError` is the better choice.

Two popular crates (Rust's word for packages) make this easier:
[`thiserror`](https://crates.io/crates/thiserror) writes the `Display` code for
your error enums, and [`anyhow`](https://crates.io/crates/anyhow) is a more
capable version of `Box<dyn Error>` for applications. We'll look at how to add
crates in a later article.

## Conclusion

Errors in Rust are just values, and the type system makes sure they're handled.
It feels like more work at first, compared to `try`/`catch`. But you'll find
that Rust programs rarely crash with errors that nobody thought about, because
the compiler made you think about them.

- Use `panic!` for bugs.
- Use `Result` for things that can go wrong.
- Use `?` to pass errors up to the caller.
- Use `Option` for values that might be missing.
