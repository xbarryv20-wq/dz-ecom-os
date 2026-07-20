"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { knowledgeSchema, type KnowledgeInput } from "@/lib/validators";
import { KNOWLEDGE_CATEGORIES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KnowledgeEntry } from "./knowledge-card";

interface KnowledgeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KnowledgeInput) => void;
  initialData?: KnowledgeEntry;
  isEditing?: boolean;
}

export function KnowledgeForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: KnowledgeFormProps) {
  const { t } = useI18n();
  const [tagsInput, setTagsInput] = useState("");

  const form = useForm<KnowledgeInput>({
    resolver: zodResolver(knowledgeSchema) as Resolver<KnowledgeInput>,
    defaultValues: {
      title: "",
      content: "",
      niche: "",
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          content: initialData.content,
          niche: initialData.niche,
          category: initialData.category,
          tags: initialData.tags,
        });
        setTagsInput(initialData.tags.join(", "));
      } else {
        form.reset({
          title: "",
          content: "",
          niche: "",
          category: "",
          tags: [],
        });
        setTagsInput("");
      }
    }
  }, [open, initialData, form]);

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const parsed = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    form.setValue("tags", parsed, { shouldValidate: true });
  };

  const handleSubmit = (data: KnowledgeInput) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.common.edit : t.knowledge.addEntry}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.prompts.title}</Label>
            <Input
              id="title"
              placeholder={t.prompts.title}
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t.prompts.content}</Label>
            <Textarea
              id="content"
              placeholder={t.prompts.content}
              rows={6}
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.prompts.category}</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(val) =>
                  form.setValue("category", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.prompts.category} />
                </SelectTrigger>
                <SelectContent>
                  {KNOWLEDGE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.signals.niche}</Label>
              <Select
                value={form.watch("niche")}
                onValueChange={(val) =>
                  form.setValue("niche", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.signals.chooseNiche} />
                </SelectTrigger>
                <SelectContent>
                  {NICHE_OPTIONS.map((niche) => (
                    <SelectItem key={niche.key} value={niche.key}>
                      {niche.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t.signals.tagsPlaceholder}</Label>
            <Input
              id="tags"
              placeholder={t.signals.tagsHint}
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          {isEditing && initialData && (
            <div className="flex items-center gap-2">
              <Switch
                id="is_pinned"
                checked={initialData.is_pinned}
                onCheckedChange={() => {
                  form.setValue("category", form.watch("category"), {
                    shouldValidate: true,
                  });
                }}
              />
              <Label htmlFor="is_pinned">{t.knowledge.pinned}</Label>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit">
              {isEditing ? t.common.save : t.common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
