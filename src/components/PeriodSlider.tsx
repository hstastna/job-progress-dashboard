import { ChangeEvent, FC, useCallback, useRef, useState } from "react";
import { periodSignal } from "../signals/periodSignal";
import { DEFAULT_PERIOD } from "../utils/constants";
import { debounce } from "../utils/utils";

export const PeriodSlider: FC = () => {
  const inputId = "period-slider";
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  const debouncedSetPeriod = useRef(
    debounce((...args: unknown[]) => {
      const value = args[0] as number;
      periodSignal.value = value;
    }, 500)
  ).current;

  const handlePeriodChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newPeriod = Number(event.target.value);

      setPeriod(newPeriod);
      debouncedSetPeriod(newPeriod);
    },
    []
  );

  return (
    <label htmlFor={inputId} className="period-label">
      <span>Period: {period} ms</span>
      <input
        id={inputId}
        className="period-input"
        type="range"
        min={50}
        max={5000}
        step={50}
        value={period}
        onChange={handlePeriodChange}
      />
    </label>
  );
};
