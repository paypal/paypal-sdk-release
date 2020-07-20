PayPal Braintree Client SDK
---------------------------

[![npm version](https://img.shields.io/npm/v/@paypal/sdk-release.svg?style=flat-square)](https://www.npmjs.com/package/@paypal/sdk-release) [![build status](https://img.shields.io/travis/paypal/paypal-sdk-release/master.svg?style=flat-square)](https://travis-ci.org/paypal/paypal-sdk-release)

[![dependencies Status](https://david-dm.org/paypal/paypal-sdk-release/status.svg)](https://david-dm.org/paypal/paypal-sdk-release) [![devDependencies Status](https://david-dm.org/paypal/paypal-sdk-release/dev-status.svg)](https://david-dm.org/paypal/paypal-sdk-release?type=dev)

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
