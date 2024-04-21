import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-more-text',
  templateUrl: './show-more-text.component.html',
  styleUrl: './show-more-text.component.css'
})
export class ShowMoreTextComponent {
  @Input() text: string  ='';
  @Input() textLength: number = 50

  more:string = "<span class=\"show\" (click)=\"showMore = false\"> show more</span>"
  less:string = "<span class=\"show\" (click)=\"showMore = false\"> show less</span>"

  showMore:boolean = false

  constructor() {
  }
}
