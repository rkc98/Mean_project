import { Component } from '@angular/core';
import {Posts} from './post/post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meanproject';
  storedposts:Posts[]=[];
  onpostadded(post){
    this.storedposts.push(post);

  }
}
