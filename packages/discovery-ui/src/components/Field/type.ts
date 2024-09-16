export type FieldValue =
  | AddressFieldValue
  | HexFieldValue
  | StringFieldValue
  | NumberFieldValue
  | BooleanFieldValue
  | ArrayFieldValue
  | ObjectFieldValue
  | UnknownFieldValue

export interface AddressFieldValue {
  type: 'address'
  name?: string
  address: string
}

export interface HexFieldValue {
  type: 'hex'
  value: string
}

export interface StringFieldValue {
  type: 'string'
  value: string
}

export interface NumberFieldValue {
  type: 'number'
  value: bigint
}

export interface BooleanFieldValue {
  type: 'boolean'
  value: boolean
}

export interface ArrayFieldValue {
  type: 'array'
  values: FieldValue[]
}

export interface ObjectFieldValue {
  type: 'object'
  value: Record<string, FieldValue>
}

export interface UnknownFieldValue {
  type: 'unknown'
  value: string
}

export function parseFieldValue(
  value: unknown,
  names: Record<string, string> = {},
): FieldValue {
  if (typeof value === 'string') {
    if (/^0x[a-f\d]*$/i.test(value)) {
      if (value.length === 42) {
        return { type: 'address', name: names[value], address: value }
      } else {
        return { type: 'hex', value }
      }
    } else if (/^-?\d+$/.test(value)) {
      return { type: 'number', value: BigInt(value) }
    } else {
      return { type: 'string', value }
    }
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return { type: 'number', value: BigInt(value) }
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean', value }
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      values: value.map((v) => parseFieldValue(v, names)),
    }
  }

  if (typeof value === 'object' && value !== null) {
    return {
      type: 'object',
      value: Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          parseFieldValue(value, names),
        ]),
      ),
    }
  }

  return {
    type: 'unknown',
    value: `${value}`,
  }
}
