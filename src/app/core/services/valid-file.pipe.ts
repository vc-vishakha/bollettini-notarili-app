import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validFile',
  pure: false,
})
export class ValidFileService implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if (value !== undefined && value !== null) {
      const filename = value;
      const ext = filename.substr(filename.lastIndexOf('.') + 1);
      const subs = filename.substring(0, filename.lastIndexOf(ext) - 1);
      const timestampString = subs.substr(subs.lastIndexOf('-') + 1);
      const isValidTimestamp = new Date(Number(timestampString)).getTime();
      if ( isValidTimestamp === Number(timestampString) ) {
        const finalName = subs.substring(0, subs.lastIndexOf('-'));
        return finalName + '.' + ext;
      } else {
        return subs + '.' + ext;
      }
    } else {
      return '';
    }
  }
}
