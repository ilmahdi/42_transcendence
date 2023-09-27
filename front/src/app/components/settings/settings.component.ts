import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { UserService } from 'src/app/services/user.service';
import { JWT_TOKEN } from 'src/app/utils/constants';
import { IUserData, IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { environment } from 'src/environments/environment';
import { TwoFAComponent } from '../modals/two-fa/two-fa.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private confirmService: ConfirmService,
    private authService :AuthService,
    public loadingService: LoadingService,
    ) {
      this.myformGroup = this.formBuilder.group({
        username: [
          this.userDataShort.username, 
          [
            Validators.required, 
            Validators.minLength(4), 
            Validators.maxLength(20), 
            Validators.pattern(/^[a-zA-Z0-9_-]*$/)
          ],
        ],
      });


      this.loggedInUserId  = this.authService.getLoggedInUserId();
    }
  public selectedImage: string | ArrayBuffer = '';
  public selectedFile: File | null = null;
  public myformGroup! :FormGroup;
  public userDataShort: IUserDataShort = {}
  public isUsernameTaken :boolean = false;
  public isTwoFaEnabled :boolean = false;


  private loggedInUserId :number;
  private subscriptions: Subscription[] = [];


  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;


  ngOnInit(): void {
    this.loadingService.showLoading();
    const subscription = this.userService.getUserData().subscribe({
    next: (data: IUserData) => {   

      this.selectedImage = data.avatar;
      this.userDataShort.id = data.id;
      this.userDataShort.username = data.username;
      this.userDataShort.avatar = data.avatar;
      this.isTwoFaEnabled = data.is_tfa_enabled!;
      
      this.myformGroup.patchValue({
        username: this.userDataShort.username,
      });

      this.loadingService.hideLoading()

    },
    error: error => {
      console.error('Error:', error.error.message); 
    }
  });
   this.subscriptions.push(subscription);


   this.myformGroup.get('username')?.valueChanges.subscribe(newUsername => {
      if (this.isUsernameTaken)
        this.isUsernameTaken = false;
    })

  }

  onImageSelected(event :any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result!;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmitForm () {
    if (this.selectedFile) {
    await firstValueFrom(this.uploadImage())
      .then((data) => {
        this.userDataShort.avatar = environment.uploadUrl + data.filename;
      });
    }
    this.userDataShort.username = this.myformGroup.value.username;
    this.updateUser();
  
  }


  toggleTwoFactorAuth() {
    if (this.isTwoFaEnabled) {
      const subscription = this.authService.disableTwoFa(this.loggedInUserId).subscribe({
        next: response => {
         
          this.isTwoFaEnabled = false;
        },
        error: error => {
          console.error('Error:', error.error.message); 
        }
      });
      this.subscriptions.push(subscription);
    }
    else
      this.openConfirmModal()
  }

  openConfirmModal() {
    const subscription = this.confirmService
      .open(this.entry, TwoFAComponent, "Scan the QR code")
      .subscribe(() => {
        this.isTwoFaEnabled = true
      });
      this.subscriptions.push(subscription);
  }
  

  // private functions
  /******************************************************* */

  private uploadImage() : Observable<any> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      return this.userService.uploadImage(formData)
    }
    return new Observable();
  }

  private updateUser() {
    const subscription = this.userService.updateUserData(this.userDataShort).subscribe({
      next: response => {
        localStorage.setItem(JWT_TOKEN, response.token);
        this.router.navigate(["/home"]);
      },
      error: error => {
        this.isUsernameTaken = true;
      }
    });
    this.subscriptions.push(subscription);

    return subscription
  }


  ngOnDestroy(): void {
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  
}
