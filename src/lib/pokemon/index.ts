import { validateSetId } from './sets';

type Step = {
  name: string;
  execute: (setId: string, stepNumber: number, totalSteps: number) => Promise<void>;
};

const STEPS: Step[] = [{ name: 'Validate Set Identifier', execute: validateSetId }];

export const processSet = async (setId: string): Promise<void> => {
  const totalSteps = STEPS.length;

  for (let i = 0; i < totalSteps; i++) {
    const step = STEPS[i];
    const stepNumber = i + 1;

    try {
      await step.execute(setId, stepNumber, totalSteps);
      console.log(`✅ Step ${stepNumber}/${totalSteps} - ${step.name} completed successfully`);
    } catch (error) {
      console.error(`❌ Step ${stepNumber}/${totalSteps} - ${step.name} failed:`, error);
      throw error;
    }
  }
};

const main = async () => {
  const setId = process.argv[2];
  if (!setId) {
    console.error('❌ No set ID provided. Usage: yarn pokemon <set-id>');
    process.exit(1);
  }

  try {
    await processSet(setId);
    console.log(`🎉 All steps completed successfully for set ${setId}!`);
  } catch (error) {
    console.error(`❌ Failed to process set ${setId}:`, error);
    process.exit(1);
  }
};

main();
