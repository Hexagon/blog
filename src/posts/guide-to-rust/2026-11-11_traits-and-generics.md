---
title: "Traits and Generics in Rust"
title_short: "Traits and Generics"
part: 11
intro: "Traits describe what a type can do, and generics let you write code that works with any type that can do it. Together, they're how Rust shares behavior between types, instead of inheritance. Let's see how they fit together."
---

## What's a Trait?

A trait is a set of methods that a type promises to have. If you've used
interfaces in TypeScript or Java, it's a similar idea.

```rust
trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

struct Car {
    brand: String,
    year: u32,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("{} is a good dog", self.name)
    }
}

impl Describe for Car {
    fn describe(&self) -> String {
        format!("A {} from {}", self.brand, self.year)
    }
}

fn main() {
    let dog = Dog { name: String::from("Rex") };
    let car = Car { brand: String::from("Volvo"), year: 1998 };

    println!("{}", dog.describe());
    println!("{}", car.describe());
}
```

`impl Describe for Dog` reads as "implement the trait Describe for the type
Dog". The compiler checks that every method in the trait is there, with the
right signature.

## Default Methods

A trait can provide a default implementation, which types can use as is, or
replace:

```rust
trait Greet {
    fn name(&self) -> String;

    // A default method, built on top of name()
    fn greet(&self) -> String {
        format!("Hello, {}!", self.name())
    }
}

struct English;
struct Swedish;

impl Greet for English {
    fn name(&self) -> String {
        String::from("World")
    }
}

impl Greet for Swedish {
    fn name(&self) -> String {
        String::from("Världen")
    }

    fn greet(&self) -> String {
        format!("Hej, {}!", self.name())
    }
}

fn main() {
    println!("{}", English.greet()); // Output: Hello, World!
    println!("{}", Swedish.greet()); // Output: Hej, Världen!
}
```

`English` and `Swedish` are unit structs, with no fields. They exist only to
implement the trait.

## Generics

Generics let you write a function once, for many types. You've used generic
types already: `Vec<T>`, `Option<T>` and `Result<T, E>`. Here's a generic
function:

```rust
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut largest = items[0];
    for &item in items {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    println!("{}", largest(&[34, 50, 25, 100, 65])); // Output: 100
    println!("{}", largest(&[1.5, 0.2, 9.9])); // Output: 9.9
    println!("{}", largest(&['r', 'u', 's', 't'])); // Output: u
}
```

`<T: PartialOrd + Copy>` declares a type parameter called `T`, and says what
`T` must be able to do. These are called **trait bounds**:

- `PartialOrd` means that values can be compared with `>`.
- `Copy` means that values can be copied out of the slice, as we do with
  `largest = items[0]`.

Without the bounds, the function wouldn't compile, as Rust can't know if any
random type supports `>`. This is the big difference from JavaScript: the
requirements are written down, and checked before the program runs.

Generic code is as fast as hand-written code. The compiler creates a separate
version of `largest` for each type it's used with.

## Traits as Parameters

When a function just needs "something that implements a trait", there's a
shorter way to write it, with `impl Trait`:

```rust
trait Describe {
    fn describe(&self) -> String;
}

struct Dog;

impl Describe for Dog {
    fn describe(&self) -> String {
        String::from("a dog")
    }
}

// These two functions mean the same thing
fn print_it(item: &impl Describe) {
    println!("This is {}", item.describe());
}

fn print_it_generic<T: Describe>(item: &T) {
    println!("This is {}", item.describe());
}

fn main() {
    print_it(&Dog);
    print_it_generic(&Dog);
}
```

When bounds get long, you can move them to a `where` clause:

```rust
use std::fmt::{Debug, Display};

fn show_both<T, U>(a: T, b: U) -> String
where
    T: Display,
    U: Debug,
{
    format!("{a} and {b:?}")
}

fn main() {
    println!("{}", show_both(42, vec![1, 2, 3])); // Output: 42 and [1, 2, 3]
}
```

## Trait Objects

Generics are decided at compile time. Sometimes, you want a list of different
types that share a trait, decided at runtime. For that, use a trait object,
`dyn Trait`, usually inside a `Box`:

```rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Circle {
    radius: f64,
}

struct Square {
    side: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    fn name(&self) -> String {
        String::from("circle")
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
    fn name(&self) -> String {
        String::from("square")
    }
}

fn main() {
    // A Vec of different types, all implementing Shape
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 1.0 }),
        Box::new(Square { side: 2.0 }),
    ];

    for shape in &shapes {
        println!("The {} has an area of {:.2}", shape.name(), shape.area());
    }
}
```

`Box` puts a value on the heap. That's needed here, as circles and squares have
different sizes, and a `Vec` needs all its items to be the same size. A `Box` is
always the size of a pointer.

When should you use what? If the set of types is fixed and known, an enum like
the `Shape` enum from the article about enums is often simpler. If other code
should be able to add its own types, use a trait.

## Standard Traits

Much of the standard library is built on traits. These are the ones you'll meet
most often:

- **`Debug`**: printing with `{:?}`.
- **`Display`**: printing with `{}`.
- **`Clone`**: making copies with `.clone()`.
- **`Copy`**: copied automatically instead of moved.
- **`PartialEq`** and **`Eq`**: comparing with `==`.
- **`PartialOrd`** and **`Ord`**: comparing with `<` and `>`, and sorting.
- **`Hash`**: using the type as a key in a `HashMap`.
- **`Default`**: a default value, with `Type::default()`.
- **`From`** and **`Into`**: converting between types.

Many of them can be derived, so the compiler writes the code for you:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a; // Copied, as Point is Copy
    let origin = Point::default(); // Point { x: 0, y: 0 }

    println!("{a:?} {b:?} {origin:?}");
    println!("{}", a == b); // Output: true
}
```

`Display` can't be derived, as Rust can't guess how you want your type to look.
You implement it yourself, like we did for the error type in the article about
error handling:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3, y: 4 };
    println!("The point is {p}"); // Output: The point is (3, 4)
    let text = p.to_string(); // Display also gives you to_string() for free
    println!("{text}");
}
```

### From and Into

Implementing `From` lets you convert one type to another, and you get `Into` for
free:

```rust
struct Celsius(f64);
struct Fahrenheit(f64);

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Self {
        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
    }
}

fn main() {
    let boiling = Fahrenheit::from(Celsius(100.0));
    println!("{}", boiling.0); // Output: 212

    let body: Fahrenheit = Celsius(37.0).into();
    println!("{:.1}", body.0); // Output: 98.6
}
```

`From` is also what the `?` operator uses to convert errors. If you implement
`From<ParseIntError>` for your own error type, `?` converts the error
automatically.

## Conclusion

Traits are Rust's way to share behavior, and generics are the way to use that
behavior without knowing the exact type. They take the place of both
inheritance and the duck typing you might know from JavaScript, but checked by
the compiler.

As an exercise, try implementing `Display` for the `TrafficLight` enum from the
article about enums, so that `println!("{light}")` prints the color in plain
words.
