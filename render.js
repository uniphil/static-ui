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
    output = output.concat(_render(namedNodes, context, node.parsed.name, node.parsed.children));
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


function renderNamed(namedNodes, context, name) {
  let output = [];  
  namedNodes[name].children.forEach(child =>
    _blah(namedNodes, context, child).forEach(childEl =>
      output.push(childEl)));
  return output;
}


function _render(namedNodes, context, name, children) {
  let output = [];
  if (name in builtins) {
    const el = builtins[name]();
    children.forEach(child =>
      _blah(namedNodes, context, child).forEach(childEl =>
        el.appendChild(childEl)));
    output.push(el);
  } else if (name in namedNodes) {
    output = output.concat(renderNamed(namedNodes, context, name));
  } else {
    throw new Error(`No node named "${name}"`);
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
  return _render(namedNodes, {}, 'App', []);
};
