import { Chapter } from "../../interfaces/Chapter";
import { Component, h, Prop, Listen, State, Element } from "@stencil/core";

import CustomTheme from "../../decorators/CustomTheme";

import { highlightChapter } from "../../utils/highlightChapter";
import { scrollToElement, createCustomEvent } from "../../utils/utils";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-page",
	shadow: true
})
export class PskPage {
	@CustomTheme()

	@State() hasToc: boolean = false;
	@State() activeChapter: string = null;
	@State() chapters: Array<Chapter> = [];

	@TableOfContentProperty({
		description: `This property will be used as the title for the page.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string = "";

	@TableOfContentProperty({
		description: `This property is the name of the table of content.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() tocTitle: string;

	@State() componentFullyLoaded: boolean = false;

	@Element() private element: HTMLElement;

	render() {
		this.hasToc && this._sendTableOfContentChapters();

		const tableOfContentSlot = (
			<div class="toc">
				<slot name="toc" />
			</div>
		);

		return (
			<div class="main-container">
				<nav><h3>{this.title}</h3></nav>
				<div class="page-content">
					{(this.componentFullyLoaded && this.hasToc) && tableOfContentSlot}

					<div class="container">
						{this.componentFullyLoaded ?
              <div class="container-content">
                <slot />
              </div>
							: <psk-ui-loader shouldBeRendered={true} />}
					</div>
				</div>
			</div>
		)
	}

	@Listen("psk-send-chapter")
	receiveChapters(evt: CustomEvent): void {
		evt.stopImmediatePropagation();
		if (!evt.detail) {
			return;
		}
		const newChapter: Chapter = { ...evt.detail };
		const findChapterRule = ((elm: Chapter) => {
			return newChapter.guid === elm.guid;
		});

		const chapterIndex: number = this.chapters.findIndex(findChapterRule);

		const tempChapter: Array<Chapter> = [...this.chapters];
		if (chapterIndex === -1) {
			tempChapter.push({
				...newChapter,
			});
			this.chapters = JSON.parse(JSON.stringify(tempChapter));
			return;
		}

		tempChapter[chapterIndex] = {
			...newChapter,
		};
		this.chapters = JSON.parse(JSON.stringify(tempChapter));
	}

	_checkForChapterScrolling(): void {
		if (window.location.href.indexOf("chapter=") === -1) {
			return;
		}

		const chapterName = window.location.href.split("chapter=")[1];

		setTimeout(() => {
			scrollToElement(chapterName, this.element);
		}, 50);
	}

	_sendTableOfContentChapters(): void {
		createCustomEvent('psk-send-toc', {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: {
				chapters: this.chapters,
				active: this.activeChapter
			}
		}, true);
	}

	private __isScrolling: number;

	private __handleScrollEvent = (evt: MouseEvent) => {
		let self = this;
		evt.preventDefault();
		evt.stopImmediatePropagation();

		clearTimeout(this.__isScrolling);

		this.__isScrolling = setTimeout(function () {
			highlightChapter.call(self);
		}, 100);
	}

	connectedCallback() {
		if (this.element.querySelector('psk-toc') !== null) {
			const toc: HTMLElement = this.element.querySelector('psk-toc');
			toc.setAttribute('slot', 'toc');
			this.hasToc = true;
		}
	}

	componentDidLoad() {
		this.componentFullyLoaded = true;
		this._checkForChapterScrolling();

		this.element.addEventListener('scroll', this.__handleScrollEvent, true);
	}

	disconnectedCallback() {
		this.element.removeEventListener('scroll', this.__handleScrollEvent, true);
	}
}
