class State {
  constructor(observable) {
    this.observable = observable;
    this.currentChange = '';
    this.observers = {};
  }

  _makeReactiveProperty(obj, key) {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: newValue => {
        const oldValue = value;
        value = newValue;
        if (this.currentChange && this.observers[this.currentChange]) {
          this.observers[this.currentChange].forEach(observer => {
            observer.call(this, oldValue, newValue);
          });
        }
      },
    });
  }

  _makeReactiveObject(obj) {
    Object.keys(obj).forEach(key => {
      this._makeReactiveProperty(obj, key);
      if (typeof obj[key] === 'object') {
        this._makeReactiveObject(obj[key]);
      }
    });
  }

  static create(node) {
    const clone = { ...node };
    const stateInstance = new State(clone);
    stateInstance._makeReactiveObject(clone);
    return stateInstance;
  }

  getState() {
    return JSON.parse(JSON.stringify(this.observable, null));
  }

  create(locationNode, optionalNode) {
    if (typeof locationNode === 'string') {
      const attributes = locationNode.split('.');
      if (attributes.length === 1) {
        this.observable[attributes[0]] = optionalNode;
      } else if (attributes.length > 1) {
        let parent = this.observable;
        attributes.forEach((attr, index, arr) => {
          if (!parent[attr]) {
            if (index === arr.length - 1) {
              parent[attr] = optionalNode;
              if (typeof optionalNode === 'object') {
                this._makeReactiveObject(optionalNode);
              } else {
                this._makeReactiveProperty(parent, attr);
              }
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

  prop(locationNode, optionalNode) {
    let finalNode;
    let parent = this.observable;
    const attributes = locationNode.split('.');

    attributes.some((attr, index, arr) => {
      if (index !== arr.length - 1) {
        if (parent[attr]) {
          parent = parent[attr];
        } else {
          // breaking if an attribute is not found
          return true;
        }
      } else if (!optionalNode) {
        finalNode = parent[attr];
      } else {
        this.currentChange = locationNode;
        parent[attr] = optionalNode;
        finalNode = optionalNode;
      }
      // continue the loop
      return false;
    });

    return finalNode;
  }

  on(property, callback) {
    let index;
    if (!this.observers[property]) {
      index = 0;
      this.observers[property] = [callback];
    } else {
      index = this.observers[property].length;
      this.observers[property].push(callback);
    }

    return () => {
      if (this.observers[property] && this.observers[property].length) {
        this.observers[property].splice(index, 1);
      }
    };
  }
}

module.exports = State;
