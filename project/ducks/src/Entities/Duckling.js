// the little ducklings
class Duckling extends Entity {
    constructor(game) {
        super(game);

        this.mesh = game.resources.models["duckling"];

        this.determineLocationInWater();

        this.color = [255.0, 232.0, 67.0];

        this.scale = 1.0;

        // the duck or duckling this entity is following
        this.following = null;
        this.follower = null;

        this.hasBeenInPlace = false;

        this.breadcrumbs = [];
    }
    

    distanceToDuck() {
        return this.pos.distance(this.game.duck.pos);
    }

    distanceToFollowing() {
        return this.pos.distance(this.following.pos);
    }


    update(dt) {
        // Update the has been in place status
        if (!this.hasBeenInPlace && this.following && this.distanceToDuck() > DUCKLING_IN_PLACE_DISTANCE && this.distanceToFollowing() <= DUCKLING_IN_PLACE_DISTANCE) {
            this.hasBeenInPlace = true;
        } else if (!this.hasBeenInPlace && this.following && this.following instanceof Duck) {
            this.hasBeenInPlace = true;
        }

        // Follow the entity that is being followed
        if (this.following) {
            const madeStep = false;

            while (true) {
                const isFollowingBreadcrumb = this.following.breadcrumbs.length > 0;
                const goalPos = (isFollowingBreadcrumb) ? this.following.breadcrumbs[0] : this.following.pos;

                const distance = this.pos.distance(goalPos);
                if (isFollowingBreadcrumb && distance < BREADCRUMB_REACHED_DISTANCE) {
                    this.following.breadcrumbs.splice(0, 1);
                } else {
                    this.dir = goalPos.subtract(this.pos).normalize();
                    this.dir = this._projectDirToWorld();
                    if (distance > DUCKLING_FOLLOW_DISTANCE || isFollowingBreadcrumb) {
                        this.pos = this.pos.add(this.dir.scale(dt / 1000 * DUCK_VELOCITY * DUCKLING_VELOCITY_FACTOR));
                    } 
                    break;
                }
            }
            
        } else {
            const duck = this.game.duck;
            if (duck.pos.subtract(this.pos).length() < DUCKLING_PICKUP_DISTANCE) {
                // happy duckling noises
                this.game.soundManager.playSound('duckling');
                duck.lead(this);
            }
        }

        // Update breadcrumbs
        if (this.follower && this.follower.pos.distance(this.pos) < BREADCRUMB_ALLOWED_DISTANCE && (this.breadcrumbs.length === 0 || this.pos.distance(this.breadcrumbs[this.breadcrumbs.length - 1]) > BREADCRUMB_DISTANCE)) {
            this.breadcrumbs.push(this.pos.clone());
        }

        // Update position and 
        this.pos = this._projectPosToWorld();
        this.angle = this._computeAngleFromDirection() - Math.PI / 2;
    }

    isInPlace() {
        return this.following && this.hasBeenInPlace && this.distanceToFollowing() <= (DUCKLING_FOLLOW_DISTANCE + 1.0);
    }


    follow(entity) {
        this.following = entity;
        entity.isFollowed = true;
    }
}