import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material/paginator';

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
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  @Input() posts: Post[] = [];
  constructor(public postService: PostsService) { }
  private postsSub: Subscription;
  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe((posts: Post[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string){
    console.log("Deleted");
    this.postService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
