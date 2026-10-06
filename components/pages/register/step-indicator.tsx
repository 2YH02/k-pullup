interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

const StepIndicator = ({
  currentStep,
  totalSteps = 4,
  labels = ["위치", "기구", "설명", "사진"],
}: StepIndicatorProps) => {
  const clampedStep = Math.max(-1, Math.min(currentStep, totalSteps));
  const displayStep = Math.max(1, Math.min(currentStep + 1, totalSteps));

  return (
    <div className="px-6 py-3">
      <div
        role="progressbar"
        aria-label={`${totalSteps}단계 중 ${displayStep}단계`}
        aria-valuenow={displayStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        className="flex gap-0.75"
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none ${
              index <= clampedStep
                ? "bg-primary dark:bg-primary-light"
                : "bg-grey-light dark:bg-grey-dark"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-text-on-surface dark:text-grey-light">
          {labels[Math.min(currentStep, labels.length - 1)]}
        </span>
        <span className="text-[11px] text-text-on-surface-muted dark:text-grey">
          {displayStep} / {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default StepIndicator;
