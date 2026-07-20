"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ApiStatusProps {
  deepseekKey: string;
  openrouterKey: string;
}

interface StatusItemProps {
  label: string;
  isConnected: boolean;
}

function StatusItem({ label, isConnected, t }: StatusItemProps & { t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
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
    </div>
  );
}

export function ApiStatus({ deepseekKey, openrouterKey }: ApiStatusProps) {
  const { t } = useI18n();
  const deepseekConnected = !!deepseekKey && deepseekKey.length > 0;
  const openrouterConnected = !!openrouterKey && openrouterKey.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{t.settings.apiConnectionStatus}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <StatusItem label="DeepSeek API" isConnected={deepseekConnected} t={t} />
        <StatusItem label="OpenRouter API" isConnected={openrouterConnected} t={t} />

        <p className="text-xs text-muted-foreground pt-2">
          {t.settings.keysStored}
        </p>
      </CardContent>
    </Card>
  );
}
