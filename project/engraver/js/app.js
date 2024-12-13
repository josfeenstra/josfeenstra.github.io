import { hello_world, draw_polyline, send_message, send_file } from '../gen/engraver.js'
import { processMultipleFiles, setupDragAndDrop } from './file-retrieval.js'

let toggle = true;

// Attach the event listener to the button
document.addEventListener('DOMContentLoaded', (event) => {

    function listen(id, callback) {
        const button = document.getElementById(id);
        button.addEventListener('click', () => { callback(button) });
    }

    listen('draw-polyline-button', (b) => {
        console.log("clicked");
        draw_polyline(toggle);
        toggle = !toggle;

        if (toggle) {
            b.innerText = "Draw Polyline";
        } else {
            b.innerText = "Stop Drawing Polyline";
        }
    });

    listen('simple-message-button', () => {
        console.log("clicked simple message button");
        let message = document.getElementById("simple-message-input").value;
        console.log(message);
        send_message(message);

    });

    hook_up_file_retrievers("dropzone", "selector", "file-input", 'stl', (name, buffer) => {

        const view = new Uint8Array(buffer);
        send_file(name, view)
    });
});



/**
 * Hook up everything
 * @param {String} dropzone_class_id 
 * @param {(a: string, b: string | ArrayBuffer | null) => void} callback what to run when files are recieved
 */
function hook_up_file_retrievers(dropzone_class_id, selector_class_id, file_input, desired_extension, callback) {

    // setup file input
    let input = document.getElementById(file_input);
    input.addEventListener("change", (ev) => {
        processMultipleFiles(input.files, callback, desired_extension);
    })

    // setup drop mechanic
    let drops = document.querySelectorAll('.' + dropzone_class_id);
    if (drops.length == 0) {
        console.error("cant find the dropbox...");
        return;
    }
    for (let drop of drops) {

        setupDragAndDrop(drop, (files) => {
            processMultipleFiles(files, callback, desired_extension)
        });

    }

    let selectors = document.querySelectorAll('.' + selector_class_id);
    if (selectors.length == 0) {
        console.error("cant find selectors...");
        return;
    }
    for (let s of selectors) {

        s.addEventListener("mouseenter", () => {
            s.classList.add("mouse-on")
        })

        s.addEventListener("mouseleave", () => {
            s.classList.remove("mouse-on")
        })

        // a little hack to make anything able to ask for file submissions
        s.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById(file_input).click();
        })
    }


}
