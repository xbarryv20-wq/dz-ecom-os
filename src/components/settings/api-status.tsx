"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, CheckCircle, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

function StatusItem({
  label,
  isConnected,
  isLoading,
  t,
}: {
  label: string;
  isConnected: boolean;
  isLoading: boolean;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            isLoading
              ? "bg-yellow-500"
              : isConnected
                ? "bg-green-500"
                : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {isLoading ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className="text-xs"
        >
          {isConnected ? (
            <>
              <CheckCircle className="h-3 w-3 ml-1" />
              {t.settings.connected}
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 ml-1" />
              {t.settings.notConnected}
            </>
          )}
        </Badge>
      )}
    </div>
  );
}

export function ApiStatus() {
  const { t } = useI18n();
  const [status, setStatus] = useState<{
    deepseek: boolean;
    openrouter: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{t.settings.apiConnectionStatus}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <StatusItem
          label="DeepSeek API"
          isConnected={status?.deepseek ?? false}
          isLoading={isLoading}
          t={t}
        />
        <StatusItem
          label="OpenRouter API"
          isConnected={status?.openrouter ?? false}
          isLoading={isLoading}
          t={t}
        />

        <p className="text-xs text-muted-foreground pt-2">
          {t.settings.keysStored}
        </p>
      </CardContent>
    </Card>
  );
}
