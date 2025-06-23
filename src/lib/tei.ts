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

function replaceTags(templateDoc: Document, segments: DocumentFragment): void {
  // replace <titlePart> with <head>
  const titlePartMainTitle = segments.querySelector('titlePart[type="main"]')
  const headMainTitle = templateDoc.createElementNS(TEINS, "head")
  headMainTitle.setAttribute("type", "main")
  headMainTitle.textContent = titlePartMainTitle!.textContent
  titlePartMainTitle!.replaceWith(headMainTitle)
  const titlePartSubTitle = segments.querySelector('titlePart[type="sub"]')
  const headSubTitle = templateDoc.createElementNS(TEINS, "head")
  headSubTitle.setAttribute("type", "sub")
  headSubTitle.textContent = titlePartSubTitle!.textContent
  titlePartSubTitle!.replaceWith(headSubTitle)
  // replace <set> with <stage>
  const set = segments.querySelector("set")
  const stage = templateDoc.createElementNS(TEINS, "stage")
  // move all children from <set> to <stage>
  while (set!.firstChild) {
    stage.appendChild(set!.firstChild)
  }
  set!.replaceWith(stage)
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

export async function createTEIDoc(sequence: number[]): Promise<string> {
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

  // set sequence as edition in source description
  templateDoc.querySelector(
    'teiHeader sourceDesc > bibl[type="edition"] > edition > idno'
  )!.textContent = sequence.join("").toString()

  // remove syntax errors --> in segments replace titlePart with head and set with stage
  replaceTags(templateDoc, segments)

  // append segments wrapped in scene divs to template's main section
  const mainDiv = templateDoc.querySelector('body > div[type="main"]')
  mainDiv?.appendChild(segments)

  // convert DOM to XML string
  const serializer = new XMLSerializer()

  return serializer.serializeToString(templateDoc)
}

export async function downloadTEIDoc(sequence: number[]) {
  let xmlString = await createTEIDoc(sequence)
  // const id = generateIdFromSequence(sequence)
  const id = "<filename>"
  // create a downloadable file and temporary URL pointing to the file
  const file = new File([xmlString], `play-${id}.xml`, { type: "application/xml" })
  const url = URL.createObjectURL(file)
  const a = document.createElement("a")
  a.href = url
  a.download = file.name
  a.click()
  // window.open(url, "_blank") // open file in new window
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// TODO:
// improve and complete download function
// wann endet letzte szene? bevor der vorhang fällt oder danach? oder direkt vor Ende des Vorspiels?
// web app --> option to show shortest and longest play (Worte zählen)
// Wie ist das Spiel entstanden? Woraus besteht es? Bsp: Welche stücke kommen heraus, wenn ich nur 1en, 2en etc würfele?
// corpus mit 100 plays generieren

// NOTES

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
