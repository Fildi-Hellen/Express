declare var google:any;
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrl: './google.component.css'
})
export class GoogleComponent implements OnInit {
 private router=inject(Router)
  ngOnInit(): void {
    //google authentication
    google.accounts.id.initialize({
      client_id: '83584705692-873okrns7cvjn9u2rqococ88m4c8pjt0.apps.googleusercontent.com',
      callback: (resp:any)=>
        
        this.handleLogin(resp)
  
      
     });
     google.accounts.id.renderButton(document.getElementById("google_btn"),{
  
      theme:'filled_blue',
      size:'large',
      shape:'rectangle',
      width:350
  
     })
  }
  private decodeToken(token:string){
    return JSON.parse(atob(token.split(".")[1]));
  }
  handleLogin(response:any){
  
    if(response){
        //decode token
        const payload=this.decodeToken(response.credential);
        //session
        sessionStorage.setItem("loggedInUser",JSON.stringify(payload));
        this.router.navigate(['home']);
    }
  }

}
