import type Chapter from '$lib/models/Chapter';
import { Page } from '$lib/models/Page';
import { text } from '@sveltejs/kit';
import { writable, type Writable } from 'svelte/store';

export const hadithBooks: Writable<string[]> = writable([]);

export const currentPage: Writable<Page> = writable(Page.HadithPicker);
