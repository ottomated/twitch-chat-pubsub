import makeBase from 'base-x';

// determined through experimentation, should probably be checked
export const charset =
	':!"#$%&\'()*+,-/0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';

export const base = makeBase(charset);

// The factor by which the message length is multiplied when encoded to get the byte length
export const messageFactor = Math.log(256) / Math.log(charset.length);

// Twitch allows 500 bytes, but we give it a little more room
export const maximumMessageByteLength = 495;
