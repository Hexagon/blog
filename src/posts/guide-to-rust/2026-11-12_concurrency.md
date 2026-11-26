---
title: "Concurrency in Rust"
title_short: "Concurrency"
part: 14
intro: "In the JavaScript guide, we learned that JavaScript runs your code on a single thread. Rust doesn't have that limit. You can run code on every core of your CPU, and the ownership rules you've learned make sure that threads can't step on each other's data. The Rust community calls it fearless concurrency."
---

## Threads

A thread runs code at the same time as the rest of your program. You start one
with `std::thread::spawn`, and give it a closure:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=3 {
            println!("Hello from the thread, number {i}");
            thread::sleep(Duration::from_millis(10));
        }
    });

    for i in 1..=3 {
        println!("Hello from main, number {i}");
        thread::sleep(Duration::from_millis(10));
    }

    handle.join().unwrap(); // Wait for the thread to finish
}
```

The output from the two loops will be mixed, and the order can change between
runs. That's what running at the same time means.

`join()` waits for the thread to finish. Without it, the program might end
before the thread is done, as the whole program stops when `main` returns.

## Moving Data Into Threads

A thread might run longer than the function that started it. So the closure
can't borrow variables from that function. It has to own them:

```rust
use std::thread;

fn main() {
    let names = vec!["Alice", "Bob"];

    let handle = thread::spawn(|| { // Error! closure may outlive the current function
        println!("{names:?}");
    });

    handle.join().unwrap();
}
```

The compiler suggests the fix, the `move` keyword. It moves the captured
variables into the closure:

```rust
use std::thread;

fn main() {
    let names = vec!["Alice", "Bob"];

    let handle = thread::spawn(move || {
        println!("{names:?}");
    });

    // names has moved into the thread, and can't be used here anymore
    handle.join().unwrap();
}
```

A thread can also return a value, which you get from `join()`:

```rust
use std::thread;

fn main() {
    let handles: Vec<_> = (0..4_u64)
        .map(|part| {
            thread::spawn(move || {
                // Each thread sums its own part of the numbers
                let start = part * 250_000 + 1;
                let end = start + 250_000;
                (start..end).sum::<u64>()
            })
        })
        .collect();

    let total: u64 = handles.into_iter().map(|h| h.join().unwrap()).sum();
    println!("The sum of 1 to 1 000 000 is {total}"); // Output: 500000500000
}
```

## Scoped Threads

Moving everything into threads isn't always practical. With `thread::scope`,
threads can borrow data, because Rust knows they'll all be finished before the
scope ends:

```rust
use std::thread;

fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8];
    let (left, right) = numbers.split_at(numbers.len() / 2);

    let (sum_left, sum_right) = thread::scope(|s| {
        let a = s.spawn(|| left.iter().sum::<i32>());
        let b = s.spawn(|| right.iter().sum::<i32>());
        (a.join().unwrap(), b.join().unwrap())
    });

    println!("{sum_left} + {sum_right} = {}", sum_left + sum_right);
    println!("numbers is still usable: {numbers:?}");
}
```

## Channels

One way for threads to talk is by sending messages. A channel has a sending end
and a receiving end:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (sender, receiver) = mpsc::channel();

    for id in 0..3 {
        let sender = sender.clone(); // Each thread gets its own sender
        thread::spawn(move || {
            let result = id * 10;
            sender.send(format!("worker {id} found {result}")).unwrap();
        });
    }

    drop(sender); // Drop the original, so the loop below knows when to stop

    // Receives messages until all senders are gone
    for message in receiver {
        println!("{message}");
    }
}
```

`mpsc` stands for "multiple producer, single consumer": many senders, one
receiver. Sending a value moves it to the other thread, so there's never a
moment when two threads can touch it. This is the same idea as `postMessage`
with Web Workers in JavaScript.

## Shared State

Sometimes, threads need to share and change the same data. For that, you need
two things:

- **`Arc`** (atomic reference counting) lets several threads own the same
  value. It keeps a count of owners, and frees the value when the last one is
  gone.
- **`Mutex`** (mutual exclusion) makes sure only one thread at a time can
  change the value.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter); // Another owner of the same counter
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                let mut value = counter.lock().unwrap(); // Wait for our turn
                *value += 1;
            } // The lock is released here, when value goes out of scope
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // Output: Result: 10000
}
```

The lock is released automatically, when the guard returned by `lock()` goes
out of scope. You can't forget to unlock it.

## Why Is It Fearless?

Here's the interesting part. Try sharing a counter between threads without the
`Mutex`, or with a plain `Rc` (the single-threaded version of `Arc`), and the
program won't compile. Rust has two special traits:

- **`Send`**: the value can be moved to another thread.
- **`Sync`**: the value can be shared between threads, through references.

The compiler adds them to your types automatically, when it's safe. `Rc` is
neither, as its counter isn't safe to update from two threads at once. `Arc`
is. `thread::spawn` requires everything it gets to be `Send`.

Together with the borrowing rules, this means that a **data race**, two threads
changing the same memory at the same time, can't happen in safe Rust. In most
languages, data races are some of the hardest bugs to find, as they only show
up sometimes, under load. In Rust, they're compile errors.

Rust can't save you from every mistake, though. Deadlocks, where two threads
wait for each other forever, are still possible. Keep locks short, and always
take several locks in the same order.

## What About Async?

Threads are great for work that keeps the CPU busy. For programs that mostly
wait, like servers handling thousands of network connections, Rust has
`async`/`await`, much like JavaScript. The big difference is that Rust doesn't
include an async runtime. You pick one as a crate, and
[Tokio](https://tokio.rs) is the most popular:

```rust
// Needs tokio in Cargo.toml, with: cargo add tokio --features full
#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(fetch("first"), fetch("second"));
    println!("{a} {b}");
}

async fn fetch(name: &str) -> String {
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    format!("{name} done")
}
```

The servers behind [rootcard](/posts/rootcard/) and [Murmo](/posts/murmo/) are
built this way. Async Rust is a big topic, and the
[Tokio tutorial](https://tokio.rs/tokio/tutorial) is the best place to continue.

## Wrapping Up the Series

That's the end of the guide to Rust. We've gone from `Hello, world!` to threads,
and covered the parts of the language you'll use every day: ownership and
borrowing, structs and enums, pattern matching, error handling, iterators,
traits and generics.

Where to go from here?

- Build something. A command line tool is a great first project. The
  [clap](https://crates.io/crates/clap) crate helps with arguments.
- Read [The Rust Programming Language](https://doc.rust-lang.org/book/), known
  as "the book". It's free, and goes deeper than this series.
- Try [Rustlings](https://github.com/rust-lang/rustlings), small exercises that
  you fix until they compile.
- Run `cargo clippy` on everything you write, and read its suggestions.

The compiler will keep saying no for a while. But one day you'll notice that
when your program finally compiles, it usually just works. That's when Rust has
you hooked.
