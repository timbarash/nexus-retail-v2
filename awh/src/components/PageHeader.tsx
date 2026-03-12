interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-panel-300">{subtitle}</p>}
    </div>
  );
}
