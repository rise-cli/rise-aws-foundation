// import crypto from 'crypto'
// import AWS from 'aws-sdk'

// const cognito = new AWS.CognitoIdentityServiceProvider({
//     region: process.env.REGION || 'us-east-1'
// })

// /**
//  * UUID
//  */
// const byteToHex = []
// for (let i = 0; i < 256; ++i) {
//     byteToHex.push((i + 0x100).toString(16).substr(1))
// }

// function bytesToUuid(buf, offset_) {
//     const offset = offset_ || 0
//     return (
//         byteToHex[buf[offset + 0]] +
//         byteToHex[buf[offset + 1]] +
//         byteToHex[buf[offset + 2]] +
//         byteToHex[buf[offset + 3]] +
//         '-' +
//         byteToHex[buf[offset + 4]] +
//         byteToHex[buf[offset + 5]] +
//         '-' +
//         byteToHex[buf[offset + 6]] +
//         byteToHex[buf[offset + 7]] +
//         '-' +
//         byteToHex[buf[offset + 8]] +
//         byteToHex[buf[offset + 9]] +
//         '-' +
//         byteToHex[buf[offset + 10]] +
//         byteToHex[buf[offset + 11]] +
//         byteToHex[buf[offset + 12]] +
//         byteToHex[buf[offset + 13]] +
//         byteToHex[buf[offset + 14]] +
//         byteToHex[buf[offset + 15]]
//     ).toLowerCase()
// }

// function rng() {
//     const rnds8 = new Uint8Array(16)
//     return crypto.randomFillSync(rnds8)
// }

// function uuid() {
//     const rnds = rng()
//     rnds[6] = (rnds[6] & 0x0f) | 0x40
//     rnds[8] = (rnds[8] & 0x3f) | 0x80
//     return bytesToUuid(rnds, undefined)
// }

// function makePassword() {
//     const id = uuid().split('-').join('').slice(0, 10)
//     const addCharacter = (x, char) => {
//         const i = Math.floor(Math.random() * 10) + 1
//         const arr = x.split('')
//         arr.splice(i, 0, char)
//         return arr.join('')
//     }

//     const withUppercaseLetter = addCharacter(id, 'C')
//     const withSpecialCharacter = addCharacter(withUppercaseLetter, '!')
//     return withSpecialCharacter
// }

// /**
//  * @param {object} props
//  * @param {string} props.email
//  * @param {string} [props.userPoolId]
//  * @param {Array.of<object>} [props.attributes] {name: string, value: string}
//  */
// export async function createUser(props) {
//     if (!props.email) {
//         throw new Error('CreateUser must have an email defined')
//     }

//     if (!process.env.USERPOOL_ID && !props.userPoolId) {
//         throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
//     }

//     const pass = makePassword()
//     const params = {
//         UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
//         Username: props.email,
//         TemporaryPassword: pass,
//         MessageAction: 'SUPPRESS',
//         UserAttributes: [
//             {
//                 Name: 'name',
//                 Value: props.email
//             },
//             {
//                 Name: 'email',
//                 Value: props.email
//             },
//             {
//                 Name: 'email_verified',
//                 Value: 'True'
//             }
//         ]
//     }

//     if (props.attributes) {
//         params.UserAttributes = [
//             ...params.UserAttributes,
//             ...props.attributes.map((x) => ({
//                 Name: x.name,
//                 Value: x.value
//             }))
//         ]
//     }

//     try {
//         await cognito.adminCreateUser(params).promise()
//         return {
//             email: props.email,
//             password: pass
//         }
//     } catch (err) {
//         throw new Error(err)
//     }
// }

// /**
//  * @param {object} props
//  * @param {string} props.userPoolId
//  * @param {string} props.email
//  */
// export async function getUser({ userPoolId, email }) {
//     try {
//         const params = {
//             UserPoolId: userPoolId,
//             Username: email
//         }

//         const result = await cognitoidentityserviceprovider
//             .adminGetUser(params)
//             .promise()

//         return {
//             id: result.Username
//         }
//     } catch (e) {
//         return false
//     }
// }

// /**
//  * @param {object} props
//  * @param {string} [props.userPoolId]
//  * @param {string} props.email
//  */
// export async function removeUser(props) {
//     if (!props.email) {
//         throw new Error('RemoveUser must have an email defined')
//     }

//     if (!process.env.USERPOOL_ID && !props.userPoolId) {
//         throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
//     }

//     const params = {
//         UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
//         Username: props.email
//     }

//     try {
//         await cognito.adminDeleteUser(params).promise()
//         return true
//     } catch (err) {
//         throw new Error(err)
//     }
// }

// /**
//  * @param {object} props
//  * @param {string} [props.userPoolId]
//  * @param {string} props.email
//  */
// export async function resetPassword(props) {
//     if (!props.email) {
//         throw new Error('CreateUser must have an email defined')
//     }

//     if (!process.env.USERPOOL_ID && !props.userPoolId) {
//         throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
//     }

//     const pass = makePassword()
//     const params = {
//         Password: pass,
//         UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
//         Username: props.email,
//         Permanent: false
//     }

//     try {
//         await cognito.adminSetUserPassword(params).promise()
//         return {
//             email: props.email,
//             password: pass
//         }
//     } catch (err) {
//         throw new Error(err)
//     }
// }
