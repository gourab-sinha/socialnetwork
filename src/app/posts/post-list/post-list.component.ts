import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: "First post", content: "This is the first post content"},
  //   {title: "Second post", content: "This is the second post content"},
  //   {title: "Thrid post", content: "This is the thrid post content"},
  // ];
  @Input() posts: Post[] = [];
  constructor(public postService: PostsService) { }
  private postsSub: Subscription;
  ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener().subscribe((posts: Post[])=>{
      this.posts = posts;
    });
  }

  onDelete(postId: string){
    this.postService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}
