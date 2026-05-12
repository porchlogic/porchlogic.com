## Reset repository to origin
Repository has been reset to match origin/main after fetching latest changes; working tree is clean with no local modifications.

## Build custom Pico-based design system
Need to pull Pico SCSS sources into the new scss/css folders, compile a custom Pico build, and switch shop/index.html to use that output while leaving the rest of the site unchanged.

## Move cart and checkout onto Pico styles
Update shop/cart.html and shop/checkout.html to drop the old shop.css, load the compiled Pico build, and rely on default Pico structure while keeping existing cart/checkout functionality intact.

## ⬜ Summarize shop/index.html contents
- COMPLETE : Read shop/index.html and produced a one-paragraph description covering layout, products, and interactions.

## ⬜ Keep social buttons visible and enlarge on all screen sizes
- COMPLETE : Updated landing page social button styles so they always render on mobile and increased icon size to about 2x.
  - Files: index.html

## ⬜ Increase mobile bottom spacing for social buttons
- COMPLETE : Raised mobile bottom offset so social buttons are no longer clipped on Android viewport chrome.
  - Files: index.html
