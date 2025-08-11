import React from 'react';

interface Step {
  id: string;
  title: string;
  duration: string;
  stepNumber: string;
}

const ProcessSteps: React.FC = () => {
  const steps: Step[] = [
    {
      id: 'assess',
      title: 'Assess Needs',
      duration: '1-3 Weeks',
      stepNumber: 'Step 01'
    },
    {
      id: 'compare',
      title: 'Compare Plans',
      duration: '2-4 Weeks',
      stepNumber: 'Step 02'
    },
    {
      id: 'check',
      title: 'Check Network',
      duration: '1 Week',
      stepNumber: 'Step 03'
    },
    {
      id: 'finalize',
      title: 'Finalize & Enroll',
      duration: '1-3 Weeks',
      stepNumber: 'Step 04'
    }
  ];

  return (
    <div className="process-steps">
      <div className="steps-header">
        <h3 className="steps-title">Answer</h3>
        <p className="steps-description">
          To find the best health plan, you should focus on these key steps and considerations:
        </p>
      </div>
      
      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <p className="step-duration">{step.duration}</p>
            <p className="step-title">{step.title}</p>
            <span className="step-badge">{step.stepNumber}</span>
          </div>
        ))}
      </div>
      
      <p className="steps-footer">
        By following these steps, you can confidently guide your clients to a health plan that 
        provides excellent value and meets their specific healthcare needs.
      </p>
    </div>
  );
};

export default ProcessSteps;
