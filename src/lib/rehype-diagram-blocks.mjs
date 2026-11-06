/**
 * rehype-diagram-blocks.mjs
 *
 * Marks fenced code blocks that contain diagram definitions so the client-side
 * Mermaid renderer can find them without ambiguity.
 *
 * Rules:
 *  - Language "mermaid" → data-diagram="mermaid"
 *  - Language "text" / "txt" / "" (plain) whose first non-empty line starts
 *    with a C4 keyword → data-diagram="c4"
 *
 * Both variants also get data-diagram-code="<raw source>" so the toggle button
 * can restore the original text without touching the DOM.
 */

const C4_KEYWORDS = /^C4(Context|Container|Component|Dynamic|Deployment)\b/m;
const MERMAID_KEYWORDS = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|sankey-beta|xychart-beta|packet-beta|kanban|architecture-beta)\b/m;

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(textOf).join('');
  return '';
}

export function rehypeDiagramBlocks() {
  return (tree) => {
    walkTree(tree);
  };
}

function walkTree(node) {
  if (node.type === 'element' && node.tagName === 'pre') {
    const codeEl = (node.children || []).find(
      (c) => c.type === 'element' && c.tagName === 'code',
    );
    const contentNode = codeEl || node;
    const rawCode = textOf(contentNode).trim();

    // Check language from both <pre data-language="..."> (Shiki output)
    // and <code class="language-..."> (standard markdown AST)
    const preLang = (
      node.properties?.['data-language'] ||
      node.properties?.dataLanguage ||
      ''
    ).toString().toLowerCase();

    const classLang = (
      (codeEl?.properties?.className || node.properties?.className || [])
        .find((c) => typeof c === 'string' && c.startsWith('language-')) ?? ''
    )
      .replace('language-', '')
      .toLowerCase();

    const lang = preLang || classLang;

    if (lang === 'mermaid' || MERMAID_KEYWORDS.test(rawCode)) {
      node.properties = node.properties || {};
      node.properties['data-diagram'] = 'mermaid';
      node.properties['data-diagram-code'] = rawCode;
      node.properties['data-language'] = 'mermaid';
    } else if (
      lang === 'c4' ||
      C4_KEYWORDS.test(rawCode)
    ) {
      node.properties = node.properties || {};
      node.properties['data-diagram'] = 'c4';
      node.properties['data-diagram-code'] = rawCode;
      node.properties['data-language'] = 'c4';
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) walkTree(child);
  }
}
