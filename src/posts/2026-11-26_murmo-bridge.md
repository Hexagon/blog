---
layout: post.njk
title: "Murmo bots: Letting Claude tap me on the shoulder"
description: "The Murmo bridge lets any program message Murmo users over plain HTTPS. Here is how it works, and how I use it to get notifications from Claude."
tags:
  - murmo
  - rootcard
  - security
  - encryption
  - messaging
  - rust
  - ai
  - claude
  - bots
  - standalone
priority: 1.0
metas:
  image: "https://hexagon.56k.guru/img/murmo_bridge_og.webp"
intro: "A few days ago I wrote about [Murmo](/posts/murmo/), the end-to-end encrypted messenger built on rootcard. Since then it has learned a new trick: bots. Any program can now write with Murmo users over plain HTTPS. And the first program I wanted to hook up was Claude, so it can tell me when it is done instead of me checking every five minutes."
---

If you haven't read the post about [Murmo](/posts/murmo/), the short version is:
a federated messenger, end-to-end encrypted, where the server is just a
messenger. This post is about the bridge, which arrived in Murmo 0.3, and about
the very practical reason I built it.

### The itch

I let Claude do more and more of the long-running work. Run the test suite,
review a branch, keep an eye on a release, check something on a schedule. A lot
of that happens in cloud sessions that run without me watching. Which is great,
until I catch myself opening the session every few minutes just to see if it is
finished.

What I wanted was simple: when the job is done, or when something needs me,
Claude sends me a message. On my phone. In the messenger I already use.

So, could Claude just be a Murmo user? Not really. A Murmo client is a browser
with non-extractable WebCrypto keys, a signed device list, prekeys that rotate
every week, envelopes encrypted per device, and receipts. None of that is
something you want to reimplement in a shell script that an AI assistant runs.
Programs want something boring: an HTTP endpoint, an API key, and JSON.

### The bridge

That is the bridge. With `MURMO_BRIDGE=1`, the server also runs **bots**. A bot
is a Murmo account whose single device lives inside the server. The program
talks HTTPS to the bridge, and the bridge speaks the real protocol to everyone
else:

```
program ──HTTPS, API key──► /bridge/api/v1 ──► bot device (in the server) ──► mailbox ──► contacts' devices
owner   ──browser──────────► /bridge/        (rootcard login, bots, keys)
```

The important part is that a bot is **not special** to the rest of Murmo. It is
an ordinary rootcard identity, with an ordinary `Name#TAG` address, an ordinary
device list and an ordinary prekey. Contacts look it up, verify its log and its
device list, and write to it like to anyone else. That also means that a bot
follows the same rules as everyone else. It can't just show up in your chats.
Its first message is a request, and you accept, decline or block it, like for
any stranger.

The bot device is written in Rust, in the server, and has to agree byte for byte
with the JavaScript client: device-list entries, signed prekeys, envelopes and
signed messages. The test suite runs the real client engine against it, so if
one of them drifts, the tests break.

### Making a bot

The owner side is a small page at `/bridge/`. You log in with a rootcard
identity, the same way as in the messenger: the password stays in the browser,
and the page sends the bridge a rootcard proof for a single-use challenge. That
proof is addressed to `<origin>/bridge`, so a proof made for something else, like
linking a device, can't be replayed to log in here.

Then you make a bot. The server registers a fresh identity for it, with a new
recovery key and a random password that nobody ever learns. You get three
things, and you see each of them **once**:

- The bot's address, like `Claude#7Q2D@murmo.org`.
- An API key, `mbk_` followed by 32 random bytes. The server only keeps a hash
  of it.
- The bot's recovery card. The server doesn't keep that either. It is the only
  way to take over or retire the identity later.

Each bot has three settings:

- **Retention.** By default (`0` days), messages to the bot are deleted in the
  same step that hands them to the program. Nothing the program has received is
  left on the server. Or you can keep them for up to 30 days, until the program
  confirms that it has them.
- **Owner only.** The bot only talks with its owner's account. Everything from
  anyone else is deleted unread. No event, no receipt, no answer.
- **Accept requests at once.** For a bot that should answer anyone, like a help
  desk.

### The API

The API for a program is small. With the key as `Authorization: Bearer`:

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/me` | Who am I? |
| POST | `/messages` | Send `{ to, text }` |
| GET | `/messages?after=&wait=` | Get new events, with long polling up to 30 s |
| GET | `/contacts` | The bot's contacts |
| POST | `/contacts/{account}/accept`, `/decline`, `/block` | Answer a request |

Sending a message is one `curl`:

```sh
curl -H "Authorization: Bearer $MURMO_KEY" \
     -H 'Content-Type: application/json' \
     -d '{"to":"Alice#3F9C","text":"The build is green."}' \
     https://murmo.org/bridge/api/v1/messages
