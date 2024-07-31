import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service'; // Importa il servizio AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup = new FormGroup({
    login: new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    }),
  });

  private subscription: Subscription = new Subscription();
  public erreursForm: { [campo: string]: string } = {
    email: '',
    password: '',
    formInvalid: '',
  };

  public messagesErreur: { [campo: string]: { [field: string]: string } } = {
    email: {
      required: 'Ce champ est requis.',
      email: 'Rentrez une adresse email valide.',
    },
    password: {
      required: 'Ce champ est requis.',
    },
    formInvalid: {
      default: 'Email ou mot de passe non valide.',
    },
  };

  constructor(
    private userService: UserService,
    private authService: AuthService, // Inietta AuthService
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.form.statusChanges.subscribe(() => {
        this.changementStatusForm();
      })
    );
  }

  validateEmail() {
    const emailControl = this.form.get('login.email');
    if (emailControl && emailControl.touched) {
      const messages = this.messagesErreur['email'];
      this.erreursForm['email'] = '';
      for (const key in emailControl.errors) {
        this.erreursForm['email'] += messages[key] + ' ';
      }
    }
  }

  validatePassword() {
    const passwordControl = this.form.get('login.password');

    if (passwordControl && passwordControl.touched) {
      const messages = this.messagesErreur['password'];
      this.erreursForm['password'] = '';
      for (const key in passwordControl.errors) {
        this.erreursForm['password'] += messages[key] + ' ';
      }
    }
  }

  changementStatusForm() {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const campo in this.erreursForm) {
      this.erreursForm[campo] = '';
      let control: AbstractControl;
      if (campo === 'form' && form.get('login.password').touched) {
        control = form;
      } else {
        control = form.get(campo)!;
      }
      if (control && control.touched && control.invalid) {
        const messages = this.messagesErreur[campo];
        for (const key in control.errors) {
          this.erreursForm[campo] += messages[key] + ' ';
        }
      }
    }
  }

  public submit(): void {
    if (this.form.valid) {
      const email = this.form.get('login.email').value;
      const password = this.form.get('login.password').value;

      this.userService
        .login$(email, password)
        .pipe(
          tap((user) => {
            if (user) {
              // Login riuscito
              console.log('Login riuscito:', user);
              this.authService.login(email); // Usa AuthService per gestire il login
              this.router.navigate(['/cocktails-list']);
              this.form.reset();
            } else {
              // Login fallito
              this.erreursForm['formInvalid'] =
                this.messagesErreur['formInvalid']['default'];
            }
          }),
          tap({
            error: (error) => {
              console.error('Errore durante il login:', error);
              this.erreursForm['formInvalid'] =
                this.messagesErreur['formInvalid']['default'];
            },
          })
        )
        .subscribe(); // Inizia l'esecuzione della pipeline
    } else {
      console.log('Il form non è valido. Impossibile inviarlo.');
      this.erreursForm['formInvalid'] =
        'Il form è vuoto o contiene errori. Per favore, controlla i campi evidenziati.';

      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control && control.invalid) {
          this.validateControl(campo);
        }
      });
    }
  }

  private validateControl(campo: string) {
    if (campo === 'login.email') {
      this.validateEmail();
    } else if (campo === 'login.password') {
      this.validatePassword();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
