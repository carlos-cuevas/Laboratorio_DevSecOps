/**
 * Renders JSON-LD as a server-side `<script>` so it ships in the
 * pre-rendered HTML (the `next/script` component hydrates on the client,
 * which some crawlers miss).
 */
export default function JsonLd({ id, data }: { id: string; data: unknown }) {
  // Escape `</` so a content value can never close the script tag early.
  const html = JSON.stringify(data).replace(/<\//g, '<\\/');
  return (
    <script
      id={id}
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
