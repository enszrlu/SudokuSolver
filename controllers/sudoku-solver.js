class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) return { valid: false, error: "Expected puzzle to be 81 characters long" }

    let regex = /[^(1-9|\.)]/;

    if (puzzleString.match(regex)) return { valid: false, error: "Invalid characters in puzzle" }

    return { valid: true }

  }

  getRowVal(row) {
    let rowVal;

    switch (row) {
      case "A":
        rowVal = 1;
        break;
      case "B":
        rowVal = 2;
        break;
      case "C":
        rowVal = 3;
        break;
      case "D":
        rowVal = 4;
        break;
      case "E":
        rowVal = 5;
        break;
      case "F":
        rowVal = 6;
        break;
      case "G":
        rowVal = 7;
        break;
      case "H":
        rowVal = 8;
        break;
      case "I":
        rowVal = 9;
        break;
      default:
        rowVal = 0;
        break;
    }

    return rowVal;
  }

  getRowChar(row) {
    let rowVal;

    switch (row) {
      case 1:
        rowVal = "A";
        break;
      case 2:
        rowVal = "B";
        break;
      case 3:
        rowVal = "C";
        break;
      case 4:
        rowVal = "D";
        break;
      case 5:
        rowVal = "E";
        break;
      case 6:
        rowVal = "F";
        break;
      case 7:
        rowVal = "G";
        break;
      case 8:
        rowVal = "H";
        break;
      case 9:
        rowVal = "I";
        break;
      default:
        rowVal = 0;
        break;
    }

    return rowVal;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString).valid) {
      return { error: this.validate(puzzleString).error }
    }

    let rowVal = this.getRowVal(row);

    if (rowVal == 0) return { error: "Invalid coordinate" }

    for (let i = 0; i < 9; i++) {
      if (puzzleString.charAt(9 * (rowVal - 1) + i) == value) {
        return { valid: false, conflict: "row" }
      }
    }

    return { valid: true }
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString).valid) {
      return { error: this.validate(puzzleString).error }
    }

    if (parseInt(column) < 1 || parseInt(column) > 9) return { error: "Invalid coordinate" }


    for (let i = 0; i < 9; i++) {
      if (puzzleString.charAt(i * 9 + parseInt(column) - 1) == value) {
        return { valid: false, conflict: "column" }
      }
    }

    return { valid: true }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString).valid) {
      return { error: this.validate(puzzleString).error }
    }

    let rowVal = this.getRowVal(row);
    if (rowVal == 0) return { error: "Invalid coordinate" }
    if (parseInt(column) < 1 || parseInt(column) > 9) return { error: "Invalid coordinate" }

    let regionCol = Math.floor((column - 1) / 3) * 3;
    let regionRow = Math.floor((rowVal - 1) / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString.charAt((9 * (regionRow + i)) + regionCol + j) == value) {
          return { valid: false, conflict: "region" }
        }
      }
    }

    return { valid: true }
  }

  check(puzzleString, row, column, value) {
    if (!this.validate(puzzleString).valid) {
      return { error: this.validate(puzzleString).error }
    }

    row = row.toUpperCase();

    let rowVal = this.getRowVal(row);
    if (rowVal == 0) return { error: "Invalid coordinate" }
    if (parseInt(column) < 1 || parseInt(column) > 9 || isNaN(parseInt(column))) return { error: "Invalid coordinate" }
    if (parseInt(value) < 1 || parseInt(value) > 9 || isNaN(parseInt(value))) return { error: "Invalid value" }

    if (puzzleString.charAt(((rowVal - 1) * 9) + parseInt(column) - 1) == value) return { valid: true }

    let rowCheck = this.checkRowPlacement(puzzleString, row, column, value);
    let colCheck = this.checkColPlacement(puzzleString, row, column, value);
    let regCheck = this.checkRegionPlacement(puzzleString, row, column, value);

    if (rowCheck.valid && colCheck.valid && regCheck.valid) {
      return { valid: true }
    }
    else {
      let result = { valid: true, conflict: [] }
      if (!rowCheck.valid) {
        result.valid = false;
        result.conflict.push(rowCheck.conflict)
      }
      if (!colCheck.valid) {
        result.valid = false;
        result.conflict.push(colCheck.conflict)
      }
      if (!regCheck.valid) {
        result.valid = false;
        result.conflict.push(regCheck.conflict)
      }

      return result
    }
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString).valid) {
      return { error: this.validate(puzzleString).error }
    }
    let firstDot = puzzleString.indexOf('.');

    if (firstDot == -1) return { status: "solved", solution: puzzleString }

    let rowVal = Math.floor(firstDot / 9) + 1;
    let rowChar = this.getRowChar(rowVal);

    let colVal = firstDot % 9 + 1;

    for (let i = 1; i < 10; i++) {
      /* let rowCheck = this.checkRowPlacement(puzzleString, rowChar, colVal, i);
      let colCheck = this.checkColPlacement(puzzleString, rowChar, colVal, i);
      let regCheck = this.checkRegionPlacement(puzzleString, rowChar, colVal, i); */
      let checkVal = this.check(puzzleString, rowChar, colVal, i)

      if (checkVal.valid) {
        let solution = this.solve(puzzleString.substring(0, firstDot) + i + puzzleString.substring(firstDot + 1));
        if (solution.status == "solved") {
          return solution
        }
      }
    }
    return { status: "error", error: "Puzzle cannot be solved", string: puzzleString }
  }
}

module.exports = SudokuSolver;

