import type { Transmitter } from './Transmitter';

export interface Isnad {
	id: number;
	text: string;
	transmitters: Transmitter[];
}
