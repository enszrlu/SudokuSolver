const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1..a.8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let longPuzzle = puzzles[0][0] + "1";
let impossibleToSolvePuzzle = "..3..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string', function (done) {
        for (var puzzle in puzzles) {
            chai.request(server)
                .post('/api/solve').send({ puzzle: puzzle[0] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                    assert.equal(res.body.solution, puzzle[1], "Response body.solution should be correct");
                });
        }
        done();
    });

    test('Solve a puzzle with missing puzzle string', function (done) {
        chai.request(server)
            .post('/api/solve')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'Required field missing', "Response body.error should be correct");

                done();
            });
    });

    test('Solve a puzzle with invalid characters', function (done) {
        chai.request(server)
            .post('/api/solve').send({ puzzle: invalidPuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'Invalid characters in puzzle', "Response body.error should be correct");

                done();
            });
    });


    test('Solve a puzzle with incorrect length', function (done) {
        chai.request(server)
            .post('/api/solve').send({ puzzle: longPuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long", "Response body.error should be correct");

                done();
            });
    });

    test('Solve a puzzle that cannot be solved', function (done) {
        chai.request(server)
            .post('/api/solve').send({ puzzle: impossibleToSolvePuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Puzzle cannot be solved", "Response body.error should be correct");

                done();
            });
    });

    test('Check a puzzle placement with all fields', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1", value: "7" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.isTrue(res.body.valid, "Response body.valid should be true");
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1", value: "2" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.isFalse(res.body.valid, "Response body.valid should be false");
                assert.include(res.body.conflict, "region", "Response body.conflict should contain 'region'");
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1", value: "8" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.isFalse(res.body.valid, "Response body.valid should be false");
                assert.include(res.body.conflict, "region", "Response body.conflict should contain 'region'");
                assert.include(res.body.conflict, "column", "Response body.conflict should contain 'column'");
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.isFalse(res.body.valid, "Response body.valid should be false");
                assert.include(res.body.conflict, "region", "Response body.conflict should contain 'region'");
                assert.include(res.body.conflict, "column", "Response body.conflict should contain 'column'");
                assert.include(res.body.conflict, "row", "Response body.conflict should contain 'row'");
                done();
            });
    });

    test('Check a puzzle placement with missing required fields', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Required field(s) missing", "Response body.error should be correct");
            });
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Required field(s) missing", "Response body.error should be correct");
            });
        chai.request(server)
            .post('/api/check').send({ coordinate: "A1", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Required field(s) missing", "Response body.error should be correct");
                done();
            });
    });


    test('Check a puzzle placement with invalid characters', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: invalidPuzzle, coordinate: "A1", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Invalid characters in puzzle", "Response body.error should be correct");
                done();
            });
    });

    test('Check a puzzle placement with incorrect length', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: longPuzzle, coordinate: "A1", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long", "Response body.error should be correct");
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "T1", value: "5" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Invalid coordinate", "Response body.error should be correct");
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value', function (done) {
        chai.request(server)
            .post('/api/check').send({ puzzle: puzzle, coordinate: "A1", value: "0" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, "Invalid value", "Response body.error should be correct");
                done();
            });
    });
});

