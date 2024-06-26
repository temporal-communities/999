import diceChart from "$lib/assets/dice_chart.json"
import almanacText from "$lib/assets/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele.xml?raw"
import xslStyle from "$lib/assets/transform.xsl?raw"
import { xsltTransform } from "$lib/xslt"
import type { PageLoad } from "./$types"
export const ssr = false

export const load: PageLoad = async () => {
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

  // Parse play XML
  const dom = new window.DOMParser().parseFromString(almanacText, "text/xml")

  // Get all segment divs and store in object
  // e.g. <div type="segment" n="1">
  const segments: Record<string, string> = {}
  const segmentDivs = dom.querySelectorAll('div[type="segment"]')
  const promises = Array.from(segmentDivs).map(async (div) => {
    const n = div.getAttribute("n")!
    const html = await xsltTransform(div.outerHTML, xslStyle)
    segments[n] = html
  })

  await Promise.all(promises)

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
