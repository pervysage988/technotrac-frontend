'use server'

/**
 * @fileOverview A flow that formulates a compelling lend request using generative AI.
 */

import { ai } from '../genkit'
import { z } from 'zod'

/**
 * -------------------------------
 * Input schema
 * -------------------------------
 */
const FormulateLendRequestInputSchema = z.object({
  ownerId: z.string(),
  equipmentType: z.string(),
  availabilityDates: z.string(),
  additionalDetails: z.string().optional(),
  pastLendingHistory: z.string().optional(),
  currentEquipmentAvailability: z.string().optional(), // ✅ added
  requestCharacteristics: z.string().optional(),       // ✅ added
})

export type FormulateLendRequestInput = z.infer<
  typeof FormulateLendRequestInputSchema
>

/**
 * -------------------------------
 * Output schema
 * -------------------------------
 */
const FormulateLendRequestOutputSchema = z.object({
  formulatedRequest: z.string(),
})

export type FormulateLendRequestOutput = z.infer<
  typeof FormulateLendRequestOutputSchema
>

/**
 * -------------------------------
 * Prompt definition
 * -------------------------------
 */
const formulateLendRequestPrompt = ai.definePrompt({
  name: 'formulateLendRequestPrompt',
  input: { schema: FormulateLendRequestInputSchema },
  output: { schema: FormulateLendRequestOutputSchema },
  prompt: `You are an AI assistant designed to help equipment owners formulate compelling lend requests.

Analyze the owner's past lending history, equipment availability, and any additional information to create a request that is more likely to attract borrowers.

Owner ID: {{{ownerId}}}
Equipment Type: {{{equipmentType}}}
Availability Dates: {{{availabilityDates}}}
Additional Details: {{{additionalDetails}}}
Past Lending History: {{{pastLendingHistory}}}
Current Equipment Availability: {{{currentEquipmentAvailability}}}
Request Characteristics: {{{requestCharacteristics}}}

Formulate a lend request:
  `,
})

/**
 * -------------------------------
 * Flow definition
 * -------------------------------
 */
const formulateLendRequestFlow = ai.defineFlow(
  {
    name: 'formulateLendRequestFlow',
    inputSchema: FormulateLendRequestInputSchema,
    outputSchema: FormulateLendRequestOutputSchema,
  },
  async (input: FormulateLendRequestInput) => {
    const { output } = await formulateLendRequestPrompt(input)
    return output!
  }
)

/**
 * -------------------------------
 * Public function
 * -------------------------------
 */
export async function formulateLendRequest(
  input: FormulateLendRequestInput
): Promise<FormulateLendRequestOutput> {
  return formulateLendRequestFlow(input)
}
