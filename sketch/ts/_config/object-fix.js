Object.entries = o => {
  const result = [];
  for (let i in o) {
    if (!o.hasOwnProperty(i)) {
      continue;
    }
    result.push([i, o[i]]);
  }
  return result;
};

Object.values = o => Object.entries(o).map((([,v]) => v))