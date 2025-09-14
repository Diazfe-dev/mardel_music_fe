import { twMerge } from 'tailwind-merge'

export function createDialog({
    modalId,
    title,
    bodyElement,
    buttons = [],
    containerStyle = null,
    contentStyle = null
} = {}) {
    // Modal element creation
    const dialog = document.createElement('dialog');
    dialog.id = modalId;
    
    // Clases por defecto para el dialog
    const defaultDialogClasses = "backdrop:bg-black backdrop:opacity-50 bg-transparent border-none outline-none fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto max-w-2xl p-0 rounded-lg shadow-lg";
    
    // Usar twMerge correctamente
    dialog.className = containerStyle 
        ? twMerge(defaultDialogClasses, containerStyle) 
        : defaultDialogClasses;

    // Modal content element creation
    const modalContent = document.createElement("div");
    const defaultContentClasses = "bg-white rounded-lg max-w-[90vw] shadow-xl";
    
    // Aplicar estilos al contenido del modal
    modalContent.className = contentStyle 
        ? twMerge(defaultContentClasses, contentStyle) 
        : defaultContentClasses;

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
        // Verificar si bodyElement es un string HTML o un elemento DOM
        if (typeof bodyElement === 'string') {
            modalBody.innerHTML = bodyElement;
        } else if (bodyElement instanceof Node) {
            modalBody.appendChild(bodyElement);
        } else {
            console.warn('bodyElement debe ser un string HTML o un Node DOM');
        }
    }

    let footer = null;
    if (buttons && buttons.length > 0) {
        footer = document.createElement("div");
        footer.className = "flex gap-2 justify-end p-4";

        buttons.forEach(button => {
            if (button instanceof Node) {
                footer.appendChild(button);
            } else {
                console.warn('Los botones deben ser elementos DOM (Node)');
            }
        });
    }
    modalContent.appendChild(header);
    modalContent.appendChild(modalBody);
    if (footer) {
        modalContent.appendChild(footer);
    }

    dialog.appendChild(modalContent);
    document.body.appendChild(dialog);

    return dialog;
}