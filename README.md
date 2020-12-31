# runthemarenostrum-website
Public website for Run The Mare Nostrum

## Develop website

- Development: `gulp watch`

## Release website

- Release: `gulp default`
- Go to `\build\` and run `aws s3 sync . s3://runthemarenostrum  --acl public-read`
- Update CloudFront `aws cloudfront create-invalidation --distribution-id EAGO6BHSU5F40 --paths "/*"`