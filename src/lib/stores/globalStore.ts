import { writable, type Writable } from 'svelte/store';

export const inputIsnads: Writable<string[]> = writable(['']);
