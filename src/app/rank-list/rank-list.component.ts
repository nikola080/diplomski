import { Component } from '@angular/core';
import { GuestServiceService } from '../service/guest-service.service';
import { User } from '../models/UserModel';

@Component({
  selector: 'app-rank-list',
  templateUrl: './rank-list.component.html',
  styleUrls: ['./rank-list.component.css']
})
export class RankListComponent {

  rankingUsers : User[] = []

  constructor(private guestService :  GuestServiceService){}
  ngOnInit()
  {
    this.guestService.getAllUsers().subscribe( (ret) => {
      if(ret['message'] == '1')
      {
        this.rankingUsers = ret['users']
        console.log(this.rankingUsers)
        this.rankingUsers.sort( (elem1, elem2 ) => {
          return elem2.points - elem1.points
        })

        console.log(this.rankingUsers)

      }
    })
  }
}
