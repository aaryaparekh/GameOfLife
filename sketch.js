//global vars
let res = {
  rows: 35,
  cols: 35
};
let grid1, grid2;
let rectSize;
let canvasSize = {
  wid: 500,
  len: 500
};
let speed = 30; //fps
let curGrid = 0; //for deciding which grid to render

function setup() {
  //noLoop();
  createCanvas(canvasSize.wid, canvasSize.len);
  frameRate(speed);

  //calculate size of square
  if (floor(canvasSize.wid / res.rows) <= floor(canvasSize.len / res.cols)) {
    rectSize = floor(canvasSize.wid / res.rows);
    if (rectSize <= 0) {
      throw "RectSize too small. Probably something wrong with canvasSize";
    }
  } else {
    rectSize = floor(canvasSize.len / res.cols);
  }

  //init grids
  grid1 = Create2DArray(res.rows, res.cols);
  grid2 = Create2DArray(res.rows, res.cols);

  let i, j = 0;
  for (i = 0; i < res.rows; i++) {
    for (j = 0; j < res.cols; j++) {
      grid1[i][j] = floor(random(0, 2));
      grid2[i][j] = 0;
    }
  }
}

function draw() {
  if (curGrid == 0) {
    //grid1 is current grid
    RenderGrid(grid1);
    curGrid = !curGrid; //switch current grid
    //calculate next generation on grid2
    ApplyRules(grid1, grid2);
  } else {
    //grid2 is current grid
    RenderGrid(grid2);
    curGrid = !curGrid; //switch current grid
    //calculate next generation on grid1
    ApplyRules(grid2, grid1);
  }
}

//apply rules to oldGrid and show new generation on newGrid
function ApplyRules(oldGrid, newGrid) {
  let i, j = 0;
  for (i = 0; i < res.rows; i++) {
    for (j = 0; j < res.cols; j++) {
      let count = CountNeighbors(oldGrid, i, j);

      console.log("i: " + i + ", j:" + j);
      console.log("Value: " + newGrid[i][j]);

      if ((count == 2 || count == 3) && oldGrid[i][j] == 1) {
        //any live cell with two or three neighbors survives
        newGrid[i][j] = 1;
      } else if (count == 3 && oldGrid[i][j] == 0) {
        //dead cell with three live neighbors becomes a live cell
        newGrid[i][j] = 1;
      } else {
        //else, all other live cells die, all dead cells remain dead
        newGrid[i][j] = 0;
      }
    }
  }
}

function CountNeighbors(grid, row, col) {
  let count = 0;

  if (row == 0 && col == 0) {
    //top left
    count += grid[row][col + 1];
    count += grid[row + 1][col];
    count += grid[row + 1][col + 1];
  } else if (row == 0 && col == res.cols - 1) {
    //top right
    count += grid[row][col - 1];
    count += grid[row + 1][col];
    count += grid[row + 1][col - 1];
  } else if (row == res.rows - 1 && col == 0) {
    //bottom left
    count += grid[row][col + 1];
    count += grid[row - 1][col];
    count += grid[row - 1][col + 1];
  } else if (row == res.rows - 1 && col == res.cols - 1) {
    //bottom right
    count += grid[row][col - 1];
    count += grid[row - 1][col];
    count += grid[row - 1][col - 1];
  } else if (row == 0) {
    //top-most row excluding corners
    count += grid[row][col - 1];
    count += grid[row + 1][col - 1];
    count += grid[row + 1][col];
    count += grid[row + 1][col + 1];
    count += grid[row][col + 1];
  } else if (row == res.rows - 1) {
    //bottom-most row excluding corners
    count += grid[row][col - 1];
    count += grid[row - 1][col - 1];
    count += grid[row - 1][col];
    count += grid[row - 1][col + 1];
    count += grid[row][col + 1];
  } else if (col == 0) {
    //left-most col excluding corners
    count += grid[row + 1][col];
    count += grid[row + 1][col + 1];
    count += grid[row][col + 1];
    count += grid[row - 1][col + 1];
    count += grid[row - 1][col];
  } else if (col == res.cols - 1) {
    //right-most col excluding corners
    count += grid[row + 1][col];
    count += grid[row + 1][col - 1];
    count += grid[row][col - 1];
    count += grid[row - 1][col - 1];
    count += grid[row - 1][col];
  } else {
    //general case where all 8 neighbors are present
    for (i = row - 1; i <= row + 1; i++) {
      for (j = col - 1; j <= col + 1; j++) {
        count += grid[i][j];
      }
    }
    //subtract self
    count -= grid[row][col];
  }

  return count;
}

function RenderGrid(grid) {
  let i, j = 0;
  for (i = 0; i < res.rows; i++) {
    for (j = 0; j < res.cols; j++) {
      //location, switch rows and cols to render properly
      let y = i * rectSize;
      let x = j * rectSize;

      if (grid[i][j] == 0) {
        //white
        stroke(1);
        fill(255);
        rect(x, y, rectSize, rectSize);
      } else {
        //black
        stroke(1);
        fill(0);
        rect(x, y, rectSize, rectSize);
      }
    }
  }
}

function Create2DArray(rows, cols) {
  let i = 0;
  var array = new Array(rows);
  for (i = 0; i < rows; i++) {
    array[i] = new Array(cols);
  }
  return array;
}