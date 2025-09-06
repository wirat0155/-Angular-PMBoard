import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    email = '';
    password = '';
    errorMessage = '';

    constructor(private http: HttpClient, private router: Router) {}

    onSubmit() {
        this.errorMessage = '';
        this.http.post<{ token: string }>('/api/auth/login', 
            { email: this.email, password: this.password}
        ).subscribe({
            next: (res) => {
                localStorage.setItem('token', res.token);
                this.router.navigate(['/board']); // เปลี่ยน path ไปหน้า board
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Login failed'
            }
        })
    }
}