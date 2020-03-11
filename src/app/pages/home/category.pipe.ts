import { Pipe, PipeTransform } from '@angular/core';
import { Category } from './../../core/models/file.model';

@Pipe({
  name: 'categoryPipe',
  pure: true
})

export class CategoryPipe implements PipeTransform {
  transform(value: string[], args: Category[]): string {
    let displayValue = '';
    if (typeof value === 'object' && value.length !== undefined && value.length > 0 && args.length > 0) {
      const filtered = [];
      value.forEach((cat) => {
        const selected = args.find((c) => c._id === cat && c.name !== undefined);
        if (selected !== undefined) {
          filtered.push(selected.name);
        }
      });
      displayValue = filtered.toString();
    } else if (typeof value === 'string') {
      const selected = args.find((c) => c._id === value && c.name !== undefined);
      if (selected !== undefined) {
        displayValue = selected.name;
      }
    }
    return displayValue;
  }
}