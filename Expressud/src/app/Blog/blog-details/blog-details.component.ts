// blog-details.component.ts
import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/Services/blog.service';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent  {
  blogs: any[] = [];
  newComment = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs() {
    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
  }

  likeBlog(id: number) {
    this.blogService.likeBlog(id).subscribe(() => {
      this.getBlogs();
    });
  }

  addComment(blogId: number) {
    this.blogService.addComment(blogId, { content: this.newComment }).subscribe(() => {
      this.getBlogs();
    });
  }
  
 
}
