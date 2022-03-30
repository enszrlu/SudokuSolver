const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

suite('UnitTests', () => {

    test('Logic handles a valid puzzle string of 81 characters', function () {
        for (var puzzle in puzzles) {
            assert.equal(solver.validate(puzzle[0]).solution, puzzle[1], "Solver should successfully solve the puzzle.")
        }
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1..a.8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        assert.equal(solver.validate(invalidPuzzle).error, "Invalid characters in puzzle", "Solver should successfully give error.")
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        let longPuzzle = puzzles[0][0] + "1"
        assert.equal(solver.solve(longPuzzle).error, "Expected puzzle to be 81 characters long", "Solver should successfully give error.")
    });

    test('Logic handles a valid row placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isTrue(solver.checkRowPlacement(puzzle, "A", 1, 7).valid, "Checker should give true.")
    });

    test('Logic handles an invalid row placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isFalse(solver.checkRowPlacement(puzzle, "A", 1, 1).valid, "Checker should give false.");
    });

    test('Logic handles a valid column placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isTrue(solver.checkColPlacement(puzzle, "A", 1, 7).valid, "Checker should give true.")
    });

    test('Logic handles an invalid column placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isFalse(solver.checkColPlacement(puzzle, "A", 1, 1).valid, "Checker should give false.");
    });

    test('Logic handles a valid region placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isTrue(solver.checkRegionPlacement(puzzle, "A", 1, 7).valid, "Checker should give true.")
    });

    test('Logic handles an invalid region placement', function () {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.isFalse(solver.checkRegionPlacement(puzzle, "A", 1, 5).valid, "Checker should give false.");
    });

    test('Valid puzzle strings pass the solver', function () {
        for (var puzzle in puzzles) {
            assert.equal(solver.solve(puzzle[0]).solution, puzzle[1], "Solver should successfully solve the puzzle.")
        }
    });

    test('Invalid puzzle strings fail the solver', function () {
        let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1..a.8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        assert.equal(solver.solve(invalidPuzzle).error, "Invalid characters in puzzle", "Solver should successfully give error.")
    });

    test('Solver returns the expected solution for an incomplete puzzle', function () {
        for (var puzzle in puzzles) {
            assert.equal(solver.solve(puzzle[0]).solution, puzzle[1], "Solver should successfully solve the puzzle.")
        }
    });
});
