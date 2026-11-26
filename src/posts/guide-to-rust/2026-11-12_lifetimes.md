---
title: "Lifetimes in Rust"
title_short: "Lifetimes"
part: 12
intro: "Sooner or later, you'll see something like <'a> in Rust code, and wonder what it means. Lifetimes are how Rust makes sure that references never point to data that's gone. Most of the time they're invisible, but when they show up, it helps to know what they say."
---

## The Problem

In the article about ownership, we learned that a reference must never outlive
the value it points to. Here's a program that breaks that rule:

```rust
fn main() {
    let reference;
    {
        let value = String::from("hello");
        reference = &value; // Error! `value` does not live long enough
    } // value is dropped here
    println!("{reference}"); // ...but reference is used here
}
```

`value` is freed at the end of the inner block, so `reference` would point to
freed memory. The compiler tracks how long every value lives, called its
**lifetime**, and refuses the program.

Within a single function, the compiler can see everything, and figures this out
by itself. Lifetimes only need to be written out when a function or a struct
works with references, and the compiler can't tell how they're connected.

## Lifetimes in Functions

Here's a function that returns the longer of two strings:

```rust
fn longest(a: &str, b: &str) -> &str { // Error! missing lifetime specifier
    if a.len() > b.len() { a } else { b }
}

fn main() {
    println!("{}", longest("hello", "hi"));
}
```

The problem is that the returned reference points into either `a` or `b`, and
the compiler doesn't know which. So it can't check that the caller uses the
result safely. We have to tell it:

```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    let first = String::from("hello");
    let result;
    {
        let second = String::from("hi");
        result = longest(&first, &second);
        println!("{result}"); // Fine, both strings are alive here
    }
}
```

`'a` is a lifetime parameter, a name for "some lifetime". The names are short by
convention, `'a`, `'b` and so on. The signature now says: both inputs live at
least as long as `'a`, and the result lives as long as `'a` too. In practice,
the result can be used as long as **both** inputs are alive.

Note that lifetimes don't change how long anything lives. They're labels that
describe how references relate, so the compiler can check them.

If we move the `println!` outside the inner block, where `second` is gone, the
compiler stops us, as the result might point into `second`.

## Lifetime Elision

You've written plenty of functions with references in this series, without any
`'a`. That's because the compiler fills in lifetimes for common cases, called
**lifetime elision**:

1. Each reference parameter gets its own lifetime.
2. If there's exactly one reference parameter, the result gets its lifetime.
3. If one of the parameters is `&self` or `&mut self`, the result gets the
   lifetime of `self`.

So this function needs no annotations, as rule 2 applies:

```rust
fn first_word(text: &str) -> &str {
    text.split(' ').next().unwrap_or("")
}

fn main() {
    println!("{}", first_word("hello world")); // Output: hello
}
```

`longest` needed them because it has two reference parameters, and no `self`,
so none of the rules decide the lifetime of the result.

## Lifetimes in Structs

A struct that holds a reference must say how long that reference lives:

```rust
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn first_sentence(&self) -> &'a str {
        self.text.split('.').next().unwrap_or("")
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let excerpt = Excerpt { text: &novel };
    println!("{}", excerpt.first_sentence()); // Output: Call me Ishmael
}
```

This means that an `Excerpt` can't outlive the string it points into. If you
drop `novel` while `excerpt` is still in use, the program won't compile.

A tip for beginners: when a struct with references gets in your way, make it
own its data instead, with `String` instead of `&str`. That removes the lifetime
completely. References in structs are great for performance, but they're rarely
needed when you start out.

## The Static Lifetime

`'static` is a special lifetime, that lasts for the whole program. All string
literals have it, as they're built into the program itself:

```rust
fn main() {
    let greeting: &'static str = "I live forever";
    println!("{greeting}");
}
```

You'll also see `'static` in error messages, often when sending data to
threads. If the compiler asks for `'static`, it usually means "this must not
borrow anything from the current function". The fix is often to move or clone
the data, rather than adding `'static` everywhere.

## Conclusion

Lifetimes look scary, but they don't add anything new. They're a way to write
down the borrowing rules you already know, in places where the compiler can't
figure them out by itself. When you get a lifetime error:

- Look at which reference outlives what. The error message points to both.
- Ask if the function or struct could own the data instead.
- If you need the reference, add lifetime parameters that describe how the
  output relates to the inputs.

Most Rust code has very few lifetime annotations, so don't worry if you don't
need them for a while.
