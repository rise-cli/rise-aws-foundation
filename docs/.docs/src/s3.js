module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
   
    <style>
        body {
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;
            color: rgb(17, 24, 39);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Inter;
        }

        h1 {
            opacity: 1;
            margin-top: 5rem;
            line-height: 1.25;
            font-size: 3rem;
            font-weight: 700;
            font-family: Inter;
            border-bottom: 1px solid rgb(229, 231, 235);
            margin-bottom: 20px;
            padding-bottom: 1rem;
        }

        h2 {
            margin-top: 2.5rem;
            line-height: 2.25;
            font-size: 2rem;
            font-weight: 700;
            font-family: Inter;

            margin-top: 2rem;
            margin-bottom: 1.5rem;
        }

        p {
            color: rgb(55, 65, 81);
            margin: 0;
            margin-bottom: 1rem;
        }

        nav {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f4f4f8;
            padding: 0 20px;
            position: fixed;
            z-index: 100;
            top: 0;
            right: 0;
            left: 0;
            background: white;
        }
        nav p {
            margin: 0;
        }

        .wrapper {
            max-width: 768px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
            width: 90%;
        }
     
        .side-container {
            position: fixed;
            top: 61px;
            left: 0px;
            bottom: 20px;
            background: white;
            width: 200px;
            margin: 0;
            padding: 0;
            padding-top: 20px;
         
        }

        .side-container ul {
            margin: 0;
            padding: 0 20px;
        }

        .side-container li {
            list-style: none;
            padding: 6px 0 6px 0;
            border: 1px solid #fff;
            border-radius: 6px;
        }

        .side-container li.selected {
            background: #f4f4f8;
            border: 1px solid #eaeaed;
            border-radius: 6px;
        }

        .side-container a {
            color: rgb(113, 113, 113);
            display: flex;
            align-items: center;
            text-decoration: none;
            font-size: 14px;
            margin-left: 20px;
            
        }

        .side-container svg {
            margin-right: 6px;
            opacity: 0.3;
            margin-left: 20px;
        }

        .hamburger {
            margin-left: auto;
            display: none;
        }


        @media(max-width: 1200px) {
            .side-container {
               
                overflow-y: scroll;
                height: 100vh;
                width: 100%;
                transform: translateX(100%);
            }
            .side-container.open {
                transform: translateX(0);
            }
            .hamburger {
                display: block;
            }
        }

     
        .hamburger .line{
            width: 16px;
            height: 2px;
            background-color: rgb(17, 24, 39);
            display: block;
            margin: 3px auto;
            -webkit-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            transition: all 0.2s ease-in-out;
        }

        .hamburger:hover{
            cursor: pointer;
        }

        .hamburger.open .line:nth-child(2){
            opacity: 0;
        }

        .hamburger.open .line:nth-child(1){
            -webkit-transform: translateY(5px) rotate(45deg);
            -ms-transform: translateY(5px) rotate(45deg);
            -o-transform: translateY(5px) rotate(45deg);
            transform: translateY(5px) rotate(45deg);
        }

        .hamburger.open .line:nth-child(3){
            -webkit-transform: translateY(-5px) rotate(-45deg);
            -ms-transform: translateY(-5px) rotate(-45deg);
            -o-transform: translateY(-5px) rotate(-45deg);
            transform: translateY(-5px) rotate(-45deg);
        }

        code[class*='language-'],
            pre[class*='language-'] {
            color: #e4f0fb;
            background: none;
            text-shadow: 0 1px rgba(0, 0, 0, 0.3);
            font-family: Menlo, Monaco, 'Courier New', monospace;
            font-size: 0.95em;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            line-height: 1.5;

            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;

            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
        }

        /* Code blocks */
        pre[class*='language-'] {
            --comment: #a6accd;
            --punctuation: #e4f0fb;
            --property: #e4f0fb;
            --boolean: #5de4c7;
            --string: #5de4c7;
            --operator: #add7ff;
            --function: #5de4c7;
            --keyword: #add7ff;
            --literal: #fffac2;
            --falsy: #f087bd;

            padding: 1.75em;
            margin: 1.5em 0;
            overflow: auto;
            border-radius: 0.75em;
            border-radius: 0.75em;
        }

        :not(pre) > code[class*='language-'],
            pre[class*='language-'] {
            background: #252b37;
            
        }

        /* Inline code */
        :not(pre) > code[class*='language-'] {
            padding: 0.1em;
            border-radius: 0.3em;
            white-space: normal;
        }

        .token.namespace {
            opacity: 0.7;
        }

        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
            color: var(--comment);
        }

        .token.punctuation {
            color: var(--punctuation);
        }

        .token.property,
        .token.tag,
        .token.constant,
        .token.symbol,
        .token.deleted {
            color: var(--property);
        }

        .token.boolean,
        .token.number {
            color: var(--boolean);
        }

        .token.selector,
        .token.attr-value,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
            color: var(--string);
        }

        .token.attr-name,
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string,
        .token.variable {
            color: var(--operator);
        }

        .token.atrule,
        .token.function,
        .token.class-name {
            color: var(--function);
        }

        .token.keyword {
            color: var(--keyword);
        }

        .token.regex,
        .token.important {
            color: var(--literal);
        }

        .token.deleted {
            color: var(--falsy);
        }

        .token.important,
        .token.bold {
            font-weight: bold;
        }
        .token.italic {
            font-style: italic;
        }

        .token.entity {
            cursor: help;
        }
    </style>
