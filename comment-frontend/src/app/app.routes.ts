import { Routes } from '@angular/router';
import { CommentComponent } from './comment/comment.component';
import { SearchComponent } from './search/search.component';
import { SearchBisComponent } from './search-bis/search-bis.component';
import { SearchDynamicComponent } from './search-dynamic/search-dynamic.component';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
  { path: '', component: CommentComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search-bis', component: SearchBisComponent },
  { path: 'search-dynamic', component: SearchDynamicComponent },
  { path: 'login', component: LoginComponent }
];
