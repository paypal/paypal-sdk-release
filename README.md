PayPal Braintree Client SDK
---------------------------

Wrapper module to test and release combined client SDK modules for PayPal and Braintree.

## Quick Start

### Adding a new component module

TODO: Why save exact module versions?
**Warning:** only use exact module versions.

```bash
npm install --save --save-exact my-sdk-component
```

### Updating all components

```bash
npm run update-modules
```

### Updating specific components

```bash
npm run update-modules -- --filter=paypal-checkout
npm run update-modules -- --filter=braintree-hosted-fields
npm run update-modules -- --filter=paypal-checkout,braintree-hosted-fields
```

### Release

**Warning:** this will trigger a production deploy.

```bash
npm run release
```