</head>
<body>
    <nav>
        <svg  height="14px" viewBox="0 0 50 50" version="1.1">
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#F0649B" offset="0%"></stop>
            <stop stop-color="#E95076" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle id="circle" fill="url(#linearGradient-1)" cx="25" cy="25" r="25"></circle>
    </g>
</svg><p style='margin-left: 6px; font-weight: bold'>RISE AWS Foundation</p>
        <p style='font-weight: normal; color: #adb3be; margin-left: 4px;'> Documentation</p>
     
        <div id='menu-button' class="hamburger" id="hamburger-1">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
    </nav>
    <div id='menu' class="side-container">
        <ul>
            <li class='false'>
    <a href='index.html'>
      
        <span>Intro</span>
    </a>
</li>
<li class='false'>
    <a href='howto.html'>
      
        <span>How To</span>
    </a>
</li>
<li class='false'>
    <a href='cloudformation.html'>
      
        <span>Cloud Formation</span>
    </a>
</li>
<li class='false'>
    <a href='lambda.html'>
      
        <span>Lambda</span>
    </a>
</li>
<li class='selected'>
    <a href='s3.html'>
      
        <span>S3</span>
    </a>
</li>

        </ul>
    </div>
    <div class='wrapper'>
        <h1 id="s3">s3</h1>
<h2 id="introduction">Introduction</h2>
<p>Working with files is a common requirement for apps. If the thing you are working with
can be represented as a JSON object, this is not the service to use (although, sometimes poeple will dump GB of data
into s3 for analytics, usually in the form of a zip file). If your data can be represented as
an object, DynamoDB is the service for you. If not, then S3 is a good service to consider.</p>
<p>Files represent any binary file
such as:</p>
<ul>
<li>zip files containing lambda source code</li>
<li>pictures</li>
<li>audio files</li>
<li>video files</li>
<li>any file that cannot be represented as a JSON object</li>
</ul>
<h2 id="s3uploadfile">s3.uploadFile</h2>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
<span class="token keyword">await</span> rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">uploadFile</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">file</span><span class="token operator">:</span> myBinaryFile<span class="token punctuation">,</span>
    <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">'my-test-bucket'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">'/pics/mypic.jpg'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
<h2 id="s3getfile">s3.getFile</h2>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
<span class="token keyword">await</span> rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">getFile</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">'my-test-bucket'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">'/pics/mypic.jpg'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
<h2 id="s3removefile">s3.removeFile</h2>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
<span class="token keyword">await</span> rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">removeFile</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">'my-test-bucket'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">'/pics/mypic.jpg'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
<h2 id="s3getfileurl">s3.getFileUrl</h2>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">getFileUrl</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">'mybucket'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">'/one/two.jpg'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
<h2 id="s3cfmakesimplebucket">s3.cf.makeSimpleBucket</h2>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> s3 <span class="token operator">=</span> rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">makeSimpleBucket</span><span class="token punctuation">(</span><span class="token string">'myBucketName'</span><span class="token punctuation">)</span>
</code></pre>
<h2 id="s3cfmakebucket">s3.cf.makeBucket</h2>
<p>This bucket has additional permissions and encryption settings. This is good
for storing source files for an application</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> rise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rise-aws-foundation'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> s3 <span class="token operator">=</span> rise<span class="token punctuation">.</span>s3<span class="token punctuation">.</span><span class="token function">makeBucket</span><span class="token punctuation">(</span><span class="token string">'myBucketName'</span><span class="token punctuation">)</span>
</code></pre>

    </div>
    <script>
            let menuOpen = false;
            document.getElementById('menu-button')
                .addEventListener('click', () => {
                    menuOpen = !menuOpen
                    if (menuOpen) {
                        document.getElementById('menu').className = 'side-container open'
                        document.getElementById('menu-button').className = 'hamburger open'
                    } else {
                        document.getElementById('menu').className = 'side-container'
                        document.getElementById('menu-button').className = 'hamburger'
                    }
                })
    </script>
</body>
</html>`