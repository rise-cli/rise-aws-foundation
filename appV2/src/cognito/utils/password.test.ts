import { test, expect } from 'vitest'
import { makePassword } from './password'

function containsUpperCase(str: string) {
    let res = false
    str.split('').forEach((x) => {
        if (x === x.toUpperCase()) {
            res = true
        }
    })
    return res
}

function containsNumbers(str: string) {
    return /\d/.test(str)
}

function containsSpecialCharacter(str: string) {
    return /[^A-Za-z0-9 ]/.test(str)
}

test('makePassword will make a password', () => {
    const pass = makePassword()
    expect(typeof pass).toBe('string')
    expect(containsUpperCase(pass)).toBe(true)
    expect(containsSpecialCharacter(pass)).toBe(true)
    expect(containsNumbers(pass)).toBe(true)
})
