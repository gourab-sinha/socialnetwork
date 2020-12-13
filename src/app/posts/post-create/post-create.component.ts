import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],

})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  constructor(public postService: PostsService) { }

  ngOnInit(): void {
  }
  onAddPost(form: NgForm){
    if(form.invalid) return;
    const post: Post = {
      id: form.value.id,
      title: form.value.title,
      content: form.value.content
    };
    this.postService.addPost(post.id, post.title, post.content);
    form.resetForm();
  }
}
