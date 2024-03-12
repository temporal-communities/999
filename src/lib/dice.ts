// The dice chart has a length of 200 and contains an array of six choices, one for each side of the die.
export function generateRandomSequence(nRolls = 200): number[] {
  // Effectively generate 200 d6 rolls
  const sequence = []

  for (let i = 0; i < nRolls; i++) {
    const roll = Math.floor(Math.random() * 6)
    sequence.push(roll)
  }
  return sequence
}

export function getSegmentIdByIndex(diceChart: number[][], index: number, pips: number): number {
  // index and pips are 1-indexed
  const segmentId = diceChart[index - 1][pips - 1]
  return segmentId
}
