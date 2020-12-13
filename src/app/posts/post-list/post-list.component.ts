import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Post } from '../posts.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  // posts = [
  //   {title: "First post", content: "This is the first post content"},
  //   {title: "Second post", content: "This is the second post content"},
  //   {title: "Thrid post", content: "This is the thrid post content"},
  // ];
  @Input() posts: Post[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
