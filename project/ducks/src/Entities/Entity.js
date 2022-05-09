// base entity
// Let's try to not make this one general blob used for everything

class Entity {
    constructor(game, pos = new Vector(WORLD_RADIUS, 0.0, 0.0), dir = new Vector(0, 0, 0), rot = new Vector(0.0, 0.0, 0.0)) {
        this.game = game;

        this.angle = 0.0; // [rad] Angle on the sphere

        this.pos = pos; // Position in world space
        this.dir = dir; // Direction in world space
        this.rot = rot; // Rotation in world space

        this.color = [255, 255, 255];

        this.scale = 1.0;

        this.mesh = null;
    }


    determineLocationInWater() {
        let hasPosition = false;

        while (!hasPosition) {
            let pos = new Vector(2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS, 2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS, 2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS);
            pos = pos.normalize().scale(WORLD_RADIUS);

            const height = this.game.world.getHeight(pos);
            console.log("Random height:", height);
            if (height === 0.0) {
                hasPosition = true;
                this.pos = pos;
                break;
            }
        }
    }


    update() {
        throw new Error('Please implement update');
    }


    // Rotate the direction on the local plane
    rotateDirectionOnLocalPlane(angle = 0.0) {
        const localPlane = this.pos.normalize();

        const projectedDir = this._projectDirToWorld();
        const orthogonalVector = localPlane.cross(projectedDir).normalize();

        const direction = projectedDir.scale(Math.cos(angle)).add(orthogonalVector.scale(Math.sin(angle)));

        this.angle += angle;
        return direction;
    }


    // Compute the local angle based on the direction
    _computeAngleFromDirection() {
        const unitVectorUp = new Vector(0.0, 1.0, 0.0);
        const planeNormal = this.pos.normalize();

        const unitVectorUpInPlane = unitVectorUp.subtract(planeNormal.scale(unitVectorUp.dot(planeNormal))).normalize();
        const unitVectorSideInPlane = unitVectorUp.cross(planeNormal).normalize();

        const angle = Math.atan2(this.dir.dot(unitVectorUpInPlane), this.dir.dot(unitVectorSideInPlane));

        return angle;
    }


    // Compute direction from angle
    _getDirectionFromAngle() {
        this.dir = new Vector(Math.sin(this.angle), -Math.cos(this.angle), 0.0);
        return this._projectDirToWorld();
    }


    // Project the direction onto the local plane
    _projectDirToWorld() {
        const localPlane = this.pos.normalize();

        return this.dir.subtract(localPlane.scale(this.dir.dot(localPlane))).normalize();
    }


    // Projects the position of an entity onto the world
    _projectPosToWorld() {
        return this.pos.normalize().scale(WORLD_RADIUS);
    }
}