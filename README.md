PayPal Braintree Client SDK
---------------------------

Wrapper module to test and release combined client SDK modules for PayPal and Braintree.

## Quick Start

### Adding a new component module

```bash
npm run add my-sdk-component
```

### Updating all components

```bash
npm run upgrade
```

### Updating specific components

```bash
npm run upgrade paypal-checkout-components
npm run upgrade paypal-braintree-hosted-fields-component
```

### Removing specific components

```bash
npm run remove paypal-checkout-components
```

### Release

**Warning:** this will trigger an npm publish and production deploy.

```bash
npm run release
```

### Activate

**Warning:** this will move the published version into traffic.

```bash
npm run activate
```

To roll back, or activate a specific version:

```bash
npm run activate x.x.x
```
