// export type GetFileUrlInput = {
//     bucket: string
//     key: string
// }

module.exports.getFileUrl = function getFileUrl(props) {
    if (props.key.startsWith('/')) {
        props.key = props.key.substr(1)
    }

    return `https://${props.bucket}.s3.amazonaws.com/${props.key}`
}
