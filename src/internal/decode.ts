import { base } from './base';
import {
	FullMessage,
	ISplitMessageHeader,
	ISplitMessagePart,
	Message,
	SplitMessageHeader,
} from './models';

type PartialData = {
	header?: ISplitMessageHeader;
	parts: Record<number, ISplitMessagePart>;
};

export class Decoder {
	private partialMessages = new Map<string, PartialData>();

	onMessage(data: string): [string, string] | undefined {
		if (data[0] !== 'A' || data[data.length - 1] !== 'A') return;
		// Decode the message
		const message = Message.decode(base.decode(data.slice(1, -1)));

		// If the full message fits in one, return it
		if (message.discriminator === FullMessage.discriminator) {
			return [message.value.topic, message.value.data];
		}

		const messageId = message.value.id;
		// Grab the existing partial message data
		let partialData = this.partialMessages.get(messageId);
		if (!partialData) {
			partialData = { parts: {} };
			this.partialMessages.set(messageId, partialData);
		}

		// If it's the header, store it
		if (message.discriminator === SplitMessageHeader.discriminator) {
			if (partialData.header) console.warn('Received duplicate header');
			partialData.header = message.value;
		} else {
			// If it's a part, store it
			if (partialData.parts[message.value.index]) {
				console.warn('Received duplicate part');
			}

			partialData.parts[message.value.index] = message.value;
		}
		const completeMessage = this.checkPartialCompletion(partialData);
		if (completeMessage) {
			this.partialMessages.delete(messageId);
			return completeMessage;
		}
	}
	/**
	 * Checks if the partial message is complete, and if so, returns it
	 * @param partialData The message data that's been received so far
	 * @returns [topic, message] if the message is complete, undefined otherwise
	 */
	checkPartialCompletion(
		partialData: PartialData
	): [string, string] | undefined {
		// Need a header
		if (!partialData.header) return;

		// Get the part count from the header
		const partCount = partialData.header.parts;

		// Data will be concatenated in this string
		let data = partialData.header.data;

		// Check if all parts have been received
		for (let i = 0; i < partCount; i++) {
			const part = partialData.parts[i];
			if (!part) return;
			data += part.data;
		}
		return [partialData.header.topic, data];
	}
}
