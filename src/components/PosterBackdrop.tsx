// Decorative-only backdrop for the "poster" theme: two slow-spinning rings
// behind the content. Implemented as real elements (not CSS pseudo-elements)
// because the gradient background and grain texture already use body::before
// and ::after.
export default function PosterBackdrop() {
  return (
    <div className="poster-backdrop" aria-hidden="true">
      <div className="poster-ring poster-ring-a" />
      <div className="poster-ring poster-ring-b" />
    </div>
  );
}
