import { Routes } from '@angular/router';
import { Chat1Component } from './components/chat1/chat1.component';
import { Chat2Component } from './components/chat2/chat2.component';
import { Chat3Component } from './components/chat3/chat3.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'chat1', component: Chat1Component},
  {path: 'chat2', component: Chat2Component},
  {path: 'chat3', component: Chat3Component},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
