import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtmlWithNewlines'
})
export class SafeHtmlWithNewlinesPipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): string {
    const replacedValue = value.replace(/\r\n/g, '<br>'); // Transform newlines
    // const val:string = this.sanitizer.bypassSecurityTrustHtml(replacedValue) as string; // Sanitize HTML
    return  replacedValue //val
  }
}
