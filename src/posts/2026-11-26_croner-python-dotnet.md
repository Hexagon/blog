---
layout: post.njk
title: "Croner for Python and .NET: Stable releases"
description: "Croner, the cron library for JavaScript and Rust, now has stable releases for Python on PyPI and for .NET on NuGet."
tags:
  - croner
  - cron
  - scheduling
  - python
  - dotnet
  - csharp
  - programming
  - standalone
priority: 0.8
metas:
  image: "https://hexagon.56k.guru/img/croner_python_dotnet_og.webp"
intro: "Croner started as a cron library for JavaScript, and later got a [Rust version](/posts/croner-for-rust/). It is now also available for Python and .NET, and both have reached their first stable releases."
---

Both libraries follow the same pattern syntax, DST rules and test cases as
[croner for JavaScript](https://github.com/Hexagon/croner) 11.0.1 and
[croner-rust](https://github.com/Hexagon/croner-rust) 5.0.1. The syntax follows
the [Open Cron Pattern Standard](https://github.com/open-source-cron/ocps)
(OCPS) 1.0 to 1.4: optional seconds and years, `L`, `W`, `#`, `+` and `?`.

### Python

- Repository: [github.com/Hexagon/croner-py](https://github.com/Hexagon/croner-py)
- Package: [pypi.org/project/croner](https://pypi.org/project/croner/)
- Current version: 1.2.0

```bash
pip install croner
```

```python
from croner import Cron

# The next 5 Sundays
print(Cron("0 0 * * SUN").next_runs(5))

# Schedule a function, as a decorator
@Cron("*/5 * * * * *", protect=True)
def every_five_seconds(job):
    print("Next run:", job.next_run())
```

It has no dependencies beyond the standard library, needs Python 3.9 or later,
and is fully typed. Time zones come from `zoneinfo`. Both plain and `async def`
functions can be scheduled.

### .NET

- Repository:
  [github.com/Hexagon/croner-dotnet](https://github.com/Hexagon/croner-dotnet)
- Package: [nuget.org/packages/Croner](https://www.nuget.org/packages/Croner)
- Current version: 1.0.0

```sh
dotnet add package Croner
```

```csharp
using Croner;

var cron = Cron.Parse("0 0 * * FRI");
DateTimeOffset next = cron.GetNextOccurrence(DateTimeOffset.UtcNow, TimeZoneInfo.Local);
Console.WriteLine(cron.Describe()); // "At 00:00, on Friday."

using var job = new CronJob("*/5 * * * * *", _ => Console.WriteLine("Every fifth second"));
```

It has no dependencies, targets .NET 8 and .NET 10, and is trimming and AOT
compatible. Jobs take their clock from a `TimeProvider`, so schedules can be
tested deterministically. From 1.0.0 on, the public API follows semantic
versioning.

### Feedback

Issues and pull requests are welcome in each repository.

---

*This post was written with help from AI (Claude), and reviewed and edited by
me.*
