// heron that snatches away your ducklings
class Heron extends Entity {
    constructor(game) {
        super(game);

        this.mesh = game.resources.models["heron-body"];

        this.color = [255.0, 0.0, 0.0];

        this.scale = 1.5;
        this.hungerTimer = 0;


        // timer to play sounds
        this.callTimer = this.getCallTimer();
    }


    getCallTimer() {
        return Math.round(1000 + Math.random()*8000);
    }


    update(dt) {
        if (this.hungerTimer > 0) {
            this.hungerTimer = Math.max(0, this.hungerTimer - dt);
        } else {
            // look for a tasty snack
            let nearestDucklingIndex = -1;
            let nearestDucklingDistance = Infinity;

            for (let ducklingIndex in this.game.duck.followers) {
                const duckling = this.game.duck.followers[ducklingIndex];
                const distance = duckling.pos.distance(this.pos);

                if (distance < nearestDucklingDistance) {
                    nearestDucklingDistance = distance;
                    nearestDucklingIndex = ducklingIndex;
                }

                if (distance < HERON_SNACK_DISTANCE) {
                    console.log('chomp!');
                    this.game.soundManager.playSound('duckling_die');
                    this.game.soundManager.playSound('nom');
                    const looseLeader = duckling.following;
                    this.game.duck.followers.splice(ducklingIndex, 1);
                    this.game.entities.splice(this.game.entities.indexOf(duckling), 1);

                    if (this.game.duck.followers.length > ducklingIndex) {
                        // there's one behind it to connect
                        if (this.game.duck.followers[ducklingIndex].following == duckling) {
                            this.game.duck.followers[ducklingIndex].following = looseLeader;
                            looseLeader.follower = this.game.duck.followers[ducklingIndex];
                        }
                    }

                    this.hungerTimer = 2000;
                    break;
                }
            }

            // Point the heron towards the nearest duckling
            if (nearestDucklingIndex !== -1 && this.game.duck.followers[nearestDucklingIndex]) {
                const nearestDuckling = this.game.duck.followers[nearestDucklingIndex];

                this.dir = nearestDuckling.pos.subtract(this.pos);
                this.dir = this._projectDirToWorld();
                this.angle = this._computeAngleFromDirection() - Math.PI / 2;
            }

            this.callTimer -= dt;
            if (this.callTimer <= 0) {
                // quack!
                this.game.soundManager.playSound('heron'+Math.ceil(Math.random()*2));
                this.callTimer = this.getCallTimer();
            }
        }
    }
}