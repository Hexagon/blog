---
title: "Structs and Methods in Rust"
title_short: "Structs and Methods"
part: 7
intro: "Structs let you bundle related data together under one name, and give it your own type. Add methods, and you have something that works a lot like objects and classes in other languages, but without inheritance. Let's build some."
---

## Defining a Struct

A struct is a named collection of fields, each with a type:

```rust
struct User {
    name: String,
    email: String,
    age: u32,
    active: bool,
}

fn main() {
    let user = User {
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
        age: 30,
        active: true,
    };

    println!("{} is {} years old", user.name, user.age);
}
```

Struct names are written in `PascalCase`, and fields in `snake_case`. Unlike a
JavaScript object, you can't add new fields later. The struct definition says
exactly what's in it.

### Changing fields

To change a field, the whole variable must be `mut`. You can't mark a single
field as mutable:

```rust
struct User {
    name: String,
    age: u32,
}

fn main() {
    let mut user = User {
        name: String::from("Alice"),
        age: 30,
    };
    user.age += 1;
    println!("{} is now {}", user.name, user.age);
}
```

### Shorthands

If a variable has the same name as a field, you can skip the `field: value`
part. And you can create a struct from another one, with `..`:

```rust
struct User {
    name: String,
    age: u32,
    active: bool,
}

fn new_user(name: String, age: u32) -> User {
    User {
        name, // Same as name: name
        age,
        active: true,
    }
}

fn main() {
    let alice = new_user(String::from("Alice"), 30);

    // Take the rest of the fields from alice
    let bob = User {
        name: String::from("Bob"),
        ..alice
    };

    println!("{} {} {}", bob.name, bob.age, bob.active);
}
```

This looks a lot like the spread operator in JavaScript, but note that it moves
fields that aren't `Copy`. Here it's fine, as `age` and `active` are copied, and
we gave `bob` its own name.

## Printing Structs

If you try to print a struct with `{:?}`, Rust complains that it doesn't know
how. You can ask the compiler to write that code for you, with `derive`:

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 10, y: 20 };
    println!("{p:?}"); // Output: Point { x: 10, y: 20 }
    println!("{p:#?}"); // The same, over several lines
}
```

You'll put `#[derive(Debug)]` on most of your structs. We'll see more things
that can be derived in the article about traits.

## Methods

Methods are functions that belong to a type. They're defined in an `impl` block:

```rust
#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // &self means: this method borrows the rectangle, read-only
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // &mut self means: this method can change the rectangle
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }

    // Methods can take other values too
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let mut big = Rectangle { width: 30.0, height: 50.0 };
    let small = Rectangle { width: 10.0, height: 40.0 };

    println!("Area: {}", big.area()); // Output: Area: 1500
    println!("Can hold: {}", big.can_hold(&small)); // Output: Can hold: true

    big.scale(2.0);
    println!("{big:?}"); // Output: Rectangle { width: 60.0, height: 100.0 }
}
```

`self` is like `this` in JavaScript, but you always write it out, and you
decide how the method gets it:

- `&self` borrows the value to read it. This is the most common one.
- `&mut self` borrows the value to change it.
- `self` takes ownership, and consumes the value. Used for methods that turn a
  value into something else.

All the ownership rules from before apply. You can't call `scale` on a
rectangle that isn't `mut`.

## Associated Functions

Functions in an `impl` block that don't take `self` are called associated
functions. They're called on the type, with `::`. You've used one already:
`String::from`.

The most common use is a constructor, which by convention is called `new`:

```rust
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn new(width: f64, height: f64) -> Self {
        Self { width, height }
    }

    fn square(size: f64) -> Self {
        Self { width: size, height: size }
    }
}

fn main() {
    let r = Rectangle::new(3.0, 4.0);
    let s = Rectangle::square(5.0);
    println!("{} {}", r.width, s.height);
}
```

`Self` is a shortcut for the type the `impl` block is for, here `Rectangle`.

Rust has no special constructor syntax, and no `new` keyword. `new` is just a
function that returns a struct, so you can have as many constructors as you
like, with names that say what they do.

## Tuple Structs and Unit Structs

Sometimes, naming every field is overkill. A tuple struct has fields without
names:

```rust
struct Color(u8, u8, u8);
struct Meters(f64);
struct Feet(f64);

fn main() {
    let red = Color(255, 0, 0);
    println!("Red has {} red", red.0);

    let distance = Meters(100.0);
    // let wrong: Feet = distance; // Would not compile, different types
    println!("{} meters", distance.0);
}
```

Wrapping a plain number in a tuple struct like `Meters` is called the
"newtype" pattern. It costs nothing at runtime, but the compiler now stops you
from mixing up meters and feet. Mixing up units like that has cost at least one real Mars probe.

There are also unit structs, with no fields at all, written `struct Marker;`.
They're useful with traits, which we'll get to later.

## No Inheritance

Coming from JavaScript classes, you might look for `extends`. Rust doesn't have
it. Instead, you put structs inside other structs, and share behavior with
traits. In practice, this leads to simpler code, as there's no long chain of
parent classes to keep in your head.

```rust
#[derive(Debug)]
struct Address {
    city: String,
    country: String,
}

#[derive(Debug)]
struct Person {
    name: String,
    address: Address, // A struct inside a struct
}

fn main() {
    let person = Person {
        name: String::from("Alice"),
        address: Address {
            city: String::from("Stockholm"),
            country: String::from("Sweden"),
        },
    };
    println!("{} lives in {}", person.name, person.address.city);
}
```

## Conclusion

Structs are how you model data in Rust, and `impl` blocks are how you give that
data behavior. Here's a small example that brings it together:

```rust
#[derive(Debug)]
struct Student {
    name: String,
    scores: Vec<u32>,
}

impl Student {
    fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            scores: Vec::new(),
        }
    }

    fn add_score(&mut self, score: u32) {
        self.scores.push(score);
    }

    fn average(&self) -> f64 {
        let sum: u32 = self.scores.iter().sum();
        sum as f64 / self.scores.len() as f64
    }
}

fn main() {
    let mut student = Student::new("Bob");
    student.add_score(85);
    student.add_score(90);
    student.add_score(78);

    println!("{}'s average is {:.2}", student.name, student.average());
    // Output: Bob's average is 84.33
}
```

What happens if `average` is called before any scores are added? Try it. You'll
get `NaN`, as it divides zero by zero. In the next article, we'll see how enums
and `Option` let us handle that properly.
