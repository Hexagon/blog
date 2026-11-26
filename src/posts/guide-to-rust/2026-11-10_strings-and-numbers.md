---
title: "Strings and Numbers in Rust"
title_short: "Strings and Numbers"
part: 6
intro: "In this post, we'll explore text and numbers in Rust. Why are there two string types? Why can't you get the third letter of a string with text[2]? And what happens when an integer gets too big? Let's find out."
---

## Two Kinds of Strings

Rust has two main string types:

- **`String`** is an owned string. It lives on the heap, and can grow and
  change.
- **`&str`** (pronounced "string slice") is a borrowed view into some text. It
  can point into a `String`, or to text that's built into the program.

```rust
fn main() {
    let literal: &str = "Hello"; // Built into the program, never changes
    let mut owned: String = String::from("Hello"); // Owned, on the heap

    owned.push_str(", world"); // Strings can grow
    let view: &str = &owned; // Borrow a String as a &str

    println!("{literal} / {view}");
}
```

A simple rule of thumb: use `&str` for function parameters, and `String` when
you need to keep or build text.

### Converting between them

```rust
fn main() {
    let a: String = "hello".to_string();
    let b: String = String::from("hello");
    let c: String = "hello".to_owned();
    let d: &str = &a; // From String to &str, just borrow it
    let e: &str = a.as_str(); // The same thing, spelled out

    println!("{a} {b} {c} {d} {e}");
}
```

## Building Strings

```rust
fn main() {
    let greeting = "Hello";
    let name = "Alice";

    // format! is the most flexible way, like a template literal in JavaScript
    let message = format!("{greeting}, {name}!");
    println!("{message}");

    // push_str adds text, push adds a single character
    let mut s = String::from("Hello");
    s.push_str(", ");
    s.push_str(name);
    s.push('!');
    println!("{s}");

    // + works too, but takes ownership of the left side
    let first = String::from("Hello, ");
    let joined = first + name;
    println!("{joined}");
}
```

## Common String Methods

```rust
fn main() {
    let name = "Alice";

    println!("{}", name.len()); // Output: 5
    println!("{}", name.to_uppercase()); // Output: ALICE
    println!("{}", name.to_lowercase()); // Output: alice
    println!("{:?}", name.find('c')); // Output: Some(3)
    println!("{}", &name[1..4]); // Output: lic
    println!("{}", name.replace("c", "k")); // Output: Alike
    println!("{}", name.contains("lic")); // Output: true
    println!("{}", name.starts_with('A')); // Output: true
    println!("{}", "  padded  ".trim()); // Output: padded

    let parts: Vec<&str> = "a,b,c".split(',').collect();
    println!("{parts:?}"); // Output: ["a", "b", "c"]
}
```

`find` returns `Some(3)` instead of a plain `3`, because there might not be a
match. Where JavaScript's `indexOf` returns `-1`, Rust returns `None`. We'll
look at this properly in the article about enums.

## Strings Are UTF-8

All strings in Rust are UTF-8. This has a consequence that surprises most
newcomers: you can't index a string by position.

```rust
fn main() {
    let word = "hello";
    let letter = word[0]; // Error! the type `str` cannot be indexed by `{integer}`
}
```

The reason is that one character can take more than one byte. `"é"` is two
bytes, and `"🦀"` is four. `.len()` gives you the number of bytes, not
characters. If Rust let you write `word[0]`, it would either be slow, as it
would have to count from the start, or give you half a character.

Instead, you say what you want:

```rust
fn main() {
    let word = "héllo 🦀";

    println!("{}", word.len()); // Output: 11 (bytes)
    println!("{}", word.chars().count()); // Output: 7 (characters)

    // Loop over the characters
    for c in word.chars() {
        print!("[{c}]");
    }
    println!();

    // Get a character by position, if there is one
    println!("{:?}", word.chars().nth(1)); // Output: Some('é')
}
```

Slicing with `&word[1..4]` works on byte positions. If a position lands in the
middle of a character, the program panics, so be careful when slicing text that
isn't plain ASCII.

## Numbers

Arithmetic works as you'd expect, with one difference from JavaScript: dividing
two integers gives an integer.

```rust
fn main() {
    let x = 10;
    let y = 3;

    println!("{}", x + y); // Output: 13
    println!("{}", x - y); // Output: 7
    println!("{}", x * y); // Output: 30
    println!("{}", x / y); // Output: 3, the remainder is dropped
    println!("{}", x % y); // Output: 1

    println!("{}", 10.0 / 3.0); // Output: 3.3333333333333335
}
```

### No mixing of types

