const steps = ['Loan product', 'Security type', 'Your details'];

export function ApplicationStepper({ currentStep }: { currentStep: number }) {
  return (
    <nav className="loan-stepper" aria-label="Application progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        return (
          <div
            className={`loan-step${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
            key={step}
          >
            <span className="loan-step-number">
              {isComplete ? '✓' : stepNumber}
            </span>
            <span className="loan-step-label">{step}</span>
          </div>
        );
      })}
    </nav>
  );
}
