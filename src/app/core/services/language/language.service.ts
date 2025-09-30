import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import {
  InstructionLang,
  LanguageOption,
  LanguageState,
} from '@core/services/language/interfaces/language.interface';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly state: WritableSignal<LanguageState> = signal<LanguageState>(
    {
      selected: 'es',
      options: [
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'es', label: 'ES', flag: '🇪🇸' },
        { code: 'de', label: 'DE', flag: '🇩🇪' },
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
        { code: 'it', label: 'IT', flag: '🇮🇹' },
      ],
    }
  );

  public readonly selected: Signal<InstructionLang> = computed(
    () => this.state().selected
  );
  public readonly options: Signal<LanguageOption[]> = computed(
    () => this.state().options
  );

  public setLang(code: InstructionLang): void {
    this.state.update((s: LanguageState) => ({ ...s, selected: code }));
  }

  public setOptions(options: LanguageOption[]): void {
    this.state.update((s: LanguageState) => ({ ...s, options }));
  }
}
