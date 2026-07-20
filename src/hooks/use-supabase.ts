"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type TableName = "signals" | "products" | "product_variants" | "inventory_movements" | "campaigns" | "campaign_metrics" | "prompts" | "knowledge_entries" | "marketing_angles" | "profiles" | "tags" | "scripts" | "product_ai_reviews" | "signal_ai_analyses";

interface UseSupabaseQueryOptions<T> {
  table: TableName;
  select?: string;
  filters?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean;
  onFetch?: (data: T[]) => T[];
}

interface UseSupabaseQueryResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSupabaseQuery<T>({
  table,
  select = "*",
  filters,
  orderBy,
  limit,
  enabled = true,
  onFetch,
}: UseSupabaseQueryOptions<T>): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      let query = supabase.from(table).select(select);

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null && value !== "all") {
            query = query.eq(key, value);
          }
        }
      }

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        setError(queryError.message);
        return;
      }

      const processed = onFetch ? onFetch(result as T[]) : (result as T[]);
      setData(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [table, select, JSON.stringify(filters), JSON.stringify(orderBy), limit, enabled, onFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

interface UseSupabaseInsertResult<T> {
  insert: (data: Partial<T>) => Promise<{ data: T | null; error: string | null }>;
  isInserting: boolean;
}

export function useSupabaseInsert<T>(
  table: TableName
): UseSupabaseInsertResult<T> {
  const [isInserting, setIsInserting] = useState(false);

  const insert = useCallback(async (data: Partial<T>) => {
    setIsInserting(true);
    try {
      const supabase = createClient();
      const { data: result, error } = await supabase
        .from(table)
        .insert(data as Record<string, unknown>)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data: result as T, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Insert failed" };
    } finally {
      setIsInserting(false);
    }
  }, [table]);

  return { insert, isInserting };
}

interface UseSupabaseUpdateResult<T> {
  update: (id: string, data: Partial<T>) => Promise<{ data: T | null; error: string | null }>;
  isUpdating: boolean;
}

export function useSupabaseUpdate<T>(
  table: TableName
): UseSupabaseUpdateResult<T> {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data: result as T, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Update failed" };
    } finally {
      setIsUpdating(false);
    }
  }, [table]);

  return { update, isUpdating };
}

interface UseSupabaseDeleteResult {
  remove: (id: string) => Promise<{ error: string | null }>;
  isDeleting: boolean;
}

export function useSupabaseDelete(table: TableName): UseSupabaseDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Delete failed" };
    } finally {
      setIsDeleting(false);
    }
  }, [table]);

  return { remove, isDeleting };
}

// Helper: get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// Helper: check if Supabase is configured (not demo mode)
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}
