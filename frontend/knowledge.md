# Frontend Knowledge

## Browser Compatibility

- Added autoprefixer to ensure CSS compatibility with Safari and other browsers
- Updated browserslist in package.json to explicitly include Safari 10+
- Enhanced viewport meta tag for better Safari rendering
- Created postcss.config.js to properly configure autoprefixer with tailwind

## Development Workflow

- After making CSS changes, ensure to rebuild CSS to apply autoprefixer transformations
- Test in multiple browsers, especially Safari, before deploying changes

## Common Issues

- Safari has stricter CSS implementation than Chrome/Firefox
- Safari may require explicit vendor prefixes for newer CSS features
- Flexbox and grid layouts may render differently in Safari
