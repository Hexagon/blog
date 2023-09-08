---
title: "Implementing Single-Player Mode: Server-Side Calculations"
part: 4
priority: 4.0
intro: "Now that we've got our frontend ready, it's time to dive into the game mechanics. In this article, we'll focus on implementing the main loop and single-player mode. We'll walk you through the server-side calculations that make the game tick. You'll learn how the game board updates, how rows are cleared, and how the game state evolves. By the end of this article, you'll have a functional single-player mode and a deeper understanding of the server-side logic that powers it. Let's get those blocks falling!"
---

To implement the server-side logic and single-player mode, we mainly use the
following files:

**Files for the game modes**

- `game/game.ts`: Contains the base game class that we extend to handle the
  single-player mode, and later multiplayer modes.
- `game/modes/singleplayer.ts`: Contains the logic specific to the single-player
  mode.

**Files for the game field**

- `game/grid.ts`: Fefines the game grid, where all the Tetris action happens.
- `game/tetromino.ts`: This is where the Tetromino pieces are defined.

**Helpers for the game loop**

- `server/baseplayer.ts`: Contains the basic class for any player (AI or human)
- `server/player.ts`: Contains the specifics of a human player.

The actual files are found at
[https://github.com/Hexagon/detris/tree/main/game](https://github.com/Hexagon/detris/tree/main/game)

## The Basics of Game Logic

Regardless of game mode, the game logic is pretty simple. You control a falling
piece made up of blocks. You can move it left, right, or down and also rotate
it. The goal is to fill up rows with blocks to clear them and score points.

## Server-Side Calculations

In this implementation, the real magic happens on the server side. It takes care
of updating the game board, checking for row clears, and tracking your score.

### The `SinglePlayerGame` Class

This class is where all the action is. It extends from the generic Game class.

#### Initialize Game State

```javascript
constructor(code?: string) {
  super("singleplayer", code);
  this.grid = new GameGrid(10, 22);
  // ... (more initializations)
  this.nextTetromino();
  this.changed();
}
```

#### Game Grid

The GameGrid object represents the Tetris board, including any blocks that have
been locked into place.

```javascript
grid:
GameGrid;
```

#### Tetrominos

The TetrominoFactory generates new Tetrominos (the shapes). We keep an array
called Tetrominoes to hold the current and upcoming Tetrominos.

```javascript
Tetrominoes: Tetromino[];
factory: TetrominoFactory;
```

#### The Game Loop

The game loop on the server keeps everything moving. It's responsible for
updating the game board and then sending that updated state to the frontend.

```javascript
iterate(): boolean {
  const currentTime = new Date().getTime();
  // ... (other time-related code)
  if (!this.moveDown()) {
    return this.lockdown();
  }
  return true;
}
```

**Here's what happens:**

- **Time Check:** First, we get the current time in milliseconds. We'll use this
  to figure out if it's time to update the game yet.
- **Move Down:** The `moveDown()` function tries to move the Tetromino piece
  down by one block. If it can't move, moveDown() returns false.
- **Move Down:** Lockdown: If `moveDown()` returns false, it’s time to lock the
  Tetromino in place with lockdown().

#### Game Speed - Time Management in the Loop

You might be wondering how the game knows when to move a Tetromino down. That's
where the `iterateDelayMs()` method comes in. It calculates the time delay
between each "tick" of the game loop. The delay gets smaller as you level up,
making the game faster.

```javascript
iterateDelayMs(): number {
  // Reduce 25 ms for each level, bottom out on 110ms
  return Math.max(500 - 25 * this.Level, 100);
}
```

#### Moving The Tetromino Down

As you guessed, `moveDown()` is in charge of moving the Tetromino down. It does
this by creating a "fake" position one block below the current one. If this new
position is valid (i.e., it doesn't collide with other blocks), the Tetromino
moves down.

```javascript
moveDown(): boolean {
  const currentSprite = this.Tetrominoes[0].Sprites[this.Rotation].Data;
  const bogusPosition: Vector = { ...this.Position };
  bogusPosition.Y += 1;

  if (this.validMove(currentSprite, bogusPosition)) {
    this.Position = structuredClone(bogusPosition);
    this.changed();
    return true;
  } else {
    return false;
  }
}
```

#### Locking the Tetromino

What if the Tetromino can't move down anymore? That's when `lockdown()` steps
in. It locks the Tetromino in its current position, updates the game board, and
even adds to your score based on the number of rows cleared.

```javascript
lockdown(): boolean {
  // ... (check validity and adjust position)
  const clearedRows = this.grid.ApplySprite(
    this.Tetrominoes[0].Sprites[this.Rotation].Data,
    this.Position,
    this.Tetrominoes[0].Type,
  );
  // ... (handle cleared rows and score)
  this.nextTetromino();
  this.changed();
  return true;
}
```

#### Details on scoring

Your score isn't just based on what you do, but also on how fast you do it.
Let's examine how the score is calculated:

```javascript
  lockdown(): boolean {
    // ... code

    // Count cleared lines
    this.Lines += clearedRows;

    // Add score for cleared rows
    if (clearedRows == 1) {
      this.addScore(40, true);
    } else if (clearedRows == 2) {
      this.addScore(40 * 2 * 2, true); // x2
    } else if (clearedRows == 3) {
      this.addScore(40 * 3 * 4, true); // x4
    } else if (clearedRows == 4) {
      this.addScore(40 * 4 * 8, true); // x8
    }
    // ... more code
  }

  addScore(baseScore: number, levelBoost: boolean) {
    let newScore = 0;
    if (levelBoost) {
      newScore += baseScore * (this.Level + 1);
    } else {
      newScore += baseScore;
    }
    this.Score += newScore;
  }
```

**Dropping Blocks**

First off, you get points for simply dropping blocks. The farther you drop a
block, the more points you get. So, if you slam a block down 5 rows, you're
going to get more points than if it just falls one row.

**Clearing Rows**

One row gives you 40 points. Clear four rows at once, and boom, you get a crazy
1280 points!

**Level Multiplier**

The higher the level you're on, the more points you earn for each row or drop.
So as you get better and the game gets faster, your potential to score big also
shoots up.

### The `GameGrid` class

Our game grid is what holds all the Tetrominos. Think of it like a big box where
you dump all your blocks. It's a 10x22 unit field, and the top two rows are
hidden. The grid class takes care of clearing rows and checking for game over
conditions.

#### Main Stuff the Grid Does:

- **Clear the Grid**: When you start a new game, this method empties the grid so
  you have a clean slate to play.
- **Apply Sprites**: This method places the Tetromino blocks onto the grid and
  checks if you cleared any rows.

### The `TetrominoFactory` Class

Tetrominos are the different shapes you play with, like the square "O" or the
long "I" shapes. Our `TetrominoFactory` class makes sure you get a random
Tetromino each time.

#### Main Stuff the Tetromino Factory Do:

- **Get a Tetromino**: Based on the type (like "I", "J", "L", etc.), it returns
  the Tetromino you'll play with.
- **Next Tetromino**: If the inventory of Tetrominos is empty, it refills and
  then randomly picks the next Tetromino for you.

#### The `BasePlayer` and `Player`-classes

The Player-class handle tasks that is common for both human and computer-based
players, like setting the current game, keeping track of the players name and
stuff like that.

Extending on that, the Player class handle user input joining games, and handle
the network traffic between browser and server.

We dont't go through the files in detail, but be sure to examine them, and add
them you your project folder. All files are listed at the top of this article.

## Wrapping Up

That's it for the single-player mode! The server handles all these calculations
to make sure the game runs smoothly.

In the next article, we'll take a look at implementing multiplayer mode. See you
then!
