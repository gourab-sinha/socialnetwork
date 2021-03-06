import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  userIsAuthenticated = false;
  totalPosts = 0;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  @Input() posts: Post[] = [];
  private authStatusSubs: Subscription;
  private postsSub: Subscription;
  userId: string;
  
  constructor(public postService: PostsService, private authService: AuthService) { }
  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener().subscribe((postsData: {posts: Post[], postCount: number})=>{
      this.isLoading = false;
      this.posts = postsData.posts;
      this.totalPosts = postsData.postCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }
    );
  }

  onDelete(postId: string){
    console.log("Deleted");
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
