import { Almanac } from "./almanac"

function generateIdFromSequence(sequence: number[]): string {
  return sequence.join("-") // this is a temporary solution
}

async function fetchTemplate(): Promise<Document> {
  const res = await fetch("/play-template.xml")
  const xmlText = await res.text()
  const parser = new DOMParser()
  return parser.parseFromString(xmlText, "text/xml")
}

function collectSegments(sequence: number[], almanacDoc: Document): DocumentFragment {
  const segments = document.createDocumentFragment()
  sequence.forEach((pips, i) => {
    const roll = i + 1
    const segmentId = Almanac.getSegmentId(roll, pips).toString()
    const segment = almanacDoc.querySelector(`div[type="segment"][n="${segmentId}"]`)
    if (segment) {
      segments.appendChild(segment.cloneNode(true)) // append segments to new body
    }
  })
  return segments
}

export async function generateTEIFromSequence(sequence: number[]): Promise<string> {
  const almanacDoc = Almanac.getDom() // parse almanac text XML into DOM document
  const templateDoc = await fetchTemplate() // get xml file template as dom document

  const segments = collectSegments(sequence, almanacDoc) // in the almanacDoc, find divs corresponding to current segment id described by roll number and pips
  const mainDiv = templateDoc.querySelector('body > div[type="main"]')
  mainDiv?.appendChild(segments) // append segments to template body

  // set title for new document
  const newTitle = "This is a new title" // PLACEHOLDER
  templateDoc.querySelector('title[type="sub"]')!.textContent = newTitle

  // convert DOM to XML string
  const serializer = new XMLSerializer()

  return serializer.serializeToString(templateDoc)
}

export async function downloadTEIDoc(sequence: number[]) {
  let xmlString = await generateTEIFromSequence(sequence)
  // const id = generateIdFromSequence(sequence)
  const id = "<filename>"
  // create a downloadable file and temporary URL pointing to the file
  const file = new File([xmlString], `play-${id}.xml`, { type: "application/xml" })
  const url = URL.createObjectURL(file)
  // const a = document.createElement("a")
  // a.href = url
  // a.download = file.name
  // a.click()
  window.open(url, "_blank") // open file in new window
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// Fragen:
// Was genau soll alles in das TEI template?
// Soll es möglich sein auf der Website den Titel selbst einzugeben?

// TODO:
// improve and complete download function
// Welches ist das kürzeste and längst mögliche Stück?
