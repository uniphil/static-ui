export default function e(name: string, classes: Array<string>,
    ...children: Array<HTMLElement | string>) {

    const el = document.createElement(name);
    el.classList.add(...classes);

    children.forEach((child: HTMLElement | string) =>
        typeof child === 'string'
            ? el.appendChild(document.createTextNode(child))
            : el.appendChild(child));

    return el;
}