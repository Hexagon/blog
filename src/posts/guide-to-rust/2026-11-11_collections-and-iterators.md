---
title: "Collections, Iterators and Closures in Rust"
title_short: "Collections and Iterators"
part: 10
intro: "Most programs work with lists of things. In this article, we'll look at Rust's most common collections, Vec and HashMap, and at iterators and closures, which let you process data in a way that'll feel familiar if you've used map and filter in JavaScript."
---

## Vec

`Vec` is a list that can grow and shrink, like an array in JavaScript. All the
items must have the same type.

```rust
fn main() {
    // Create an empty Vec, and add items
    let mut fruits: Vec<String> = Vec::new();
    fruits.push(String::from("apple"));
    fruits.push(String::from("banana"));

    // Or use the vec! macro
    let mut numbers = vec![10, 20, 30];

    numbers.push(40); // Add to the end
    let last = numbers.pop(); // Remove from the end, gives Option<i32>
    numbers.insert(0, 5); // Insert at a position
    numbers.remove(1); // Remove at a position

    println!("{fruits:?} {numbers:?} {last:?}");
    println!("Length: {}", numbers.len());
}
```

### Reading items

There are two ways to get an item:

```rust
fn main() {
    let numbers = vec![10, 20, 30];

    let first = numbers[0]; // Panics if the index is out of range
    let maybe = numbers.get(10); // Returns Option, None if out of range

    println!("{first} {maybe:?}"); // Output: 10 None

    if numbers.contains(&20) {
        println!("Found 20");
    }
}
```

Use `[]` when an index outside the list would be a bug, and `.get()` when it can
happen in normal use.

### Looping

```rust
fn main() {
    let mut scores = vec![85, 92, 78];

    // Borrow each item to read it
    for score in &scores {
        println!("{score}");
    }

    // Borrow each item to change it
    for score in &mut scores {
        *score += 5;
    }

    // Take ownership: scores can't be used after this loop
    for score in scores {
        println!("{score}");
    }
}
```

The three forms match the three ways of using a value from the article about
ownership: `&`, `&mut`, and moving.

### Sorting

```rust
fn main() {
    let mut numbers = vec![40, 100, 1, 5, 25, 10];
    numbers.sort();
    println!("{numbers:?}"); // Output: [1, 5, 10, 25, 40, 100]

    numbers.sort_by(|a, b| b.cmp(a)); // Descending
    println!("{numbers:?}"); // Output: [100, 40, 25, 10, 5, 1]

    let mut names = vec!["banana", "apple", "cherry"];
    names.sort();
    println!("{names:?}"); // Output: ["apple", "banana", "cherry"]
}
```

Unlike JavaScript, `sort` compares numbers as numbers. There's no need for a
compare function to get `[1, 5, 10]` instead of `[1, 10, 5]`.

## HashMap

A `HashMap` stores values by key, like a `Map` in JavaScript:

```rust
use std::collections::HashMap;

fn main() {
    let mut ages: HashMap<String, u32> = HashMap::new();

    ages.insert(String::from("Alice"), 30);
    ages.insert(String::from("Bob"), 25);
    ages.insert(String::from("Alice"), 31); // Replaces the old value

    // get returns an Option
    match ages.get("Alice") {
        Some(age) => println!("Alice is {age}"),
        None => println!("Who?"),
    }

    // Loop over keys and values. The order is not guaranteed!
    for (name, age) in &ages {
        println!("{name}: {age}");
    }

    ages.remove("Bob");
    println!("Entries left: {}", ages.len()); // Output: Entries left: 1
}
```

### The entry API

A common task is to update a value if the key exists, or insert a starting
value if it doesn't. Counting words, for example:

```rust
use std::collections::HashMap;

fn main() {
    let text = "the cat sat on the mat the end";
    let mut counts: HashMap<&str, u32> = HashMap::new();

    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }

    println!("'the' appears {} times", counts["the"]); // Output: 3
}
```

`entry(word).or_insert(0)` gives you a mutable reference to the count, inserting
`0` first if the word is new.

If you need the keys in sorted order, use `BTreeMap` instead. It has the same
methods. There's also `HashSet` and `BTreeSet`, for collections of unique
values.

## Closures

A closure is a function without a name, that you can store in a variable or pass
to another function. They look like this:

