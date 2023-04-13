import { ClassName, View, ViewProps } from '@tweakpane/core';

interface Config {
	content: string;
	viewProps: ViewProps;
}

const className = ClassName('nfot');

export class InfoTextView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const contentElem = doc.createElement('div');
		contentElem.classList.add(className('t'));
		contentElem.innerHTML = config.content;
		this.element.appendChild(contentElem);
	}
}