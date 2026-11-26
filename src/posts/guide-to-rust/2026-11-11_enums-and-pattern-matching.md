---
title: "Enums and Pattern Matching in Rust"
title_short: "Enums and Pattern Matching"
part: 8
intro: "Enums in Rust are far more powerful than in most languages. Combined with match, they let you describe exactly which states your data can be in, and make the compiler check that you've handled every one of them. This is also where we meet Option, Rust's answer to null."
---

## Defining an Enum

An enum is a type that can be one of a fixed set of variants. Remember the
traffic light from earlier in the series? Here it is as an enum:

```rust
#[derive(Debug)]
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn handle_traffic_light(light: TrafficLight) {
    match light {
        TrafficLight::Red => println!("Stop the car!"),
        TrafficLight::Yellow => println!("Slow down, get ready to stop."),
        TrafficLight::Green => println!("Go, you're good to go!"),
    }
}

fn main() {
    handle_traffic_light(TrafficLight::Red);
    handle_traffic_light(TrafficLight::Green);
}
```

Compare this with the version that took a `&str`. There's no `_` case for
invalid colors anymore, because there are no invalid colors. A `TrafficLight`
can only be red, yellow or green, and calling the function with `"purple"`
doesn't compile.

## Exhaustive Matching

Now, let's say we add a fourth state, a blinking yellow light used at night.
Without changing the function:

```rust
enum TrafficLight {
    Red,
    Yellow,
    Green,
    BlinkingYellow,
}

fn handle_traffic_light(light: TrafficLight) {
    match light { // Error! non-exhaustive patterns: `TrafficLight::BlinkingYellow` not covered
        TrafficLight::Red => println!("Stop the car!"),
        TrafficLight::Yellow => println!("Slow down, get ready to stop."),
        TrafficLight::Green => println!("Go, you're good to go!"),
    }
}

fn main() {
    handle_traffic_light(TrafficLight::Red);
}
```

The compiler points out every `match` in the program that needs updating. In a
large codebase, this is a huge help. In JavaScript, you'd have to search for
every place that checks the light, and hope you found them all.

## Variants With Data

Each variant of an enum can carry its own data, of different types:

```rust
#[derive(Debug)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
            Shape::Triangle(a, b, c) => {
                // Heron's formula
                let s = (a + b + c) / 2.0;
                (s * (s - a) * (s - b) * (s - c)).sqrt()
            }
        }
    }
}

fn main() {
    let shapes = [
        Shape::Circle { radius: 1.0 },
        Shape::Rectangle { width: 3.0, height: 4.0 },
        Shape::Triangle(3.0, 4.0, 5.0),
    ];

    for shape in &shapes {
        println!("{shape:?} has an area of {:.2}", shape.area());
    }
}
```

The `match` takes each variant apart, and gives names to the data inside. This
is called destructuring, and it's what makes enums so pleasant to work with.

Enums can have methods, just like structs.

## Option: No More Null

Rust has no `null` and no `undefined`. When a value might be missing, you use
the enum `Option`, which is built into the language. It's defined like this:

```rust
enum Option<T> {
    Some(T), // There is a value, of type T
    None,    // There is no value
}
```

The `<T>` means it works with any type. We'll get to that in the article about
generics. You've seen `Option` already, when `find` returned `Some(3)`.

The important part is that an `Option<i32>` is not an `i32`. You can't use it as
a number until you've checked that there is one:

```rust
fn find_user_age(name: &str) -> Option<u32> {
    match name {
        "Alice" => Some(30),
        "Bob" => Some(25),
        _ => None,
    }
}

fn main() {
    let age = find_user_age("Alice");
    // let next_year = age + 1; // Would not compile, age might be None

    match age {
        Some(years) => println!("Next year, Alice is {}", years + 1),
        None => println!("No such user"),
    }
}
```

The billion-dollar mistake of null pointers, "Cannot read properties of
undefined" in JavaScript, simply can't happen. The compiler makes you handle
the missing case.

### Handy Option methods

Writing a `match` for every `Option` gets long. There are methods for the
common cases:

```rust
fn main() {
    let some: Option<u32> = Some(30);
    let none: Option<u32> = None;

    println!("{}", some.unwrap_or(0)); // Output: 30
    println!("{}", none.unwrap_or(0)); // Output: 0, a default value
    println!("{:?}", some.map(|age| age + 1)); // Output: Some(31)
    println!("{:?}", none.map(|age| age + 1)); // Output: None
    println!("{}", some.is_some()); // Output: true

    // unwrap gives the value, but panics if there is none.
    // Fine in quick experiments, but avoid it in real code.
    println!("{}", some.unwrap()); // Output: 30
}
```

`|age| age + 1` is a closure, a small inline function. It's like
`(age) => age + 1` in JavaScript. We'll look closer at closures in the article
about iterators.

## if let and let else

When you only care about one pattern, `match` is more than you need. `if let`
runs a block if a value matches a pattern:

```rust
fn main() {
    let maybe_name: Option<&str> = Some("Alice");

    if let Some(name) = maybe_name {
        println!("Hello, {name}!");
    } else {
        println!("Hello, stranger!");
    }
}
```

`let else` is the opposite. It takes a value out of a pattern, and if the value
doesn't match, the `else` block must leave the function:

```rust
fn greet(maybe_name: Option<&str>) {
    let Some(name) = maybe_name else {
        println!("No name given");
        return;
    };

    // From here on, name is a plain &str
    println!("Hello, {name}!");
}

fn main() {
    greet(Some("Alice"));
    greet(None);
}
```

This keeps the main path of a function free from nesting, and is one of my
favorite features of the language.

## More Patterns

Patterns can do more than pick an enum variant:

```rust
fn describe(point: (i32, i32)) -> String {
    match point {
        (0, 0) => "the origin".to_string(),
        (x, 0) => format!("on the x axis at {x}"),
        (0, y) => format!("on the y axis at {y}"),
        (x, y) if x == y => format!("on the diagonal at {x}"),
        (x, y) => format!("somewhere else, at {x}, {y}"),
    }
}

fn main() {
    println!("{}", describe((0, 0)));
    println!("{}", describe((5, 0)));
    println!("{}", describe((3, 3)));
    println!("{}", describe((2, 7)));
}
```

`if x == y` is called a match guard, an extra condition for that arm. The arms
are checked from top to bottom, and the first match wins.

There's also the `matches!` macro, for when you just need a `bool`:

```rust
#[derive(Debug)]
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn main() {
    let light = TrafficLight::Yellow;
    let must_stop = matches!(light, TrafficLight::Red | TrafficLight::Yellow);
    println!("Must stop: {must_stop}"); // Output: Must stop: true
}
```

## Conclusion

Enums are one of the main reasons people enjoy writing Rust. Instead of
juggling flags and strings, you describe the states your data can be in, and
the compiler makes sure you handle them all.

Remember the student average that returned `NaN` when there were no scores?
With `Option`, the method can say that there is no average:

```rust
struct Student {
    scores: Vec<u32>,
}

impl Student {
    fn average(&self) -> Option<f64> {
        if self.scores.is_empty() {
            return None;
        }
        let sum: u32 = self.scores.iter().sum();
        Some(sum as f64 / self.scores.len() as f64)
    }
}

fn main() {
    let new_student = Student { scores: vec![] };
    let bob = Student { scores: vec![85, 90, 78] };

    for student in [new_student, bob] {
        match student.average() {
            Some(avg) => println!("Average: {avg:.2}"),
            None => println!("No scores yet"),
        }
    }
}
```

`Option` covers values that might be missing. For operations that might fail,
with a reason, Rust has a sibling called `Result`. That's next.
