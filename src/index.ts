import { EventEmitter } from 'eventemitter3';
import { Client } from 'tmi.js';
import { Decoder } from './internal/decode';
import { encodeMessage } from './internal/encode';

export class Publisher {
	private client: Client;

	constructor(private channel: string, username: string, password: string) {
		this.client = new Client({
			identity: {
				username,
				password,
			},
			channels: [channel],
		});
	}

	public async connect() {
		await this.client.connect();
	}

	public async disconnect() {
		await this.client.disconnect();
	}

	public async publish(topic: string, message: string) {
		const msgs = encodeMessage(topic, message);
		for (const msg of msgs) {
			await this.client.say(this.channel, msg);
			await new Promise((resolve) => setTimeout(resolve, 200));
		}
	}
}

export class Subscriber extends EventEmitter {
	private client: Client;
	private decoder: Decoder;

	constructor(private channel: string, username: string) {
		super();
		this.decoder = new Decoder();
		this.client = new Client({
			channels: [channel],
		});
		this.client.on('message', (_, user, message) => {
			if (user.username !== username) return;
			const event = this.decoder.onMessage(message);
			if (event) {
				this.emit(event[0], event[1]);
			}
		});
	}

	public async connect() {
		await this.client.connect();
	}

	public async disconnect() {
		await this.client.disconnect();
	}
}
