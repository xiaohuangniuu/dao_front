import {Buffer} from "buffer";
import { Principal } from '@dfinity/principal'
import { sha224 } from './sha224'
import { getCrc32 } from './crc'
import { toHexString } from './hex'
// @ts-ignore
import { to32bits,from32bits } from './bit'

export function PrincipalToShow(principalText : string){
    return principalText.substring(0,5) + "..." +principalText.substring(principalText.length-3)
}

const padding = new Buffer('\x0Atid')
const getSubAccountArray = (s:number) => {
    if (Array.isArray(s)) {
        return s.concat(Array(32 - s.length).fill(0))
    } else {
        //32 bit number only
        return Array(28)
            .fill(0)
            .concat(to32bits(s ? s : 0))
    }
}
export const principalToAccountIdentifier = (p:string, s:number) => {
    const padding = new Buffer('\x0Aaccount-id')

    // @ts-ignore
    const array = new Uint8Array([...padding, ...Principal.fromText(p).toUint8Array(), ...getSubAccountArray(s)])
    const hash = sha224(array)
    const checksum = to32bits(getCrc32(hash))
    // @ts-ignore
    const array2 = new Uint8Array([...checksum, ...hash])
    return toHexString(array2)
}

export const principalToAccountIdentifierArray = (p: string, s: number) => {
    const padding = new Buffer('\x0Aaccount-id')
    const array = new Uint8Array([...padding, ...Principal.fromText(p).toUint8Array(), ...getSubAccountArray(s)])
    const hash = sha224(array)
    const checksum = to32bits(getCrc32(hash))
    const array2 = new Uint8Array([...checksum, ...hash])
    return Array.from(array2)
}