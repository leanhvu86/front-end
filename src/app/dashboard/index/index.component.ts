import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('vi');
    sessionStorage.setItem('currentLang', 'vi');
  }

  ngOnInit() {
  }
  useLanguage(language: string) {
    this.translate.use(language);
    console.log(language);
    sessionStorage.setItem('currentLang', language);

  }
}
