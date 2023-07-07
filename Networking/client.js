const {HelloRequest, Empty} = require('./pool_pb.js');
const {PoolGameClient} = require('./pool_grpc_web_pb.js');
const grpc_promise = require('grpc-promise');;

var client = new PoolGameClient('http://chrissytopher.com:50051');
grpc_promise.promisifyAll(client);

async function createGame() {
	return client.createRoom().sendMessage({});
}

async function getRoom(room_id) {
	return client.getRoom().sendMessage({room_code: room_id});
}

async function joinRoom(room_id) {
	return client.joinRoom().sendMessage({room_code: room_id});
}

async function setPlayerInfo(room_id, token, player_id, name) {
	await client.setPlayerInfo().sendMessage({room_id: {room_code: room_id}, authed_player: {player_id: player_id, name: name, player_token: token}});
}