---
title: The Guide to Rust - Introduction
title_short: Introduction
part: 1
priority: 1.0
intro: "The aim of this series is to give a solid understanding of Rust, from the very first line of code to ownership, traits and threads. We'll stick to the standard library, and focus on the parts of the language you'll use every day. No prior Rust experience is needed, but it helps if you have written some code before, in any language."
---

Before diving in, let's make something clear: Rust has a reputation for being
hard to learn. Some of that is deserved. The compiler is strict, and it will say
no to code that would run just fine in most other languages. But it says no for
good reasons, and it is very good at explaining why. Once things click, you get
programs that are fast, use little memory, and are free from whole classes of
bugs, like null pointers and data races.

I've used Rust for things like the
[Rust version of Croner](/posts/croner-for-rust/), and the servers behind
[rootcard](/posts/rootcard/) and [Murmo](/posts/murmo/). This series is the
guide I would have liked to have when I started.

If you've followed [The guide to JavaScript](/posts/guide-to-js/introduction/),
the structure will feel familiar. Where it helps, I'll point out how Rust
differs from JavaScript.

### What You'll Learn

- **Variables and Types**: How Rust stores data, and why it cares so much about
  types.
- **Control Flow and Functions**: The building blocks of every program.
- **Ownership and Borrowing**: The one big idea that makes Rust different.
- **Strings and Numbers**: Text, UTF-8, integer overflow and floating point.
- **Structs and Enums**: How to model your own data.
- **Pattern Matching**: Rust's most pleasant feature, once you get used to it.
- **Error Handling**: `Result`, `Option` and the `?` operator.
- **Collections and Iterators**: Vectors, hash maps, and processing data
  without loops.
- **Traits and Generics**: Writing code that works with many types.
- **Lifetimes**: What those `'a` things are, and when you need them.
- **Modules, Cargo and Testing**: Organizing a real project.
- **Concurrency**: Threads, channels and shared state, without data races.

Each article takes about 10-20 minutes to read. Set aside at least as much time
again to type in the examples and change them. Rust is learned by arguing with
the compiler, so the more you do that, the better.

## Installing Rust

The recommended way to install Rust is `rustup`, which manages Rust versions
for you. On Linux and macOS, run this in a terminal:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Windows, download and run `rustup-init.exe` from
[rustup.rs](https://rustup.rs). When it's done, open a new terminal and check
that everything works:

```bash
rustc --version
cargo --version
```

`rustc` is the compiler. `cargo` is Rust's build tool and package manager, and
it's what you'll use almost all of the time. Rust releases a new stable version
every six weeks, and you can update with `rustup update`.

## Our First Dive into Rust

Let's create a new project with Cargo:

```bash
cargo new hello
cd hello
```

This creates a folder with two things in it: `Cargo.toml`, which describes your
project, and `src/main.rs`, which already contains a small program:

```rust
// The program starts in the function called main
fn main() {
    // println! prints a line of text to the terminal
    println!("Hello, world!");
}
```

Run it with:

```bash
cargo run
```

Cargo compiles the program and runs it, and you'll see `Hello, world!` at the
end of the output. The `!` in `println!` means that it's a macro, not a regular
function. Macros generate code at compile time. For now, you only need to know
that `println!` is how you print things, and that it needs the `!`.

Unlike JavaScript, Rust is compiled ahead of time. `cargo run` builds an
executable file, which you'll find in `target/debug/hello`. You can copy that
file to another computer with the same operating system and run it there,
without installing Rust. When you're ready to ship, `cargo build --release`
builds an optimized version in `target/release/`.

## Trying Things Without Installing

If you just want to test a snippet, the
[Rust Playground](https://play.rust-lang.org) runs Rust in your browser. It's
handy for quick experiments while reading this series.

## Editor Support

Install `rust-analyzer` for your editor. It's available for VS Code, Zed, Neovim
and most others, and shows types, errors and documentation as you type. In Rust,
this helps more than in most languages, as you'll see the compiler's opinion
before you even save the file.

That's it for now, you'll find the next article on the link just below, or at
the top of the page, under "The guide to Rust".
