
interface AnchorViewIntroProps {
  onComplete?: () => void;
}

export default function AnchorViewIntro({ onComplete }: AnchorViewIntroProps) {
  onComplete?.();
  return null;
}
