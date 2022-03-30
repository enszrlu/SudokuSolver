'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let coord = req.body.coordinate;
      let val = req.body.value;
      let puzzle = req.body.puzzle;

      if (!puzzle || puzzle == "" || !coord || coord == "" || !val || val == "") return res.json({ error: "Required field(s) missing" })

      let result = solver.check(puzzle, coord.charAt(0), coord.slice(1), val)

      res.json(result)
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;

      if (!puzzle || puzzle == "") return res.json({ error: 'Required field missing' })

      let result = solver.solve(puzzle);

      res.json(result)
    });
};
