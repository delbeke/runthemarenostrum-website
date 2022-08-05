# runthemarenostrum-website
Public website for Follow the Coast

## Develop website

- Development: `gulp watch`

## Release website

- Release: `gulp default`
- Go to `\build\` and run `aws s3 sync . s3://runthemarenostrum  --acl public-read --delete --cache-control must-revalidate`
- Update CloudFront `aws cloudfront create-invalidation --distribution-id EAGO6BHSU5F40 --paths "/*"`