

export function checkHighlighted(){
// if the user has highlighted text, return true
    if (window.getSelection()?.toString()) {
        return true;
    } else {
        return false;
    }


}


export function wrapHighlighted(markupTag: string, text: string) {

    // console.log("Markup Tag:", markupTag);

    const selection = window.getSelection()?.toString();

    

    const selectedText = selection || "";
    console.log("Selected Text:", selectedText);

    // console.log("Selection:", selection.toString());
    if (selectedText.length === 0) {
        return text; // No text selected, return original text
    }

    // Surround the selected text with the specified markup tag
    const wrappedText = `${markupTag}${selectedText}${markupTag}`;

    console.log("Wrapped Text:", wrappedText);

    return wrappedText;


}

export function prependHighlighted(markupTag: string, text: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return text; // No selection, return original text
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.length === 0) {
        return text; // No text selected, return original text
    }

    // Surround the selected text with the specified markup tag
    const wrappedText = `${markupTag}${selectedText}`;

    console.log("Wrapped Text:", wrappedText);

}