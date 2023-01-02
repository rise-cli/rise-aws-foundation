import { uuid } from './uuid'
import { test, expect } from 'vitest'

test('uuid will generate an unique id', () => {
    const id = uuid()
    const id2 = uuid()
    expect(typeof id).toBe('string')
    expect(id !== id2).toBeTruthy()
})
