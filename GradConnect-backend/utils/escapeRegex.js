// Escapes regex special characters so user input can be used safely in a
// MongoDB $regex filter without enabling ReDoS or unintended pattern matches.
function escapeRegex(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { escapeRegex };
