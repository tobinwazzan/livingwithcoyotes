// Reusable "Read the role description" disclosure. Inline expandable text box —
// no popup, no client JS. variant matches light vs. dark card backgrounds.

export default function RoleDetails({
  text,
  variant = "light",
  center = false,
}: {
  text: string;
  variant?: "light" | "dark";
  center?: boolean;
}) {
  const summaryColor =
    variant === "dark"
      ? "text-clay hover:text-sand"
      : "text-clay hover:text-ink";
  const boxColor =
    variant === "dark"
      ? "border-sand/15 bg-dusk/40 text-sand/80"
      : "border-line/10 bg-card/70 text-ink/75";

  return (
    <details className={`mt-3 ${center ? "mx-auto max-w-xl" : ""}`}>
      <summary
        className={`cursor-pointer list-none text-sm font-semibold transition [&::-webkit-details-marker]:hidden ${
          center ? "text-center" : ""
        } ${summaryColor}`}
      >
        Read the role description ▾
      </summary>
      <div
        className={`mt-2 rounded-lg border p-4 text-left text-sm leading-relaxed ${boxColor}`}
      >
        {text}
      </div>
    </details>
  );
}
