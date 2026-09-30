const SECTION_LABELS = /^(sources|references|footnotes)$/i;

const SOURCE_CLASS = 'post-sources';

function textContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(textContent).join('');
  return '';
}

function addClass(node, className) {
  node.properties = node.properties || {};
  const existing = node.properties.className;
  const classes = Array.isArray(existing)
    ? existing
    : existing
      ? [existing]
      : [];
  if (!classes.includes(className)) classes.push(className);
  node.properties.className = classes;
}

/**
 * Tags the trailing "Sources" / "References" / "Footnotes" section (its
 * heading and every following sibling up to the next h2) with a class so it
 * can be styled as smaller footnote text.
 */
export function rehypePostSources() {
  return (tree) => {
    const children = tree.children || [];

    let start = -1;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== 'element' || node.tagName !== 'h2') continue;
      const label = textContent(node).trim().replace(/\s+/g, ' ');
      if (SECTION_LABELS.test(label)) {
        start = i;
        break;
      }
    }
    if (start === -1) return;

    addClass(children[start], SOURCE_CLASS);
    for (let i = start + 1; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'element' && node.tagName === 'h2') break;
      if (node.type === 'element') addClass(node, SOURCE_CLASS);
    }
  };
}
