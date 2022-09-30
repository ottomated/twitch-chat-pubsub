import makeBase from 'base-x';

export const charset =
	':!"#$%&\'()*+,-/0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';

export const base = makeBase(charset);

export const messageFactor = Math.log(256) / Math.log(charset.length);
export const maximumMessageByteLength = 495;
