---
title: "Ownership and Borrowing in Rust"
title_short: "Ownership and Borrowing"
part: 5
intro: "Ownership is the one big idea that makes Rust different from other languages. It's how Rust manages memory without a garbage collector, and how it prevents a whole family of bugs before your program even runs. It takes a while to get used to, so take your time with this one."
---

## Why Ownership?

Every program needs to manage memory. In JavaScript, a garbage collector runs in
the background, finds objects that nobody uses anymore, and frees them. That's
convenient, but it costs time and memory. In C, you free memory by hand, which is
fast, but easy to get wrong. Freeing too early, or twice, leads to crashes and
security holes.

Rust takes a third path. The compiler keeps track of who is responsible for each
value, and frees it at exactly the right moment. There's no garbage collector,
and no manual freeing. The price is that you have to follow a few rules.

## The Three Rules

1. Each value has a variable that owns it, called its **owner**.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped, and its memory is
   freed.

```rust
fn main() {
    {
        let name = String::from("Hexagon"); // name owns the String
        println!("{name}");
    } // name goes out of scope here, and the String is freed

    // println!("{name}"); // Would not compile, name doesn't exist here
}
```

`String::from` creates a `String`, which is text stored on the heap, that can
grow and change. We'll look closer at strings in the next article.

## Moving

Here's where Rust starts to feel different. When you assign a `String` to
another variable, ownership **moves**:

```rust
fn main() {
    let a = String::from("hello");
    let b = a; // The String moves from a to b

    println!("{a}"); // Error! borrow of moved value: `a`
}
```

In JavaScript, `a` and `b` would point to the same string. In Rust, there can
only be one owner, so after the move, `a` can't be used anymore. That's what
makes rule 3 work: when `b` goes out of scope, the string is freed once, and
there's no `a` left over pointing to freed memory.

The same thing happens when you pass a value to a function:

```rust
fn shout(text: String) {
    println!("{}!", text.to_uppercase());
} // text is dropped here

fn main() {
    let message = String::from("hello");
    shout(message); // message moves into the function
    // println!("{message}"); // Would not compile, message has moved
}
```

## Cloning

If you really want two independent copies, ask for one with `.clone()`:

```rust
fn main() {
    let a = String::from("hello");
    let b = a.clone(); // A full copy of the text
    println!("{a} and {b}"); // Both work
}
```

Cloning copies the data, which takes time and memory. That's why Rust never
does it behind your back. When you see `.clone()`, you know a copy is made.

## Copy Types

You might wonder why this works:

```rust
fn main() {
    let x = 5;
    let y = x;
    println!("{x} and {y}"); // Works fine
}
```

Simple values that live entirely on the stack, like integers, floats, `bool`,
`char`, and tuples and arrays of those, are `Copy`. Copying them is so cheap
that Rust just does it, instead of moving.

## Borrowing

Moving values into every function would be tiresome, as you'd never get them
back. Instead, you can **borrow** a value with a reference, written `&`:

```rust
fn count_letters(text: &String) -> usize {
    text.len()
}

fn main() {
    let message = String::from("hello");
    let length = count_letters(&message); // Lend message to the function
    println!("{message} has {length} letters"); // We still own message
}
```

The function gets to look at the string, but doesn't own it. When the function
returns, nothing is freed, as the owner is still `main`.

### Mutable references

A plain reference is read-only. To let someone change a value, lend it with
`&mut`:

```rust
fn add_exclamation(text: &mut String) {
    text.push('!');
}

fn main() {
    let mut message = String::from("hello");
    add_exclamation(&mut message);
    println!("{message}"); // Output: hello!
}
```

Note that `mut` is needed in three places: on the variable, when lending, and
in the function's parameter type. You always see where things can change.

## The Borrowing Rules

At any given time, you can have **either**:

- any number of read-only references (`&T`), **or**
- exactly one mutable reference (`&mut T`).

But never both at once. And a reference can never outlive the value it points
to.

```rust
fn main() {
    let mut scores = vec![1, 2, 3];

    let first = &scores[0]; // A read-only borrow
    scores.push(4); // Error! cannot borrow `scores` as mutable
    println!("{first}");
}
```

Why is this a problem? `push` might need more room, and move the whole list to a
new place in memory. Then `first` would point to memory that has been freed. In
C, this is a classic bug. In Rust, it simply doesn't compile.

The borrow only lasts until the last time the reference is used. So this works
fine:

```rust
fn main() {
    let mut scores = vec![1, 2, 3];

    let first = &scores[0];
    println!("{first}"); // Last use of first, the borrow ends here

    scores.push(4); // Fine
    println!("{scores:?}");
}
```

The same rules prevent data races between threads, which we'll come back to in
the last article of the series.

## Slices

A slice is a reference to a part of a collection. For text, the slice type is
`&str`, which you've already seen:

```rust
fn first_word(text: &str) -> &str {
    match text.find(' ') {
        Some(index) => &text[..index],
        None => text,
    }
}

fn main() {
    let sentence = String::from("hello wonderful world");
    println!("{}", first_word(&sentence)); // Output: hello

    let numbers = [1, 2, 3, 4, 5];
    let middle = &numbers[1..4]; // A slice of an array: [2, 3, 4]
    println!("{middle:?}");
}
```

Taking `&str` instead of `&String` is a good habit. A `&String` converts to a
`&str` automatically, so the function now accepts both a `String` and plain
text like `"hello"`. Don't worry about `Some` and `None` yet, they're covered in
the article about enums.

## Fighting the Borrow Checker

The part of the compiler that checks these rules is called the borrow checker.
In the beginning, you'll argue with it a lot. Some tips:

- **Read the error message.** Rust's errors are long because they're helpful.
  They usually point to both the borrow and the conflicting use.
- **Borrow instead of moving** when a function only needs to read a value.
- **Clone when it's cheap and you're stuck.** It's not cheating. You can
  optimize later, if it ever matters.
- **Keep borrows short.** Use the reference, and let it go, before you change
  the value.

## In Summary

```rust
fn describe(text: &str) -> String {
    format!("'{text}' has {} characters", text.chars().count())
}

fn make_loud(text: &mut String) {
    *text = text.to_uppercase();
}

fn take_ownership(text: String) {
    println!("I own '{text}' now, and will drop it");
}

fn main() {
    let mut greeting = String::from("hello");

    println!("{}", describe(&greeting)); // Borrow to read
    make_loud(&mut greeting); // Borrow to change
    println!("{greeting}"); // Output: HELLO

    let copy = greeting.clone(); // An explicit copy
    take_ownership(greeting); // greeting moves into the function
    println!("The copy is still here: {copy}");
}
```

`*text` means "the value that `text` points to". It's needed here, as we replace
the whole string, and not just call a method on it. `format!` works like
`println!`, but gives back a `String` instead of printing it.

If this article felt like a lot, that's normal. Ownership is the steepest part
of learning Rust, and it gets easier with every program you write.
