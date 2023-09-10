import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.css']
})
export class TwoFAComponent {
  
  constructor(
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

  private loggedInUserId :number = this.authService.getLoggedInUserId();

  public twoFACodeForm: FormGroup;
  public qrCode: string = "";
  public tfaSecret: string = "";
  public twoFACode: string = ""
  public isIncorrectCode: boolean = false

  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  ngOnInit(): void {
    this.authService.generateTwoFa(this.loggedInUserId).subscribe({
      next: response => {
        this.qrCode = response.qr_code;
        this.tfaSecret = response.tfa_secret;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }
  onInputFocus() {
    this.isIncorrectCode = false;
  }


  submitForm() {
    
    this.twoFACode = this.twoFACodeForm.get('twoFACode')?.value;
    this.authService.enableTwoFa(this.loggedInUserId, this.twoFACode).subscribe({
      next: response => {
        if (response.is_tfa_enabled)
          this.confirmEvent.emit();
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


  closeMe() {
    this.closeMeEvent.emit();
  }


}
