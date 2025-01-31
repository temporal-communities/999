import { browser } from "$app/environment"
import diceChart from "$lib/assets/dice_chart.json"
import almanacText from "$lib/assets/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele.xml?raw"
import xslStyle from "$lib/assets/transform.xsl?raw"
import { validateDiceChart, validateSegments } from "$lib/validate"
import { xsltTransform } from "$lib/xslt"

export class Almanac {
  static segmentsCache: Record<string, string> | null = null
  static segmentsPromise: Promise<Record<string, string>> | null = null

  static getDom() {
    if (!browser) {
      throw new Error("getDom is only available in the browser")
    }
    return new window.DOMParser().parseFromString(almanacText, "text/xml")
  }

  static async getSegments(): Promise<Record<string, string>> {
    if (this.segmentsCache) return this.segmentsCache
    if (this.segmentsPromise) return this.segmentsPromise

    this.segmentsPromise = (async () => {
      const dom = this.getDom()
      const segments: Record<string, string> = {}
      const segmentDivs = dom.querySelectorAll('div[type="segment"]')

      const promises = Array.from(segmentDivs).map(async (div) => {
        const n = div.getAttribute("n")!
        const html = await xsltTransform(div.outerHTML, xslStyle)
        segments[n] = html
      })
      await Promise.all(promises)

      validateSegments(segments, 200 * 6)
      this.segmentsCache = segments
      return segments
    })()

    return this.segmentsPromise
  }

  static getDiceChart() {
    validateDiceChart(diceChart)
    return diceChart
  }

  static getSegmentId(roll: number, pips: number): number {
    if (roll < 1 || roll > 200 || pips < 1 || pips > 6) {
      throw new Error("Invalid roll or pip count")
    }
    return diceChart[roll - 1][pips - 1]
  }

  static async getSegment(roll: number, pips: number): Promise<Segment> {
    const id = this.getSegmentId(roll, pips)
    return { id, html: (await this.getSegments())[id] }
  }
}

interface Segment {
  id: number
  html: string
}
