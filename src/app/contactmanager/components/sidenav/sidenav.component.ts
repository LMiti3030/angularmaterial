import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit{


  public isScreenSmall !: boolean ;

  users!: Observable<User[]>;

  constructor(private breakPointObserver : BreakpointObserver,
    private userService: UserService){

  }

  ngOnInit(): void {

    this.breakPointObserver.observe(
      //[Breakpoints.XSmall] -> predefined breakpoints
      [`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`] //our own defined media query
      )
      .subscribe( (state: BreakpointState) => {
        this.isScreenSmall = state.matches; //if max-width = SMALL_WIDTH_BREAKPOINT (state.matches = true) => isScreenSmall = true
      }  );

      this.users = this.userService.users;
      //this property calls asObservable on our BehaviourSubject

      this.userService.loadAll();

      this.users.subscribe({
        next: data => console.log(data)
      });

  }

}
