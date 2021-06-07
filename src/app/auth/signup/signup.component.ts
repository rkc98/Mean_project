import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authservice:AuthService) { }
  isLoading=false;
  onSignup(form : NgForm){
    // console.log(form.value);
    if (form.invalid){
      return
    }
    this.authservice.createuser(form.value.email,form.value.password)
  }
  ngOnInit(): void {
  }

}
