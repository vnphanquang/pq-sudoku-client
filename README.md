
#  <img src="./.github/expanded-logo.svg" height="80px" alt="pqSudoku logo">

pqSudoku is an **editor** and playground for sudoku enthusiasts, an attempt to provide a platform for puzzle makers. The project is in early development stage
and currently only support tools for creating sudokus, but potentially will extend
to cover more grid-based puzzles.

Inspirations: 
<a href="http://www.littlegogs.com" target="_blank">Duncan's SuDoku Solver</a>,
<a href="https://puzzlemadness.co.uk/" target="_blank">Puzzle Madness</a>,
<a href="https://sudoku.com" target="_blank">Easybrain's Sudoku</a>,
<a href="https://www.youtube.com/channel/UCC-UOdK8-mIjxBQm_ot1T-Q/featured" target="_blank">Cracking The Cryptic</a>,...

---

## Implementation Overview

pqSudoku web app is built upon 
<a href="https://reactjs.org/" target="_blank">React</a>, 
with a major part of its layout and components made possible by 
<a href="https://material-ui.com/" target="_blank">Material-UI</a>. 
Solution for dynamic styling (CSS-in-JS) is provided also by Material-UI API. Global state is managed by
<a href="https://redux.js.org/" target="_blank">Redux</a>, 
<a href="https://react-redux.js.org/" target="_blank">React-redux</a>, 
and perhaps 
<a href="https://redux-observable.js.org/" target="_blank">Redux-observable</a> in the future as dependencies within state components, middlewares, and API requests demand better implementation.

---

## Features in Active Development
  1. Auto-generation and solution algorithm
  2. Error checking within row, column, subgrid, and grid
  3. Customization for SVG export

---

## Support and Collaboration

If you find this project useful, please consider getting involved, leaving issues,bug reports or comments.