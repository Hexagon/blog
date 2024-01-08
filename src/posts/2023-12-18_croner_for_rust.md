---
layout: post.njk
title: "A detour to Rust: Creating a Rust flavor of Croner"
description: "Delving into the creation of `Croner`, a Rust library for cron scheduling, inspired by limitations in Deno.cron and the lack of timezone and second granularity support in existing Rust libraries."
tags:
  - rust
  - croner
  - cron
  - scheduling
  - programming
priority: 1.0
metas:
  image: "https://hexagon.56k.guru/img/croner_rust.webp"
header: "/img/croner_rust.webp"
intro: "So, there I was, diving into Deno's new feature, Deno.cron, when something caught my eye. It was missing a few things – support for time zones, second granularity, and some extended cron-syntax I like. It got me thinking: could I fill these gaps? Despite not having dabbled in Rust before, I had a fair bit of fun creating the [croner](https://github.com/hexagon/croner) library for JavaScript and TypeScript, so why not give it a shot in Rust?"
---
Rolling up my sleeves - entirely new to Rust, but curious, I wasn't just looking to patch up what I found lacking in Deno.cron; I wanted to build something that could improve on the existing libraries. That's how the Rust version of `croner` started taking shape – not as a direct copy of its JavaScript sibling, but as a efficient Rust library that does a bit more than just parse and evaluate basic cron patterns.

This new `croner`, just as it JavaScript sibling, sticks to the good old POSIX/Vixie-cron standards but with a twist – it brings in some handy extras like `L`, `#`, and `W`. Plus, of course timezone support and an option for second granularity, aiming to make it the cron-library Rust lacks.

While exploring the current options, including `saffron` which is the crate ued by Deno today, I noticed a total lack of options. As an example, both `saffron` and `cron` have chosen to go with an alternative numbering of weekdays introduced and embraced by the Java commutity through Quartz, using 1 for SUN, 2 for MON etc. This does not follow the POSIX-standard used by your regular "system cron", which uses 0 for SUN etc. As a result of that, croner aims to adhere to standards, but introduces options that allow users to tailor how cron patterns patterns are interpreted:

*   `with_seconds_optional`: Brings an extra layer of precision to scheduling. Users can include seconds in their cron patterns if they need to, but it's not a must.
*   `with_seconds_required`: Ensures that every cron pattern explicitly defines the seconds, making scheduling more usable for real time applications.
*   `with_alternative_weekdays`: While croner use POSIX-numbering (0=SUN,1=MON,...) by default, this switches the weekday mode to Quartz-style (1=SUN,2=MON) etc., commonly used in Java-based scheduling systems. While I'm not fond of this, several Rust applications already seem to have adapted the Quartz-numbering.
*   `with_dom_and_dow`: Allows for using `AND` to combine Day of Month (DOM) and Day of Week (DOW) conditions in a cron expressions. The end-user should be able to use this when needed, to create pattern that matches both day of month, and day of week - like when new years is on a friday.

To give a complete picture of the diffreneces of each crate, I'll just snip a comparison table i made for the GitHub README, and edit out the parts supported by both croner and the pre-existing alternatives;

Feature              | Croner      | Cron      | Saffron |
---------------------|-------------|-----------|---------|
Time Zone-support | X         |    X    |     | 
`L` - Last day of month | X         |         |   X   |
`L` - Last occurrence of weekday |    X     |       |       |
`#` - Nth occurrence of weekday |    X     |      |   X    |
`W` - Closest weekday |    X     |        |  X     |
"Standards"-compliant weekdays (1 is monday) |   X    |      |       |
Five part patterns (minute granularity) |  X   |         |    X   |
Six part patterns (second granularity)|  X   |    X    |       |
Aliases (`@hourly` etc.) |  X           |     X      |          |
DOM-and-DOW option |    X     |           |         |

### Getting Started with Croner

Designed to be a (almost) drop-in-replacement for Saffron, Croner is simple to use out of the box. The only third party depenceny is chrono.

To give croner a try. Just add it to your `Cargo.toml`, and try out one of the examples below:

```rust
[dependencies]
croner = "2.0.1" # Adjust the version as necessary
chrono = "0.4.31"
# Optionally
# chrono_tz = "0.8.4"
```

**Usage Examples:**

1. **Matching Current Time and Finding Next Occurrence:**

   ```rust
   use croner::Cron;
   use chrono::Local;

   fn main() {
       let cron = Cron::new("18 * * * 5").parse().expect("Couldn't parse cron string");
       let time = Local::now();
       let matches = cron.is_time_matching(&time).unwrap();
       let next = cron.find_next_occurrence(&time, false).unwrap();
       println!("Pattern matches at {}", next);
   }
   ```

2. **Working with Different Time Zones:**

   ```rust
   use croner::Cron;
   use chrono::{Local, TimeZone};
   use chrono_tz::Tz;

   fn main() {
       let cron = Cron::new("18 * * * 5").parse().expect("Couldn't parse cron string");
       let est_timezone: Tz = "America/New_York".parse().expect("Invalid timezone");
       let time_est = Local::now().with_timezone(&est_timezone);
       let next_est = cron.find_next_occurrence(&time_est, false).unwrap();
       println!("Next match in EST: {}", next_est);
   }
   ```

3. **Calculating Specific Occurrences (e.g., New Year's Eve on a Friday):**

   ```rust
   use croner::Cron;
   use chrono::Local;

   fn main() {
       let cron = Cron::new("0 0 0 31 12 FRI")
           .with_seconds_optional()
           .with_dom_and_dow()
           .parse()
           .expect("Couldn't parse cron string");
       let time = Local::now();
       for time in cron.iter_from(time).take(5) {
           println!("{}", time);
       }
   }
   ```


### Join the discussion ...

As croner is nearing completion, I'm trying to get the discussion going by creating a few issues at the Deno repository. If you're interested in the topic, join in on the discussion:

1. **Bug: Deno.cron Day-of-Week Mismatch** ([Issue #21555](https://github.com/denoland/deno/issues/21555)): This issue points out a discrepancy in how numeric weekdays are handled in Deno.cron. Addressing this could enhance the accuracy and usability of cron patterns.

2. **Feature Request: Enhancing Deno.cron for Second Granularity** ([Issue #21561](https://github.com/denoland/deno/issues/21561)): This feature request focuses on incorporating (or at least allowing) seconds into cron patterns.

3. **Feature Request: Timezone Support for Deno.cron** ([Issue #21562](https://github.com/denoland/deno/issues/21562)): Time zone support is crucial for global applications.

### ... Or Join the Development

I'd also like to encourage you to check out the repository at [github.com/hexagon/croner-rust](https://github.com/hexagon/croner-rust). Try it out, find any yet undiscovered oddities, and/or review the code and get back to me thorugh an Issue. As I mentioned before, this is my first contact with Rust and I'm still learning, so I appreciate any kind of feedback.

### The Future: A Full-Blown Threaded Scheduler for Rust

Besides hoping that the Deno crew adopts `croner` in Deno, I've begun working on a stand-alone threaded scheduler for Rust, utilizing `croner` at its core. This project aims to bring more advanced and standards-compliant scheduling to Rust applications. See [github.com/hexagon/croner-scheduler-rust](https://github.com/hexagon/croner-scheduler-rust) or the `croner-scheduler` crate.

