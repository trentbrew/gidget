declare namespace chrome {
  export interface AILanguageModel {
    capabilities(): Promise<{ available: string }>
    create(options: { systemPrompt: string }): Promise<any>
  }

  export interface AIOriginTrial {
    languageModel: AILanguageModel
  }

  export const aiOriginTrial: AIOriginTrial
}
