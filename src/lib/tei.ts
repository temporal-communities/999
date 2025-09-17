import { Almanac } from "./almanac"

const TEINS = "http://www.tei-c.org/ns/1.0"

function generateIdFromSequence(sequence: number[]): string {
  return sequence.join("-") // this is a temporary solution
}

async function fetchTemplate(): Promise<Document> {
  const res = await fetch("/play-template.xml")
  const xmlText = await res.text()
  const parser = new DOMParser()
  return parser.parseFromString(xmlText, "text/xml")
}

function getSegment(almanacDoc: Document, roll: number, pips: number): Element | null {
  const segmentId = Almanac.getSegmentId(roll, pips).toString()
  const segment = almanacDoc.querySelector(`div[type="segment"][n="${segmentId}"]`)
  return segment
}

// in the almanacDoc, find divs corresponding to current segment id described by roll number and pips
function collectSegments(sequence: number[], almanacDoc: Document): DocumentFragment {
  const segments = document.createDocumentFragment()
  const sceneStartRolls = [3, 4, 13, 18, 27, 28, 29, 57, 61, 96, 112, 114, 131, 145, 170, 184, 191]
  let currentSceneDiv: Element | null = null

  sequence.forEach((pips, i) => {
    const roll = i + 1
    const segment = getSegment(almanacDoc, roll, pips)
    const sceneIndex = sceneStartRolls.indexOf(roll) // if roll number is in sceneStartRolls then it marks a scene start
    const sceneNumber = sceneIndex >= 0 ? sceneIndex + 1 : null // if sceneIndex is -1 then current roll is not a scene start and scenenNumber is null

    if (segment) {
      if (sceneNumber != null) {
        if (currentSceneDiv) segments.appendChild(currentSceneDiv) // finish previous scene
        currentSceneDiv = document.createElementNS("http://www.tei-c.org/ns/1.0", "div") // start new scene
        currentSceneDiv.setAttribute("type", "scene")
        currentSceneDiv.setAttribute("n", sceneNumber.toString())
      }
      // append only the children of the div, not the outer <div type=segment> tag
      Array.from(segment.childNodes).forEach((child) => {
        if (currentSceneDiv) {
          currentSceneDiv.appendChild(child.cloneNode(true))
        } else {
          // if no current scene yet, append directly
          segments.appendChild(child.cloneNode(true))
        }
      })
    }
  })
  // append the last scene
  if (currentSceneDiv) {
    segments.appendChild(currentSceneDiv)
  }
  return segments
}

export async function createTEIDoc(
  sequence: number[]
): Promise<{ doc: string; timestamp: string }> {
  const almanacDoc = Almanac.getDom() // parse almanac text XML into dom document
  const templateDoc = await fetchTemplate() // get xml file template as dom document

  const segments = collectSegments(sequence, almanacDoc)

  // set titles in tei header and front page
  const mainTitle = segments.children[0].textContent
  const subTitle = segments.children[1].textContent
  templateDoc.querySelector('teiHeader titleStmt > title[type="main"]')!.textContent = mainTitle
  templateDoc.querySelector('teiHeader titleStmt > title[type="sub"]')!.textContent = subTitle
  templateDoc.querySelector('front > titlePage > docTitle > titlePart[type="main"]')!.textContent =
    mainTitle
  templateDoc.querySelector('front > titlePage > docTitle > titlePart[type="sub"]')!.textContent =
    subTitle

  // add url to generated play
  templateDoc.querySelector(
    'teiHeader sourceDesc > bibl[type="edition"] > edition > idno'
  )!.textContent = sequence.join("").toString()

  // set sequence as edition in source description
  templateDoc.querySelector(
    'teiHeader sourceDesc > bibl[type="digitalSource"] > idno'
  )!.textContent = "https://temporal-communities.github.io/999/" + sequence.join("").toString()

  // add timestamp
  const date = new Date()
  const timestamp = date.toISOString() // keep full ISO 8601 string as enforced by oxygen
  templateDoc
    .querySelector("teiHeader revisionDesc > listChange > change")!
    .setAttribute("when", timestamp)

  // add titles, cast list and set description to front page and remove from segments
  const front = templateDoc.querySelector("front")
  for (let i = 0; i < 4 && segments.children[i]; i++) {
    front?.appendChild(segments.children[i])
    segments.removeChild(segments.children[i])
  }

  // append segments wrapped in scene divs to template's main section
  const mainDiv = templateDoc.querySelector('body > div[type="main"]')
  mainDiv?.appendChild(segments)

  // convert DOM to XML string
  const serializer = new XMLSerializer()

  return { doc: serializer.serializeToString(templateDoc), timestamp: timestamp }
}

export async function downloadTEIDoc(sequence: number[]) {
  const result = await createTEIDoc(sequence)
  const xmlString = result.doc
  const timestamp = result.timestamp
  // create a downloadable file and temporary URL pointing to the file
  const file = new File([xmlString], `play-${timestamp}.xml`, { type: "application/xml" })
  const url = URL.createObjectURL(file)
  const a = document.createElement("a")
  a.href = url
  a.download = file.name
  a.click()
  // window.open(url, "_blank") // open file in new window
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// NOTES
// improve and complete download function
// wann endet letzte szene? bevor der vorhang fällt oder danach? oder direkt vor Ende des Vorspiels?

//   1. Wurf: Titel + Untertitel
//   2. Wurf: Personen
//   3. Wurf: Szene 1
//   4. Wurf: Szene 2
//  13. Wurf: Szene 3 // WENN 2 GEWÜRFELT WIRD, FEHLT HEADER FÜR SZENE 3
//  18. Wurf: Szene 4
//  27. Wurf: Szene 5
//  28. Wurf: Szene 6
//  29. Wurf: Szene 7
//  57. Wurf: Szene 8
//  61. Wurf: Szene 9
//  96. Wurf: Szene 10
// 112. Wurf: Szene 11
// 114. Wurf: Szene 12
// 131. Wurf: Szene 13
// 145. Wurf: Szene 14 // WENN 2 ODER 6 GEWÜRFELT WIRD, FEHLT HEADER FÜR SZENE 14
// 170. Wurf: Szene 15
// 184. Wurf: Szene 16
// 191. Wurf: Szene 17 (Letzter Auftritt)
// 199. Wurf: (Der Vorhang fällt.)
// 200. Wurf: Ende des Vorspiels.
