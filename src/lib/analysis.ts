import { Almanac } from "./almanac"

// find random shortest play sequence and word count
export function getRandomShortestPlay(): { wordCount: number; sequence: number[] } {
  const almanacDoc = Almanac.getDom()
  const segmentDivs = Array.from(almanacDoc.querySelectorAll('div[type="segment"]'))

  let shortestPlaySequence: number[] = []
  let shortestPlayLength = 0

  for (let roll = 1; roll <= 200; roll++) {
    let minLength = Infinity
    let shortestPips: number[] = []

    for (let pips = 1; pips <= 6; pips++) {
      const segmentId = Almanac.getSegmentId(roll, pips)
      const segmentDiv = segmentDivs[segmentId - 1]
      const divText = segmentDiv.textContent || ""
      const wordCount = (divText.match(/\p{L}+/gu) || []).length
      // Regex explanation:
      // \p{L}   => matches any kind of letter from any language (Unicode letter)
      // +       => matches one or more letters (i.e., a whole word)
      // g flag  => global: find all matches, not just the first one
      // u flag  => unicode: enables full unicode matching (necessary for \p{} to work)

      if (wordCount < minLength) {
        minLength = wordCount
        shortestPips = [pips]
      } else if (wordCount === minLength) {
        // track multiple pips candidates of one roll that result in the same shortest word count
        shortestPips.push(pips)
      }
    }

    shortestPlayLength += minLength
    // randomly pick one pips candidate
    shortestPlaySequence[roll - 1] = shortestPips[Math.floor(Math.random() * shortestPips.length)]
  }

  return {
    wordCount: shortestPlayLength,
    sequence: shortestPlaySequence
  }
}

// find random longest play sequence and word count
export function getRandomLongestPlay(): { wordCount: number; sequence: number[] } {
  const almanacDoc = Almanac.getDom()
  const segmentDivs = Array.from(almanacDoc.querySelectorAll('div[type="segment"]'))

  let longestPlaySequence: number[] = []
  let longestPlayLength = 0

  for (let roll = 1; roll <= 200; roll++) {
    let maxLength = -Infinity
    let longestPips: number[] = []

    for (let pips = 1; pips <= 6; pips++) {
      const segmentId = Almanac.getSegmentId(roll, pips)
      const segmentDiv = segmentDivs[segmentId - 1]
      const divText = segmentDiv.textContent || ""
      const wordCount = (divText.match(/\p{L}+/gu) || []).length
      // Regex explanation:
      // \p{L}   => matches any kind of letter from any language (Unicode letter)
      // +       => matches one or more letters (i.e., a whole word)
      // g flag  => global: find all matches, not just the first one
      // u flag  => unicode: enables full unicode matching (necessary for \p{} to work)

      if (wordCount > maxLength) {
        maxLength = wordCount
        longestPips = [pips]
      } else if (wordCount === maxLength) {
        // track multiple pips candidates of one roll that result in the same longest word count
        longestPips.push(pips)
      }
    }

    longestPlayLength += maxLength
    // randomly pick one pips candidate
    longestPlaySequence[roll - 1] = longestPips[Math.floor(Math.random() * longestPips.length)]
  }

  return {
    wordCount: longestPlayLength,
    sequence: longestPlaySequence
  }
}

// function to print both results
export function getRandomLongestAndShortestPlay(): void {
  const shortest = getRandomShortestPlay()
  const longest = getRandomLongestPlay()

  const result = {
    shortestPlay: {
      wordCount: shortest.wordCount,
      sequence: shortest.sequence
    },
    longestPlay: {
      wordCount: longest.wordCount,
      sequence: longest.sequence
    }
  }

  console.log(JSON.stringify(result, null, 2))
}

// NOTES
// Ohne List glückt’s keiner Liebe. --> sind das 5 oder 6 Wörter?
