function generateBoard2(rows, columns) {
  // The resulting board configuration
  let board = Array(rows)
  let rowHeaders = Array(rows).fill().map(_ => [])
  let columnHeaders = Array(columns).fill().map(_ => [])
  let filledCellsCount = 0
  let emptyCellsCount = 0
  // Generate board and row headers
  for (var i = 0; i < rows; i++) {
    let row = Array(columns)
    let index = 0
    // Whether to start the row with an empty or filled cell
    let fill = Boolean(Math.floor(Math.random() * 2))
    while (index < columns) {
      // Number of connected cells (can be empty or filled)
      let connectedCells = Math.ceil(Math.random() * (columns - index))
      for (var _ = 0; _ < connectedCells; _++) {
        row[index++] = fill
        filledCellsCount += fill
        emptyCellsCount += !fill
      }
      if (fill) {
        rowHeaders[i].push(connectedCells)
      }
      fill = !fill
    }
    if (rowHeaders[i].length == 0) rowHeaders[i] = [0]
    board[i] = row
  }
  // Generate column headers
  for (var c = 0; c < columns; c++) {
    let isFilled = board[0][c]
    let currentLength = 0
    for (var r = 0; r < rows; r++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) columnHeaders[c].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) columnHeaders[c].push(currentLength)
    if (columnHeaders[c].length == 0) columnHeaders[c] = [0]
  }
  return { board, rowHeaders, columnHeaders, filledCellsCount, emptyCellsCount }
}

function generateBoard(rows, columns) {
  // The resulting board configuration
  let board = Array(rows)
  let rowHeaders = Array(rows).fill().map(_ => [])
  let columnHeaders = Array(columns).fill().map(_ => [])
  let filledCellsCount = 0
  let emptyCellsCount = 0

  for (var r = 0; r < rows; r++) {
    let row = Array(columns)
    for (var c = 0; c < columns; c++) {
      row[c] = (Math.random() - 0.4 > 0)
      filledCellsCount += row[c]
      emptyCellsCount += !row[c]
    }
    board[r] = row
  }

  // Generate row headers
  for (var r = 0; r < rows; r++) {
    let isFilled = board[r][0]
    let currentLength = 0
    for (var c = 0; c < columns; c++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) rowHeaders[r].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) rowHeaders[r].push(currentLength)
    if (rowHeaders[r].length == 0) rowHeaders[r] = [0]
  }

  // Generate column headers
  for (var c = 0; c < columns; c++) {
    let isFilled = board[0][c]
    let currentLength = 0
    for (var r = 0; r < rows; r++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) columnHeaders[c].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) columnHeaders[c].push(currentLength)
    if (columnHeaders[c].length == 0) columnHeaders[c] = [0]
  }

  return { board, rowHeaders, columnHeaders, filledCellsCount, emptyCellsCount }
}

async function newSeek(options) {
  // Request seek
  const seek = await fetch("http://localhost:3000/seek/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      playerId: options.playerId,
      boardDimensions: options.boardDimensions
    })
  }).then(res => res.json())
  return seek.map(seekRequest => {
    return {
      playerId: seekRequest.playerId,
      playerName: seekRequest.playerId,
      boardDimensions: seekRequest.boardDimensions,
      rating: 2000
    }
  })
}

export default { generateBoard, generateBoard2, newSeek }