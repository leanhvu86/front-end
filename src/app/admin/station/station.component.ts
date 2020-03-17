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
  userObject = {
    role: 0,
    id: '',
  }
  message: string = '';
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
        console.log(user)
        if (user.role === -1) {
          user.role = 'Chưa xác thực'
        } else if (user.role === 0) {
          user.role = 'Thành viên'
        } else if (user.role === 1) {
          user.role = 'Quản trị'
        } else if (user.role > 1) {
          user.role = 'Admin'
        } else {
          user.role = 'Khóa'
        }
        if (user.status === 1) {
          user.status = 'Khóa'
        } else {
          user.status = 'Mở khóa'
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
  updateRole(user: any) {
    this.userObject.role = 1;
    this.userObject.id = user._id;
    this.userService.updateRole(this.userObject).subscribe(data => {
      if (data.body['status'] === 200) {
        user = data.body['user']
        for (let userAccess of this.users) {
          if (userAccess.email === user.email) {
            userAccess = user;
            this.users = this.users.filter(user => user._id !== userAccess._id);
            user.role = 'Quản trị'
            this.users.push(user)
            this.message = 'Thêm quản trị viên thành công'
            setTimeout(() => {
              this.message = ''
            }, 5000);
          }
        }
      }
    })
  }
  updateReport(id: any) {
    console.log(id)
  }
  bannedUser(id: any) {
    console.log(id)
  }
}