```

If Alice hasn't accepted the bot yet, this becomes a request, with the text as
its note. Once she accepts, it is a normal message. Receiving is the other way
around: `GET /messages?wait=30` waits until something arrives, and gives back
events like `message`, `request`, `reaction`, `edit` or `delivered`. Files show
up as a notice with a name and a size, but the bridge doesn't take the file
itself.

There are limits, of course: 60 sends per minute per bot, of which at most 30
requests per hour, texts up to 8 000 characters, at most 2 000 contacts per bot,
and the operator decides who may make bots and how many.

### Hooking up Claude

This is the part that made me build all of the above. Claude Code has
**skills**: a folder with a `SKILL.md` that tells the model when and how to do
something, and optionally a script next to it. So I made a skill called
`murmo-notify`, with a small `notify.sh`:

```sh
notify.sh "Tests pass on the branch, ready for review."
notify.sh --check     # who is the bot? sends nothing
notify.sh --set-key   # read the API key without echoing it
```

The script is about forty lines of bash. It reads the API key from an
environment variable or a file with mode `600`, has my account id hardcoded as
the only recipient, cuts the text at 8 000 characters, and posts it to
`/bridge/api/v1/messages`. The exit code tells Claude what happened: sent, an
error from the server, no key, or that `murmo.org` couldn't be reached at all.
The last one happens in cloud sessions where the network only allows some
hosts, and then Claude tells me that the host needs to be added, instead of
quietly failing.

Most of the skill is not code, though. It is rules, and they matter more:

- **Write short.** What happened, and what (if anything) I need to do. The first
  line should be enough.
- **One message per event, not per step.** Nobody wants a bot that narrates.
- **No secrets in the message.** No keys, no passwords, nothing from a `.env`
  file. More on why below.
- **Only when I asked for it**, or when a scheduled check finds something I need
  to act on.

The bot runs with **owner only** on. So it can only ever write to me, and it
only ever listens to me. Now I can start something in a cloud session, put the
phone in my pocket, and get a message when it is done.

### What you give up

I want to be clear about this, because it goes against the whole idea of Murmo:
**end-to-end encryption ends at the bridge.** The bot's device is in the server,
so the server decrypts what is written to the bot, and then hands it to the
program. For an AI assistant, that means the model provider reads it too. That
is unavoidable. A program that can read your messages can read your messages.

What Murmo does is keep the damage small, and make it visible:

- **The bridge is off by default.** Without `MURMO_BRIDGE=1` there are no
  routes and no table. Nothing of it exists.
- **A bot is its own account, never a device of yours.** Only what is written to
  the bot reaches it. Your other chats are as private as before.
- **It is labelled.** The bot's device is named "Murmo Bridge", in its device
  list and in the safety code. The messenger doesn't yet show more clearly that
  a contact is a bot, and that is on the list.
- **It has to ask first.** Nobody gets messages from a bot without accepting its
  request.
- **It keeps little.** The bot's state, with its keys, contacts and waiting
  events, is encrypted under a key derived from the server's host key. With the
  default retention, events are deleted as soon as the program has them.
- **Owner only stops strangers.** For a personal assistant this is the
  important one. If anyone could write to the bot that Claude reads, anyone
  could try to give Claude instructions. With owner only, everything from
  others is dropped before it becomes an event.

So the rule for the skill is: write to the bot as if the server can read it,
since it can.

### Not yet

The bridge is new, and a few things are missing:

- Bots can't talk with contacts on **other Murmo servers** yet. Federation for
  bots is not there.
- **Files** only arrive as a notice.
- **Disappearing messages** are dropped unread, since the bridge can't make a
  program forget them.

Version 0.3.1, released today, already has a round of fixes from a security
review of the bridge: declines and blocks now count against the contact limit,
and a change by the owner, like turning on owner only or deleting the bot,
takes effect at once, also for a long poll that is already waiting.

### Try it

If you run your own Murmo server, set `MURMO_BRIDGE=1`, and preferably
`MURMO_BRIDGE_OWNERS` to the account ids that may make bots. Read
["The bridge"](https://github.com/Hexagon/murmo/blob/main/docs/HOSTING.md#the-bridge)
in the hosting guide first. The whole protocol and API is in
[DESIGN.md §16](https://github.com/Hexagon/murmo/blob/main/docs/DESIGN.md#16-the-bridge-optional),
and the code is at [github.com/Hexagon/murmo](https://github.com/Hexagon/murmo).

And now, when Claude is done, it sends me a message.

---

*This post was written with help from AI (Claude), and reviewed and edited by
me.*
