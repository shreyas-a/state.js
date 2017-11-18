const setNotifier = (node, key) => {
  let val = node[key];

  Object.defineProperty(node, key, {
    get() {
      return val;
    },
    set(newVal) {
      console.log(`Changed ${key}: ${val} -> ${newVal}`);
      val = newVal;
      // notify(_key);
    },
  });
};

class State {
  constructor(observable) {
    this.observable = observable;
  }

  static create(node) {
    const clone = { ...node };
    Object.keys(clone).forEach(_key => {
      setNotifier(clone, _key);
    });

    return new State(clone);
  }

  getState() {
    return JSON.parse(JSON.stringify(this.observable, null));
  }

  create(locationNode, onlyNode) {
    if (typeof locationNode === 'string') {
      const attributes = locationNode.split('.');
      if (attributes.length === 1) {
        this.observable[attributes[0]] = onlyNode;
      } else if (attributes.length > 1) {
        let parent = this.observable;
        attributes.forEach((attr, index, arr) => {
          if (!parent[attr]) {
            if (index === arr.length - 1) {
              parent[attr] = onlyNode;
            } else {
              parent[attr] = {};
            }
          }
          if (index !== arr.length - 1) {
            parent = parent[attr];
          }
        });
      }
    } else if (typeof locationNode === 'object') {
      this.observable = { ...this.observable, ...locationNode };
    }
    return this.getState();
  }

  prop(locationNode, onlyNode) {
    let finalNode;
    let parent = this.observable;
    const attributes = locationNode.split('.');

    attributes.some((attr, index, arr) => {
      if (index !== arr.length - 1) {
        if (parent[attr]) {
          parent = parent[attr];
        } else {
          return true;
        }
      } else if (!onlyNode) {
        finalNode = parent[attr];
      } else {
        parent[attr] = onlyNode;
        finalNode = onlyNode;
      }

      return false;
    });

    return finalNode;
  }

  on(property, callback) {}
}

module.exports = State;
