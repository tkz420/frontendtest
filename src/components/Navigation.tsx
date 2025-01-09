import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  showNavigation: boolean;
}

export const Navigation = ({ onPrevious, onNext, showNavigation }: NavigationProps) => {
  if (!showNavigation) return null;

  return (
    <>
      <button
        onClick={onPrevious}
        className="navigation-arrow left-4"
        aria-label="Previous media"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        className="navigation-arrow right-4"
        aria-label="Next media"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};
