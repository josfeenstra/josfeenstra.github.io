// Pathfinder.js - Pathfinder utilities for entities on the world

class Pathfinder {
	// Returns an array of waypoints from the start to the destination if it exists
	// Algorithm: A*
	// Size: the size of the grid we consider
	static findPath(game, start, destination, size = 1) {
		let world = game.world;
		let terrain = world.terrain;
		let entities = world.entities;

		if (start == null) return;
		if (destination == null) return;

		// Don't try to pathfind if the starting tile or ending tile is inaccessible
		if (!terrain.getTile(start).isAccessible()) return;
		if (!terrain.getTile(destination).isAccessible()) return;

		let directions = [
			new Vector(1, 1), new Vector(-1, -1), new Vector(-1, 1), new Vector(1, -1),
			new Vector(1, 0),  new Vector(0, 1), new Vector(-1, 0), new Vector(0, -1),
		];

		let expandedNodes = [];
		let availableNodes = [];

		let id = 0;
		availableNodes.push({id: id++, pos: start, cost: 0, previous: null});

		// As long as we do not reach the destination add nodes and score
		let foundPath = false;
		while(!foundPath) {
			if(id > 9999 || availableNodes.length === 0) break;

			// Pick node with lowest cost
			availableNodes.sort((a, b) => ((a.cost < b.cost) ? -1 : ((a.cost > b.cost) ? 1 : 0)));
			let node = availableNodes[0];

			// Evaluate nodes adjacent to the node
			for (let direction of directions) {
				let pos = node.pos.add(direction).round();
				let tile = terrain.getTile(pos);
				if(tile.isAccessible() && !tile.isOccupied() && expandedNodes.find(e => e.pos.equals(pos)) == null) {
					let distance = pos.distance(destination);
					let cost = node.cost + distance + node.pos.distance(pos);

					let nodeVisitedBefore = availableNodes.find(e => e.pos.equals(pos));
					if(nodeVisitedBefore != null) {
						if(nodeVisitedBefore.cost > cost) {
							nodeVisitedBefore.cost = cost;
							nodeVisitedBefore.previous = node.id;
						}
					} else {
						availableNodes.push({id: id++, pos: pos, cost: cost, previous: node.id});

						if(pos.equals(destination)) {
							foundPath = true;
							break;
						}
					}
				}
			}

			// Expand the node that was just evaluated
			expandedNodes.push(node);
			availableNodes.splice(availableNodes.findIndex(e => e.id == node.id), 1);
		}

		// Trace back the nodes from the destination to the start based on cost to create a path
		if(foundPath) {
			let lastNode = availableNodes.find(e => e.pos.equals(destination));

			let path = [];
			path.push(lastNode);

			while(!(lastNode.pos.equals(start))) {
				lastNode = expandedNodes.find(e => e.id == lastNode.previous);
				path.push(lastNode);
			}
			path.reverse();

			return path;
		}
		return null;
	}


	static findRoomPath(game, startRoom, destinationRoom, size = 1) {
		let world = game.world;
		let rooms = world.ship.rooms;
		let entities = world.entities;

		if (startRoom == null) return;
		if (destinationRoom == null) return;

		let expandedNodes = [];
		let availableNodes = [];

		let id = 0;
		availableNodes.push({id: id++, room: startRoom, cost: 0, previous: null});

		// As long as we do not reach the destination add nodes and score
		let foundPath = false;
		while(!foundPath) {
			if(id > 9999 || availableNodes.length === 0) break;

			// Pick node with lowest cost
			availableNodes.sort((a, b) => ((a.cost < b.cost) ? -1 : ((a.cost > b.cost) ? 1 : 0)));
			let node = availableNodes[0];

			// Evaluate nodes adjacent to the node
			// console.log(Object.entries(node.neighbors));
			for (let neighbor of Object.values(node.room.neighbors)) {
				if(!neighbor.door) continue;

				let room = neighbor.room;

				// if there is no room to this neighboring side, or the room is full of water, don't consider it for pathfinding
				if (!room) continue; //(room.getFlooding() >= TRAVERSABLE_WATER_LEVEL && !room == destinationRoom)) continue;
				// TODO possibly add this back into the code
				// || expandedNodes.find(e => e.room == room) !== null

				// room is accessible! Yay!
				let distance = room.standPos.distance(destinationRoom.standPos);
				let cost = node.cost + distance + node.room.standPos.distance(room.standPos);

				// extra cost for closed doors
				cost += (neighbor.door.isOpen ? 0 : 50);
				// extra cost for water in room
				cost += neighbor.room.getFlooding() * 100;

				let nodeVisitedBefore = availableNodes.find(e => e.room == room);
				if (nodeVisitedBefore != null) {
					if (nodeVisitedBefore.cost > cost) {
						nodeVisitedBefore.cost = cost;
						nodeVisitedBefore.previous = node.id;
					}
				} else {
					availableNodes.push({id: id++, room: room, cost: cost, previous: node.id});

					if (room.standPos.equals(destinationRoom.standPos)) {
						foundPath = true;
						break;
					}
				}
			}

			// Expand the node that was just evaluated
			expandedNodes.push(node);
			availableNodes.splice(availableNodes.findIndex(e => e.id == node.id), 1);
		}

		// Trace back the nodes from the destination to the start based on cost to create a path
		if(foundPath) {
			let lastNode = availableNodes.find(e => e.room.standPos.equals(destinationRoom.standPos));

			let path = [];
			path.push(lastNode);

			while(!(lastNode.room.standPos.equals(startRoom.standPos))) {
				lastNode = expandedNodes.find(e => e.id == lastNode.previous);
				path.push(lastNode);
			}
			path.reverse();
			return path;
		}
		return null;
	}
}
