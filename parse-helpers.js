const re = exp => t => {
  const match = t.match(new RegExp(`^${exp.source}`));
  if (!match) return { error: `no match for /${exp}/: ${t}` };
  return { parsed: match[0], remaining: t.slice(match[0].length) };
};


const newline = re(/\n/);
const blanks = re(/\s+/);


const alt = parsers => t => {
  const errors = [];
  for (let name in parsers) {
    const { error, parsed, remaining } = parsers[name](t);
    if (!error) {
      return { parsed: { name, parsed }, remaining };
    }
    errors.push(error);
  }
  return { error: `no alternatives matched: ${errors.join('\n')}` };
};


const _many = one => parser => t => {
  let left = t;
  const output = [];
  while (true) {
    const { error, parsed, remaining } = parser(left);
    if (error) {
      if (one && !output.length) return { error };
      return { parsed: output, remaining: left };
    }
    output.push(parsed);
    if (!remaining) return { parsed: output, remaining };
    left = remaining;
  }
};

const many0 = _many(false);
const many1 = _many(true)


const __SAVE = Symbol('parser save key');
const _mark = (k, parser) => t => {
  const result = parser(t);
  result[__SAVE] = k;
  return result;
};
const _use = parser =>
  _mark('value', parser);

const seq = getParsers => t => {
  let left = t;
  const output = {};
  for (let parser of getParsers(_mark)) {
    const { error, parsed, remaining, [__SAVE]: k } = parser(left);
    if (error) return { error: `failed to parse sequence: ${error}` };
    if (k) output[k] = parsed;
    left = remaining;
  }
  return { parsed: output, remaining: left };
};

const decorated = getParsers => t => {
  const { error, parsed, remaining } = seq(() => getParsers(_use))(t);
  if (error) return { error };
  return { parsed: parsed.value, remaining };
};


const opt = parser => t => {
  const { error, parsed, remaining } = parser(t);
  return error
    ? { parsed: { empty: true }, remaining: t }
    : { parsed: { empty: false, parsed}, remaining };
};


const tag = s => t =>
  t.startsWith(s)
    ? { parsed: s, remaining: t.slice(s.length) }
    : { error: `tag "${s}" didn't match: "${t}"` };
