import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Recipe } from 'src/app/shared/model/recipe';

@Component({
  selector: 'app-recipe-access',
  templateUrl: './recipe-access.component.html',
  styleUrls: ['./recipe-access.component.css']
})
export class RecipeAccessComponent implements OnInit {

  users: Recipe[] = [];
  config: any;
  searchText;
  collection = { count: 60, data: [] };

  constructor(private userService: RecipeService, private orderPipe: OrderPipe) {
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
