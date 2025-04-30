import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommentService, Comment } from './comment.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: (Comment & { safeContent?: SafeHtml })[] = [];
  newComment: Comment = { author: '', content: '' };

  constructor(private commentService: CommentService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.commentService.getComments().subscribe(data => {
      this.comments = data.map(c => ({
        ...c,
        safeContent: this.sanitizer.bypassSecurityTrustHtml(c.content)
      }));
    });
  }

  submitComment(): void {
    if (!this.newComment.author || !this.newComment.content) return;
    this.commentService.postComment(this.newComment).subscribe(c => {
      const safe = this.sanitizer.bypassSecurityTrustHtml(c.content);
      this.comments.push({ ...c, safeContent: safe });
      this.newComment = { author: '', content: '' };
    });
  }
}