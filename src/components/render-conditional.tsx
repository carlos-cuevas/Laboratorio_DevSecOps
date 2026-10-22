interface RenderConditionalProps {
  condition: boolean;
  children: React.ReactNode;
}

export default function RenderConditional({
  condition,
  children,
}: RenderConditionalProps) {
  return condition ? children : null;
}
