<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Admin: Create Blog
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $blog = Blog::create($validated);

        return response()->json($blog, 201);
    }

    // Admin: Update Blog
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $blog->update($validated);

        return response()->json($blog);
    }

    // Admin: Delete Blog
    public function destroy($id)
    {
        Blog::destroy($id);

        return response()->json(['message' => 'Blog deleted']);
    }

    // Customer & Admin: View Blogs
    public function index()
    {
        return response()->json(Blog::with('comments')->get());
    }

    // Admin: View Comments
    public function viewComments($id)
    {
        $blog = Blog::with('comments')->findOrFail($id);

        return response()->json($blog->comments);
    }

    // Admin: Delete Comment
    public function deleteComment($id)
    {
        Comment::destroy($id);

        return response()->json(['message' => 'Comment deleted']);
    }

    // Customer: Like Blog
    public function likeBlog($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->increment('likes');

        return response()->json($blog);
    }

    // Customer: Add Comment
    public function addComment(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'blog_id' => $id,
            'content' => $validated['content'],
        ]);

        return response()->json($comment, 201);
    }
    
}
