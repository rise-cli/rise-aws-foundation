/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export function getFileUrl(props) {
    if (props.key.startsWith('/')) {
        props.key = props.key.substr(1)
    }

    return `https://${props.bucket}.s3.amazonaws.com/${props.key}`
}
