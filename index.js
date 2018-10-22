/* @flow */

type Component<T> = {
    name : string,
    requirer : () => T,
    setupHandler : ?string
};

export default function setupSDK(namespace : string, version : string, components : $ReadOnlyArray<Component<mixed>>) {

    if (window[namespace]) {
        let { version: existingVersion } = window[namespace];
        throw new Error(`SDK already loaded with ${ (existingVersion === version) ? 'same' : 'different' } version: ${ existingVersion } (this version: ${ version })`);
    }

    window[namespace] = window[namespace] || {};
    window[namespace].version = version;

    for (const { name, requirer, setupHandler } of components) {
        let componentExports = {};

        try {
            // $FlowFixMe
            let { [setupHandler]: setupComponent, ...rest } = requirer();

            if (setupComponent) {
                setupComponent();
            }

            componentExports = rest;
        } catch (err) {
            setTimeout(() => {
                throw new Error(`Bootstrap Error for ${ name }:\n\n${ err.message }\n\n${ err.stack }`);
            }, 1);
            continue;
        }

        window[namespace] = {
            ...window[namespace],
            ...componentExports
        };
    }
}
