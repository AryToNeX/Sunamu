import RPC, { Client, Presence } from "discord-rpc";
import { DiscordPresenceConfig } from "../types";
import { checkFunctionality, debug, getConfig } from "../util";

const clientId = "908012408008736779";
let rpc: Client | undefined;
let loginPromise;

async function connect(){
	if(loginPromise) return loginPromise;

	let _resolve;
	loginPromise = new Promise(resolve => {_resolve = resolve;});
	let error: boolean, client: Client;

	do {
		client = new RPC.Client({
			transport: "ipc"
		});

		client.once("connected", () => {
			debug("Discord RPC is connected");
		});

		// @ts-ignore
		client.once("disconnected", async () => {
			debug("Discord RPC was disconnected");
			rpc = undefined;
		});

		try{
			error = false;
			debug("Discord RPC logging in");
			await client.connect(clientId);
		}catch(_e){
			debug(_e);
			error = true;
			client.removeAllListeners();
			await client.destroy().catch(() => {});
			debug("Discord RPC errored out while logging in, waiting 5 seconds before retrying");
			await new Promise(resolve => setTimeout(resolve, 5000));
		}
	}while(error);

	rpc = client;
	_resolve();
	loginPromise = undefined;
}

export async function getPresenceConfig(){
	const settings: DiscordPresenceConfig = Object.assign({}, (await getConfig()).discordRpc);
	settings.enabled = checkFunctionality(settings.enabled, process.env.DISCORDRPC);
	return settings;
}

export async function updatePresence(presence?: Presence) {
	while (!rpc)
		await connect();

	if(!presence) {
		rpc.clearActivity();
		return;
	}

	return rpc.setActivity(presence);
}
