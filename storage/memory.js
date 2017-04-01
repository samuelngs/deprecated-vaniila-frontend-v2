
export default class MemoryStorage {

  constructor ({ initialState = {} } = {}) {
    this.storage = { ...initialState };
  }

  setItem (key, value, callback) {
    return new Promise((resolve, reject) => {
      this.storage[key] = value;
      if (typeof callback === 'function') callback(null, value);
      resolve(value);
    });
  }

  getItem (key, callback) {
    return new Promise((resolve, reject) => {
      const value = this.storage[key];
      if (typeof callback === 'function') callback(null, value);
      resolve(value);
    });
  }

  removeItem (key, callback) {
    return new Promise((resolve, reject) => {
      const value = this.storage[key];
      delete this.storage[key];
      if (typeof callback === 'function') callback(null, value);
      resolve(value);
    });
  }

  getAllKeys (callback) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(this.storage);
      if (typeof callback === 'function') callback(null, keys);
      resolve(keys);
    });
  }

}
