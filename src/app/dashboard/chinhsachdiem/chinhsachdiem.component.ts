import {Component, OnInit} from '@angular/core';
import {AppSetting} from '../../appsetting';

@Component({
  selector: 'app-chinhsachdiem',
  templateUrl: './chinhsachdiem.component.html',
  styleUrls: ['./chinhsachdiem.component.css']
})
export class ChinhsachdiemComponent implements OnInit {

  baseUrl = AppSetting.BASE_URL;

  constructor() {
  }

  ngOnInit() {
  }

}
