export type NowIndicatorPropsType = {
  /** Distance from the top of the column, in px. */
  top: number;
};

export function NowIndicator({ top }: NowIndicatorPropsType) {
  return (
    <div data-slot="calendar-now" aria-hidden="true" style={{ top }}>
      <span data-slot="calendar-now-dot" />
    </div>
  );
}
