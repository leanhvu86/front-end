import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-gallery-access',
  templateUrl: './gallery-access.component.html',
  styleUrls: ['./gallery-access.component.css']
})
export class GalleryAccessComponent implements OnInit {

  gallerys: Gallery[] = [];
  config: any;
  searchText;
  collection = { count: 60, data: [] };
  key: any;
  pageSize = 10;
  loading = false;
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
      itemsPerPage: this.pageSize,
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
      for (let i = 0; i < this.gallerys.length; i++) {
        let gallery = this.gallerys[i];
        gallery.seq = i + 1;
        if (gallery.recipe.length > 0) {
          gallery.image = gallery.recipe[0].imageUrl;
        } else {
          gallery.image = 'default-gallery.png';
        }
      }
      this.loading = true
    });

  }
  keyUp() {
    console.log(this.pageSize)
    if (this.searchText.length > 2) {
      this.pageSize = this.gallerys.length;
      this.pageChanged(1);
    } else {
      this.pageSize = 10;
    }
  }
}
