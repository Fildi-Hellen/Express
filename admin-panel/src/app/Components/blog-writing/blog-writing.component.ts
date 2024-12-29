import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../Services/blog.service';

@Component({
  selector: 'app-blog-writing',
  templateUrl: './blog-writing.component.html',
  styleUrls: ['./blog-writing.component.css']
})
export class BlogWritingComponent implements OnInit {

  blogs: any[] = [];
  newBlog = { title: '',  author: '', content: ''  };


  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs() {
    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
  }

  createBlog() {
    this.blogService.createBlog(this.newBlog).subscribe(() => {
      this.getBlogs();
    });
  }

  updateBlog(id: number, updatedBlog: any) {
    this.blogService.updateBlog(id, updatedBlog).subscribe(() => {
      this.getBlogs();
    });
  }

  deleteBlog(id: number) {
    this.blogService.deleteBlog(id).subscribe(() => {
      this.getBlogs();
    });
  }


}
