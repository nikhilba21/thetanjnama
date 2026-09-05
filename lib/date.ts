export function formatDateSafe(dateInput?: string | null): string {
  if (!dateInput) return 'हाल ही में';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'हाल ही में';
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return 'हाल ही में';
  }
}
