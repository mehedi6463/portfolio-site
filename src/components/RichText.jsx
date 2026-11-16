/** Renders plain text where **double asterisks** mark bold words. No HTML is interpreted. */
export default function RichText({ text = '' }) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );
}
