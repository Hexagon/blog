---
title: "Building the Frontend: HTML, CSS, and Basic JS"
part: 3
priority: 3.0
intro: "Welcome to the third installment of our Detris series, where we're building a web-based Tetris game using Deno. Having set up our project and understood its core files, it's time to turn our attention to the frontend. In this article, we'll explore the `assets` folder to understand how our game will look and feel. We'll delve into the `index.html` file and the accompanying CSS to give our game its visual appeal. Furthermore, we'll discuss how the frontend and backend communicate to create a seamless gaming experience. By the end of this article, you'll have a good grasp of frontend development and be well on your way to creating an engaging user interface for your Tetris game."
---

# Building the Frontend: HTML, CSS, and Basic JS

## Exploring the Assets Folder

The `assets` folder is where all our frontend files live. Inside, you'll find:

- `index.html`: The main HTML file that loads when you visit the game.
- `css/`: A folder containing all the CSS files to make our game look good.

## assets/index.html

This file is the starting point of our game. It includes the game board and
other UI elements. When you open it in a browser, it connects to our Deno
backend.

We will only cover the important parts here, the full file is available at
[https://github.com/Hexagon/detris/blob/main/assets/index.html](https://github.com/Hexagon/detris/blob/main/assets/index.html)

```xml
<!doctype html>
<html>
  <!-- Head section: Sets up metadata, title, and links to stylesheets -->
  <head>
    <meta charset="utf-8">
    <title>Detris</title>
    <!-- ... -->
  </head>

  <!-- Body section: Where all the game UI and elements are placed -->
  <body>
    <!-- Touch Controls: For mobile interactions -->
    <div id="touchcontrols">
      <!-- ... -->
    </div>
    
    <!-- Main Wrapper: Contains all the game views -->
    <div id="wrapper">
      
      <!-- Mode Selection View: To choose the game mode and set nickname -->
      <div class="container view" id="viewModeselect">
        <!-- ... -->
      </div>
      
      <!-- Battle Game View: For PvP mode -->
      <div class="container view" id="viewBattleGame">
        <!-- ... -->
      </div>

      <!-- Battle Highscore View: Shows highscores in PvP mode -->
      <div class="container view" id="viewBattleHighscore">
        <!-- ... -->
      </div>

      <!-- Singleplayer Game View: For single-player mode -->
      <div class="container view" id="viewSingleplayerGame">
        <!-- ... -->
      </div>

      <!-- Co-op Game View: For co-op mode -->
      <div class="container view" id="viewCoopGame">
        <!-- ... -->
      </div>

      <!-- Singleplayer Highscore View: Shows highscores in single-player mode -->
      <div class="container view" id="viewSingleplayerHighscore">
        <!-- ... -->
      </div>

      <!-- Co-op Highscore View: Shows highscores in co-op mode -->
      <div class="container view" id="viewCoopHighscore">
        <!-- ... -->
      </div>

      <!-- Aborted Game View: Shown when the game ends abruptly -->
      <div class="container view" id="viewAborted">
        <!-- ... -->
      </div>

      <!-- Loading View: Shown while the game is loading -->
      <div class="container view" id="viewLoading">
        <!-- ... -->
      </div>

      <!-- Starting Game View: Shown while waiting for players -->
      <div class="container view" id="viewStarting">
        <!-- ... -->
      </div>
      
    </div>

    <!-- Footer: Shows additional information and links -->
    <footer class="row">
      <!-- ... -->
    </footer>

    <!-- Main JS: The JavaScript file that controls the game -->
    <script type="module" src="static/js/main.js?v=3"></script>
  </body>
</html>
```

## The CSS Files

Inside the
[assets/static/css/](https://github.com/Hexagon/detris/tree/main/assets/static/css)
folder, we've got a few different files:

- `main.css`: This is where the main styling for the game lives.
- `normalize.css`: Makes sure our styling looks consistent across different
  browsers.
- `skeleton.css`: A lightweight CSS framework we're using to make our life
  easier.
- `tetrominos.css`: Style of the tetrominoes.

These are very dependent on how you want the game to look and feel, so we won't
go through them in detail. Just copy and modify them to your liking.

## Connecting Frontend to Backend

The frontend communicates with the backend using JavaScript. When you make a
move in the game, it sends a message to the server. The server processes the
move, updates the game state, and then sends it back to be displayed on the
frontend.

So most of the front end code is lazy, it's displaying the menus, passing key
presses, and displaying the game.

All required files reside in
[assets/static/js](https://github.com/Hexagon/detris/tree/main/assets/static/js).

That's it for this article! In the next one, we'll get into how to implement the
single-player mode.

See you there!
