import { supabase } from "../supabase/supabase";
import { z } from "zod";
import type { 
  CommentsResponse, 
  CommentResponse, 
  DeleteCommentResponse, 
  CreateCommentInput,
  Comment,
  CommentWithProfile 
} from "./types";
import { commentWithProfileSchema, commentSchema } from "./types";

export async function getCommentsByPexelsId(pexels_id: number): Promise<CommentsResponse> {
  try {
    const { data: comments, error } = await supabase
      .from("comment")
      .select("*, profile(username)")
      .eq("pexels_id", pexels_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }

    const parsedComments = z.array(commentWithProfileSchema).safeParse(comments);
    if (!parsedComments.success) {
      throw new z.ZodError(parsedComments.error.issues);
    }

    const enrichedComments: CommentWithProfile[] = parsedComments.data.map((comment) => ({
      ...comment,
      display_name: comment.profile?.username || "Anonymous",
    }));

    return enrichedComments;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Zod validation error validating comments array:`, error.issues);
    } else if (error instanceof Error) {
      console.error(`❌ Error occurred fetching comments: ${error.message}`);
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}

export async function getOwnComments(user_id: string): Promise<Comment[] | null> {
  try {
    const { data: comments, error } = await supabase
      .from("comment")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }

    const parsedComments = z.array(commentSchema).safeParse(comments);
    if (!parsedComments.success) {
      throw new z.ZodError(parsedComments.error.issues);
    }

    return parsedComments.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Zod validation error validating comments array:`, error.issues);
    } else if (error instanceof Error) {
      console.error(`❌ Error occurred fetching comments: ${error.message}`);
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}

export async function deleteOwnComment(id: number): Promise<DeleteCommentResponse> {
  try {
    const { data, error } = await supabase
      .from("comment")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error deleting comment: ${error.message}`);
    }

    const parsedComment = commentSchema.safeParse(data);
    if (!parsedComment.success) {
      throw new z.ZodError(parsedComment.error.issues);
    }

    return parsedComment.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Zod validation error validating comment:`, error.issues);
    } else if (error instanceof Error) {
      console.error(`❌ Error occurred deleting comment: ${error.message}`);
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}

export async function insertComment({ pexels_id, commentText }: CreateCommentInput): Promise<CommentResponse> {
  try {
    const { data: comment, error } = await supabase
      .from("comment")
      .insert([{ pexels_id, text: commentText }])
      .select("*, profile(username, first_name, last_name)")
      .maybeSingle();

    if (error) {
      throw new Error(`Error inserting comment: ${error.message}`);
    }

    const parsedComment = commentWithProfileSchema.safeParse(comment);
    if (!parsedComment.success) {
      throw new z.ZodError(parsedComment.error.issues);
    }

    const enrichedComment: CommentWithProfile = {
      ...parsedComment.data,
      display_name: parsedComment.data.profile?.username || "Anonymous",
    };

    return enrichedComment;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Zod validation error validating comment:`, error.issues);
    } else if (error instanceof Error) {
      console.error(`❌ Error occurred inserting comment: ${error.message}`);
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}
