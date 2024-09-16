import React from 'react'
import { FieldValue } from './type'

export interface FieldValueDisplayProps {
  value: FieldValue
}

export function FieldValueDisplay({ value }: FieldValueDisplayProps) {
  if (value.type === 'address') {
    if (value.name) {
      return (
        <a
          className="font-mono text-blue-700 text-sm"
          href={`#${value.address}`}
        >
          <strong>{value.name}</strong> {value.address}
        </a>
      )
    } else {
      return (
        <p className="font-mono text-gray-700 text-sm">
          <strong>???</strong> {value.address}
        </p>
      )
    }
  }

  if (value.type === 'hex') {
    return <small className="font-mono">{value.value}</small>
  }

  if (value.type === 'string') {
    return 'null'
  }

  if (value.type === 'number') {
    const fmt = Intl.NumberFormat('en-US')
    return (
      <p className="font-mono text-orange-800">{fmt.format(value.value)}</p>
    )
  }

  if (value.type === 'boolean') {
    return (
      <p className="font-bold font-mono text-orange-800 text-sm uppercase">
        {value.value.toString()}
      </p>
    )
  }

  if (value.type === 'array') {
    return null
  }

  if (value.type === 'object') {
    return null
  }

  if (value.type === 'unknown') {
    return value.value
  }

  return null
}
