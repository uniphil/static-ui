const identifier = re(/[A-Za-z_\-][\w\-]*/);


const declaration = decorated(use => [
      tag('▲ '),
  use(identifier),
      newline,
]);


const captures = tag('<');


const exposes = tag('>');


const bool = alt({
  true: tag('true'),
  false: tag('false'),
});

const string = decorated(use => [
      tag('"'),
  use(re(/[^"]*/)),  // TODO: handle escaped doublequotes
      tag('"'),
]);

const literal = decorated(use => [
      tag('('),
  use(alt({
            bool,
            string,
          })),
      tag(')'),
]);


function children() {
  return _children.apply(null, arguments);
}


const normalNode = seq(k => [
  k('name',     identifier),
                blanks,
  k('captures', opt(captures)),
  k('exposes',  opt(exposes)),
  k('children', children),
]);


const switchNode = tag('switch');  // TODO


const _children = many0(decorated(use => [
        tag('↳'),
        blanks,
    use(alt({
          literal,
          normalNode,
          switchNode
        })),
]));


const namedNode = seq(k => [
  k('name',     declaration),
                opt(blanks),
  k('children', children),
                newline,
]);


const parse = many0(alt({
  blanks,
  namedNode,
}));
