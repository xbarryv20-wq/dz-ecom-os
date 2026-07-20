"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signalSchema, type SignalInput } from "@/lib/validators";
import { SIGNAL_SOURCES, SIGNAL_TYPES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";
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

interface SignalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SignalInput) => void;
  initialData?: Partial<SignalInput>;
  isEditing?: boolean;
}

export function SignalForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: SignalFormProps) {
  const { t } = useI18n();
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") ?? ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignalInput>({
    resolver: zodResolver(signalSchema) as Resolver<SignalInput>,
    defaultValues: {
      source: initialData?.source ?? "",
      rawText: initialData?.rawText ?? "",
      sourceLink: initialData?.sourceLink ?? "",
      signalType: initialData?.signalType ?? "",
      niche: initialData?.niche ?? "",
      engagementEstimate: initialData?.engagementEstimate ?? 0,
      tags: initialData?.tags ?? [],
    },
  });

  const sourceValue = watch("source");
  const signalTypeValue = watch("signalType");
  const nicheValue = watch("niche");

  function handleFormSubmit(data: SignalInput) {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({ ...data, tags });
    reset();
    setTagsInput("");
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setTagsInput("");
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.signals.editSignal : t.signals.addNewSignal}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t.signals.editSignalDesc
              : t.signals.addSignalDesc}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">{t.signals.source}</Label>
            <Select
              value={sourceValue}
              onValueChange={(val) => setValue("source", val)}
            >
              <SelectTrigger id="source">
                <SelectValue placeholder={t.signals.chooseSource} />
              </SelectTrigger>
              <SelectContent>
                {SIGNAL_SOURCES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {t.signals.signalSources[s.key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawText">{t.signals.rawText}</Label>
            <Textarea
              id="rawText"
              placeholder={t.signals.rawTextPlaceholder}
              className="min-h-[100px]"
              {...register("rawText")}
            />
            {errors.rawText && (
              <p className="text-sm text-destructive">
                {errors.rawText.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceLink">{t.signals.sourceLink} ({t.common.notes})</Label>
            <Input
              id="sourceLink"
              placeholder="https://..."
              dir="ltr"
              {...register("sourceLink")}
            />
            {errors.sourceLink && (
              <p className="text-sm text-destructive">
                {errors.sourceLink.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signalType">{t.signals.signalType}</Label>
              <Select
                value={signalTypeValue}
                onValueChange={(val) => setValue("signalType", val)}
              >
                <SelectTrigger id="signalType">
                  <SelectValue placeholder={t.signals.chooseType} />
                </SelectTrigger>
                <SelectContent>
                  {SIGNAL_TYPES.map((st) => (
                    <SelectItem key={st.key} value={st.key}>
                      {t.signals.signalTypes[st.key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.signalType && (
                <p className="text-sm text-destructive">
                  {errors.signalType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">{t.signals.niche}</Label>
              <Select
                value={nicheValue}
                onValueChange={(val) => setValue("niche", val)}
              >
                <SelectTrigger id="niche">
                  <SelectValue placeholder={t.signals.chooseNiche} />
                </SelectTrigger>
                <SelectContent>
                  {NICHE_OPTIONS.map((n) => (
                    <SelectItem key={n.key} value={n.key}>
                      {t.niches[n.key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.niche && (
                <p className="text-sm text-destructive">
                  {errors.niche.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engagementEstimate">{t.signals.engagement}</Label>
            <Input
              id="engagementEstimate"
              type="number"
              min={0}
              placeholder="0"
              {...register("engagementEstimate")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t.signals.tagsPlaceholder}</Label>
            <Input
              id="tags"
              placeholder={t.signals.tagsHint}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
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
              {isEditing ? t.common.save : t.signals.addSignalButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
