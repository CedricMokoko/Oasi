//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CocktailListComponent } from './cocktail-container/cocktail-list/cocktail-list.component';
import { CocktailDetailsComponent } from './cocktail-container/cocktail-details/cocktail-details.component';
import { CocktailContainerComponent } from './cocktail-container/cocktail-container.component';
import { RicetteComponent } from './ricette/ricette.component';
import { IngredientiComponent } from './panier-container/ingredienti/ingredienti.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { PanierContainerComponent } from './panier-container/panier-container.component';
import { CocktailFormComponent } from './cocktail-container/cocktail-form/cocktail-form.component';

//Pipes
import { FilterPipe } from './shared/pipes/filter.pipe';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './welcomepage/login/login.component';
import { RegisterComponent } from './welcomepage/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CocktailListComponent,
    CocktailDetailsComponent,
    CocktailContainerComponent,
    RicetteComponent,
    IngredientiComponent,
    WelcomepageComponent,
    PanierContainerComponent,
    CocktailFormComponent,
    FilterPipe,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
