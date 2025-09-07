import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.serivce';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    email = '';
    password = '';
    loading = false;
    errorMessage = '';
    fieldErrors: Record<string, string> = {};

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        // reset previous errors
        this.errorMessage = "";
        this.fieldErrors = {};

        // client-side validation
        if (!this.email) {
            this.fieldErrors['email'] = "Email is required";
        }

        if (!this.password) {
            this.fieldErrors['password'] = "Password is required";
        }

        if (Object.keys(this.fieldErrors).length > 0) {
            return;
        }

        const payload: LoginRequest = {
            email: this.email,
            password: this.password
        };

        this.loading = true;

        this.authService.login(payload)
            .subscribe({
                next: (res) => {
                    this.router.navigate(["/board"]);
                    this.loading = false;
                },
                error: (err) => {
                    this.errorMessage = err.message || "Login failed";
                    this.loading = false;
                }
            })
    }
}