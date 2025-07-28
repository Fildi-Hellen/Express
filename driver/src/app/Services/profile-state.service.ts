import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileStateService {
  
  private profileDataSubject = new BehaviorSubject<any>({
    name: '',
    profile_picture_url: null
  });
  
  profileData$ = this.profileDataSubject.asObservable();
  
  updateProfileData(profileData: any): void {
    this.profileDataSubject.next({
      name: profileData.name || '',
      profile_picture_url: profileData.profile_picture_url || null
    });
  }
  
  getCurrentProfileData(): any {
    return this.profileDataSubject.value;
  }
}