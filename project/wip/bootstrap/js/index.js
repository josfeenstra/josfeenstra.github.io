import { Cheese } from "./food/cheese.js"; // bug in TypeScript.
function main() {
    console.log("Hello, world!");
    console.log("this is cheese:");
    let kaas = new Cheese("spicy", false);
    console.log(kaas);
    // test of ES2016 werkt
    let list = ["henk", "kaas", "pieter"];
    console.log(list.includes("pieter"));
}
window.addEventListener("load", main, false);
