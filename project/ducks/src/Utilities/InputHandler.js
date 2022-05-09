class InputHandler {
  constructor(game) {
    this.game = game;

    this.listeningTo = {};
    this.pressed = {};
    this.mouse = new Vector();
    this.delta = new Vector();

    this.mouseClick = {};
    this.rightClick = {};
    this.unprocessedClick = false;
    this.unprocessedRightClick = false;

    this.isRightPressed = false;
    this.isMousePressed = false;

    this.hasBeenFocussed = false;

    this.boundingRect = null;

    this.touches = [];

    this.unprocessedScroll = false;
    this.deltaScroll = 0;

    // special cases for the modyfiers
    this.isShiftDown = false;


    // Add event listener for blur
    this.game.canvas.addEventListener("blur", event => {
      this.game.isPaused = true;
    });


    // Add event listener for focus
    this.game.canvas.addEventListener("focus", event => {
      this.game.isPaused = false;
    });


    // Add event listener for key down
    document.addEventListener("keydown", event => {
      // if there's a listener, do callback
      if (this.listeningTo[event.code]) {
        this.isShiftDown = event.shiftKey;
        this.listeningTo[event.code](true);
        this.pressed[event.code] = true;
      }
    });


    // Add event listener for key up
    document.addEventListener("keyup", event => {
      // if there's a listener, do callback
      if (this.listeningTo[event.code]) {
        this.listeningTo[event.code](false);
        this.pressed[event.code] = false;
      }
    });


    // Add an event listener for mouse clicks
    this.game.canvas.addEventListener("click", event => {
      this.unprocessedClick = true;
      this.mouseClick = {
          pos: new Vector(this.mouse.x, this.mouse.y),
          shift: event.shiftKey,
          control: event.ctrlKey
      }
    });


    // Add an event listener for mouse mouse
    this.game.canvas.addEventListener("mousemove", event => {
      this.boundingRect = this.game.canvas.getBoundingClientRect();

      let pos = new Vector();
      pos.x = event.clientX - this.boundingRect.x;
      pos.y = event.clientY - this.boundingRect.y;

      // Width is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) > (this.game.width / this.game.height)) {
        pos.x = (pos.x - (this.boundingRect.width - (this.game.width * (this.boundingRect.height / this.game.height))) / 2) * (this.game.height / this.boundingRect.height);
        pos.y = pos.y * (this.game.height / this.boundingRect.height);
      }

      // Height is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) < (this.game.width / this.game.height)) {
        pos.x = pos.x * (this.game.width / this.boundingRect.width);
        pos.y = (pos.y - (this.boundingRect.height - (this.game.height * (this.boundingRect.width / this.game.width))) / 2) * (this.game.width / this.boundingRect.width);
      }

      this.delta = pos.clone().subtract(this.mouse);
      this.mouse = new Vector(pos.x, pos.y);

      this.isMouseMoving = true;
    });


    this.game.canvas.addEventListener("mousedown", event => {
      // right mouse button
      if (event.button === 2) {
        this.isRightPressed = true;
      }

      if(!this.hasBeenFocussed) this.hasBeenFocussed = true;

      this.isMousePressed = true;

      this.mouseAtDown = this.mouse.clone();
    });


    this.game.canvas.addEventListener("mouseup", event => {
      // right mouse button
      if (event.button === 2) {
        this.isRightPressed = false;
      }

      this.isMousePressed = false;
    });


    // the user starts pressing the screen
    this.game.canvas.addEventListener("touchstart", event => {
      this.boundingRect = this.game.canvas.getBoundingClientRect();

      let pos = new Vector();
      pos.x = event.clientX - this.boundingRect.x;
      pos.y = event.clientY - this.boundingRect.y;

      // Width is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) > (this.game.width / this.game.height)) {
        pos.x = (pos.x - (this.boundingRect.width - (this.game.width * (this.boundingRect.height / this.game.height))) / 2) * (this.game.height / this.boundingRect.height);
        pos.y = pos.y * (this.game.height / this.boundingRect.height);
      }

      // Height is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) < (this.game.width / this.game.height)) {
        pos.x = pos.x * (this.game.width / this.boundingRect.width);
        pos.y = (pos.y - (this.boundingRect.height - (this.game.height * (this.boundingRect.width / this.game.width))) / 2) * (this.game.width / this.boundingRect.width);
      }

      this.mouse = new Vector(pos.x, pos.y);

      this.touches = Object.entries(event.touches).map(([index, touch]) => {
        return [index, {
          x: pos.x,
          y: pos.y
        }];
      });

      this.isMousePressed = true;
    });


    // the user drags across the screen
    this.game.canvas.addEventListener("touchmove", event => {
      this.boundingRect = this.game.canvas.getBoundingClientRect();

      let pos = new Vector();
      pos.x = event.clientX - this.boundingRect.x;
      pos.y = event.clientY - this.boundingRect.y;

      // Width is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) > (this.game.width / this.game.height)) {
        pos.x = (pos.x - (this.boundingRect.width - (this.game.width * (this.boundingRect.height / this.game.height))) / 2) * (this.game.height / this.boundingRect.height);
        pos.y = pos.y * (this.game.height / this.boundingRect.height);
      }

      // Height is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) < (this.game.width / this.game.height)) {
        pos.x = pos.x * (this.game.width / this.boundingRect.width);
        pos.y = (pos.y - (this.boundingRect.height - (this.game.height * (this.boundingRect.width / this.game.width))) / 2) * (this.game.width / this.boundingRect.width);
      }

      this.mouse = new Vector(pos.x, pos.y);

      this.touches = Object.entries(event.touches).map(([index, touch]) => {
        return [index, {
          x: pos.x,
          y: pos.y
        }];
      });
    });


    this.game.canvas.addEventListener("wheel", event => {
      this.deltaScroll = event.deltaY;
      this.unprocessedScroll = true;
    });


    this.game.canvas.addEventListener("touchend", event => {
      this.boundingRect = this.game.canvas.getBoundingClientRect();

      let pos = new Vector();
      pos.x = event.clientX - this.boundingRect.x;
      pos.y = event.clientY - this.boundingRect.y;

      // Width is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) > (this.game.width / this.game.height)) {
        pos.x = (pos.x - (this.boundingRect.width - (this.game.width * (this.boundingRect.height / this.game.height))) / 2) * (this.game.height / this.boundingRect.height);
        pos.y = pos.y * (this.game.height / this.boundingRect.height);
      }

      // Height is limited by aspect ratio
      if ((this.boundingRect.width / this.boundingRect.height) < (this.game.width / this.game.height)) {
        pos.x = pos.x * (this.game.width / this.boundingRect.width);
        pos.y = (pos.y - (this.boundingRect.height - (this.game.height * (this.boundingRect.width / this.game.width))) / 2) * (this.game.width / this.boundingRect.width);
      }

      this.mouse = new Vector(pos.x, pos.y);

      this.isMousePressed = false;

      this.touches = Object.entries(event.touches).map(([index, touch]) => {
        return [index, {
          x: pos.x,
          y: pos.y
        }];
      });
    });


    this.game.canvas.addEventListener("contextmenu", event => {
      event.preventDefault();
      this.unprocessedRightClick = true;
      this.rightClick = {
          pos: new Vector(this.mouse.x, this.mouse.y),
      }
    });
  }


  // Add an event listener to the specified key code
  listenTo(code, callback) {
    if(!Object.keys(this.listeningTo).includes(code)) {
      this.listeningTo[code] = callback;
    }
  }


  stopListeningTo(code) {
    if(Object.keys(this.listeningTo).includes(code)) {
      delete this.listeningTo[code];
    }
  }


  // Return boolean if a key is pressed
  isPressed(key) {
    return this.pressed[key] ? true : false;
  }


  // Checks if a click just occurred in a certain area
  isClickedScreenPos(x, y, w, h) {
    if (x instanceof Rectangle) {
      if (x.covers(this.mouseClick.pos) && this.unprocessedClick) {
        // this.unprocessedClick = false;
        return true;
      }
    } else {
      if(this.mouseClick.pos.x > x && this.mouseClick.pos.x < (x + w) && this.mouseClick.pos.y > y && this.mouseClick.pos.y < (y + h) && this.unprocessedClick) {
        // this.unprocessedClick = false;
        return true;
      }
    }
    return false;
  }


  getClickedWorldPos() {
    if (this.unprocessedClick) {
        let zoomedMouse = this.mouse.multiply(1 / this.game.camera.zoom);
        let worldPos = this.game.camera.pos.subtract(new Vector(this.game.canvas.width/2, this.game.canvas.height/2)).add(zoomedMouse);
        // this.unprocessedClick = false;
        return {
            pos: worldPos,
            shift: this.mouseClick.shift,
            control: this.mouseClick.control
        }
    } else {
        console.error('Requested click pos when no pos was clicked!');
        return null;
    }
  }


  getRightClickedWorldPos() {
      if (this.unprocessedRightClick) {
          let zoomedMouse = this.mouse.multiply(1 / this.game.camera.zoom);
          let worldPos = this.game.camera.pos.subtract(new Vector(this.game.canvas.width/2, this.game.canvas.height/2)).add(zoomedMouse);
          this.unprocessedRightClick = false;
          return {
              pos: worldPos,
              shift: this.mouseClick.shift
          }
      } else {
          console.error('Requested right click pos when no pos was clicked!');
          return null;
      }
  }


  getMouseWorldPos() {
      let zoomedMouse = this.mouse.multiply(1 / this.game.camera.zoom);
      let worldPos = this.game.camera.pos.subtract(new Vector(this.game.canvas.width/2, this.game.canvas.height/2)).add(zoomedMouse);
      return worldPos;
  }


  isMouseInScreenPos(x, y, w, h) {
    if(this.mouse.x > x && this.mouse.x < (x + w) && this.mouse.y > y && this.mouse.y < (y + h)) {
      return true;
    }
    return false;
  }


  isScrolling(callback) {
    if(this.unprocessedScroll) {
      this.unprocessedScroll = false;

      callback(this.deltaScroll);
    }
  }


  update(dt) {
    this.unprocessedClick = false;
  }
}
