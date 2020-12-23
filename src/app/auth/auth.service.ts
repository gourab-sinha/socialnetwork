import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthService{
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient, private router: Router){}
    createUser(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
            console.log(response);
        });
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    getToken(){
        return this.token;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{token: string, expriesIn: number}>("http://localhost:3000/api/user/login", authData).subscribe(response=>{
            const responseObj = JSON.parse(JSON.stringify(response));
            console.log(responseObj);
            const token = responseObj["token"];
            console.log(token);
            const expriesIn = responseObj["expiresIn"];
            console.log(expriesIn);
            this.token = token;
            if(token){
                this.tokenTimer = setTimeout(()=>{
                    this.logout();
                }, expriesIn * 1000)
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(["/"]);
            }
        });
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(["/"]);
        clearTimeout(this.tokenTimer);
    }
}