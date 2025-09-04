// src/ai/genkit.ts
// Lightweight stub for a Genkit-like API (keeps your app compiling until the real pkg is added)

// -----------------
// Minimal "zod-like" surface
// -----------------
type ZodShape = Record<string, unknown>

export type ZodObject = ZodShape & {
  _desc?: string
  describe: (d: string) => ZodObject
}

export type ZodString = {
  type: "string" | "string?"
  _desc?: string
  _optional?: boolean
  describe: (d: string) => ZodString
  optional: () => ZodString
}

export const z = {
  object: (shape: ZodShape): ZodObject => {
    const describe = (d: string): ZodObject => ({ ...shape, _desc: d, describe })
    return { ...shape, describe }
  },

  string: (): ZodString => {
    const describe = (d: string): ZodString => ({
      type: "string",
      _desc: d,
      _optional: false,
      describe,
      optional,
    })
    const optional = (): ZodString => ({
      type: "string?",
      _optional: true,
      describe,
      optional,
    })
    return { type: "string", describe, optional }
  },
} as const

// ✅ Modern ES2015+ style: export a type instead of namespace
export type Infer<T> = T

// -----------------
// Fake AI helper
// -----------------
export const ai = {
  ask: async (prompt: string): Promise<string> => {
    console.warn("⚠️ Genkit AI not installed. Returning dummy response.")
    return `Dummy AI response for: “${prompt}”`
  },

  definePrompt: <TInput extends Record<string, unknown>>(_config: unknown) => {
  return async (
    input: TInput
  ): Promise<{ output: TInput & { formulatedRequest: string } }> => {
    return {
      output: {
        ...input,
        formulatedRequest: "AI response placeholder", // ✅ always returned
      },
    }
  }
},
    
  defineFlow: <TInput, TOutput>(
    config: unknown,
    fn: (input: TInput) => Promise<TOutput>
  ) => {
    void config
    return async (input: TInput): Promise<TOutput> => fn(input)
  },
} as const
