import type Chapter from '$lib/models/Chapter';
import type Hadith from '$lib/models/Hadith';
import { Page } from '$lib/models/Page';
import { text } from '@sveltejs/kit';
import { writable, type Writable } from 'svelte/store';

export const hadithBooks: Writable<string[]> = writable([]);

export const currentPage: Writable<Page> = writable(Page.HadithPicker);

export const selectedHadiths: Writable<Hadith[]> = writable([]);

export const hadithPickerModalVisible: Writable<boolean> = writable(false);
export const hadithEditorModalVisible: Writable<number> = writable(-1); // hadith.id. If -1, then no hadith is being edited.

export const isFetching = writable(false);