```rust
fn main() {
    let add = |a: i32, b: i32| a + b; // Like (a, b) => a + b in JavaScript
    let double = |x| x * 2; // Types are usually inferred
    let greet = || println!("Hello!"); // No parameters

    println!("{}", add(2, 3)); // Output: 5
    println!("{}", double(4)); // Output: 8
    greet();

    // A closure can use variables from where it was created
    let bonus = 10;
    let add_bonus = |score: i32| score + bonus;
    println!("{}", add_bonus(85)); // Output: 95
}
```

Just like in JavaScript, closures capture the variables around them. If a
closure needs to own what it captures, for example when it's sent to another
thread, put `move` in front of it: `move |x| x + bonus`.

## Iterators

An iterator produces items one at a time. Every collection can give you one,
with `.iter()`. The real power comes from iterator adapters, methods that
transform one iterator into another. These will look familiar:

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];

    let doubled: Vec<i32> = numbers.iter().map(|n| n * 2).collect();
    println!("{doubled:?}"); // Output: [2, 4, 6, 8, 10, 12]

    let even: Vec<&i32> = numbers.iter().filter(|n| *n % 2 == 0).collect();
    println!("{even:?}"); // Output: [2, 4, 6]

    let sum: i32 = numbers.iter().sum();
    println!("{sum}"); // Output: 21

    let total = numbers.iter().fold(0, |acc, n| acc + n); // Like reduce
    println!("{total}"); // Output: 21

    let has_big = numbers.iter().any(|&n| n > 5); // Like some
    let all_positive = numbers.iter().all(|&n| n > 0); // Like every
    println!("{has_big} {all_positive}"); // Output: true true

    let first_big = numbers.iter().find(|&&n| n > 3);
    println!("{first_big:?}"); // Output: Some(4)
}
```

`collect()` gathers the items into a collection. Because it can create many
different types, you need to say which one you want, here with `Vec<i32>`.

You might wonder about `*n`, `|&n|` and `|&&n|`. `.iter()` gives references to
the items, and `filter` and `find` add one more reference on top. The `&` in the
pattern takes them off again. This is one of the fiddly parts of Rust, and if
you get it wrong, the compiler will tell you what it expected.

### Iterators are lazy

Nothing happens until something consumes the iterator, like `collect`, `sum` or
a `for` loop. This means you can chain many steps without creating
intermediate lists. The chain below never builds a list of a million numbers,
and stops as soon as it has found three:

```rust
fn main() {
    let result: Vec<u64> = (1..=1_000_000)
        .map(|n| n * n)
        .filter(|n| n % 7 == 0)
        .take(3)
        .collect();

    println!("{result:?}"); // Output: [49, 196, 441]
}
```

Iterator chains compile down to the same machine code as a hand-written loop,
so there's no performance reason to avoid them.

### More useful adapters

```rust
fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![85, 92, 78];

    // enumerate: add an index
    for (i, name) in names.iter().enumerate() {
        println!("{i}: {name}");
    }

    // zip: walk two iterators side by side
    for (name, score) in names.iter().zip(scores.iter()) {
        println!("{name} scored {score}");
    }

    // rev, skip and take
    let last_two: Vec<_> = names.iter().rev().take(2).collect();
    println!("{last_two:?}"); // Output: ["Charlie", "Bob"]

    // max_by_key: the item with the largest key
    let best = names.iter().zip(scores.iter()).max_by_key(|(_, score)| **score);
    println!("{best:?}"); // Output: Some(("Bob", 92))

    // join, for strings
    println!("{}", names.join(", ")); // Output: Alice, Bob, Charlie
}
```

`Vec<_>` lets Rust infer the item type, while you still say that you want a
`Vec`.

## Conclusion

Here's a small example that uses most of what we've covered: a word frequency
counter, that prints the three most common words.

```rust
use std::collections::HashMap;

fn main() {
    let text = "the quick brown fox jumps over the lazy dog the fox";

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }

    let mut sorted: Vec<(&str, usize)> = counts.into_iter().collect();
    // Most common first, and alphabetically when the count is the same
    sorted.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));

    for (word, count) in sorted.iter().take(3) {
        println!("{word}: {count}");
    }
}
```

This prints `the: 3`, `fox: 2` and `brown: 1`. Try changing the text, or making
it count letters instead of words.
