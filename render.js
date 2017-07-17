const builtins = (names => {
  const makeNode = name => () =>
    document.createElement(name);

  return names.reduce((nodes, name) => {
    nodes[name] = makeNode(name);
    return nodes;
  }, {});
})(elementNames);


function _blah(namedNodes, context, node) {
  let output = [];
  if (node.name === 'normalNode') {
    output = output.concat(_render(namedNodes, context, node.parsed));
  } else if (node.name === 'literal') {
    const value = node.parsed;
    output.push(document.createTextNode({
      string: value.parsed,
      bool: value.parsed.name,
    }[value.name]));
  } else {
    throw new Error(`not yet handled child type: "${node.name}"`);
  }
  return output;
}


function _render(namedNodes, context, node) {
  let output = [];
  if (node.name in builtins) {
    const el = document.createElement(node.name);
    node.children.forEach(child =>
      _blah(namedNodes, context, child).forEach(childEl =>
        el.appendChild(childEl)));
    output.push(el);
  } else if (node.name in namedNodes) {
    node.children.forEach(child =>
      _blah(namedNodes, context, child).forEach(el =>
        output.push(el)));
  } else {
    throw new Error(`No node named "${node.name}"`);
  }
  return output;
}


function render(ast) {
  const namedNodes = ast.parsed.reduce((nodes, subtree) => {
    if (subtree.name === 'namedNode') {
      nodes[subtree.parsed.name] = subtree.parsed;
    }
    return nodes;
  }, {});
  if (!namedNodes.App) {
    throw new Error('There must be a namedNode called "App".');
  }
  return _render(namedNodes, {}, namedNodes.App);
};
