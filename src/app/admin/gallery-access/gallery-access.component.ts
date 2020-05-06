import {Component, OnInit} from '@angular/core';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Gallery} from 'src/app/shared/model/gallery';
import {OrderPipe} from 'ngx-order-pipe';

@Component({
  selector: 'app-gallery-access',
  templateUrl: './gallery-access.component.html',
  styleUrls: ['./gallery-access.component.css']
})
export class GalleryAccessComponent implements OnInit {

  gallerys: Gallery[] = [];
  config: any;
  searchText;
  collection = {count: 60, data: []};
  key: any;

  constructor(
    private galleryService: GalleryService,
    private orderPipe: OrderPipe
  ) {
    this.collection = orderPipe.transform(this.collection, 'info.name');
    console.log(this.collection);
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: 'items number ' + (i + 1)
        }
      );
    }

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.gallerys.length
    };
  }

  ngOnInit() {
    this.getGallery();
  }

  order: string = 'info.name';
  reverse: boolean = false;

  pageChanged(event) {
    this.config.currentPage = event;
  }

  getGallery() {
    this.galleryService.getGalleryies().subscribe(gallerys => {
      this.gallerys = gallerys;
      
      this.gallerys.sort((a, b) => {
        if (a.totalPoint > b.totalPoint) {
          return -1;
        } else if (a.totalPoint < b.totalPoint) {
          return 1;
        } else {
          return 0;
        }
      });
       for (let i= 0; i < this.gallerys.length; i++) {
         let gallery = this.gallerys[i];
         gallery.seq=i+1;
        if (gallery.recipe.length > 0) {
          gallery.image = gallery.recipe[0].imageUrl;
        } else {
          gallery.image = 'fvt7rkr59r9d7wk8ndbd';
        }
      }
    });
  }
}
