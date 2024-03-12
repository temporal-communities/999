import type { PageLoad } from "./$types"
import { base } from "$app/paths"
export const ssr = false

export const load: PageLoad = async ({ fetch }) => {
  // Fetch dice chart JSON
  const diceChart = await fetch(`${base}/dice_chart.json`).then((res) => res.json())

  // Check whether dice chart is complete
  ;(function () {
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
  })()

  // Fetch play XML
  const res = await fetch(
    `${base}/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele_2024-02-22.xml`
  )

  // Parse XML
  const text = await res.text()
  const dom = new window.DOMParser().parseFromString(text, "text/xml")

  // Get all segment divs and store in object
  // e.g. <div type="segment" n="1">
  const segments: Record<string, string> = {}
  const segmentDivs = dom.querySelectorAll('div[type="segment"]')
  for (const div of segmentDivs) {
    const n = div.getAttribute("n")!
    segments[n] = div.outerHTML
  }

  // Check whether 1200 (200 * 6) segments are present
  ;(function () {
    const missing = []
    for (let i = 1; i <= 200 * 6; i++) {
      if (!segments[i]) {
        missing.push(i)
      }
    }
    if (missing.length) {
      console.error("Missing segments:", missing)
      throw new Error("Missing segments")
    }
  })()

  return { dom, segments, diceChart }
}
