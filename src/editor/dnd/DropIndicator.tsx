interface DropIndicatorProps {
  isVisible: boolean;
}

export function DropIndicator({ isVisible }: DropIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="relative h-1 my-0.5">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 rounded-full" />
      <div className="absolute left-0 top-[-3px] w-2 h-2 bg-blue-500 rounded-full" />
      <div className="absolute right-0 top-[-3px] w-2 h-2 bg-blue-500 rounded-full" />
    </div>
  );
}
