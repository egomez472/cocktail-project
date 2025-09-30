export type InstructionLang = 'en' | 'es' | 'de' | 'fr' | 'it';

export interface LanguageOption {
  code: InstructionLang;
  label: string;
  flag: string;
}

export interface LanguageState {
  selected: InstructionLang;
  options: LanguageOption[];
}