Rust never converts number types behind your back. You can't add an `i32` to an
`f64`, or even an `i32` to an `i64`, without converting one of them first:

```rust
fn main() {
    let count: i32 = 7;
    let price: f64 = 2.5;

    let total = count as f64 * price; // Convert with 'as'
    println!("{total}"); // Output: 17.5

    let big: i64 = 1_000_000; // Underscores make big numbers readable
    let sum = big + i64::from(count); // A lossless conversion
    println!("{sum}");
}
```

`as` always succeeds, but it can lose information. `300 as u8` gives `44`, and
`3.9 as i32` gives `3`. When a conversion might not fit, use `try_from`, which
tells you if it failed:

```rust
fn main() {
    let big: i32 = 300;
    let small = u8::try_from(big);
    println!("{small:?}"); // An Err, as 300 doesn't fit in a u8

    let fits = u8::try_from(200);
    println!("{fits:?}"); // Output: Ok(200)
}
```

### Math functions

In Rust, math functions are methods on the numbers themselves:

```rust
fn main() {
    println!("{}", std::f64::consts::PI); // Output: 3.141592653589793
    println!("{}", 25.0_f64.sqrt()); // Output: 5
    println!("{}", 2_i32.pow(3)); // Output: 8
    println!("{}", 2.0_f64.powf(0.5)); // Output: 1.4142135623730951
    println!("{}", 3.6_f64.round()); // Output: 4
    println!("{}", 3.6_f64.floor()); // Output: 3
    println!("{}", (-7_i32).abs()); // Output: 7
    println!("{}", 3.max(9)); // Output: 9
}
```

The `_f64` and `_i32` suffixes tell Rust which type a number literal is, so it
knows which methods are available.

## Integer Overflow

What happens if a number gets too big for its type? In JavaScript, you lose
precision silently. In Rust, it depends:

- In a debug build (`cargo run`), the program **panics**, stopping with an
  error.
- In a release build (`cargo run --release`), the number wraps around, so
  `255_u8 + 1` becomes `0`.

As neither is usually what you want, Rust has methods that make the choice
explicit:

```rust
fn main() {
    let x: u8 = 250;

    println!("{:?}", x.checked_add(10)); // Output: None, it didn't fit
    println!("{:?}", x.checked_add(5)); // Output: Some(255)
    println!("{}", x.wrapping_add(10)); // Output: 4, wraps around
    println!("{}", x.saturating_add(10)); // Output: 255, stops at the max
}
```

Use `checked_` when overflow means something went wrong, `saturating_` when the
maximum is a sensible answer, and `wrapping_` for things like hashes and
checksums, where wrapping is the point.

## Floating Point

`f64` is the same kind of number that JavaScript uses for everything, so it has
the same quirks:

```rust
fn main() {
    println!("{}", 0.1 + 0.2); // Output: 0.30000000000000004
    println!("{}", 0.1 + 0.2 == 0.3); // Output: false

    // Compare with a small margin instead
    println!("{}", (0.1_f64 + 0.2 - 0.3).abs() < 1e-10); // Output: true
}
```

For money, use integers of the smallest unit, like cents.

## Parsing Numbers

To turn text into a number, use `parse`. You have to say which type you want,
and handle the case where the text isn't a number:

```rust
fn main() {
    let good: Result<i32, _> = "42".parse();
    let bad: Result<i32, _> = "forty-two".parse::<i32>();

    println!("{good:?}"); // Output: Ok(42)
    println!("{bad:?}"); // Output: Err(ParseIntError { kind: InvalidDigit })

    let n: f64 = "3.14".parse().unwrap(); // unwrap: give me the value, or panic
    println!("{n}");
}
```

`Result` is how Rust handles anything that can fail. It's the topic of a whole
article later in the series.

## Hexadecimal and Binary

```rust
fn main() {
    let x = 0xFF; // Hexadecimal
    let y = 0b1010; // Binary
    let z = 0o17; // Octal

    println!("{x} {y} {z}"); // Output: 255 10 15
    println!("{:x} {:b} {:#x}", 255, 10, 255); // Output: ff 1010 0xff
    println!("{:08b}", 5); // Output: 00000101, padded to 8 digits

    // Bitwise operators work like in JavaScript, except NOT, which is ! instead of ~
    println!("{}", 10 & 5); // Output: 0
    println!("{}", 10 | 5); // Output: 15
    println!("{}", 10 ^ 5); // Output: 15
    println!("{}", !10_u8); // Output: 245
    println!("{}", 10 << 1); // Output: 20
    println!("{}", 10 >> 1); // Output: 5
}
```

That's a lot of ground. Take your time, experiment, and come back to this
article when you run into strings that won't do what you want.
