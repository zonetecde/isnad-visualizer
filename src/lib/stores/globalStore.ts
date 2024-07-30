import type Chapter from '$lib/models/Chapter';
import type Hadith from '$lib/models/Hadith';
import { Page } from '$lib/models/Page';
import { text } from '@sveltejs/kit';
import { writable, type Writable } from 'svelte/store';

export const hadithBooks: Writable<string[]> = writable([]);

export const currentPage: Writable<Page> = writable(Page.Main);

export const selectedHadiths: Writable<Hadith[]> = writable([]);

export const hadithEditorModalVisible: Writable<number> = writable(-1); // hadith.id. If -1, then no hadith is being edited.

export const isFetching = writable(false);

export const pageName: any = { [Page.Main]: '', [Page.HadithSelector]: 'hadiths-selector', [Page.IsnadViewer]: 'isnad-viewer' };
