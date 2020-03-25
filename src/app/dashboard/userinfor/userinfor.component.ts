import { Component, OnInit } from '@angular/core';
import { Options } from "ng5-slider";
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service.';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})
export class UserinforComponent implements OnInit {
  id: String = '1'
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cookie: CookieService,
  ) { }

  ngOnInit() {
  }
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };

  getUser() {
    this.id = this.route.snapshot.params.id;
  }
}
