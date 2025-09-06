import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth.serivce';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;

    constructor(private authService: AuthService) {}

    onSubmit() {
        if (this.password !== this.confirmPassword) {
            alert('Password do not match!');
            return;
        }

        const payload: RegisterRequest = {
            fullName: this.fullName,
            email: this.email,
            password: this.password
        };

        this.loading = true;
        this.authService.register(payload)
            .subscribe({
                next: (res) => {
                    alert(res.message);
                    this.loading = false;
                },
                error: (err) => {
                    alert(err.message);
                    this.loading = false;
                }
            });
    }
}