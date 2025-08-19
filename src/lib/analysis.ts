import { Almanac } from "./almanac"

// find random shortest play sequence and word count
export function getRandomShortestPlay({ countLetters = false }: { countLetters?: boolean } = {}): {
  count: number
  sequence: number[]
} {
  const almanacDoc = Almanac.getDom()
  const segmentDivs = Array.from(almanacDoc.querySelectorAll('div[type="segment"]'))

  let shortestPlaySequence: number[] = []
  let shortestPlayLength = 0
  const regEx = countLetters ? /\p{L}/gu : /\p{L}+(?:['’]\p{L}+)*/gu
  // Regex explanation:
  // \p{L}   => matches any kind of letter from any language (Unicode letter)
  // +       => matches one or more letters (i.e., a whole word)
  // (?:['’]\p{L}+)* => allows one or more apostrophes (straight ' or curly ’) within a word
  // g flag  => global: find all matches, not just the first one
  // u flag  => unicode: enables full unicode matching (necessary for \p{} to work)

  for (let roll = 1; roll <= 200; roll++) {
    let minLength = Infinity
    let shortestPips: number[] = []

    for (let pips = 1; pips <= 6; pips++) {
      const segmentId = Almanac.getSegmentId(roll, pips)
      const segmentDiv = segmentDivs[segmentId - 1]
      const divText = segmentDiv.textContent || ""
      const count = (divText.match(regEx) || []).length // count is word count or letter count depending on countLetters
      if (count < minLength) {
        minLength = count
        shortestPips = [pips]
      } else if (count === minLength) {
        // track multiple pips candidates of one roll that result in the same shortest word count
        shortestPips.push(pips)
      }
    }

    // console.log("Roll", roll, ":", shortestPips) // for debugging

    shortestPlayLength += minLength
    // randomly pick one pips candidate
    shortestPlaySequence[roll - 1] = shortestPips[Math.floor(Math.random() * shortestPips.length)]
  }

  return {
    count: shortestPlayLength,
    sequence: shortestPlaySequence
  }
}

// find random longest play sequence and word count
export function getRandomLongestPlay({ countLetters = false }: { countLetters?: boolean } = {}): {
  count: number
  sequence: number[]
} {
  const almanacDoc = Almanac.getDom()
  const segmentDivs = Array.from(almanacDoc.querySelectorAll('div[type="segment"]'))

  let longestPlaySequence: number[] = []
  let longestPlayLength = 0
  const regEx = countLetters ? /\p{L}/gu : /\p{L}+(?:['’]\p{L}+)*/gu
  // Regex explanation:
  // \p{L}   => matches any kind of letter from any language (Unicode letter)
  // +       => matches one or more letters (i.e., a whole word)
  // (?:['’]\p{L}+)* => allows one or more apostrophes (straight ' or curly ’) within a word
  // g flag  => global: find all matches, not just the first one
  // u flag  => unicode: enables full unicode matching (necessary for \p{} to work)

  for (let roll = 1; roll <= 200; roll++) {
    let maxLength = -Infinity
    let longestPips: number[] = []

    for (let pips = 1; pips <= 6; pips++) {
      const segmentId = Almanac.getSegmentId(roll, pips)
      const segmentDiv = segmentDivs[segmentId - 1]
      const divText = segmentDiv.textContent || ""
      const count = (divText.match(regEx) || []).length
      if (count > maxLength) {
        maxLength = count
        longestPips = [pips]
      } else if (count === maxLength) {
        // track multiple pips candidates of one roll that result in the same longest word count
        longestPips.push(pips)
      }
    }

    // console.log("Roll", roll, ":", longestPips) // for debugging

    longestPlayLength += maxLength
    // randomly pick one pips candidate
    longestPlaySequence[roll - 1] = longestPips[Math.floor(Math.random() * longestPips.length)]
  }

  return {
    count: longestPlayLength,
    sequence: longestPlaySequence
  }
}

// function to print both results
export function getRandomLongestAndShortestPlay({
  countLetters = false
}: { countLetters?: boolean } = {}): void {
  const shortest = getRandomShortestPlay({ countLetters: countLetters })
  const longest = getRandomLongestPlay({ countLetters: countLetters })

  let result = {}

  if (countLetters) {
    result = {
      shortestPlay: {
        letterCount: shortest.count,
        sequence: shortest.sequence
      },
      longestPlay: {
        letterCount: longest.count,
        sequence: longest.sequence
      }
    }
  } else {
    result = {
      shortestPlay: {
        wordCount: shortest.count,
        sequence: shortest.sequence
      },
      longestPlay: {
        wordCount: longest.count,
        sequence: longest.sequence
      }
    }
  }

  console.log(JSON.stringify(result, null, 2))
}

export function generateAllSamePipsSequence({ pips = 1 }: { pips?: number } = {}): {
  sequence: number[]
} {
  return {
    sequence: new Array(200).fill(pips)
  }
}

// NOTES
// Ohne List glückt’s keiner Liebe. --> 5 Wörter  ✔
// shortest/longest play: Buchstaben zählen ✔
// nur 1,2,3 etc. ✔
// 100 random Stücke für Dracor
