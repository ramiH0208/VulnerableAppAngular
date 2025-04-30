import { Routes } from '@angular/router';
import { CommentComponent } from './comment/comment.component';
import { SearchComponent } from './search/search.component';


export const routes: Routes = [
  { path: '', component: CommentComponent },
  { path: 'search', component: SearchComponent }

];
