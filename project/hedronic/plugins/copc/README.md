# Copc-gf
A Geofront plugin made from the [copc-rs](https://github.com/pka/copc-rs) crate
Can be used to load Copc files in Geofront

## Usage
- 🛠️ Build with `wasm-pack build`
   - Build for geofront: `wasm-pack build --out-dir ../app/public/wasm-modules/copc_front/ --target web` 
- 🔬 Test in Headless Browsers with `wasm-pack test --headless --firefox`
- 🎁 Publish to NPM with `wasm-pack publish --target web`
  L Note, something is wrong here, use `wasm-pack build --target web && wasm-pack publish`

