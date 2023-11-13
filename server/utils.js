// Generate 8-character random game ID
function generateGameId() {
  const chars = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
  ];
  const id = []
  for (var i = 0; i < 8; i++) {
    id.push(chars[Math.floor(Math.random() * chars.length)])
  }
  return id.join("")
}

export default { generateGameId }