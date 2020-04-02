import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';
import { User } from 'src/app/shared/model/user';
import { OrderPipe } from 'ngx-order-pipe';
import { CookieService } from 'ngx-cookie-service';

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
  admin: boolean = false;
  message: string = '';
  constructor(
    private userService: UserService,
    private orderPipe: OrderPipe,
    private cookies: CookieService
  ) {
    this.collection = orderPipe.transform(this.collection, 'info.name');

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
    this.getStaff()
    let role = this.cookies.get('role')
    if (parseInt(role) > 1) {
      this.admin = true
    }
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getStaff() {
    this.userService.getUsers().subscribe(users => {
      if (users === undefined) {
        return
      }
      this.users = users;
      for (let user of this.users) {
        if (user.imageUrl === undefined) {
          user.imageUrl = 'jbiajl3qqdzshdw0z749'
        }
        user.isAdmin === false
        if (user.role === -1) {
          user.role = 'Chưa xác thực'
        } else if (user.role === 0) {
          user.role = 'Thành viên'
        } else if (user.role === 1) {
          user.role = 'Quản trị'
          user.isAdmin === true
        } else if (user.role > 1) {
          user.isAdmin === true
          user.role = 'Admin'
        } else {
          user.role = 'Khóa'
        }
        let userAccess = user;
        this.users = this.users.filter(use => use._id !== userAccess._id);

        this.users.push(user)
      }
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
  updateRole(user: any) {
    if (user.warningReport === 0) {
      this.userObject.role = 1;
    } else {
      this.userObject.role = 0;
    }
    this.userObject.id = user._id;
    this.userService.updateRole(this.userObject).subscribe(data => {
      if (data.body['status'] === 200) {
        user = data.body['user']
        for (let userAccess of this.users) {
          if (userAccess.email === user.email) {
            userAccess = user;
            this.users = this.users.filter(user => user._id !== userAccess._id);
            if (user.role === -1) {
              user.role = 'Chưa xác thực'
            } else if (user.role === 0) {
              user.role = 'Thành viên'
            } else if (user.role === 1) {
              user.role = 'Quản trị'
              user.isAdmin === true
            } else if (user.role > 1) {
              user.isAdmin === true
              user.role = 'Admin'
            } else {
              user.role = 'Khóa'
            }
            if (user.imageUrl === undefined) {
              user.imageUrl = 'jbiajl3qqdzshdw0z749'
            }
            this.users.push(user)
            if (this.userObject.role === 0) {
              this.message = 'Hạ quyền quản trị viên thành công'
            } else {
              this.message = 'Thêm quản trị viên thành công'
            }

            setTimeout(() => {
              this.message = ''
            }, 5000);
          }
        }
      }
    })
  }
  updateReport(user: any) {
    this.userObject.id = user._id;
    this.userService.updateReport(this.userObject).subscribe(data => {
      if (data.body['status'] === 200) {
        user = data.body['user']
        for (let userAccess of this.users) {
          if (userAccess.email === user.email) {
            userAccess = user;
            this.users = this.users.filter(user => user._id !== userAccess._id);
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
            if (user.imageUrl === undefined) {
              user.imageUrl = 'jbiajl3qqdzshdw0z749'
            }
            this.users.push(user)
            this.message = 'Báo cáo thành viên thành công'
            setTimeout(() => {
              this.message = ''
            }, 5000);
          }
        }
      }
    })
  }
  bannedUser(user: any) {
    console.log('banned user')
    this.userObject.id = user._id;
    this.userService.bannedUser(this.userObject).subscribe(data => {
      if (data.body['status'] === 200) {
        user = data.body['user']
        for (let userAccess of this.users) {
          if (userAccess.email === user.email) {
            userAccess = user;
            this.users = this.users.filter(user => user._id !== userAccess._id);
            if (user.imageUrl === undefined) {
              user.imageUrl = 'jbiajl3qqdzshdw0z749'
            }
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
            this.users.push(user)
            this.message = 'Khóa thành viên thành công'
            setTimeout(() => {
              this.message = ''
            }, 3000);
          }
        }
      }
    })
  }
  activeMember(user: any) {
    console.log('active user')
    let userTemp = user
    this.userService.activeMember(user._id).subscribe(data => {
      this.users = this.users.filter(user => user._id !== userTemp._id);

      user = data
      user.block = false;
      if (user.imageUrl === undefined) {
        user.imageUrl = 'jbiajl3qqdzshdw0z749'
      }
      user.isAdmin = false;
      if (user.role === -1) {
        user.role = 'Chưa xác thực'
      } else if (user.role === 0) {
        user.role = 'Thành viên'
      } else if (user.role === 1) {
        user.isAdmin = true;
        user.role = 'Quản trị'
      } else if (user.role > 1) {
        user.role = 'Admin'
        user.isAdmin = true;
      } else {
        user.role = 'Khóa'
      }
      this.users.push(user)
      this.message = 'Mở khóa thành viên thành công'
      setTimeout(() => {
        this.message = ''
      }, 3000);

    })
  }

}
