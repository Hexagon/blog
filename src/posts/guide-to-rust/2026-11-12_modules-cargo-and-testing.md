---
title: "Modules, Cargo and Testing in Rust"
title_short: "Modules, Cargo and Testing"
part: 13
intro: "So far, everything has lived in a single file. Real projects need more structure. In this article, we'll split code into modules, add crates from crates.io, and write tests, all with the tools that come with Rust."
---

## Modules

A module groups related code, and decides what's visible from the outside. You
can declare a module directly in a file, with `mod`:

```rust
mod geometry {
    pub struct Point {
        pub x: f64,
        pub y: f64,
    }

    pub fn distance(a: &Point, b: &Point) -> f64 {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        square_root(dx * dx + dy * dy)
    }

    // Not pub: only visible inside the geometry module
    fn square_root(value: f64) -> f64 {
        value.sqrt()
    }
}

fn main() {
    let a = geometry::Point { x: 0.0, y: 0.0 };
    let b = geometry::Point { x: 3.0, y: 4.0 };
    println!("{}", geometry::distance(&a, &b)); // Output: 5
}
```

Everything is private by default. `pub` makes an item visible outside the
module. Note that for structs, each field needs its own `pub`. That lets you
make a struct public, while keeping its fields private and only allowing
changes through methods.

### use

Writing `geometry::Point` everywhere gets long. `use` brings names into scope:

```rust
mod geometry {
    pub struct Point {
        pub x: f64,
        pub y: f64,
    }
}

use geometry::Point;
use std::collections::{HashMap, HashSet}; // Several names at once

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    let mut seen: HashSet<i32> = HashSet::new();
    let map: HashMap<&str, i32> = HashMap::new();
    seen.insert(1);
    println!("{} {} {}", p.x, seen.len(), map.len());
}
```

This is like `import` in JavaScript, but `use` only creates a shortcut. The
module itself is found through `mod`, not through `use`.

### Modules in files

In a real project, each module usually lives in its own file. With this layout:

```
src/
├── main.rs
├── geometry.rs
└── network/
    ├── mod.rs
    └── client.rs
```

`main.rs` declares the modules, and Rust finds the files by their names:

```rust
// src/main.rs
mod geometry; // Loads src/geometry.rs
mod network; // Loads src/network/mod.rs

use geometry::Point;

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    network::client::connect();
}
```

The content of `geometry.rs` is the same as what was inside `mod geometry { }`
above, without the braces. And `network/mod.rs` would contain
`pub mod client;`, to load `network/client.rs`. Instead of `network/mod.rs`,
you can also name the file `network.rs`, next to the `network` folder.

Inside a module, `crate::` refers to the root of your project, and `super::`
to the parent module.

## Binaries and Libraries

A Cargo project, called a **package**, can contain a binary, a library, or both:

- `src/main.rs` is the start of a program you can run.
- `src/lib.rs` is the start of a library, that other code can use.

A common pattern is to put most of the code in `lib.rs`, and keep `main.rs`
small. Create a library project with `cargo new --lib my_library`.

## Cargo.toml and Crates

`Cargo.toml` describes your package:

```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2024"

[dependencies]
```

`edition` decides which version of the language rules to use. Editions come
every few years, and let Rust make changes without breaking old code. Crates
from different editions work fine together.

### Adding dependencies

Packages from [crates.io](https://crates.io) are called crates. Let's add
[Croner](https://github.com/Hexagon/croner-rust), a cron pattern parser, and
[chrono](https://crates.io/crates/chrono), a date and time library:

```bash
cargo add croner chrono
```

This adds them to `Cargo.toml`:

```toml
[dependencies]
chrono = "0.4"
croner = "5"
```

The next `cargo build` or `cargo run` downloads and compiles them. Now they can
be used like any module:

```rust
// Needs croner and chrono in Cargo.toml
use chrono::Utc;
use croner::Cron;
use std::str::FromStr;

fn main() {
    let cron = Cron::from_str("0 9 * * MON-FRI").expect("a valid pattern");

    println!("{}", cron.describe());

    let now = Utc::now();
    let next = cron.find_next_occurrence(&now, false).expect("a next run");
    println!("Next run: {next}");
}
```

The versions in `Cargo.toml` follow semantic versioning. `"5"` means any `5.x.y`
version, as those should be compatible. The exact versions that were picked are
saved in `Cargo.lock`. Commit that file for programs, so everyone builds with
the same versions.

To find crates, search [crates.io](https://crates.io), or
[lib.rs](https://lib.rs), which is a bit easier to browse. Documentation for
every published crate is available at [docs.rs](https://docs.rs).

## Testing

Tests are built into Rust and Cargo. A test is a function marked with
`#[test]`. By convention, unit tests live in a `tests` module at the bottom of
the same file as the code they test:

```rust
// src/lib.rs, run the tests with: cargo test
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 { None } else { Some(a / b) }
}

#[cfg(test)]
mod tests {
    use super::*; // Bring in everything from the parent module

    #[test]
    fn adds_two_numbers() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn divides() {
        assert_eq!(divide(10, 2), Some(5));
    }

    #[test]
    fn refuses_to_divide_by_zero() {
        assert_eq!(divide(10, 0), None);
    }

    #[test]
    #[should_panic]
    fn panics_on_bad_index() {
        let v: Vec<i32> = Vec::new();
        let _ = v[0];
    }
}
```

`#[cfg(test)]` means that the module is only compiled when running tests, so it
doesn't end up in your program. Since the tests module is inside the same file,
it can test private functions too.

Run all tests with:

```bash
cargo test
```

The most common checks are:

- `assert!(condition)` fails if the condition is false.
- `assert_eq!(a, b)` fails if `a != b`, and shows both values.
- `assert_ne!(a, b)` fails if `a == b`.

All of them take an optional message, like
`assert!(list.is_empty(), "list should be empty, but was {list:?}")`.

Tests that use your library from the outside, like a user would, go in a
`tests/` folder next to `src/`. Each file there is compiled as its own crate.

### Documentation tests

Code examples in documentation comments are tested too:

````rust
// In src/lib.rs of a crate called my_crate
/// Adds two numbers.
///
/// ```
/// assert_eq!(my_crate::add(2, 2), 4);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
````

`cargo test` runs the example, so your documentation can never get out of date
without you noticing. Run `cargo doc --open` to see the documentation in your
browser.

## More Cargo Tools

A few more commands that you'll use all the time:

- **`cargo check`** checks that the code compiles, without building it. Much
  faster than `cargo build`.
- **`cargo fmt`** formats all your code in the standard style. No more
  discussions about where braces go.
- **`cargo clippy`** is a linter with hundreds of checks. It catches mistakes,
  and suggests simpler ways to write things. It's a great teacher when you're
  learning.
- **`cargo build --release`** builds an optimized version of your program.
- **`cargo update`** updates dependencies to the newest compatible versions.

## Conclusion

Cargo is one of the things Rust is most praised for. Building, testing,
formatting, linting, documentation and dependencies, all with one tool that
works the same on every computer. A good habit is to run `cargo fmt`,
`cargo clippy` and `cargo test` before every commit.

As an exercise, take the `Student` example from the article about enums, move
it into its own module, and write tests for `average`, including the case with
no scores.
