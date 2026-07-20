"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  Star,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface GeneratedAngles {
  hooks: string[];
  angles: string[];
  tiktok_scripts: string[];
  facebook_posts: string[];
  upsell_ideas: string[];
  bundle_ideas: string[];
}

interface AngleDisplayProps {
  data: GeneratedAngles;
  onSave: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={handleCopy}
    >
      {copied ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function HookCard({ hook, index }: { hook: string; index: number }) {
  const [isWinner, setIsWinner] = useState(false);

  return (
    <Card className={`transition-colors ${isWinner ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}`}>
      <CardContent className="flex items-center gap-3 p-4">
        <Badge variant="outline" className="shrink-0">
          {index + 1}
        </Badge>
        <p className="flex-1 text-sm leading-relaxed">{hook}</p>
        <div className="flex items-center gap-1">
          <CopyButton text={hook} />
          <Button
            variant={isWinner ? "default" : "outline"}
            size="icon"
            className={`h-7 w-7 shrink-0 ${isWinner ? "bg-green-500 hover:bg-green-600" : ""}`}
            onClick={() => setIsWinner(!isWinner)}
          >
            <Star className={`h-3.5 w-3.5 ${isWinner ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AngleCard({ angle, index }: { angle: string; index: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Badge variant="outline" className="shrink-0">
          {index + 1}
        </Badge>
        <p className="flex-1 text-sm leading-relaxed">{angle}</p>
        <CopyButton text={angle} />
      </CardContent>
    </Card>
  );
}

function ScriptCard({ script, index }: { script: string; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.angles.script} {index + 1}</CardTitle>
        <div className="flex items-center gap-1">
          <CopyButton text={script} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm leading-relaxed">
            {script}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function PostCard({ post, index }: { post: string; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.angles.post} {index + 1}</CardTitle>
        <div className="flex items-center gap-1">
          <CopyButton text={post} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm leading-relaxed">
            {post}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function AngleDisplay({ data, onSave }: AngleDisplayProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t.angles.generatedResults}</h2>
        </div>
        <Button onClick={onSave} variant="outline">
          <Save className="ml-2 h-4 w-4" />
          {t.angles.saveAll}
        </Button>
      </div>

      <Tabs defaultValue="hooks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="hooks">
            {t.angles.hooks} ({data.hooks.length})
          </TabsTrigger>
          <TabsTrigger value="angles">
            {t.angles.angles} ({data.angles.length})
          </TabsTrigger>
          <TabsTrigger value="tiktok">
            {t.angles.tiktokScripts} ({data.tiktok_scripts.length})
          </TabsTrigger>
          <TabsTrigger value="facebook">
            {t.angles.facebookPosts} ({data.facebook_posts.length})
          </TabsTrigger>
          <TabsTrigger value="upsell">
            {t.angles.upsellIdeas} ({data.upsell_ideas.length})
          </TabsTrigger>
          <TabsTrigger value="bundles">
            {t.angles.bundleIdeas} ({data.bundle_ideas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hooks">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.hooks.map((hook, i) => (
                <HookCard key={i} hook={hook} index={i} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="angles">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.angles.map((angle, i) => (
                <AngleCard key={i} angle={angle} index={i} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tiktok">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.tiktok_scripts.map((script, i) => (
                <ScriptCard key={i} script={script} index={i} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="facebook">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.facebook_posts.map((post, i) => (
                <PostCard key={i} post={post} index={i} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upsell">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.upsell_ideas.map((idea, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Badge variant="outline" className="shrink-0">
                      {i + 1}
                    </Badge>
                    <p className="flex-1 text-sm leading-relaxed">{idea}</p>
                    <CopyButton text={idea} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bundles">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-1">
              {data.bundle_ideas.map((idea, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Badge variant="outline" className="shrink-0">
                      {i + 1}
                    </Badge>
                    <p className="flex-1 text-sm leading-relaxed">{idea}</p>
                    <CopyButton text={idea} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
