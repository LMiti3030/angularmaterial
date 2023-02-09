import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
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

  @ViewChild(MatSidenav) sidenav !: MatSidenav;

  constructor(private breakPointObserver : BreakpointObserver,
    private userService: UserService,
    private router: Router){

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

      //unncesssary as the main-content already does this
      //keep it for reference
      // this.users.subscribe({
      //   next: data => {
      //     console.log(data);
      //     if(data.length > 0) {
      //       this.router.navigate(['/contactmanager', data[0].id]);
      //     }
      //   }
      // });

      this.closeSideNavOnSmallScreen();
  }

  closeSideNavOnSmallScreen(){
    this.router.events.subscribe( {
      next: () => {
        if(this.isScreenSmall){
          //TODO close sidenav
          this.sidenav.close();
        }
      }
    } );
  }

}
