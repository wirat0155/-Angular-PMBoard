import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        createAt: string;
    },
    requestId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
    };
    requestId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = "http://localhost:3000/api/auth";
    
    constructor(private http: HttpClient) {}

    register(data: RegisterRequest): Observable<RegisterResponse>{
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data, { withCredentials: true })
                .pipe(
                    catchError(this.handleError)
                );
    }

    login(data: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data, { withCredentials: true })
                .pipe(
                    catchError(this.handleError)
                );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            return throwError(() => new Error(error.error.message));
        } else if (error.error?.message) {
            return throwError(() => new Error(error.error.message));
        } else {
            return throwError(() => new Error(`Error ${error.status}: ${error.statusText}`));
        }
    }
}