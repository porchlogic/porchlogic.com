# Porch Logic Website Development Guide

## Build Commands
- Build CSS: `npx tailwindcss -i styles.scss -o styles.css --watch`
- Compile SCSS: `npx sass styles.scss styles.css --watch`
- Start development server: Use a local server like `npx serve` or any HTTP server

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include appropriate accessibility attributes
- Classes follow TailwindCSS conventions

### CSS/SCSS
- Follow nested BEM-like structure in SCSS files
- Use TailwindCSS utilities via @apply when possible
- Custom components should be organized by layout section

### JavaScript
- Follow standard ES6+ conventions
- Handle errors with try/catch for async operations
- Use meaningful variable and function names
- Prefer const/let over var

### Naming Conventions
- Files: lowercase with hyphens (kebab-case)
- CSS classes: descriptive, functional purpose
- JS variables: camelCase
- Functions: camelCase with action verbs

### Project Organization
- HTML files at root level
- SCSS organized by component/section
- Assets in dedicated folders (images, fonts)