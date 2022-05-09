// mother duck
class Duck extends Entity {
    constructor(game) {
        super(game);
        
        this.mesh = game.resources.models["duck"];

        this.determineLocationInWater();
        this.dir = new Vector(0.0, 0.0, 1.0).normalize();

        this.color = [255.0, 255.0, 255.0];

        this.followers = [];

        this.breadcrumbs = [];

        this.quackTimer = this.getQuackTimer();

    }

    lead(duckling) {
        if (this.followers.length > 0) {
            const leader = this.followers[this.followers.length - 1];

            duckling.following = leader; 

            leader.isFollowed = true;
            leader.follower = duckling;
        } else {
            duckling.following = this;
        }
        this.followers.push(duckling);
        this.isFollowed = true;

        // Spawn a new duck
        this.game.entities.push(new Duckling(this.game));
        //this.game.entities.push(new Duckling(this.game));
    }

    getQuackTimer() {
        return Math.round(2000 + Math.random()*4000);
    }

    update(dt) {
        let isColliding = false;

        this.quackTimer -= dt;
        if (this.quackTimer <= 0) {
            // quack!
            this.game.soundManager.playSound('quack'+Math.ceil(Math.random()*3));
            this.quackTimer = this.getQuackTimer();
        }

        // Update the followers
        for (let i = 1; i < this.followers.length; i++) {
            const duckling = this.followers[i];

            if (this.pos.distance(duckling.pos) < DUCKLING_COLLISION_DISTANCE && duckling.isInPlace()) {
                this.game.soundManager.playSound('flying');
                this.game.camera.transition(new Vector(640, 360, 500), 4000);
                this.game.state = GameState.Lost;
                return;
            }
        }

        // Check terrain collision
        const localHeight = this.game.world.getHeight(this.pos);  
        isColliding = (localHeight > 0.1);

        // Update breadcrumbs
        if (this.followers.length > 0 && (this.breadcrumbs.length === 0 || this.pos.distance(this.breadcrumbs[this.breadcrumbs.length - 1]) > BREADCRUMB_DISTANCE)) {
            this.breadcrumbs.push(this.pos.clone());
        }

        // Update the position of the duck
        if (!isColliding) this.pos = this.pos.add(this.dir.scale(dt / 1000 * DUCK_VELOCITY));
        else {
            this.game.soundManager.playSound('flying');
            this.game.camera.transition(new Vector(640, 360, 500), 4000);
            this.game.state = GameState.Lost;
        }

        // Project the position and the direction back onto the world
        this.pos = this._projectPosToWorld();
        this.dir = this._projectDirToWorld();

        this.angle = this._computeAngleFromDirection() - Math.PI / 2;
    }
}