## PayPal Braintree Client SDK

[![build status][build-badge]][build]
[![npm version][version-badge]][package]
[![apache license][license-badge]][license]

[build-badge]: https://img.shields.io/github/actions/workflow/status/paypal/paypal-sdk-release/main.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/paypal/paypal-sdk-release/actions?query=workflow%3Abuild
[version-badge]: https://img.shields.io/npm/v/@paypal/sdk-release.svg?style=flat-square
[package]: https://www.npmjs.com/package/@paypal/sdk-release
[license-badge]: https://img.shields.io/github/license/paypal/paypal-sdk-release.svg?style=flat-square
[license]: https://github.com/paypal/paypal-sdk-release/blob/main/LICENSE

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
npm run upgrade @paypal/checkout-components
npm run upgrade @paypal/card-components
```

### Rejecting specific packages during upgrade

Use `--REJECT` to exclude a package from being upgraded. This is useful when a package version needs to be pinned.

```bash
npm run upgrade -- --REJECT="@krakenjs/zoid"
```

To apply this via the GitHub Actions workflow, add `--REJECT="<package>"` to the `npm run upgrade` command in `.github/workflows/upgrade.yml`.

### Removing specific components

```bash
npm run remove @paypal/checkout-components
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
