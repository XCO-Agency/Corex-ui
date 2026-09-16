export type VideoTutorialBlockPropsType = {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  onPlay?: () => void;
  onOptionsClick?: () => void;
};
