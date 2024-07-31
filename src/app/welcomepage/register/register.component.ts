import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private userService: UserService) {}

  public form: FormGroup = new FormGroup(
    {
      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
      ]),
      login: new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]{8,}$/
          ),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      }),
    },
    this.passWordsMatch()
  );

  public subscription: Subscription = new Subscription();

  public erreursForm: { [campo: string]: string } = {
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: '',
    formInvalid: '',
  };

  public messagesErreur: { [campo: string]: { [field: string]: string } } = {
    nome: {
      required: 'Ce champ est requis.',
      minlength: 'Votre nom doit faire au moins 3 caractères.',
      maxlength: 'Votre nom doit faire au plus 8 caractères.',
    },
    email: {
      required: 'Ce champ est requis.',
      email: 'Rentrez une adresse email valide.',
      pattern: "Le format de l'email est invalide.",
    },
    password: {
      required: 'Ce champ est requis.',
      pattern:
        'La mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
    },
    confirmPassword: {
      required: 'Ce champ est requis.',
    },
    form: {
      noMatch: 'Les mots de passe ne correspondent pas.',
    },
    formInvalid: {
      default:
        'Il form è vuoto o contiene errori. Per favore, controlla i campi evidenziati.',
    },
  };

  ngOnInit() {
    this.subscription.add(
      this.form.statusChanges.subscribe(() => {
        this.changementStatusForm();
      })
    );
  }

  validateNome() {
    const nomeControl = this.form.get('nome');
    if (nomeControl && nomeControl.touched) {
      const messages = this.messagesErreur['nome'];
      this.erreursForm['nome'] = '';
      for (const key in nomeControl.errors) {
        this.erreursForm['nome'] += messages[key] + ' ';
      }
    }
  }

  validateEmail() {
    const emailControl = this.form.get('login').get('email');
    if (emailControl && emailControl.touched) {
      const messages = this.messagesErreur['email'];
      this.erreursForm['email'] = '';
      for (const key in emailControl.errors) {
        this.erreursForm['email'] += messages[key] + ' ';
      }
    }
  }

  validatePassword() {
    const passwordControl = this.form.get('login').get('password');

    if (passwordControl && passwordControl.touched) {
      const messages = this.messagesErreur['password'];
      this.erreursForm['password'] = '';
      for (const key in passwordControl.errors) {
        this.erreursForm['password'] += messages[key] + ' ';
      }
    }
  }

  validateConfirmPasswordControl() {
    const confirmPasswordControl = this.form
      .get('login')
      .get('confirmPassword');

    if (confirmPasswordControl && confirmPasswordControl.touched) {
      const messages = this.messagesErreur['confirmPassword'];
      this.erreursForm['confirmPassword'] = '';
      for (const key in confirmPasswordControl.errors) {
        this.erreursForm['confirmPassword'] += messages[key] + ' ';
      }
    }
  }

  passWordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('login').get('password').value !==
        control.get('login').get('confirmPassword').value
        ? { noMatch: true }
        : null;
    };
  }

  changementStatusForm() {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const campo in this.erreursForm) {
      this.erreursForm[campo] = '';
      let control: AbstractControl;
      if (
        campo === 'form' &&
        form.get('login').get('password').touched &&
        form.get('login').get('confirmPassword').dirty
      ) {
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
      const user: User = {
        name: this.form.get('nome').value,
        email: this.form.get('login').get('email').value,
        password: this.form.get('login').get('password').value,
        role: 'admin',
      };

      this.userService
        .addUser$(user)
        .pipe(
          tap(() => {
            this.router.navigate(['/login']);
            this.form.reset();
          }),
          catchError((error) => {
            console.error('Errore nella registrazione:', error);
            this.erreursForm['form'] =
              'Errore durante la registrazione. Per favore, riprova.';
            return of(null); // Permette di completare l'Observable senza terminare il flusso
          })
        )
        .subscribe();
    } else {
      console.log('Il form non è valido. Impossibile inviarlo.');
      this.erreursForm['formInvalid'] =
        'Il form è vuoto o contiene errori. Per favore, controlla i campi evidenziati.';

      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control && control.invalid) {
          const messages = this.messagesErreur[campo];
          this.erreursForm[campo] = '';
          for (const key in control.errors) {
            this.erreursForm[campo] += messages[key] + ' ';
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
