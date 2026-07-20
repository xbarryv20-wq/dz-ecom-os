"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Store, Save } from "lucide-react";
import { CURRENCIES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

export interface ProfileData {
  full_name: string;
  email: string;
  store_name: string;
  phone: string;
  preferred_currency: string;
  preferred_niche: string;
}

interface ProfileFormProps {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
}

export function ProfileForm({ data, onSave }: ProfileFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ProfileData>(data);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{t.settings.profile}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">{t.settings.fullName}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              value={formData.email}
              readOnly
              className="bg-muted cursor-not-allowed"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_name">
              <Store className="inline h-3.5 w-3.5 ml-1" />
              {t.settings.storeName}
            </Label>
            <Input
              id="store_name"
              value={formData.store_name}
              onChange={(e) => handleChange("store_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.settings.phone}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.settings.currency}</Label>
            <Select
              value={formData.preferred_currency}
              onValueChange={(val) => handleChange("preferred_currency", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((cur) => (
                  <SelectItem key={cur.key} value={cur.key}>
                    {cur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.preferredNiche}</Label>
            <Select
              value={formData.preferred_niche}
              onValueChange={(val) => handleChange("preferred_niche", val)}
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

        <div className="flex justify-end pt-2">
          <Button onClick={() => onSave(formData)}>
            <Save className="h-4 w-4 ml-1" />
            {t.settings.saveProfile}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
