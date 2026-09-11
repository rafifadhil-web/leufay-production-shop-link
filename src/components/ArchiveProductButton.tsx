'use client';

/** Browser confirmation belongs in a Client Component; the mutation stays a Server Action. */
export function ArchiveProductButton({ action }: { action: () => Promise<void> }) {
  return <form action={action} style={{ display: 'inline' }}>
    <button
      className="meta"
      type="submit"
      style={{ border: 0, background: 'none', color: '#ffab65', marginLeft: 12, cursor: 'pointer' }}
      onClick={(event) => {
        if (!window.confirm('Apakah kamu yakin ingin menghapus produk ini?')) event.preventDefault();
      }}
    >
      ARCHIVE
    </button>
  </form>;
}
