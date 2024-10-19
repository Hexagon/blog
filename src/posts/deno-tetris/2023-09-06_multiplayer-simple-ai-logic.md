---
title: "Creating AI Opponents: Dive into the Code"
part: 6
intro: "Welcome back to part six of our Detris series! After getting our hands dirty with multiplayer, let's tackle another cool feature: AI opponents. This article will walk you through the TypeScript code behind our Tetris AI. We'll look at how the AI decides to move and rotate blocks, and how to plug this AI into your game. Let's dive in!"
---

The source code for the ai player is found at
[server/aiplayer.ts](https://github.com/hexagon/detris/blob/main/server/aiplayer.ts).

## The AIPlayer Class

We have an `AIPlayer` class extending from the `BasePlayer` class. This allows
our AI to act like any other player in the game, with some extra methods to
handle AI logic.

```typescript
class AIPlayer extends BasePlayer {
    private aiInterval: number | undefined;
    ...
}
```

## Decision Timing

The AI doesn't make decisions instantaneously. We introduce some delay to mimic
human-like behavior.

```typescript
private BASE_DECISION_DELAY_MS = 200;
private RANDOM_DECISION_DELAY_MAX_MS = 500;
```

## AI Logic

The AI logic is encapsulated in the `calculateAIControls` method. This function
evaluates the current game state and decides on the best move. It checks for
space below the falling block, and selects the move that minimizes this space,
effectively making the stack more compact.

```typescript
private calculateAIControls(): { [key: string]: boolean } {
    ...
    let leastSpaceBelow = Infinity;
    ...
    for (let rotation = 0; rotation < 4; rotation++) {
    ...
    }
    ...
}
```

## Connecting AI to the Game

To add the AI player to the game, we call the `connect` method. This sets up the
game and starts the AI logic.

```typescript
public connect(game: Game) {
    ...
    this.startAI();
}
```

# Understanding the AI Algorithm

## Calculating the Best Move

The `calculateAIControls` function serves as the brain of the AI. It calculates
the best move by iterating through all possible rotations and positions for the
current Tetromino. The function aims to find the position with the least amount
of space below it, making sure the stack is as compact as possible.

```typescript
private calculateAIControls(): { [key: string]: boolean } {
  ...
  let leastSpaceBelow = Infinity;
  let bestMove = null;

  for (let rotation = 0; rotation < 4; rotation++) {
    // Try different positions
    for (let x = -2; x < grid.width; x++) {
      ...
      // Check for least space below
      const spaceBelow = this.countEmptySpaces(grid, bogusSprite, {
        X: x,
        Y: y,
      });

      if (spaceBelow < leastSpaceBelow) {
        leastSpaceBelow = spaceBelow;
        bestMove = { x, rotation };
      }
      ...
    }
  }
  ...
}
```

And there you have it! Your Tetris game can now pit players against a
computer-controlled opponent. In the next part, we'll wrap it up and discuss
future enhancements. Stay tuned!
