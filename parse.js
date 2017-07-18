const identifier = re(/[A-Za-z_\-][\w\-]*/);


const declaration = decorated(use => [
      tag('▲ '),
  use(identifier),
      newline,
]);


const captures = seq(k => [
              tag('    < '),
  k('name',   identifier),
  k('value',  opt(decorated(use => [
                    tag('←'),
                use(literal),
              ]))),
              newline,
]);


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


const normalNode = seq(k => [
  k('name',     identifier),
                newline,
  k('captures', opt(captures)),
  k('exposes',  opt(exposes)),
  k('children', children),
]);


const switchNode = tag('switch');  // TODO


const children = indented(many0(decorated(use => [
        tag('↳ '),
    use(alt({
          literal,
          normalNode,
          switchNode
        })),
        opt(newline),
])));


const namedNode = seq(k => [
  k('name',     declaration),
  k('children', children),
                newline,
]);


const parse = many0(alt({
  blanks: newline,
  namedNode,
}));
