import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-two-fa-login',
  templateUrl: './two-fa-login.component.html',
  styleUrls: ['./two-fa-login.component.css']
})
export class TwoFaLoginComponent {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService :AuthService
    ) {
    this.twoFACodeForm = this.formBuilder.group({
      twoFACode: [
        this.twoFACode,
        [
          Validators.required, 
          Validators.minLength(6), 
          Validators.maxLength(6), 
          Validators.pattern(/^\d{6}$/)
        ],
      ],
    });
  }

  public loggedInUserId :number = this.authService.getLoggedInUserId();
  public loggedInUserusername :string = this.authService.getLoggedInUser();

  public twoFACodeForm: FormGroup;
  public qrCode: string = "";
  public tfaSecret: string = "";
  public twoFACode: string = ""
  public isIncorrectCode: boolean = false

  @Input() title: string = '';
  @Input() body: string = '';

  ngOnInit(): void {

  }
  onInputFocus() {
    this.isIncorrectCode = false;
  }
  onLogoutClick() {

    this.authService.logout();
    this.router.navigate(['/login']);
  }


  submitForm() {
    
    this.twoFACode = this.twoFACodeForm.get('twoFACode')?.value;
    this.authService.validateTwoFa(this.loggedInUserId, this.twoFACode).subscribe({
      next: response => {
        if (response.is_tfa_validated)
          this.router.navigate(["/home"]);
        else
        {
          this.twoFACodeForm.get('twoFACode')?.setValue('');
          this.isIncorrectCode = true;
        }
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }


}
