export async function xsltTransform(xml: string, xsl: string): Promise<string> {
  const xsltProcessor = new XSLTProcessor()
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  const xslDoc = parser.parseFromString(xsl, "text/xml")
  xsltProcessor.importStylesheet(xslDoc)
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc)
  const result = new XMLSerializer().serializeToString(resultDoc)
  return result
}
