"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, type PromptInput } from "@/lib/validators";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";

interface PromptFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PromptInput) => void;
  initialData?: Partial<PromptInput>;
  isEditing?: boolean;
}

export function PromptForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: PromptFormProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromptInput>({
    resolver: zodResolver(promptSchema) as Resolver<PromptInput>,
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      category: initialData?.category ?? "",
      isFavorite: initialData?.isFavorite ?? false,
    },
  });

  const categoryValue = watch("category");
  const contentValue = watch("content");

  function handleFormSubmit(data: PromptInput) {
    onSubmit(data);
    reset();
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.common.edit : t.prompts.addPrompt}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t.prompts.description
              : t.prompts.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.prompts.title}</Label>
            <Input
              id="title"
              placeholder={t.prompts.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t.prompts.category}</Label>
            <Select
              value={categoryValue}
              onValueChange={(val) => setValue("category", val)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={t.prompts.category} />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">{t.prompts.content}</Label>
              <span className="text-xs text-muted-foreground">
                {contentValue?.length ?? 0} {t.prompts.content}
              </span>
            </div>
            <Textarea
              id="content"
              placeholder={t.prompts.content}
              className="min-h-[200px] font-mono text-sm"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? t.common.save : t.prompts.addPrompt}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
