import { Component, OnInit, Input, Output } from '@angular/core';
import { RouteRail } from 'src/app/shared/model/route-rail';

import { RouteRailService } from 'src/app/shared/service/route-rail.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.css']
})
export class RoutingComponent implements OnInit {
  routeRails: RouteRail[] = [];
  constructor(
    private routeRailservice: RouteRailService, private translate: TranslateService) {
    translate.setDefaultLang('vi');
  }

  ngOnInit() {
    this.getRouteRailArray();
  }
  @Input() opened = false;

  /**
   * Text to display in the group title bar
   */
  @Input() title: string;
  public accordianData = [];
  public accordianDataVi = [];
  public accordianDataEn = [];
  /**
   * Emitted when user clicks on group titlebar
   * @type {EventEmitter<any>}
   */
  // @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  getRouteRailArray() {
    let currentLang = sessionStorage.getItem('currentLang');

    console.log(currentLang)
    this.routeRailservice.getRouteRails().subscribe(routeRails => {
      this.routeRails = routeRails;
      console.log('routeRails' + this.routeRails);
      for (let route of this.routeRails) {
        if (route.status === 1) {
          let data = {
            id: route.routeId,
            header: route.nameRoute,
            content: route.description
          }
          this.accordianDataVi.push(data);
        } else if (route.status === 2) {
          let data = {
            id: route.routeId,
            header: route.nameRoute,
            content: route.description
          }
          this.accordianDataEn.push(data);
        }

      }
      if (currentLang === 'vi') {
        this.accordianData = this.accordianDataVi;
      } else if (currentLang === 'en') {
        this.accordianData = this.accordianDataEn;
      }
    });

  }
}
