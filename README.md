dsds
====

[![Build Status](https://secure.travis-ci.org/maxkueng/dsds.png?branch=master)](http://travis-ci.org/maxkueng/dsds)

This is a __Dead Simple Data Store__ for Node.js. It's an in-memory data
store that automatically persists to file (unless you tell it not to).
dsds does not care about speed, security, ACIDity and what not. It's
meant for those experiments and quick scripts where you just want to
store some data in the easiest and quickest way possible.

It uses synchronous functions just so that you don't have to write a
callback.

## Installation

```
npm install dsds --save
```

and then

```javascript
var dsds = require('dsds');
```

## API

### `store = dsds(name [, options])`

Creates a new data store with the name `name`. If you call `dsds()` with
the same name again, you will get the cached object so you can access
the same store from different parts of your code.

Possible options:

 - `idProperty`: String. This is the name of the property where the ID
   will be stored in. Default: "id";
 - `persistence`: Boolean. Whether the data should be persisted to file.
   Default: true
 - `autoPersist`: Boolean: Whether the data should be automatically
   persisted on every write operation. Default: true. You can manually
   call `store.persist()`
 - `filePath`: String. Path to the file where the data should be
   persisted. Default: `'./' + name + '.json'`. The directories will be
   automatically created if necessary.

```javascript
var fighters = dsds('fighters', {
    filePath: './data/fighters.json'
});
```

### `store.get(id)`

Returns the object with the ID `id`.

```javascript
var ryu = store.get('ce4c05cd-00fc-410d-9f17-209b543e232f');
```

### `store.all()`

Returns an array containing all records.

```javascript
var fighters = store.all();
```

### `store.insert(data)`

Inserts `data` in to the store. And resturns the new object. A unique ID
will be added to the property defined in `options.idProperty` (default:
"id").

```javascript
var ryu = store.insert({
    name:    'Ryu',
    gender:  'male',
    country: 'Japan',
    height:  175
});

console.log(ryu.id);
```


    ce4c05cd-00fc-410d-9f17-209b543e232f

### `store.update(id, data)`

Updates a record and returns the updated record. `data` will be merged
in to the existing record and leave the other properties intact.

```javascript
var id = 'ce4c05cd-00fc-410d-9f17-209b543e232f';
var ryu = store.update(id, {
    height: 187,
    eyeColor: 'brown'
});
```

### `store.replace(id, data)`

Replaces a record and returns the new record. Leaves the ID intact.

```javascript
var id = 'ce4c05cd-00fc-410d-9f17-209b543e232f';
var evilRyu = store.update(id, {
    name:    'Evil Ryu',
    gender:  'male',
    country: 'Japan',
    height:  175,
    rival:   'Sagat'
});
```

### `store.remove(id)`

Deletes the record with ID `id`. 

```javascript
var id = 'ce4c05cd-00fc-410d-9f17-209b543e232f';
store.remove(id);
```

### `store.find(callback)`

Returns an array of all records that pass the test in `callback`. It
uses lodash's `filter` function internally.

```javascript
var females = store.find(function (fighter) {
    return fighter.gender == 'female';
});
```

### `store.findOne(callback)`

Same as `store.find` but returns only the first record. Uses lodash's
`find` function internally.

### `store.persist()`

Writes all records to disc. You don't have to call this manually unless
you have set `options.autoPersist` to `false`.

```javascript
store.persist();
```

### `store.load()`

Loads the data from `options.filePath`. You don't have to call this
manually.

```javascript
store.load();
```

## License

MIT License

Copyright (c) 2014 Max Kueng (http://maxkueng.com/)
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
