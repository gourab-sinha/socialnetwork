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
    private userId: string;
    constructor(private http: HttpClient, private router: Router){}
    createUser(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
            
            console.log("Successful");
            console.log(response);
            this.login(email,password);
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
    getUserId(){
        return this.userId;
    }
    login(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{token: string, expriesIn: number, userId: string}>("http://localhost:3000/api/user/login", authData).subscribe(response=>{
            const responseObj = JSON.parse(JSON.stringify(response));
            console.log(responseObj);
            const token = responseObj["token"];
            console.log(token);
            const expiresIn = responseObj["expiresIn"];
            console.log(expiresIn);
            this.token = token;
            if(token){
                this.setAuthTimer(expiresIn);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.userId = responseObj["userId"];
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresIn*1000);
                console.log(expirationDate);
                this.saveAuthData(token,expirationDate,this.userId);
                this.router.navigate(["/"]);
            }
        });
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(["/"]);
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token =  authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userid");
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }

    private setAuthTimer(duration: number){
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        },duration * 1000);
    }
}