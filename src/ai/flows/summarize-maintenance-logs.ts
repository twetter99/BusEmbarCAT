// Summarize maintenance logs and suggest potential failure points.

'use server';

/**
 * @fileOverview Summarizes maintenance logs and suggests potential failure points.
 *
 * - summarizeMaintenanceLogs - A function that summarizes maintenance logs and suggests potential failure points.
 * - SummarizeMaintenanceLogsInput - The input type for the summarizeMaintenanceLogs function.
 * - SummarizeMaintenanceLogsOutput - The return type for the summarizeMaintenanceLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMaintenanceLogsInputSchema = z.object({
  maintenanceLogs: z
    .string()
    .describe('The maintenance logs to summarize.'),
  checklist: z
    .string()
    .optional()
    .describe('The maintenance checklist to provide context.'),
});
export type SummarizeMaintenanceLogsInput = z.infer<
  typeof SummarizeMaintenanceLogsInputSchema
>;

const SummarizeMaintenanceLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the maintenance logs.'),
  potentialFailurePoints: z
    .string()
    .describe('Suggested potential failure points based on the logs.'),
});
export type SummarizeMaintenanceLogsOutput = z.infer<
  typeof SummarizeMaintenanceLogsOutputSchema
>;

export async function summarizeMaintenanceLogs(
  input: SummarizeMaintenanceLogsInput
): Promise<SummarizeMaintenanceLogsOutput> {
  return summarizeMaintenanceLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMaintenanceLogsPrompt',
  input: {schema: SummarizeMaintenanceLogsInputSchema},
  output: {schema: SummarizeMaintenanceLogsOutputSchema},
  prompt: `You are a maintenance supervisor reviewing maintenance logs to identify potential failure points.

  Summarize the following maintenance logs and suggest potential failure points.

  Maintenance Logs:
  {{maintenanceLogs}}

  {% if checklist %}
  Use the following checklist to provide context:
  {{checklist}}
  {% endif %}

  Respond in the following format:

  Summary: [summary of the maintenance logs]
  Potential Failure Points: [suggested potential failure points]`,
});

const summarizeMaintenanceLogsFlow = ai.defineFlow(
  {
    name: 'summarizeMaintenanceLogsFlow',
    inputSchema: SummarizeMaintenanceLogsInputSchema,
    outputSchema: SummarizeMaintenanceLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
