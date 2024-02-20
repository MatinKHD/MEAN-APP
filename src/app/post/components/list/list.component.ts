import { Component, inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PostService } from '../../../services/post.service';
import { AuthService } from 'src/app/services/auth.service';

import { Post } from 'src/app/utilities/models/post.model';
import { User } from './../../../utilities/models/user.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private postService: PostService = inject(PostService);
  private authSerive: AuthService = inject(AuthService);
  posts$!: Observable<{ posts: Post[] } | null>;
  user$!: Observable<{ user: User | null; authStatus: boolean }>;
  posts: Post[] = [];
  isLoading: boolean = false;
  postsLength!: number;
  postPerPage!: number;
  pageSizeOption: number[] = [1];
  showMenu: boolean = false;

  ngOnInit(): void {
    this.onFetchedPosts();
    this.user$ = this.authSerive.user$;
    this.posts$ = this.postService.posts$;
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId).subscribe();
  }

  onPostMenuClickHandler(postId: string) {
    this.posts.forEach((post) => {
      postId === post.id ? this.showMenu === true : this.showMenu === false;
    });
    console.log(this.showMenu);
  }

  private onFetchedPosts(): void {
    this.isLoading = true;
    this.postService
      .fetchPosts(this.postPerPage, 1)
      .subscribe(() => (this.isLoading = false));
  }
}
