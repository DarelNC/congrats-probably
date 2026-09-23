let sent = false

// One page view per load, fire and forget. Skipped in development and when the
// browser asks not to be tracked. Nothing here can throw into the game.
export function trackView() {
  if (import.meta.env.DEV || sent || navigator.doNotTrack === '1') return
  sent = true
  try {
    const params = new URLSearchParams(location.search)
    const body = JSON.stringify({
      ref: document.referrer,
      src: params.get('ref') || params.get('utm_source') || '',
    })
    navigator.sendBeacon('/api/hit', body)
  } catch {
    // an analytics failure must never reach the game
  }
}
