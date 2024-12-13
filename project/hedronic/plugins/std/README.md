# `geofront-lib`: Geofront Library

This is an 'std' library for the geofront environment. 
However, it is loaded like a plugin. 
This way, we both offer a base line of functionality,
as well as explain how plugins are created. 


## Usage:
- 🛠️ Build with `wasm-pack build`
   - Build for geofront: `wasm-pack build --out-dir ../app/public/wasm-modules/geofront/ --target web` 
- 🔬 Test in Headless Browsers with `wasm-pack test --headless --firefox`
- 🎁 Publish to NPM with `wasm-pack publish --target web`

### More Specifically:  
```
wasm-pack build --dev
wasm-pack build --out-dir build
wasm-pack build --out-dir ../../build/wasm-modules/hello-wasm/ --target web
```


## Dev Notes 

which linalg library to use?

