import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { JWT_TOKEN } from 'src/app/utils/constants';
import { IUserData, IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    ) {
      this.myformGroup = this.formBuilder.group({
        username: this.userDataShort.username,
      })
    }
  public selectedImage: string | ArrayBuffer = '';
  public selectedFile: File | null = null;
  public myformGroup! :FormGroup;
  public userDataShort: IUserDataShort = { 
  }


  ngOnInit(): void {
    this.userService.getUserData().subscribe((data: IUserData) => {

      this.selectedImage = data.avatar;
      this.userDataShort.id = data.id
      this.userDataShort.username = data.username
      this.userDataShort.avatar = data.avatar

      this.myformGroup.patchValue({
        username: this.userDataShort.username,
      });
   });

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
    this.router.navigate(["/home"]);
  
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

    return this.userService.updateUserData(this.userDataShort).subscribe(data => {
      console.log(data)
    });
  }
  
}
