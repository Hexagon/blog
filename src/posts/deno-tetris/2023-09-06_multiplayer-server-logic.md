---
title: "Adding Multiplayer: Server Logic"
part: 5
intro: "Welcome to part five of our Detris series. In this article, we dive into multiplayer action, where we deal with multiple players, and real-time updates. Buckle up!"

---

## Adding Multiplayer: Server Logic

To implement the multiplayer modes, we mainly use the following files:

- `game/modes/coop.ts`: Co-Op mode
- `game/modes/battle.ts`: Battle mode

The actual files are found at
[https://github.com/Hexagon/detris/tree/main/game/mode](https://github.com/Hexagon/detris/tree/main/game/mode)

Let's go through the differences compared to single player mode:

### Player Management

In a single-player game, you're only concerned with one player's actions. In a
multiplayer game, you need to handle multiple players, each with their own game
state. Create a players array to keep track of connected players.

```javascript
players: Player[];
```

### Game State Sharing

In single-player mode, the game state (`grid`, `Tetrominoes`, `Position`, etc.)
is only for one player. In multiplayer, you'll have to manage and share the game
state among all players.

### Key Differences in Class Methods

#### Constructor

In single-player mode, you initialize the game state directly in the
constructor. For multiplayer, you'll initialize the game state for each player
separately.

##### checkRequirements

In a single-player game, you only need to check if there's one player. For
multiplayer, you'll need to check for the required number of players:

```javascript
checkRequirements(): boolean {
  return (this.players.length >= 2);
}
```

##### broadcast

In a single-player game, you only broadcast messages to one client. In
multiplayer, you'll loop through all players:

```javascript
broadcast(m: unknown) {
  for (const player of this.players) {
    player.sendMessage(JSON.stringify(m));
  }
}
```

##### act Method

The act method in single-player mode is straightforward; it directly manipulates
the game state. In multiplayer, you'll have to identify which player initiated
the action:

```javascript
public act(player: Player, key: string, state: boolean): void {
  // Identify player and manipulate their specific game state
}
```

##### iterate Method

In single-player, the iterate method updates the game state. For multiplayer,
you'll need to iterate over each player's game state:

```javascript
iterate(): boolean {
  for (const player of this.players) {
    // Update each player's game state
  }
  return true;
}
```

## Wrapping Up

The main difference in adding multiplayer is managing multiple game states and
player interactions. You'll need to keep track of each player's state, update it
individually, and then broadcast the changes to all connected players.

That's it for now! You're now equipped to take your Tetris game into the
multiplayer arena. Stay tuned for more updates!
