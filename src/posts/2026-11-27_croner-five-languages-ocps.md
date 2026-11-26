---
layout: post.njk
title: "One cron pattern, five languages: Croner and OCPS"
description: "Croner now exists for JavaScript, Rust, Python, .NET and C++. How the five are kept in agreement, and why a cron standard, OCPS, was needed."
tags:
  - croner
  - cron
  - ocps
  - scheduling
  - javascript
  - rust
  - python
  - dotnet
  - cpp
  - programming
  - standalone
priority: 1.0
metas:
  image: "https://hexagon.56k.guru/img/croner_five_languages_og.webp"
intro: "Croner started as a [small cron library for JavaScript](/posts/scheduling-tasks-with-croner/). It then got a [Rust version](/posts/croner-for-rust/), and recently [Python and .NET versions](/posts/croner-python-dotnet/). Now there is a fifth one, for C++. Five libraries that should answer the same question in the same way: when does `0 0 L * FRI` run next? That turned out to be the easy part. The hard part was deciding what the right answer is."
---

### The five

Here they are, with the current versions:

| Language | Repository | Package | Version |
| :--- | :--- | :--- | :--- |
| JavaScript / TypeScript | [Hexagon/croner](https://github.com/Hexagon/croner) | `croner` on npm and JSR | 11.0.1 |
| Rust | [Hexagon/croner-rust](https://github.com/Hexagon/croner-rust) | `croner` on crates.io | 5.0.1 |
| Python | [Hexagon/croner-py](https://github.com/Hexagon/croner-py) | `croner` on PyPI | 1.2.0 |
| .NET | [Hexagon/croner-dotnet](https://github.com/Hexagon/croner-dotnet) | `Croner` on NuGet | 1.0.0 |
| C++ | [Hexagon/croner-cpp](https://github.com/Hexagon/croner-cpp) | Header only, CMake or Conan | 0.2.0 |

The JavaScript version runs in Node.js, Deno, Bun and the browser, from the
same code. I have written about how that works in the series on
[cross-runtime JavaScript](/posts/cross-runtime-development/introduction/), and
about publishing to JSR in
[Two weeks with jsr.io](/posts/getting-to-know-jsr/).

All of them have no dependencies beyond the standard library of each language
(the Rust version lets you pick `chrono` or `jiff` for time). All of them can
both evaluate a pattern ("when is the next run?") and run a function on a
schedule.

The same schedule, the second Friday of each month at noon, in each language:

```javascript
// JavaScript
import { Cron } from "croner";
new Cron("0 0 12 * * FRI#2").nextRuns(3);
```

```rust
// Rust
use croner::Cron;
use std::str::FromStr as _;
let cron = Cron::from_str("0 0 12 * * FRI#2")?;
```

```python
# Python
from croner import Cron
Cron("0 0 12 * * FRI#2").next_runs(3)
```

```csharp
// .NET
using Croner;
var cron = Cron.Parse("0 0 12 * * FRI#2");
```

```cpp
// C++
#include <croner/croner.hpp>
const croner::Cron cron("0 0 12 * * FRI#2");
cron.next_runs(3);
```

The C++ version is the newest. It is header-only C++17, reads the system
zoneinfo database on Linux, macOS and the BSDs (or uses C++20
`std::chrono::tzdb`), and splits the API in two: `croner::Cron` is an
immutable, thread-safe schedule, and `croner::Job` runs a function on it on a
background thread. It is still 0.x, and 0.2.0 already broke the API from 0.1.0,
so expect a few more changes before 1.0.

### The problem: there is no "cron"

When you write a cron library, you quickly find out that "cron syntax" isn't one
thing. Roughly:

- **POSIX** defines cron, but only the bare minimum. Not even step values like
  `*/5`, or names like `MON`.
- **Vixie cron** (later ISC cron), from 1987, added the things everyone uses
  today: steps, ranges, names, and later nicknames like `@daily`. This is the
  cron on most Linux and BSD systems, and what most people mean by "cron".
- **Quartz**, the Java scheduler, added `L`, `W` and `#`, which are very useful.
  But it also changed things that already had a meaning. Sunday is `1` instead
  of `0`, and day of month and day of week are combined with AND instead of OR,
  which is why Quartz needs `?` to switch one of them off.

Then every library picks a bit from each. Some support seconds, some don't. Some
put the seconds first, some put a year last. `?` means "any" in one library,
"no specific value" in another, and "the time when the job was started" in a
third.

The classic trap is this one:

```
0 12 1 * MON
```

In Vixie cron, this runs at noon on the 1st of every month **and** at noon on
every Monday. In Quartz-style libraries, it runs only on Mondays that are also
the 1st. Same pattern, completely different schedule, and nothing tells you
which one you got.

For one library, you can just pick an answer and document it. For five
libraries that are supposed to agree, "what croner.js happens to do" is not a
good enough specification. Especially not when croner.js itself has changed its
mind on a few of these over the years.

### OCPS: writing it down

That is why the [Open Cron Pattern Specification](https://github.com/open-source-cron/ocps)
(OCPS) exists. The idea is simple: take Vixie cron as the baseline, since that
is what most patterns out there already are, and then add the useful extensions
one small step at a time. Every version is a strict superset of the previous
one. A pattern that is valid in one version must mean exactly the same thing in
all later versions.

The versions are:

| Version | Status | What it adds |
| :--- | :---: | :--- |
| 1.0 | Final | The baseline: five fields, Vixie cron semantics, with the ambiguous cases spelled out. |
| 1.1 | Final | Nicknames: `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`, `@reboot`. |
| 1.2 | Draft | An optional seconds field first, and an optional year field last. |
| 1.3 | Draft | `L` (last), `#` (nth weekday) and `W` (nearest weekday). |
| 1.4 | Draft | `+` for AND between day of month and day of week, `?` marked as non-portable, guidance on DST. |

OCPS 1.1 was finalized today, which is part of the reason for this post.

A few of the choices are worth explaining:

**OR is the default.** `0 12 1 * MON` runs on the 1st or on Mondays, like in
Vixie cron. If you want AND, you say so with a `+` in front of the day of week:
`0 12 1 * +MON` only runs on a Monday the 1st. That makes the AND case explicit
in the pattern itself, instead of in a library option that someone else can't
see when they read the pattern.

**`?` is non-portable.** It has meant too many different things. An OCPS
implementation may accept it, but then only as an alias for `*`, and you
shouldn't use it in patterns that are meant to be shared.

**Seconds go first, years go last.** That is the most common convention, and it
means a 5-field pattern still works everywhere. In a 6-field pattern the extra
field is always seconds, never a year.

**`L`, `W` and `#` come from Quartz, but the weekday numbers don't.** Sunday is
still `0` (or `7`). Croner.js has an `alternativeWeekdays` option for people who
come from Quartz and want `1` to be Sunday, but that is not the default.

### Test vectors instead of prose

A specification in prose is good for people. Machines need examples. So OCPS
also has [conformance test vectors](https://github.com/open-source-cron/ocps/blob/main/data/conformance-tests.json):
a JSON file with, right now, 44 tests grouped by version. Each test is a pattern
and a list of times that must match, must not match, or a pattern that must be
accepted or rejected:

```json
{
  "id": "ocps-1.0-step-evaluation-over-explicit-range",
  "type": "datetime-match",
  "description": "Step evaluation over an explicit range.",
  "pattern": "5-59/15 9 * * *",
  "expectations": {
    "mustMatch": [
      "2025-03-10 09:05:00",
      "2025-03-10 09:20:00",
      "2025-03-10 09:35:00",
      "2025-03-10 09:50:00"
    ],
    "mustNotMatch": ["2025-03-10 09:15:00"]
  }
}
```

The file is plain JSON with a schema, so any implementation in any language can
run it. The Croner libraries do: the .NET version runs every vector as part of
its normal tests, and the C++ version checks out a pinned commit of the OCPS
repository in CI and runs all of them through a small driver.

There are also a few places where all Croner versions knowingly differ from the
specification, and they say so, in one shared list:

- Nicknames are case-insensitive, so `@Daily` is accepted. OCPS says they are
  case-sensitive.
- `@reboot` is rejected when the pattern is parsed, with a clear error. A
  library has no "boot" to run at. OCPS allows rejecting it, but only at run
  time.
- `?` is accepted as `*` in every field, not only the two day fields.

These are old behaviours that people depend on. Changing them would break
existing schedules, and that is exactly what the whole exercise is meant to
avoid. Better to be compatible with yourself and open about where you differ,
than quietly "correct".

There is also an [implementation conformance matrix](https://github.com/open-source-cron/ocps/blob/main/CONFORMANCE.md),
which lists how well 17 popular cron libraries and daemons follow each version.
It is a good place to look if you need to know whether `L` or `@daily` will work
in the tool you are using, Croner or not.

### Keeping five libraries in step

The test vectors cover the specification. They don't cover everything else: time
zones, daylight saving time, leap years, `startAt` and `stopAt`, the 31st in a
30-day month, or what happens one millisecond before midnight. That is where
most of the real bugs are.

So the libraries also test against each other. Croner.js is the reference.
Each of the other versions has a small driver program that reads patterns and
dates from stdin and prints the results, and a script that generates random
patterns, options, time zones and start dates, runs them through both croner.js
and the driver, and compares the answers. In the C++ CI, that is 50 000 random
cases in UTC, 20 000 more with the system time zone set to `Europe/Stockholm`,
and a three-way run against croner.js and croner-rust. The seed is the CI run
number, so every run tests new cases, and a failure can be repeated exactly.

The Python version has the same kind of comparison script against croner.js.
And all of them share the same DST rules. A job is either a fixed-time job, with
a single value for seconds, minutes and hours, or an interval job:

- A fixed-time job (`0 30 2 * * *`) runs **once** when the clock goes back and
  02:30 happens twice.
- It still runs when the clock jumps forward and 02:30 never happens, at the
  first valid time after the gap.
- An interval job (`*/10 * * * * *`, but also `0 30 1,2 * * *`) runs on every
  matching time, including both passes through a repeated hour.

This is close to what Vixie cron does, and it is one of the places where Croner
knowingly differs from the current OCPS 1.4 draft. Getting there took a breaking
change in croner.js 11.0.0, to line it up with croner-rust.

When a random test finds a difference, one of three things is true: the new
library is wrong, croner.js is wrong, or the specification doesn't say. The
first gets fixed in the library. The second gets fixed in croner.js, and several
entries in its changelog now end with "as in croner-rust". The third becomes an
issue on OCPS, and sometimes a clarification in the next revision.

That loop is the real value of having five versions. Every new implementation
reads the specification with fresh eyes, and finds the places where it is
vague.

### Help wanted

OCPS 1.2 to 1.4 are still drafts. If you maintain a cron library, or have
opinions about cron (who doesn't), I would be happy for feedback:

- Read the [specification](https://github.com/open-source-cron/ocps), and open
  an issue if something is unclear, or plain wrong.
- Run the [test vectors](https://github.com/open-source-cron/ocps/blob/main/data/conformance-tests.json)
  against your library, and tell me how it went.
- Correct the [conformance matrix](https://github.com/open-source-cron/ocps/blob/main/CONFORMANCE.md)
  if your favourite library is missing or listed wrong. It is generated from
  `data/conformance.json`, so it is a one-line pull request.

And if you just need a cron library, there is now one for your language. As
long as your language is one of five.

---

*This post was written with help from AI (Claude), and reviewed and edited by
me.*
