import z from "zod";


export const commentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  pexels_id: z.number(),
  user_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const profileSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const commentWithProfileSchema = commentSchema.extend({
  profile: profileSchema.optional(),
  display_name: z.string(), // Computed field from API
});

export const createCommentSchema = z.object({
  pexels_id: z.number(),
  commentText: z.string().min(1, "Comment cannot be empty"),
});

export const deleteCommentSchema = z.object({
  id: z.string().uuid(),
});

export type Comment = z.infer<typeof commentSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type CommentWithProfile = z.infer<typeof commentWithProfileSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;

export type CommentsResponse = CommentWithProfile[] | null;
export type CommentResponse = CommentWithProfile | null;
export type DeleteCommentResponse = Comment | null;

export type CommentError = {
  message: string;
  code?: string;
  details?: string;
};
