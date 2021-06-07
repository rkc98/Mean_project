import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Authdata} from '../auth/authdata.model'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  createuser(email:string,password:string){
    const authdata:Authdata={
      email : email,
      password:password
    }
this.http.post("http://localhost:3000/api/users/signup",authdata).subscribe(response=>{
  console.log(response);
})
  }
}
