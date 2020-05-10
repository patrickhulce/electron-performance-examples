# electron-performance-examples

## Overview

Run `yarn && yarn start` to launch the project.

![image](https://user-images.githubusercontent.com/2301202/81505629-51111a80-92b6-11ea-8869-71f3e4de7732.png)

Play around with the buttons to observe how Electron behaves with main-thread activity.

## Background

Electron has a main process and renderer processes, just like Chromium. [Electron's docs](https://www.electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes) and [Cameron's article](https://cameronnokes.com/blog/deep-dive-into-electron's-main-and-renderer-processes/) on this topic are really helpful introductions if you're unfamiliar with the basics.

## Characteristics

- Work in renderers does not affect other renderers.
- Work in the main process _does_ impact renderers but only for handling user input and coordinating IPCs. Notice that while main thread stalls the JS-loop to render random numbers continues even though no buttons will respond to user input.
