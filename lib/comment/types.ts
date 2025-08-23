import z from "zod";


export const commentSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format"),
  text: z.string(),
  pexels_id: z.number(),
  user_id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format"),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

// Schema for raw database response (before enrichment)
export const commentWithProfileRawSchema = commentSchema.extend({
  profile: z.object({
    username: z.string(),
  }).optional(),
});

// Schema for comments with minimal profile info (username only) - after enrichment
export const commentWithProfileSchema = commentSchema.extend({
  profile: z.object({
    username: z.string(),
  }).optional(),
  display_name: z.string(), // Computed field from API
});

// Schema for raw database response with full profile (for insertComment)
export const commentWithFullProfileRawSchema = commentSchema.extend({
  profile: z.object({
    username: z.string(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  }).optional(),
});

// Schema for comments with full profile info (for insertComment) - after enrichment
export const commentWithFullProfileSchema = commentSchema.extend({
  profile: z.object({
    username: z.string(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  }).optional(),
  display_name: z.string(), // Computed field from API
});

export const createCommentSchema = z.object({
  pexels_id: z.number(),
  commentText: z.string().min(1, "Comment cannot be empty"),
});

export const deleteCommentSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format"),
});

export type Comment = z.infer<typeof commentSchema>;
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
