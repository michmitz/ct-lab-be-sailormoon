const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Sailor = require('../lib/models/sailor');

describe('Sailor Moon routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a sailor', () => {
    return request(app)
      .post('/sailors') 
      .send({
        sailorName: 'Sailor Pluto',
        realName: 'Setsuna Meiou',
        description: 'The coolest character',
        attack: 'Dead Scream',
        zodiacSign: 'Scorpio',
        imageUrl: 'https://www.pngegg.com/en/png-kuyry'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          sailorName: 'Sailor Pluto',
          realName: 'Setsuna Meiou',
          description: 'The coolest character',
          attack: 'Dead Scream',
          zodiacSign: 'Scorpio',
          imageUrl: 'https://www.pngegg.com/en/png-kuyry'
        });
      });
  });

  it('gets all sailors', async() => {
    const sailors = await Promise.all([
      {
        sailorName: 'Sailor Pluto',
        realName: 'Setsuna Meiou',
        description: 'The coolest character.',
        attack: 'Dead Scream',
        zodiacSign: 'Scorpio',
        imageUrl: 'https://www.pngegg.com/en/png-kuyry'
      },
      {
        sailorName: 'Sailor Neptune',
        realName: 'Michiru Kaiou',
        description: 'Michiru is exactly what a fairy tale princess would be like.',
        attack: 'Deep Submerge',
        zodiacSign: 'Pisces',
        imageUrl: 'https://www.pngwing.com/en/free-png-tqixj'
      },
      {
        sailorName: 'Sailor Saturn',
        realName: 'Hotaru Tomoe',
        description: 'Also known as the Guardian of Destruction.',
        attack: 'Silence Wall',
        zodiacSign: 'Capricorn',
        imageUrl: 'https://www.fanpop.com/clubs/hotaru-tomoe/images/26957407/title/sailor-saturn-manga-fanart'
      }
    ].map(sailor => Sailor.insert(sailor)));

    return request(app)
      .get('/sailors')
      .then(res => {
        sailors.forEach(sailor => {
          expect(res.body).toContainEqual(sailor);
        }); 
      });
  });

  it('gets a sailor by id', async() => {
    const sailor = await Sailor.insert({
        sailorName: 'Sailor Pluto',
        realName: 'Setsuna Meiou',
        description: 'The coolest character.',
        attack: 'Dead Scream',
        zodiacSign: 'Scorpio',
        imageUrl: 'https://www.pngegg.com/en/png-kuyry'
    });

    return request(app)
      .get(`/sailors/${sailor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          sailorName: 'Sailor Pluto',
          realName: 'Setsuna Meiou',
          description: 'The coolest character.',
          attack: 'Dead Scream',
          zodiacSign: 'Scorpio',
          imageUrl: 'https://www.pngegg.com/en/png-kuyry'
        });
      });
  });

  it('updates a sailor by id', async() => {
    const sailor = await Sailor.insert({
      sailorName: 'Sailor Pluto',
      realName: 'Setsuna Meiou',
      description: 'The coolest character.',
      attack: 'Dead Scream',
      zodiacSign: 'Scorpio',
      imageUrl: 'https://www.pngegg.com/en/png-kuyry'
    });

    return request(app)
      .put(`/sailors/${sailor.id}`)
      .send({
        sailorName: 'Sailor Pluto',
        realName: 'Setsuna Meiou',
        description: 'She possesses powers that are associated with time, space, the underworld, and darkness.',
        attack: 'Time Stop',
        zodiacSign: 'Scorpio',
        imageUrl: 'https://www.pngegg.com/en/png-kuyry'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          sailorName: 'Sailor Pluto',
          realName: 'Setsuna Meiou',
          description: 'She possesses powers that are associated with time, space, the underworld, and darkness.',
          attack: 'Time Stop',
          zodiacSign: 'Scorpio',
          imageUrl: 'https://www.pngegg.com/en/png-kuyry'
        });
      });
  });

  it('deletes a sailor by id', async() => {
    const sailor = await Sailor.insert({
      sailorName: 'Sailor Pluto',
      realName: 'Setsuna Meiou',
      description: 'The coolest character.',
      attack: 'Dead Scream',
      zodiacSign: 'Scorpio',
      imageUrl: 'https://www.pngegg.com/en/png-kuyry'
    });

    return request(app)
      .delete(`/sailors/${sailor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          sailorName: 'Sailor Pluto',
          realName: 'Setsuna Meiou',
          description: 'The coolest character.',
          attack: 'Dead Scream',
          zodiacSign: 'Scorpio',
          imageUrl: 'https://www.pngegg.com/en/png-kuyry'
        });
      }); 
  });
});


