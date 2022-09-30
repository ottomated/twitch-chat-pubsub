import { base, maximumMessageByteLength, messageFactor } from './base';
import {
	FullMessage,
	Message,
	SplitMessageHeader,
	SplitMessagePart,
} from './models';
import { v4 } from 'uuid';

function encodeFullMessage(topic: string, data: string): string {
	return (
		'A' +
		base.encode(
			Message.encode({
				discriminator: FullMessage.discriminator,
				value: {
					topic,
					data,
				},
			})
		) +
		'A'
	);
}

export function encodeMessage(topic: string, data: string): string[] {
	// Encode it in one message if it fits
	const singleMessageLength = getMessageLength(topic, data);
	if (singleMessageLength <= maximumMessageByteLength) {
		return [encodeFullMessage(topic, data)];
	}
	// Calculate header data length
	const headerLength = getHeaderDataLength(topic);

	const chatMessages: string[] = [];
	const id = v4();

	// Slice the data up into chunks and encode them
	let dataSliceStart = headerLength;
	let index = 0;
	while (dataSliceStart < data.length) {
		const partLength = getPartDataLength();
		const view = data.slice(dataSliceStart, dataSliceStart + partLength);
		chatMessages.push(
			base.encode(
				Message.encode({
					discriminator: SplitMessagePart.discriminator,
					value: {
						id,
						index,
						data: view,
					},
				})
			)
		);
		index++;
		dataSliceStart += partLength;
	}
	// Encode the header (do this after the parts so we know how many there are)
	chatMessages.unshift(
		base.encode(
			Message.encode({
				discriminator: SplitMessageHeader.discriminator,
				value: {
					id,
					topic,
					parts: chatMessages.length,
					data: data.slice(0, headerLength),
				},
			})
		)
	);
	return chatMessages.map((m) => `A${m}A`);
}

/**
 * @param topic The topic of the message
 * @param data The data of the message
 * @returns The length of the message if it were encoded in one message
 */
function getMessageLength(topic: string, data: string) {
	return (
		4 + // message length
		1 + // discriminator
		4 + // topic length
		topic.length + // topic string
		4 + // data length
		data.length
	);
}

/**
 * @returns The length of the data that can be stored in the header
 */
function getHeaderDataLength(topic: string): number {
	return Math.floor(
		maximumMessageByteLength / messageFactor -
			(4 + // message length
				1 + // discriminator
				16 + // guid
				4 + // topic length
				topic.length + // topic string
				2 + // number of parts
				4) // data length
	);
}
/**
 * @returns The length of the data that can be stored in a part
 */
function getPartDataLength(): number {
	return Math.floor(
		maximumMessageByteLength / messageFactor -
			(4 + // message length
				1 + // discriminator
				16 + // guid
				2 + // part index
				4) // data length
	);
}
