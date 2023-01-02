export type GetFileUrlInput = {
    bucket: string
    key: string
}

/** Get the url for a s3 bucket file */
export default function getFileUrl(props: GetFileUrlInput): string {
    if (props.key.startsWith('/')) {
        props.key = props.key.substr(1)
    }

    return `https://${props.bucket}.s3.amazonaws.com/${props.key}`
}
