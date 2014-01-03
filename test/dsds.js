var expect = require('chai').expect,
	dsds = require('../index');

var fighters = dsds('fighters', {
	filePath: './data/fighters.json'
});

var sampleIDs = [];

var sampleData = [
	{
		name: 'Ryu',
		gender: 'male',
		country: 'Japan',
		height: 175
	},
	{
		name: 'Akuma',
		gender: 'male',
		country: 'Japan',
		height: 178
	},
	{
		name: 'Poison',
		gender: 'female',
		country: 'USA',
		height: 175
	},
	{
		name: 'Chun-Li',
		gender: 'female',
		country: 'China',
		height: 169
	}
];

describe('dsds', function () {

	describe('#clear', function () {

		it('should clear the datastore', function () {
			fighters.clear();

			expect(fighters.records).to.be.empty;
		});

	});

	describe('#insert', function () {

		it('should insert some records', function () {
			sampleData.forEach(function (sample, index) {
				var fighter = fighters.insert(sample);
				expect(fighter).to.have.property('id');
				expect(fighter).to.have.property('name', sample.name);
				expect(fighter).to.have.property('gender', sample.gender);
				expect(fighter).to.have.property('country', sample.country);
				expect(fighter).to.have.property('height', sample.height);

				sampleIDs[index] = fighter.id;
			});

			expect(fighters.all()).to.have.length(sampleData.length);
		});

	});

	describe('#update', function () {
	
		it('should update a record', function () {
			var fighter = fighters.update(sampleIDs[1], {
				height: 200,
				eyeColor: 'red'
			});

			expect(fighter).to.have.property('id', sampleIDs[1]);
			expect(fighter).to.have.property('name', sampleData[1].name);
			expect(fighter).to.have.property('gender', sampleData[1].gender);
			expect(fighter).to.have.property('country', sampleData[1].country);
			expect(fighter).to.have.property('height', 200);
			expect(fighter).to.have.property('eyeColor', 'red');
		});
	
	});

	describe('#replace', function () {
	
		it('should replace a record', function () {
			var fighter = fighters.replace(sampleIDs[1], {
				id: 'Bla',
				name: 'Sagat',
				gender: 'male',
				country: 'Thailand',
				height: 226
			});

			expect(fighter).to.have.property('id', sampleIDs[1]);
			expect(fighter).to.have.property('name', 'Sagat');
			expect(fighter).to.have.property('gender', 'male');
			expect(fighter).to.have.property('country', 'Thailand');
			expect(fighter).to.have.property('height', 226);
			expect(fighter.eyeColor).to.not.exist;
		});
	
	});

	describe('#find', function () {

		it('should find female fighters', function () {
			var females = fighters.find(function (fighter) {
				return fighter.gender === 'female';
			});

			expect(females).to.have.length(2);
		});

	});

	describe('#findOne', function () {

		it('should find one female fighter', function () {
			var female = fighters.findOne(function (fighter) {
				return fighter.gender === 'female';
			});

			expect(female).to.have.property('gender', 'female');
		});

	});

	describe('#remove', function () {
	
		it('should remove a record', function () {
			fighters.remove(sampleIDs[2]);

			expect(fighters.get(sampleIDs[2])).to.not.be.ok;
		});
	
	});

});
