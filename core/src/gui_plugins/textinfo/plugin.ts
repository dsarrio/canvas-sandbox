import {
	BaseBladeParams,
	BladeApi,
	BladePlugin,
	ParamsParsers,
	parseParams,
} from '@tweakpane/core';

import { InfoTextController } from './controller';

export interface InfodumpBladeParams extends BaseBladeParams {
	content: string;
	view: 'infotext';
}

export const TweakpaneInfoTextPlugin: BladePlugin<InfodumpBladeParams> = {
	id: 'infotext',
	type: 'blade',

	// This plugin template injects a compiled CSS by @rollup/plugin-replace
	// See rollup.config.js for details
	css: '__css__',

	accept(params) {
		const p = ParamsParsers;
		const r = parseParams(params, {
			border: p.optional.boolean,
			content: p.required.string,
			markdown: p.optional.boolean,
			view: p.required.constant('infotext'),
		});
		return r ? {params: r} : null;
	},

	controller(args) {
		return new InfoTextController(args.document, {
			content: args.params.content,
			viewProps: args.viewProps,
		});
	},

	api(args) {
		if (!(args.controller instanceof InfoTextController)) {
			return null;
		}
		return new BladeApi(args.controller);
	},
};