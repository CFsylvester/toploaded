import * as readline from 'readline';

// --- CLI Utils ---
export const createReadlineInterface = () =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

export const askQuestion = async (rl: readline.Interface, question: string): Promise<string> =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
