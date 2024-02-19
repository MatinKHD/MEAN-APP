import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';

import { env } from 'src/environments/environment';

import { Post } from 'src/app/utilities/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http: HttpClient = inject(HttpClient);
  private url: string = env.apiUrl + '/posts';
  private postsSource = new BehaviorSubject<{
    posts: Post[];
  } | null>(null);
  posts: Post[] = [];
  posts$ = this.postsSource.asObservable();

  fetchPosts(
    pageSize: number,
    currentPage: number
  ): Observable<{ posts: Post[]; maxPosts: number }> {
    const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
    return this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        this.url + queryParams
      )
      .pipe(
        tap(({ message, posts, maxPosts }) => {
          this.posts = [...posts];
          this.postsSource.next({ posts: this.posts });
        }),
        map(({ posts, maxPosts }) => ({ posts, maxPosts }))
      );
  }
  fetchSinglePost(id: string): Observable<Post> {
    return this.http
      .get<{ message: string; post: Post }>(this.url + `/${id}`)
      .pipe(
        take(1),
        map((response) => response.post)
      );
  }

  setPost = (post: Post) => {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    post.image && postData.append('image', post.image, post.title);
    return this.http
      .post<{ message: string; post: Post }>(this.url + '/create', postData)
      .pipe(
        tap(({ post }) => {
          this.posts = [post, ...this.posts];
          this.postsSource.next({ posts: this.posts });
        })
      );
  };

  updatePost = (
    id: string,
    title: string,
    content: string,
    image: File | string
  ) => {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: '',
        creatorName: '',
        creatorAvatar: '',
      };
    }
    return this.http
      .put<{
        message: string;
        post: Post;
      }>(this.url + `/${id}`, postData)
      .pipe(map((response) => response.post));
  };

  deletePost(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.url + `/${postId}`);
  }
}
