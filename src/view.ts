// @ts-ignore-file (Prevent build crash)

import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";
import type { ViewStateResult } from "obsidian";

import type TranslatorPlugin from "./main";

import type { SvelteComponent } from "svelte";
import { ViewPage } from "./ui/pages";

import { type Writable, writable } from "svelte/store";
import { get } from "svelte/store";
import { settings } from "./stores";

import { SERVICES_INFO, TRANSLATOR_VIEW_ID } from "./constants";
import type { TranslatorServiceType } from "./types";
import { ViewAppearanceModal } from "./ui/modals";
import ViewFunctionalityModal from "./ui/modals/view_functionality_modal";

export interface TranslatorViewState {
	language_from: string;
	language_to: string;
	translation_service: TranslatorServiceType;
	auto_translate: boolean;
	apply_glossary: boolean;
	view_mode: number;
	filter_mode: number;
	show_attribution: boolean;
	top_buttons: string[];
	left_buttons: string[];
	right_buttons: string[];
}

interface TranslatorViewEphemeralState {
	receive_focus: boolean;
}

type ViewPageComponent = SvelteComponent & { getState: () => TranslatorViewState };

export class TranslatorView extends ItemView {
	view?: ViewPageComponent;

	// Translation service store is shared with the View component
	translation_service: Writable<TranslatorServiceType> = writable("dummy");

	// TODO: navigation causes notes to be replaced
	// navigation = true;

	constructor(leaf: WorkspaceLeaf, public plugin: TranslatorPlugin) {
		super(leaf);

		// Add view-specific settings modals to the tab title bar
		this.addAction("palette", "Change the view's appearance", () => {
			new ViewAppearanceModal(plugin.app, this).open();
		});

		this.addAction("wrench", "Alter the view's functionality", () => {
			new ViewFunctionalityModal(plugin.app, this).open();
		});
	}

	getViewType() {
		return TRANSLATOR_VIEW_ID;
	}

	getDisplayText() {
		return SERVICES_INFO[get(this.translation_service)].display_name;
	}

	getIcon(): string {
		return get(this.translation_service);
	}

	async onOpen() {
		this.contentEl.id = this.leaf.id!;
		this.contentEl.style.display = "flex";
		this.contentEl.style.flexDirection = "column";
	}

	getState(): Partial<TranslatorViewState> {
		const state = super.getState() as Partial<TranslatorViewState>;
		if (this.view) {
			const view_state = this.view.getState();
			state.language_from = view_state.language_from;
			state.language_to = view_state.language_to;
			state.translation_service = view_state.translation_service;
			state.auto_translate = view_state.auto_translate;
			state.apply_glossary = view_state.apply_glossary;
			state.view_mode = view_state.view_mode;
			state.filter_mode = view_state.filter_mode;
			state.show_attribution = view_state.show_attribution;
			state.top_buttons = view_state.top_buttons;
			state.left_buttons = view_state.left_buttons;
			state.right_buttons = view_state.right_buttons;
		}
		return state;
	}

	async updateState(props: Partial<TranslatorViewState>) {
		this.view?.$set(props);
	}

	async setState(state: Partial<TranslatorViewState>, result: ViewStateResult): Promise<void> {
		const current_settings = get(settings);
		if (!this.view) {
			this.translation_service.subscribe((value) => {
				// Update the tab data whenever the translation service changes
				setIcon(this.leaf.tabHeaderInnerIconEl, value);
				const title = SERVICES_INFO[value].display_name;
				this.leaf.tabHeaderEl.ariaLabel = title;
				this.leaf.tabHeaderInnerTitleEl.innerText = title;
				this.titleEl.innerText = title;
			});

			// If no translation service is set, use the global translation service
			this.translation_service.set(state.translation_service || current_settings.translation_service);

			this.view = new ViewPage({
				target: this.contentEl,
				props: {
					plugin: this.plugin,
					id: this.contentEl.id,
					translation_service: this.translation_service,

					// Get either the stored state settings, or use the default settings
					language_from: state.language_from ?? current_settings.default_source_language,
					language_to: state.language_to ?? current_settings.default_target_language,
					auto_translate: state.auto_translate || false,
					apply_glossary: state.apply_glossary ?? current_settings.apply_glossary,
					view_mode: state.view_mode ?? current_settings.layout_default,
					filter_mode: state.filter_mode || 0,
					show_attribution: state.show_attribution ?? current_settings.hide_attribution_default,
					top_buttons: state.top_buttons ?? [...current_settings.quicksettings_default],
					left_buttons: state.left_buttons ?? [...current_settings.left_quickactions_default],
					right_buttons: state.right_buttons ?? [...current_settings.right_quickactions_default],
				},
			}) as ViewPageComponent;
		} else {
			this.translation_service.set(state.translation_service || current_settings.translation_service);

			// Called whenever state get changed via appearance modal changes:
			// necessary because view_appearance.ts and view.ts/ViewPage.svelte cannot directly communicate
			this.view.$set({
				language_from: state.language_from || current_settings.default_source_language,
				language_to: state.language_to || current_settings.default_target_language,
				auto_translate: state.auto_translate || false,
				apply_glossary: state.apply_glossary || false,
				view_mode: state.view_mode || 0,
				filter_mode: state.filter_mode || 0,
				show_attribution: state.show_attribution !== undefined ? state.show_attribution : true,
				top_buttons: state.top_buttons || [],
				left_buttons: state.left_buttons || [],
				right_buttons: state.right_buttons || [],
			});
		}

		await super.setState(state, result);
	}

	async setEphemeralState(state: Partial<TranslatorViewEphemeralState>): Promise<void> {
		if (state.receive_focus)
			(<HTMLTextAreaElement> this.containerEl.find(".translator-left-column").children[1].children[0]).focus();
	}

	async onClose() {
		this.view?.$destroy();
		this.containerEl.detach();
	}

	onResize() {
		const rectangle = this.contentEl.getBoundingClientRect();
		this.view?.onResize(rectangle.width, rectangle.height);
	}
}
