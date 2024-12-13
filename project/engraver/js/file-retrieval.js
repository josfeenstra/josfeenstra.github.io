/** process a json
 * @param {string} jsonString
 */
function readJson(jsonString) {
    console.log("size", jsonString.length);
    let json = JSON.parse(jsonString);
    console.log(json);
}


/** process a file
 * @param {File} file
 * @param {(a: string, b: string | ArrayBuffer | null) => void} callback callback for what to do with the recovered data
 */
function processFile(file, callback) {

    var reader = new FileReader();
    reader.addEventListener("load", (e2) => {
        callback(file.name, e2.target.result);
    });
    reader.readAsArrayBuffer(file); // start reading the file data.
}


//#region dragging & dropping, wiring, and other js business


/** process all files, recieved by either a drag&drop or file selection
 * @param {FileList} files the list of files
 * @param {string} desiredExtention what type of file to look for
 * @param {(a: string, b: string | ArrayBuffer | null) => void} callback callback for what to do with the recovered data
 * @return {boolean} true on succes, false on failure 
 */
export function processMultipleFiles(files, callback, desiredExtention = "json") {

    console.clear();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let type = getFileExtention(file.name);
        console.log(`file ${i}: name: ${file.name}, type: ${type}`)
        if (type == desiredExtention) {
            processFile(file, callback);
            //return;
        } else {
            console.log(`Can't process this file: Please give me something which ends on .${desiredExtention}!`);
        }
    }


}


/**
 * Setup a bunch of events so the element can be used as a drag & drop element
 * @param {HTMLElement} element The HTML element to drag & drop onto.
 * @param {(files: FileList) => void} callback what to run when files are recieved
 */
export function setupDragAndDrop(element, callback, dropclass = "drop-enter") {

    console.log("setting up drag events...");

    element.addEventListener("dragenter", (ev) => {
        ev.preventDefault();
        element.classList.add(dropclass)
        // console.log("entering entering...");
        return true;
    }, true);

    element.addEventListener("dragleave", (ev) => {
        ev.preventDefault();
        element.classList.remove(dropclass)
        // console.log("leaving drag....");
        return true;
    }, true);

    // note: this is a bit ugly, keep adding drop-enter every frame.
    // but due to an overlap 'bug' this is needed.
    element.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        element.classList.add(dropclass)
        return true;
    }, true);

    element.addEventListener("drop", (ev) => {
        //prevent browser from opening the file when drop off
        ev.stopPropagation();
        ev.preventDefault();
        element.classList.remove(dropclass)

        var files = ev.dataTransfer.files;
        callback(files);

        return true;
    }, true);
}

/** process all files, recieved by either a drag&drop or file selection
 * @param {string} filename
 * @return {string} 
 */
function getFileExtention(filename) {
    let parts = filename.split(".")
    if (parts.length > 1) {
        return parts.pop();
    } else {
        return ""
    }
}
