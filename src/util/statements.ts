import showdown from 'showdown';


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
    } else if (selectedText.includes(markupTag)) {

        // remove the markup tag from the selected text
        const unwrappedText = selectedText.replace(new RegExp(`\\${markupTag}`, 'g'), '');
        return text.replace(selectedText, unwrappedText);
    }

    // Surround the selected text with the specified markup tag
    const wrappedText = `${markupTag}${selectedText}${markupTag}`;


    console.log("Wrapped Text:", wrappedText);
    text = text.replace(selectedText, wrappedText);
    return text;


}

export function prependHighlighted(markupTag: string, text: string) {

    const selection = window.getSelection()?.toString();
    const selectedText = selection || "";
    console.log("Selected Text:", selectedText);

    if (selectedText.length === 0) {
        return text; // No text selected, return original text
    } else if (selectedText.startsWith(markupTag)) {
        // If the selected text already starts with the markup tag, remove it
        const unwrappedText = selectedText.replace(new RegExp(`^\\${markupTag}`), '');
        return text.replace(selectedText, unwrappedText);
    }

    // Prepend the markup tag to the selected text then add new line
    const prependedText = `${"\n"}${markupTag}${selectedText}${"\n"}`;
    console.log("Prepended Text:", prependedText);
    text = text.replace(selectedText, prependedText);
    return text;

}


// use showdown to convert markdown to html
export const convertMarkdownToHTML = (text: string) =>{
    // const showdown = require('showdown');
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    return html;


}

