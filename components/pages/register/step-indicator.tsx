interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator = ({ currentStep, totalSteps = 4 }: StepIndicatorProps) => {
  const clampedStep = Math.max(-1, Math.min(currentStep, totalSteps));
  const displayStep = Math.max(1, Math.min(currentStep + 1, totalSteps));

  return (
    <div
      role="progressbar"
      aria-label={`${totalSteps}단계 중 ${displayStep}단계`}
      aria-valuenow={displayStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      className="flex gap-0.75 px-6 py-3"
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
  );
};

export default StepIndicator;
