import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.serivce';
import { z, ZodError } from "zod";

const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at lease 8 characters"),
});

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;
    errorMessage = "";
    fieldErrors: Record<string, string> = {};

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        // Reset previous errors
        this.errorMessage = "";
        this.fieldErrors = {};

        if (this.password !== this.confirmPassword) {
            this.fieldErrors['confirmPassword'] = "Password do not match!";
            return;
        }

        const payload: RegisterRequest = {
            fullName: this.fullName,
            email: this.email,
            password: this.password
        };

        // Validate using Zod
        try {
            registerSchema.parse(payload);
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

        this.authService.register(payload)
            .subscribe({
                next: (res) => {
                    alert(res.message);
                    this.loading = false;
                },
                error: (err) => {
                    this.errorMessage = err.message || "Registration failed";
                    this.loading = false;
                }
            });
    }
}