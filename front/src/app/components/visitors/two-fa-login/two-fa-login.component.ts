import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/utils/socket/socket.service';


@Component({
  selector: 'app-two-fa-login',
  templateUrl: './two-fa-login.component.html',
  styleUrls: ['./two-fa-login.component.css']
})
export class TwoFaLoginComponent {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService :AuthService,
    private socketService: SocketService,
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

    this.loggedInUserId  = this.authService.getLoggedInUserId();
    this.loggedInUserusername  = this.authService.getLoggedInUser();
  }

  public loggedInUserId :number;
  public loggedInUserusername :string;

  public twoFACodeForm: FormGroup;
  public qrCode: string = "";
  public tfaSecret: string = "";
  public twoFACode: string = ""
  public isIncorrectCode: boolean = false
  public isLeavingPage: boolean = true


  private subscriptions: Subscription[] = [];

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
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload() {
    if (this.isLeavingPage)
      this.authService.logout()
  }
  
  
  submitForm() {
    
    this.twoFACode = this.twoFACodeForm.get('twoFACode')?.value;
    const subscription = this.authService.validateTwoFa(this.loggedInUserId, this.twoFACode).subscribe({
      next: response => {
        if (response.is_tfa_validated) {
          this.isLeavingPage = false;
          this.socketService.initSocketConnection();
          this.router.navigate(["/home"]);
        }
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
    this.subscriptions.push(subscription);
  }
  ngOnDestroy() {
    if (this.isLeavingPage)
      this.authService.logout()

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
