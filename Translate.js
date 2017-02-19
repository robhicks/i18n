class Translate {
  constuctor(message = {}, options = {}) {
    this.options = options;
    this.message = message;
    this.splitter = options.splitter || '::';
    return this.translate;
  }

  getTranslation(key) {
    if (this.message[key]) return this.message[key];

    let components = key.split(this.splitter);
    let namespace = components[0];
    let _key = components[1];

    if (this.message[namespace] && this.message[namespace][_key]) return this.message[namespace][_key];
    return null;
  }

  getPlural(translation, count) {
    let i, _translation, upper;
    if (typeof translation === 'object') {
      let keys = Object.keys(translation);
      if (keys.length === 0) return null;
      for (i = 0; i < keys.length; i++) {
        if (keys[i].indexOf('gt' === 0)) upper = parseInt(keys[i].replace('gt', ''), 10);
      }
      if (translation[count]) _translation = translation[count];
      else if (count > upper) _translation = translation['gt' + upper];
      else if (translation.n) _translation = translation.n;
      else _translation = translation[Object.keys(translation).reverse()[0]];

      return _translation;
    }

  }

  replacePlaceholders(translation, replacements) {
    if (typeof translation === 'string') {
      return translation.replace(/\{(\w*)\}/g, ((match, key) => {
        if (!replacements.hasOwnProperty(key)) {
          console.log('Could not find replacement for ', key, 'in replacements object:', replacements);
          return '{' + key + '}';
        }
      }));
    }
    return translation;
  }

  translate(...key) {
    let replacements, count;
    if (key[1] && typeof key[1] === 'object') replacements = key[1];
    else if (key[2] && typeof key[2] === 'object') replacements = key[2];
    if (Number.isInteger(key[1])) count = key[1];
    else if(Number.isInteger(key[2])) count = key[2];

    let translation = this.getTranslation(key);

    if (count !== null) {
      replacements.n = replacements.n ? replacements.n : count;

      //get appropriate plural translation string
      translation = this.getPlural(translation, count);
    }

    //replace {placeholders}
    translation = this.replacePlaceholders(translation, replacements);

    if (translation === null) {
      console.log('Translation for "' + key + '" not found.');
    }

    return translation;
  }
}