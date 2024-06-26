import { getDiceChart, getSegments } from "$lib"
import type { PageLoad } from "./$types"

// Disable SSR as we're using browser-specific APIs
export const ssr = false

export const load: PageLoad = async () => {
  const segments = await getSegments()
  const diceChart = getDiceChart()

  return { segments, diceChart }
}
