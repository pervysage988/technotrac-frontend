'use server'

/**
 * @fileOverview A flow that formulates a compelling borrow request using generative AI.
 */

import { ai } from '../genkit'
import { z } from 'zod'

/**
 * -------------------------------
 * Input schema
 * -------------------------------
 */
const FormulateBorrowRequestInputSchema = z.object({
  borrowerId: z.string(),
  equipmentType: z.string(),
  rentalDates: z.string(),
  additionalDetails: z.string().optional(),
  pastBorrowingHistory: z.string().optional(),
})

export type FormulateBorrowRequestInput = z.infer<
  typeof FormulateBorrowRequestInputSchema
>

/**
 * -------------------------------
 * Output schema
 * -------------------------------
 */
const FormulateBorrowRequestOutputSchema = z.object({
  formulatedRequest: z.string(),
})

export type FormulateBorrowRequestOutput = z.infer<
  typeof FormulateBorrowRequestOutputSchema
>

/**
 * -------------------------------
 * Prompt definition
 * -------------------------------
 */
const formulateBorrowRequestPrompt = ai.definePrompt({
  name: 'formulateBorrowRequestPrompt',
  input: { schema: FormulateBorrowRequestInputSchema },
  output: { schema: FormulateBorrowRequestOutputSchema },
  prompt: `You are an AI assistant designed to help borrowers formulate compelling loan requests for farming equipment.

Analyze the borrower's past borrowing history, current equipment needs, and any additional details to create a request that is more likely to be accepted.

Borrower ID: {{{borrowerId}}}
Equipment Type: {{{equipmentType}}}
Rental Dates: {{{rentalDates}}}
Additional Details: {{{additionalDetails}}}
Past Borrowing History: {{{pastBorrowingHistory}}}

Formulate a borrow request:
  `,
})

/**
 * -------------------------------
 * Flow definition
 * -------------------------------
 */
const formulateBorrowRequestFlow = ai.defineFlow(
  {
    name: 'formulateBorrowRequestFlow',
    inputSchema: FormulateBorrowRequestInputSchema,
    outputSchema: FormulateBorrowRequestOutputSchema,
  },
  async (input: FormulateBorrowRequestInput) => {
    const { output } = await formulateBorrowRequestPrompt(input)
    return output!
  }
)

/**
 * -------------------------------
 * Public function
 * -------------------------------
 */
export async function formulateBorrowRequest(
  input: FormulateBorrowRequestInput
): Promise<FormulateBorrowRequestOutput> {
  return formulateBorrowRequestFlow(input)
}
