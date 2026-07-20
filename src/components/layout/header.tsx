interface HeaderProps {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
}

export function Header({ title, description, rightContent }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
}
