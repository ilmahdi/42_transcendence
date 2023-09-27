import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/models/newUser.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ViewChild('form') form!: NgForm

  form = new FormGroup({firstName:new FormControl, lastName:new FormControl, email:new FormControl, password:new FormControl})

  submissionType: 'login' | 'join' = 'login';
  constructor(private authService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    const {email, password} = this.form.value;
    if (!email || !password) return;

    if (this.submissionType === 'login') {
      return this.authService.login(email, password).subscribe(()=>{
        this.router.navigate(['/home'])
      }
      )
    }
    else if (this.submissionType === 'join') {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return null;

      const newUser: NewUser = { firstName, lastName, email, password };

      return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
    }
    return;
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    }
    else if (this.submissionType === 'join') {
      this.submissionType = 'login'
    }
  }

}
