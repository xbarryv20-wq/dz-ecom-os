"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProfileForm, type ProfileData } from "@/components/settings/profile-form";
import { ApiStatus } from "@/components/settings/api-status";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseUpdate,
  getCurrentUserId,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type { Profile } from "@/types/database";

const INITIAL_PROFILE: ProfileData = {
  full_name: "أحمد بن محمد",
  email: "ahmed@dzecom.dz",
  store_name: "متجر الجزائر للجمال",
  phone: "+213 555 12 34 56",
  preferred_currency: "DZD",
  preferred_niche: "beauty",
};

export default function SettingsPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  const { data: profiles, refetch } = useSupabaseQuery<Profile>({
    table: "profiles",
    filters: userId ? { user_id: userId } : undefined,
    enabled: !isDemo && !!userId,
    limit: 1,
  });

  const profile = profiles[0] ?? null;
  const { update } = useSupabaseUpdate<Profile>("profiles");

  const [localProfile, setLocalProfile] = useState<ProfileData>(INITIAL_PROFILE);

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        full_name: profile.full_name ?? INITIAL_PROFILE.full_name,
        email: profile.email ?? INITIAL_PROFILE.email,
        store_name: profile.store_name ?? INITIAL_PROFILE.store_name,
        phone: profile.phone ?? INITIAL_PROFILE.phone,
        preferred_currency: profile.preferred_currency ?? INITIAL_PROFILE.preferred_currency,
        preferred_niche: profile.preferred_niche ?? INITIAL_PROFILE.preferred_niche,
      });
    }
  }, [profile]);

  const handleSaveProfile = async (data: ProfileData) => {
    if (isDemo) {
      setLocalProfile(data);
      return;
    }

    if (!profile?.id) return;

    const { error } = await update(profile.id, {
      full_name: data.full_name,
      email: data.email,
      store_name: data.store_name,
      phone: data.phone,
      preferred_currency: data.preferred_currency,
      preferred_niche: data.preferred_niche,
    });

    if (!error) {
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.settings.title}</h1>
          <p className="text-sm text-muted-foreground">
            إدارة ملفك الشخصي وتفضيلات التطبيق
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile">{t.settings.profile}</TabsTrigger>
          <TabsTrigger value="api"> {t.settings.apiSettings}</TabsTrigger>
          <TabsTrigger value="preferences">{t.settings.preferences}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-4">
          <ProfileForm data={localProfile} onSave={handleSaveProfile} />
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-4">
          <ApiStatus
            deepseekKey={process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY ?? ""}
            openrouterKey={process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? ""}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{t.settings.appPreferences}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{t.settings.language}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.settings.uiLanguage}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{t.settings.arabic}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    {t.settings.theme}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.settings.themeDesc}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {t.settings.comingSoon}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
