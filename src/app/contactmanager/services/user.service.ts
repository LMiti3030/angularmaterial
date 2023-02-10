import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _users !: BehaviorSubject<User[]>;

  private dataStore!: {
    users: User[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { users: [] };
    this._users = new BehaviorSubject<User[]>([]);
  }

  get users(): Observable<User[]>{
    return this._users.asObservable();
  }

  addUser(user : User) : Promise<User>{
    return new Promise( (resolver, reject) => {
      user.id = this.dataStore.users.length + 1;
      this.dataStore.users.push(user);

      //inform the subscribers to the BehaviorSubject
      this._users.next(Object.assign({}, this.dataStore).users)
      resolver(user);
    } );
  }

  userById(id: number): User {
    return <User> this.dataStore.users.find( user => user.id == id);
  }

  public loadAll() {
    const usersUrl = 'https://angular-material-api.azurewebsites.net/users';

    return this.http.get<User[]>(usersUrl).subscribe({
      next: (data) => {
        this.dataStore.users = data;
        //let components/listeners know that data is available
        // Object.assign copies the datastore to a new object {} - empty object initially
        //next will return only the users
        this._users.next(Object.assign({}, this.dataStore).users)
      },
      error: (err) => {
        console.log('Failed to fetch users');
      },
    });
  }
}
