import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';
import { User } from 'src/app/shared/model/user';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  users: User[] = [];
  config: any;
  collection = { count: 60, data: [] };
  constructor(private userService: UserService) {

    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "items number " + (i + 1)
        }
      );
    }

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.users.length
    };
  }

  ngOnInit() {
    this.getRecipes()
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getRecipes() {
    this.userService.getRecipes().subscribe(users => {
      this.users = users;

      console.log(this.users);
    });
  }
}
