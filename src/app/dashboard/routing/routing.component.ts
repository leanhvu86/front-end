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
  constructor(
    private routeRailservice: RouteRailService, private translate: TranslateService) {
    translate.setDefaultLang('vi');
  }
  routeRails: RouteRail[] = [];
  @Input() opened = false;

  /**
   * Text to display in the group title bar
   */
  @Input() title: string;
  public accordianData = [];
  public accordianDataVi = [];
  public accordianDataEn = [];

  ngOnInit() {
    this.getRouteRailArray();
  }
  /**
   * Emitted when user clicks on group titlebar
   * @type {EventEmitter<any>}
   */
  // @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  getRouteRailArray() {
    const currentLang = sessionStorage.getItem('currentLang');

    console.log(currentLang);
    this.routeRailservice.getRouteRails().subscribe(routeRails => {
      this.routeRails = routeRails;
      console.log('routeRails' + this.routeRails);
      for (const route of this.routeRails) {
        if (route.status === 1) {
          const data = {
            id: route.routeId,
            header: route.nameRoute,
            content: route.description
          };
          this.accordianDataVi.push(data);
        } else if (route.status === 2) {
          const data = {
            id: route.routeId,
            header: route.nameRoute,
            content: route.description
          };
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
