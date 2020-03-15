import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';
import { User } from 'src/app/shared/model/user';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  users: User[] = [];
  config: any;
  searchText;
  collection = { count: 60, data: [] };

  constructor(private userService: UserService, private orderPipe: OrderPipe) {
    this.collection = orderPipe.transform(this.collection, 'info.name');
    console.log(this.collection);
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "items number " + (i + 1)
        }
      );
    }

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.users.length
    };
  }
  order: string = 'info.name';
  reverse: boolean = false;
  ngOnInit() {
    this.getRecipes()
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getRecipes() {
    this.userService.getRecipes().subscribe(users => {
      this.users = users;
      for (let user of this.users) {
        if (user.imageUrl === undefined) {
          user.imageUrl = 'jbiajl3qqdzshdw0z749'
        }
      }
      console.log(this.users);
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
}
