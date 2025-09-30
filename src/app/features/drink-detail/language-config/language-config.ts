import { Injectable, Signal, inject } from '@angular/core';
import { LanguageOption } from '@core/services/language/interfaces/language.interface';
import { LanguageService } from '@core/services/language/language.service';
import { InputFieldSelectConfig } from '@shared/components/input-field/interfaces/input-field.interface';

@Injectable({ providedIn: 'root' })
export class LanguageConfigService {
  private readonly langSvc: LanguageService = inject(LanguageService);

  public readonly options: Signal<LanguageOption[]> = this.langSvc.options;

  public readonly languageSelectBaseConfig: Omit<
    InputFieldSelectConfig<LanguageOption>,
    'selected'
  > = {
    type: 'select',
    icon: 'pi pi-globe',
    placeholder: 'Language...',
    options: this.langSvc.options,
    optionLabel: 'label',
    showClear: false,
  } as const;
}
