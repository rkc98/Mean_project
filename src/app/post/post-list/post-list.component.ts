import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { Posts } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts: Posts[] = [];
  private sub: Subscription;
  isLoading = false;
  constructor(public postservice: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postservice.getPost();
    this.sub = this.postservice
      .getPostUpdateListener()
      .subscribe((posts: Posts[]) => {
        this.posts = posts;
        this.isLoading = false;
        console.log(this.posts);
      });
  }
  onDelete(postid) {
    this.postservice.deletePosts(postid);
  }
  onpagechanged(pagedata:PageEvent){
console.log(pagedata);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
