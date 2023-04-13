import {BladeController, createBlade, ViewProps} from '@tweakpane/core';

import { InfoTextView } from './view';

interface Config {
	content: string;
	viewProps: ViewProps;
}

export class InfoTextController extends BladeController<InfoTextView> {
	constructor(doc: Document, config: Config) {
		super({
			blade: createBlade(),
			view: new InfoTextView(doc, config),
			viewProps: config.viewProps,
		});
	}
}