import { locale } from "$lib/stores/locale"
import { get } from "svelte/store"
import { Almanac } from "./almanac"

// TODO: use english/german according to locale, adapt comments

const lang = get(locale)

function generateIdFromSequence(sequence: number[]): string {
  return sequence.join("-") // this is a temporary solution
}

export async function generateTEIFromSequence(sequence: number[]): Promise<string> {
  const dom = Almanac.getDom() // parse almanac text XML into DOM document
  const body = dom.createElement("body") // create new dom body for one-act play to download

  // in the dom, find div corresponding to current segment id described by current roll number and pips
  sequence.forEach((pips, i) => {
    const roll = i + 1
    const segmentId = Almanac.getSegmentId(roll, pips).toString()
    const segment = dom.querySelector(`div[type="segment"][n="${segmentId}"]`)
    if (segment) {
      body.appendChild(segment.cloneNode(true)) // append segments to new body
    }
  })

  // wrap the new body in TEI element and add meta data including unique play id
  // TODO: use const ns = "http://www.tei-c.org/ns/1.0" and dom.createElementNS(ns, "TEI") for all elements (header, text, body)
  const playId = generateIdFromSequence(sequence)
  const tei = dom.createElement("TEI")
  tei.setAttribute("xmlns", "http://www.tei-c.org/ns/1.0")
  tei.setAttribute("xml:lang", lang)
  const teiHeader = dom.createElement("teiHeader")
  // TODO: change this
  if (lang == "en") {
    teiHeader.innerHTML = `
      <fileDesc>
        <titleStmt><title>Dice-Generated One-Act Play</title></titleStmt>
        <idno type="dice-sequence">${playId}</idno>
        <publicationStmt><publisher>EXC 2020 Temporal Communities</publisher></publicationStmt>
        <sourceDesc><p>Generated using a digitalized version of the Würfelalmanach by Georg Nikolaus Bärmann</p></sourceDesc>
      </fileDesc>
    `
  } else {
    teiHeader.innerHTML = `
      <fileDesc>
        <titleStmt><title>Dice-Generated One-Act Play</title></titleStmt>
        <idno type="dice-sequence">${playId}</idno>
        <publicationStmt><publisher>EXC 2020 Temporal Communities</publisher></publicationStmt>
        <sourceDesc><p>Generated using a digitalized version of the Würfelalmanach by Georg Nikolaus Bärmann</p></sourceDesc>
      </fileDesc>
    `
  }
  tei.appendChild(teiHeader)
  const text = dom.createElement("text")
  text.appendChild(body)
  tei.appendChild(text)

  //   // add header with style information
  //   const header = `<?xml version="1.0" encoding="UTF-8"?>
  // <?xml-stylesheet type="text/css" href="../css/tei.css"?>
  // <?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng"
  //              type="application/xml"
  //              schematypens="http://relaxng.org/ns/structure/1.0"?>`
  const header = `<?xml version="1.0" encoding="UTF-8"?>`

  // convert DOM to XML
  const serializer = new XMLSerializer()
  return `${header}\n${serializer.serializeToString(tei)}`
}

export async function downloadTEIDoc(sequence: number[]) {
  const xml = await generateTEIFromSequence(sequence)
  const id = generateIdFromSequence(sequence)
  // create a downloadable file and temporary URL pointing to the file
  const file = new File([xml], `play-${id}.xml`, { type: "application/xml" })
  const url = URL.createObjectURL(file)
  const a = document.createElement("a")
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
  window.open(url, "_blank") // open file in new window
}
