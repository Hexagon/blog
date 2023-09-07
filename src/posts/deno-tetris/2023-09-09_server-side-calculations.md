---
title: "Implementing Single-Player Mode: Server-Side Calculations"
part: 4
priority: 4.0
intro: "Welcome back to part four of our Detris series, where we're constructing a Tetris game with Deno as the backbone. Now that we've got our frontend ready, it's time to dive into the game mechanics. In this article, we'll focus on implementing the single-player mode. We'll walk you through the server-side calculations that make the game tick. You'll learn how the game board updates, how rows are cleared, and how the game state evolves. By the end of this article, you'll have a functional single-player mode and a deeper understanding of the server-side logic that powers it. Let's get those blocks falling!"
---

# Implementing Single-Player Mode: Server-Side Calculations

To implement the server-side logic and single-player mode, we mainly use the following files:

- `game/game.ts`: Contains the base game class that we extend to handle the single-player mode.
- `game/grid.ts`: Fefines the game grid, where all the Tetris action happens.
- `game/tetromino.ts`: This is where the Tetromino pieces are defined.

- `game/modes/singleplayer.ts`: Contains the logic specific to the single-player mode.

- `server/baseplayer.ts`: Contains the basic class for any player (AI or human)
- `server/player.ts`: Contains the specifics of a human player.

The actual files are found at [https://github.com/Hexagon/detris/tree/main/game](https://github.com/Hexagon/detris/tree/main/game)

## The Basics of Game Logic

In single-player mode, the game logic is pretty simple. You control a falling piece made up of blocks. You can move it left, right, or down and also rotate it. The goal is to fill up rows with blocks to clear them and score points.

## Server-Side Calculations

The real magic happens on the server side. It takes care of updating the game board, checking for row clears, and tracking your score.

### The SinglePlayerGame Class

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

The GameGrid object represents the Tetris board, including any blocks that have been locked into place.

```javascript
grid: GameGrid;
```

#### Tetrominos

The TetrominoFactory generates new Tetrominos (the shapes). We keep an array called Tetrominoes to hold the current and upcoming Tetrominos.

```javascript
Tetrominoes: Tetromino[];
factory: TetrominoFactory;
```

#### The Game Loop

The game loop on the server keeps everything moving. It's responsible for updating the game board and then sending that updated state to the frontend.

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

#### Moving The Tetromino Down

The moveDown() method tries to move the Tetromino down by one unit. If it can't, it returns false.

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

When a Tetromino can't move down anymore, it's time to lock it in place and update the game board. That's what the lockdown() method does.

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

And that's it for the single-player mode! The server handles all these calculations to make sure the game runs smoothly.

In the next article, we'll take a look at implementing multiplayer mode. See you then!
