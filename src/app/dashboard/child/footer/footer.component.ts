import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user.service.';
import { Summary } from 'src/app/shared/model/summary';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  summary: Summary
  loadInfo: boolean = false
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getSummary()
  }
  getSummary() {
    this.userService.getSummary(1).subscribe(data => {
      this.summary = data.body['summary']
      this.loadInfo == true
    })
  }
  clickMenu() {
    const radio: HTMLElement = document.getElementById('scroll-to-top');
    radio.click();
  }
}
