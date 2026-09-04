export function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-slate-900">{titulo}</h1>
      <p className="mt-2 text-sm text-slate-500">Pantalla en construcción.</p>
    </div>
  );
}
