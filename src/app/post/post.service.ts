import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Posts } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Posts[] = [];
  private postupdated = new Subject<Posts[]>();

  constructor(private http: HttpClient, private router: Router) {}
  getPost() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map((postsdata) => {
          return postsdata.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagepath: post.imagepath,
            };
          });
        })
      )
      .subscribe((postsdata) => {
        this.posts = postsdata;
        this.postupdated.next([...this.posts]);

        console.log(this.posts);
      });
  }
  getPostUpdateListener() {
    return this.postupdated.asObservable();
  }
  //   getPosts(id:string){
  // return {...this.posts.find(p=>{
  //   p.id===id;
  // })}
  //   }

  getPosts(id: string) {
    return this.http.get<{ _id: string; title: string; content: string,imagepath:string }>(
      "http://localhost:3000/api/posts/" + id
    );
    //return { ...this.posts.find((p) => p.id === id) };
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
    let postdata: Posts | FormData;
    if (typeof image === "object") {
      postdata = new FormData();
      postdata.append("id", id);
      postdata.append("title", title);
      postdata.append("content", content);
      postdata.append("image", image, title);
    } else {
       postdata = {
        id: id,
        title: title,
        content: content,
        imagepath: image,
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + id, postdata)
      .subscribe((response) => {
        this.router.navigate(["/"]);
        console.log(response);
      });
  }
  addPosts(title: string, content: string, image: File) {
    // const post: Posts = { id: null, title: title, content: content };
    const postdata = new FormData();
    postdata.append("title", title);
    postdata.append("content", content);
    postdata.append("image", image, title);

    this.http
      .post<{ message: string; post: Posts }>(
        "http://localhost:3000/api/posts",
        postdata
      )
      .subscribe((responsedata) => {
        const post: Posts = {
          id: responsedata.post.id,
          title: title,
          content: content,
          imagepath: responsedata.post.imagepath,
        };
        // const id = responsedata.postid;
        // post.id = id;
        console.log(responsedata.message);
        this.posts.push(post);
        this.postupdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
  deletePosts(postid: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postid)
      .subscribe(() => {
        const updateafetrdelete = this.posts.filter(
          (post) => post.id !== postid
        );
        this.posts = updateafetrdelete;
        this.postupdated.next([...this.posts]);
        console.log("deleted element with id : " + postid);
      });
  }
}
