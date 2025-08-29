export function createDialog(
    modalId,
    title = '',
    bodyElement = null,
    buttons = []
) {
    // Modal element creation
    const dialog = document.createElement('dialog');
    dialog.id = modalId;
    dialog.className = "backdrop:bg-black backdrop:opacity-50 bg-transparent border-none outline-none fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto max-w-2xl p-0 rounded-lg shadow-lg";

    // Modal content element creation
    const modalContent = document.createElement("div");
    modalContent.className = "bg-white rounded-lg max-w-[90vw] shadow-xl";

    // Header creation
    const header = document.createElement("div");
    header.className = "flex justify-between items-center p-4";

    // Title element
    const titleElement = document.createElement('h2');
    titleElement.className = "text-lg font-semibold";
    titleElement.textContent = title;

    // Close button (X)
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = "text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center";
    closeButton.onclick = () => dialog.close();

    header.appendChild(titleElement);
    header.appendChild(closeButton);

    // Body creation
    const modalBody = document.createElement("div");
    modalBody.className = "p-4";

    if (bodyElement) {
        modalBody.appendChild(bodyElement);
    }

    // Footer creation (only if there are buttons)
    let footer = null;
    if (buttons.length > 0) {
        footer = document.createElement("div");
        footer.className = "flex gap-2 justify-end p-4";

        buttons.forEach(button => {
            footer.appendChild(button);
        });
    }

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(modalBody);
    if (footer) {
        modalContent.appendChild(footer);
    }

    dialog.appendChild(modalContent);

    document.body.appendChild(dialog);

    return dialog;
}