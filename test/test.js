const { expect } = require('chai');
const State = require('../dist/state');

let myState;
describe('State Library', () => {
  it('.create: has a method for creation', () => {
    expect(State).to.have.own.property('create');
  });
  it('.create: creates an instance of State', () => {
    myState = State.create({
      name: '0 to 1',
      cost: 50,
      country: {
        name: 'India',
        city: 'Bangalore',
      },
    });
    expect(myState).to.be.an.instanceOf(State);
  });

  describe('.getState', () => {
    it('returns a plain JS object', () => {
      expect(myState.getState()).to.have.property('name');
      expect(myState.getState()).to.not.have.property('observers');
    });
  });

  describe('.create', () => {
    it('creates a new node at root level', () => {
      myState.create({ author: { name: 'Peter Thiel' } });
      expect(myState.getState())
        .to.have.property('author')
        .that.have.property('name')
        .that.is.equal('Peter Thiel');
    });
    it('creates a new node inside an existing node', () => {
      myState.create('country.time', 'IST');
      expect(myState.getState())
        .to.have.property('country')
        .that.have.property('time')
        .that.is.equal('IST');
    });
  });

  describe('.prop', () => {
    it('gets the value', () => {
      expect(myState.prop('cost')).to.be.a('number');
      expect(myState.prop('cost')).to.equal(50);
    });
    it('sets the value on calling with 2nd param', () => {
      expect(myState.prop('cost')).to.be.a('number');
      expect(myState.prop('cost', 100)).to.equal(100);
    });
  });

  describe('.on', () => {
    let countryNameObserver;
    it('adds a observer to the property and calls when value is changed', () => {
      countryNameObserver = myState.on('country.city', (oldV, newV) => {
        expect(oldV).to.equal('Bangalore');
        expect(newV).to.equal('Pune');
      });

      myState.prop('country.city', 'Pune');
    });

    it('unsubscribes the observer when returning function is called', () => {
      countryNameObserver();
      expect(myState.observers).to.not.have.own.property('country.city');
    });
  });
});
