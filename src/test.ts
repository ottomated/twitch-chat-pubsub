import { Publisher, Subscriber } from './index';
import { config } from 'dotenv';
config();

const publisher = new Publisher(
	'cheatstream',
	'ottomated',
	process.env.OAUTH_TOKEN as string
);

const subscriber = new Subscriber('cheatstream', 'ottomated');

(async () => {
	const longMessage = 'a'.repeat(2000);

	await publisher.connect();
	await subscriber.connect();
	subscriber.on('topic1', (message) => {
		console.log('Topic 1:', message);
	});
	subscriber.on('topic2', (message) => {
		console.log('Topic 2:', message);
	});
	await publisher.publish('topic1', 'Hello, world!');
	await publisher.publish('topic2', 'Hello, world!');
	await publisher.publish('topic1', longMessage);
})();
