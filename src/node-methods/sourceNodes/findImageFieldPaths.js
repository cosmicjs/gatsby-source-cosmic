const findImageFieldPaths = (object, path = null) => {
  let imageFields = [];

  if (Object.keys(object).length === 2 && object.url && object.imgix_url) {
    imageFields.push(path);
    return imageFields;
  }

  Object.keys(object).forEach((key) => {
    const newPath = path ? `${path}.${key}` : key;
    if (Array.isArray(object[key])) {
      for (let i = 0; i < object[key].length; i += 1) {
        imageFields = imageFields.concat(findImageFieldPaths(object[key][i], `${newPath}[${i}]`));
      }
    } else if (object[key] && typeof object[key] === 'object') {
      imageFields = imageFields.concat(findImageFieldPaths(object[key], newPath));
    }
  });

  return imageFields;
};

export default findImageFieldPaths;
