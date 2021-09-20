import {Component, Input, OnInit} from '@angular/core';
import {Gallery} from '../../../shared/model/gallery';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-member-title',
  templateUrl: './member-title.component.html',
  styleUrls: ['./member-title.component.css']
})
export class MemberTitleComponent implements OnInit {
  @Input() level: string;
  @Input() value: number;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };
  constructor() { }

  ngOnInit() {
  }

}
