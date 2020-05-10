function stall(ms = 1000) {
  const start = Date.now()
  while (Date.now() - start < ms);
}

module.exports = {stall}
