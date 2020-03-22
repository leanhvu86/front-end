import { Component, OnInit } from '@angular/core';
import { Options } from "ng5-slider";
@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})
export class UserinforComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };


}
