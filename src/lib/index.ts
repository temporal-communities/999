import { browser } from "$app/environment"
import diceChart from "$lib/assets/dice_chart.json"
import almanacText from "$lib/assets/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele.xml?raw"
import xslStyle from "$lib/assets/transform.xsl?raw"
import { validateDiceChart, validateSegments } from "$lib/validate"
import { xsltTransform } from "$lib/xslt"

/**
 * Get play XML DOM
 */
export function getPlayDom() {
  if (!browser) {
    throw new Error("getPlayDom is only available in the browser")
  }

  return new window.DOMParser().parseFromString(almanacText, "text/xml")
}

/**
 * Get segments from play XML
 */
export async function getSegments(): Promise<Record<string, string>> {
  // Parse play XML
  const dom = getPlayDom()

  // Get all segment divs and store in object
  // e.g. <div type="segment" n="1">
  const segments: Record<string, string> = {}
  const segmentDivs = dom.querySelectorAll('div[type="segment"]')
  const promises = Array.from(segmentDivs).map(async (div) => {
    const n = div.getAttribute("n")!
    const html = await xsltTransform(div.outerHTML, xslStyle)
    segments[n] = html
  })

  // Check whether 1200 (200 * 6) segments are present
  await Promise.all(promises)
  validateSegments(segments, 200 * 6)

  return segments
}

/**
 * Get dice roll chart
 */
export function getDiceChart() {
  // Check whether dice chart is complete
  validateDiceChart(diceChart)
  return diceChart
}
