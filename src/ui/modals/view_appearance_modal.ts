import { App, Modal } from "obsidian";
import type { SvelteComponent } from "svelte";
import { get } from "svelte/store";
import { QUICK_ACTIONS, QUICK_SETTINGS } from "../../constants";
import { generateIdentifier } from "../../util";
import { settings } from "../../stores";
import type { TranslatorView, TranslatorViewState } from "../../view";
import ViewAppearanceModalView from "./ViewAppearanceModalView.svelte";

type QuickSettingButton = (typeof QUICK_SETTINGS)[keyof typeof QUICK_SETTINGS] & { id: string };
type QuickActionButton = (typeof QUICK_ACTIONS)[keyof typeof QUICK_ACTIONS] & { id: string };

type AppearanceModalState = Omit<TranslatorViewState, "top_buttons" | "left_buttons" | "right_buttons"> & {
	top_buttons: QuickSettingButton[];
	left_buttons: QuickActionButton[];
	right_buttons: QuickActionButton[];
};

export default class ViewAppearanceModal extends Modal {
	private view?: SvelteComponent;

	constructor(app: App, public translator_view: TranslatorView) {
		super(app);
		this.translator_view = translator_view;
		this.titleEl.innerText = "Alter translation view appearance";
	}

	async onOpen() {
		const state = this.translator_view.getState();
		const current_settings = get(settings);
		const modal_state: AppearanceModalState = {
			language_from: state.language_from ?? current_settings.default_source_language,
			language_to: state.language_to ?? current_settings.default_target_language,
			translation_service: state.translation_service ?? current_settings.translation_service,
			auto_translate: state.auto_translate ?? false,
			apply_glossary: state.apply_glossary ?? current_settings.apply_glossary ?? false,
			view_mode: state.view_mode ?? current_settings.layout_default,
			filter_mode: state.filter_mode ?? 0,
			show_attribution: state.show_attribution ?? current_settings.hide_attribution_default,
			top_buttons: (state.top_buttons ?? [...current_settings.quicksettings_default]).map((button) => ({
				id: button + `_${generateIdentifier()}`,
				...QUICK_SETTINGS[button as keyof typeof QUICK_SETTINGS],
			})),
			left_buttons: (state.left_buttons ?? [...current_settings.left_quickactions_default]).map((button) => ({
				id: button + `_${generateIdentifier()}`,
				...QUICK_ACTIONS[button as keyof typeof QUICK_ACTIONS],
			})),
			right_buttons: (state.right_buttons ?? [...current_settings.right_quickactions_default]).map((button) => ({
				id: button + `_${generateIdentifier()}`,
				...QUICK_ACTIONS[button as keyof typeof QUICK_ACTIONS],
			})),
		};

		this.view = new ViewAppearanceModalView({
			target: this.contentEl,
			props: modal_state,
		});
		this.view.$on("close", async (e) => {
			if (e.detail) {
				const detail = e.detail as AppearanceModalState;
				const updated_state: TranslatorViewState = {
					top_buttons: detail.top_buttons.map((button: QuickSettingButton) => button.id.split("_")[0]),
					left_buttons: detail.left_buttons.map((button: QuickActionButton) => button.id.split("_")[0]),
					right_buttons: detail.right_buttons.map((button: QuickActionButton) => button.id.split("_")[0]),
					language_from: detail.language_from,
					language_to: detail.language_to,
					translation_service: detail.translation_service,
					auto_translate: detail.auto_translate,
					apply_glossary: detail.apply_glossary,
					view_mode: detail.view_mode,
					filter_mode: detail.filter_mode,
					show_attribution: detail.show_attribution,
				};

				await this.translator_view.setState(updated_state, { history: false });
			}

			super.close();
		});
	}

	onClose() {
		this.view?.$destroy();
	}
}
