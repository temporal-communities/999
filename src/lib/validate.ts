/**
 * Check whether dice chart is complete
 */
export function validateDiceChart(diceChart: number[][]) {
  // Must have length 200
  if (diceChart.length !== 200) {
    console.error(`Dice chart length is ${diceChart.length}, expected 200`)
    throw new Error("Malformed dice chart")
  }
  // Must have 6 values per entry
  for (let i = 0; i < diceChart.length; i++) {
    const entry = diceChart[i]
    if (entry.length !== 6) {
      console.error(`Dice chart entry ${i} has length ${entry.length}, expected 6`)
      throw new Error("Malformed dice chart")
    }
  }
}

/**
 * Check whether segments are complete
 */
export function validateSegments(segments: Record<string, string>, n: number) {
  // There should be n segments
  const missing = []
  for (let i = 1; i <= n; i++) {
    if (!segments[i]) {
      missing.push(i)
    }
  }
  if (missing.length) {
    console.error("Missing segments:", missing)
    throw new Error("Missing segments")
  }
}
