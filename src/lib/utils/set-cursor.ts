export const setCursorPosition = (node: HTMLElement, position: number) => {
	const sel = document.getSelection();

	if( sel.rangeCount ){
		['Start', 'End'].forEach(pos =>
			sel.getRangeAt(0)["set" + pos](node.firstChild, position)
		)
	}
}
