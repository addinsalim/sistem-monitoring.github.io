import React from 'react'

export default function StatusBadge({ label, tone = 'green' }) {
  return <span className={`status-badge badge-${tone}`}>{label}</span>
}

