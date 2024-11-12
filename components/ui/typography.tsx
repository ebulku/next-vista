export function TypographyH2({ text }: { text: string }) {
  return <h2 className="text-3xl font-bold tracking-tight">{text}</h2>;
}

export function TypographyH4({ text }: { text: string }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{text}</h4>
  );
}
