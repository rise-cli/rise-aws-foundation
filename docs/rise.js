module.exports = {
    name: 'RISE AWS Foundation',
    logo: `<svg  height="14px" viewBox="0 0 50 50" version="1.1">
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#F0649B" offset="0%"></stop>
            <stop stop-color="#E95076" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle id="circle" fill="url(#linearGradient-1)" cx="25" cy="25" r="25"></circle>
    </g>
</svg>`,
    sidebar: {
        Intro: 'index.md',
        'How To': 'howto.md',
        'Cloud Formation': 'cloudformation.md',
        Lambda: 'lambda.md',
        S3: 's3.md',
        DynamoDB: 'db.md',
        Cognito: 'cognito.md',
        CodeStar: 'codestar.md'
        // 'Api Gateway': 'apigateway.md'
    }
}
