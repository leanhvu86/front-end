import { Component, OnInit } from "@angular/core";
import { Options } from "ng5-slider";
@Component({
  selector: "app-myrecipe",
  templateUrl: "./myrecipe.component.html",
  styleUrls: ["./myrecipe.component.css"]
})
export class MyrecipeComponent implements OnInit {
  value: number = 2;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };
  constructor() {}

  ngOnInit() {}
}
