import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home2Component implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('vi');
  }

  ngOnInit() {
  }
}


