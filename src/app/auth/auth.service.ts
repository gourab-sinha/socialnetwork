import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService{
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient){}
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
        this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData).subscribe(response=>{
            console.log(response);
            const token = response.token;
            this.token = token;
            if(token){
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
            }
        });
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
    }
}