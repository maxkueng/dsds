var _ = require('lodash'),
	uuid = require('uuid'),
	fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	
	dataStores = {};

exports = module.exports = createDSDS;

function createDSDS (name, options) {

	options = options || {};
	if (typeof options.idProperty === 'undefined') { options.idProperty = 'id'; }
	if (typeof options.persistence === 'undefined') { options.persistence = true; }
	if (typeof options.autoPersist === 'undefined') { options.autoPersist = true; }
	if (typeof options.filePath === 'undefined') { options.filePath = './' + name + '.json'; }

	if (dataStores[name]) {
		return dataStores[name];
	}

	var dsds = {

		idProperty: options.idProperty,
		persistence: options.persistence,
		autoPersist: options.autoPersist,
		filePath: path.resolve(process.cwd(), options.filePath),
		records: {},

		get: function (id, property) {
			var rec = dsds.records[id] || null;

			if (property && rec) {
				return rec[property] || null;
			}

			return rec;
		},

		set: function (id, property, value) {
			if (!dsds.records[id]) { return false; }
			
			if (typeof value === 'undefined') {
				value = property;
				property = null;
			}

			if (property) {
				dsds.records[id][property] = value;

				if (dsds.persistence && dsds.autoPersist) {
					dsds.persist();

				}
				return dsds.records[id][property];
			}

			return dsds.replace(id, value);

		},

		all: function () {
			return _.values(dsds.records);
		},
	
		insert: function (data) {
			if (!data) { data = {}; }
			if (!data[dsds.idProperty]) { data[dsds.idProperty] = uuid.v4(); }

			dsds.records[data[dsds.idProperty]] = data;

			if (dsds.persistence && dsds.autoPersist) {
				dsds.persist();
			}

			return data;
		},

		update: function (id, data) {
			if (!dsds.records[id]) { return false; }

			dsds.records[id] = _.merge(dsds.records[id], data);

			if (dsds.persistence && dsds.autoPersist) {
				dsds.persist();
			}

			return dsds.records[id];
		},

		replace: function (id, data) {
			if (!dsds.records[id]) { return false; }

			dsds.records[id] = data;
			dsds.records[id][dsds.idProperty] = id;

			if (dsds.persistence && dsds.autoPersist) {
				dsds.persist();
			}

			return dsds.records[id];
		},

		find: function (callback) {
			return _.filter(dsds.records, callback);
		},

		findOne: function (callback) {
			return _.find(dsds.records, callback);
		},

		remove: function (id) {
			delete dsds.records[id];

			if (dsds.persistence && dsds.autoPersist) {
				dsds.persist();
			}
		},

		clear: function () {
			dsds.records = {};

			if (dsds.persistence && dsds.autoPersist) {
				dsds.persist();
			}
		},

		load: function () {
			if (!fs.existsSync(dsds.filePath)) { return; }
			var json = fs.readFileSync(dsds.filePath, { encoding: 'utf8' });
			try {
				dsds.records = JSON.parse(json);
			} catch (e) { }
		},

		persist: function () {
			mkdirp.sync(path.dirname(dsds.filePath));

			var json = JSON.stringify(dsds.records, null, '  ');
			fs.writeFileSync(dsds.filePath, json, { encoding: 'utf8' });
		}
	
	};

	if (dsds.persistence) {
		dsds.load();
	}

	dataStores[name] = dsds;

	return dsds;

}
