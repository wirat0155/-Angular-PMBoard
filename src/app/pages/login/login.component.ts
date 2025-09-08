import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.serivce';
import { z, ZodError } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at lease 8 characters"),
});

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

        const payload: LoginRequest = {
            email: this.email,
            password: this.password
        };
        
        // Validate using Zod
                try {
                    loginSchema.parse(payload);
                } catch (err) {
                    if (err instanceof ZodError) {
                        // Map field errors
                        err.errors.forEach(e => {
                            if (e.path && e.path.length > 0) {
                                const key = e.path[0] as string;
                                this.fieldErrors[key] = e.message;
                            }
                        });
                    }
                }

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