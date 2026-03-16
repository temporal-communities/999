import { browser } from "$app/environment"
import diceChart from "$lib/assets/dice_chart.json"
import germanAlmanacText from "$lib/assets/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele.xml?raw"
import englishAlmanacText from "$lib/assets/rolling-the-dice-for-999-and-many-more-almanac-comedies.xml?raw"
import xslStyle from "$lib/assets/transform.xsl?raw"
import { validateDiceChart, validateSegments } from "$lib/validate"
import { xsltTransform } from "$lib/xslt"

type Locale = "de" | "en"

export class Almanac {
  static segmentsCache: Partial<Record<Locale, Record<string, string>>> = {}
  static segmentsPromise: Partial<Record<Locale, Promise<Record<string, string>>>> = {}

  static getDom(locale: Locale = "de") {
    if (!browser) {
      throw new Error("getDom is only available in the browser")
    }
    const text = locale === "de" ? germanAlmanacText : englishAlmanacText
    return new window.DOMParser().parseFromString(text, "text/xml")
  }

  static async getSegments(locale: Locale = "de"): Promise<Record<string, string>> {
    if (this.segmentsCache[locale]) return this.segmentsCache[locale]!
    if (this.segmentsPromise[locale]) return this.segmentsPromise[locale]!

    this.segmentsPromise[locale] = (async () => {
      const dom = this.getDom(locale)
      const segments: Record<string, string> = {}
      const segmentDivs = dom.querySelectorAll('div[type="segment"]')

      const promises = Array.from(segmentDivs).map(async (div) => {
        const n = div.getAttribute("n")!
        const html = await xsltTransform(div.outerHTML, xslStyle)
        segments[n] = html
      })
      await Promise.all(promises)

      validateSegments(segments, 200 * 6)
      this.segmentsCache[locale] = segments
      return segments
    })()

    return this.segmentsPromise[locale]!
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

  static async getSegment(roll: number, pips: number, locale: Locale = "de"): Promise<Segment> {
    const id = this.getSegmentId(roll, pips)
    return { id, html: (await this.getSegments(locale))[id] }
  }
}

interface Segment {
  id: number
  html: string
}
