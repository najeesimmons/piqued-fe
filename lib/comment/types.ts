import z from "zod";

// Database schema for comments
export const commentSchema = z.object({
  id: z.number(),
  text: z.string(),
  pexels_id: z.number(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

// Profile schema (referenced in comments)
export const profileSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

// Comment with profile data (joined query result)
export const commentWithProfileSchema = commentSchema.extend({
  profile: profileSchema.optional(),
  display_name: z.string(), // Computed field from API
});

// Input schema for creating comments
export const createCommentSchema = z.object({
  pexels_id: z.number(),
  commentText: z.string().min(1, "Comment cannot be empty"),
});

// Input schema for deleting comments
export const deleteCommentSchema = z.object({
  id: z.number(),
});

// API response types
export type Comment = z.infer<typeof commentSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type CommentWithProfile = z.infer<typeof commentWithProfileSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;

// API function return types
export type CommentsResponse = CommentWithProfile[] | null;
export type CommentResponse = CommentWithProfile | null;
export type DeleteCommentResponse = Comment | null;

// Error types
export type CommentError = {
  message: string;
  code?: string;
  details?: string;
};
