import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Posts } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type-validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  constructor(public postservice: PostService, public route: ActivatedRoute) {}
  private postId: string;
  form: FormGroup;
  mode = "create";
  isLoading = false;
  imagePreview: string;

  post: Posts;
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        console.log(paramMap.get("postId"));
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        // this.postservice.getPosts(this.postId).subscribe((){

        // });
        this.postservice.getPosts(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagepath: postData.imagepath,
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagepath,
          });
        });
        this.isLoading = false;
        console.log(this.post);
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }
  onImageAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get("image").updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onAddPost() {
    console.log(this.form.value.title, this.form.value.content);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      console.log(this.form.value.title, this.form.value.content);
      this.postservice.addPosts(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      console.log(this.form.value.title, this.form.value.content);
      this.postservice.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }
}
