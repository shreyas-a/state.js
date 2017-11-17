const addNotifier = (_object, key) => {
  let val = _object[key];

  Object.defineProperty(_object, key, {
    get() {
      return val;
    },
    set(newVal) {
      val = newVal;
      // notify(_key);
    },
  });
};

const State = {
  create: _object => {
    const clone = { ..._object };
    Object.keys(clone).forEach(_key => {
      addNotifier(clone, _key);
    });
    return clone;
  },
};

module.exports = State;
