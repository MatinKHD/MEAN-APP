import { Component, OnInit, inject } from '@angular/core';
import { PostService } from '../../../services/post.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { of, switchMap, take, takeUntil } from 'rxjs';

import { Unsub } from 'src/app/utilities/unsub';

import { mimeType } from 'src/app/utilities/validators/mime-type.validator';
import { Post } from 'src/app/utilities/models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent extends Unsub implements OnInit {
  private postService: PostService = inject(PostService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  mode: string = 'create';
  post!: Post;
  isLoading: boolean = false;
  form!: FormGroup;
  imagePreview!: string;

  ngOnInit(): void {
    this.initializeform();
    this.detectMode();
  }

  initializeform() {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl('', {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: Validators.required,
        asyncValidators: mimeType,
      }),
    });
  }

  detectMode = () => {
    this.route.paramMap
      .pipe(
        takeUntil(this.unSubscribe$),
        switchMap((params) => {
          const id = params.get('id');
          if (params.has('id') && id) {
            this.isLoading = true;
            return this.postService.fetchSinglePost(id);
          } else {
            const postData: Post = {
              id: '',
              title: '',
              content: '',
              creator: '',
              creatorName: '',
              creatorAvatar: '',
              imagePath: '',
            };
            return of(postData);
          }
        })
      )
      .subscribe((postData) => {
        this.isLoading = false;
        if (postData.id) {
          this.mode = 'eidt';
          this.post = postData;
          this.form.setValue({
            title: postData.title,
            content: postData.content,
            image: postData.imagePath,
          });
        } else {
          this.mode = 'create';
          this.post = postData;
        }
      });
  };

  onSavePostHanlder(postId: string) {
    this.isLoading = true;
    const post = {
      id: this.mode === 'create' ? '' : postId,
      title: this.form.get('title')?.value,
      content: this.form.get('content')?.value,
      image: this.form.get('image')?.value,
      creator: '',
      creatorName: '',
      creatorAvatar: '',
      imagePath: '',
    };
    if (this.form.invalid) return;
    if (this.mode === 'create') {
      this.postService
        .setPost(post)
        .pipe(take(1))
        .subscribe({
          error: () => (this.isLoading = false),
        });
    } else {
      this.postService
        .updatePost(post.id, post.title, post.content, post.image)
        .pipe(take(1))
        .subscribe(() => (this.isLoading = false));
    }
    this.router.navigate(['/list']);

    this.form.reset();
  }

  onFilePickerHandler(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      this.form.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
}
