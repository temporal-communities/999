import xmlTemplate from "$lib/assets/play-template.xml?raw"
import { Almanac } from "./almanac"

function removePBsFromDiv(div: Element) {
  Array.from(div.getElementsByTagName("pb")).forEach((pb) => pb.parentNode?.removeChild(pb))
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
      removePBsFromDiv(segment) // remove page breaks from segment

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
  const almanacDoc = Almanac.getDom()
  const templateDoc = new window.DOMParser().parseFromString(xmlTemplate, "text/xml")

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
  segments.removeChild(segments.children[0]) // remove main title
  segments.removeChild(segments.children[0]) // remove subtitle

  // add cast list and set description to front page (removed automatically)
  const front = templateDoc.querySelector("front")
  front?.appendChild(segments.children[0]) // cast list
  front?.appendChild(segments.children[0]) // set description

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
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
