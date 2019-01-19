
function findKey<T, K extends keyof T>(object: T, predicate: () => {}): T {
  let result = {} as T
  if (object == null) {
    return result
  }
  Object.keys(object).some((key) => {
    const value = object[key]
    if (predicate(value, key, object)) {
      result = key
      return true
    }
  })
  return result
}

const users = {
  'barney':  { 'age': 36, 'active': true },
  'fred':    { 'age': 40, 'active': false },
  'pebbles': { 'age': 1,  'active': true }
}


findKey(users, ({ age }) => age < 40)
// => 'barney' (iteration order is not guaranteed)