import { uuid } from './uuid'
/**
 * FormatKeys
 *
 * FormatKeys allows someone to put @id, which will
 * automatically replace it with a uuid
 *
 */
export function formatKeys(oldInput: any) {
    const input = { ...oldInput }
    if (input.pk && input.pk !== '@id' && input.pk.includes('@id')) {
        input.pk = input.pk.replace('@id', uuid())
    }

    if (input.pk && input.pk === '@id') {
        input.pk = uuid()
    }

    if (input.sk && input.sk !== '@id' && input.sk.includes('@id')) {
        input.sk = input.sk.replace('@id', uuid())
    }

    if (input.sk && input.sk === '@id') {
        input.sk = uuid()
    }

    return input
}
