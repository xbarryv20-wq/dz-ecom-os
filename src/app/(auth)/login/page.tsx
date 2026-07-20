"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n/context";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const { t } = useI18n();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: t.auth.loginError, description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({ title: t.auth.signupError, description: t.auth.passwordMismatch, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: email.split("@")[0] },
      },
    });

    if (error) {
      toast({ title: t.auth.signupError, description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile entry
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        email: email,
        full_name: email.split("@")[0],
        preferred_currency: "DZD",
      }).maybeSingle();
    }

    toast({ title: t.auth.signupSuccess, variant: "default" });
    setLoading(false);
    setMode("login");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-card-foreground">{t.common.appName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login" ? t.auth.loginSubtitle : t.auth.signup}
        </p>
      </div>

      <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            className="text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t.auth.password}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            dir="ltr"
            className="text-left"
          />
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              dir="ltr"
              className="text-left"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? mode === "login" ? t.auth.loggingIn : t.auth.signingUp
            : mode === "login" ? t.auth.loginButton : t.auth.signupButton}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <button
            onClick={() => { setMode("signup"); setConfirmPassword(""); }}
            className="text-primary hover:underline"
          >
            {t.auth.noAccount} {t.auth.signup}
          </button>
        ) : (
          <button
            onClick={() => { setMode("login"); setConfirmPassword(""); }}
            className="text-primary hover:underline"
          >
            {t.auth.hasAccount} {t.auth.login}
          </button>
        )}
      </div>
    </div>
  );
}
