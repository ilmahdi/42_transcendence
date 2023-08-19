import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { JWT_TOKEN } from 'src/app/utils/constants';
import { IUserData, IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      this.myformGroup = this.formBuilder.group({
        username: [
          this.userDataShort.username, 
          [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_-]*$/)],
        ],
      })
    }
  public selectedImage: string | ArrayBuffer = '';
  public selectedFile: File | null = null;
  public myformGroup! :FormGroup;
  public userDataShort: IUserDataShort = {}
  public isUsernameTaken :boolean = false;

  ngOnInit(): void {

   this.userDataShort.ft_id = + this.route.snapshot.queryParamMap.get('ft_id')!;
   this.userDataShort.username =this.route.snapshot.queryParamMap.get('username')!;
   this.selectedImage = this.route.snapshot.queryParamMap.get('avatar')!;
   this.userDataShort.avatar = this.route.snapshot.queryParamMap.get('avatar')!;

   this.myformGroup.patchValue({
    username: this.userDataShort.username,
  });


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
    this.registerUser();
  
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

  private registerUser() {
    return this.userService.registerUser(this.userDataShort).subscribe({
      next: response => {
        // console.log('Received data:', response);
        if (response.token) 
          localStorage.setItem(JWT_TOKEN, response.token);
        this.router.navigate(["/home"]);
      },
      error: error => {
        console.error('Error:', error.error.message); 
        this.isUsernameTaken = true;
      }
  });
  }

 
  
}
