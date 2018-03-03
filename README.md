PayPal Braintree Client SDK
---------------------------

Wrapper module to test and release combined client SDK modules for PayPal and Braintree.

## Quick Start

### Adding a new component module

**Warning:** only use exact module versions.

```javascript
npm install --save --save-exact my-sdk-component
```

### Updating all components

```javascript
npm run update-modules
```

### Updating specific components

```javascript
npm run update-modules -- --filter=paypal-checkout
npm run update-modules -- --filter=braintree-hosted-fields
npm run update-modules -- --filter=paypal-checkout,braintree-hosted-fields
```

### Release

**Warning:** this will trigger a production deploy.

```javascript
npm run release
```