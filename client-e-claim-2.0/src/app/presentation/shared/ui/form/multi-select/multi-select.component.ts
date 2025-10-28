// multi-select.component.ts
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Select options';
  @Input() selectedOptions: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();

  icons = {
    chevron: ChevronDown
  };

  disabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  writeValue(value: string[]): void {
    this.selectedOptions = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleSelection(option: string): void {
    const index = this.selectedOptions.indexOf(option);
    
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }
    
    this.onChange(this.selectedOptions);
    this.onTouched();
    this.selectionChange.emit(this.selectedOptions);
  }

  isSelected(option: string): boolean {
    return this.selectedOptions.includes(option);
  }

  removeOption(option: string, event: Event): void {
    event.stopPropagation();
    const index = this.selectedOptions.indexOf(option);
    if (index !== -1) {
      this.selectedOptions.splice(index, 1);
      this.onChange(this.selectedOptions);
      this.onTouched();
      this.selectionChange.emit(this.selectedOptions);
    }
  }
}