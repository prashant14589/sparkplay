'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: '#6d28d9',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: '10px 20px',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      🖨️ Print / Save as PDF
    </button>
  )
}
