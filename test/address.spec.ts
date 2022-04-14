import { resolve } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { faker } from '../src';
import { ExpectationStore } from './support/expectation-store';

const seededRuns = [
  {
    seed: 42,
    streetAddress: {
      normal: '7917 Lauryn Spur',
      full: '7917 Lauryn Spur Apt. 410',
    },
    direction: {
      normal: 'South',
      full: 'South',
      abbr: 'S',
    },
    ordinalDirection: {
      full: 'Northwest',
      abbr: 'NW',
    },
    cardinalDirection: {
      normal: 'East',
      full: 'East',
      abbr: 'E',
    },
    city: 'Port Valentine',
    cityPrefix: 'West',
    citySuffix: 'bury',
    cityName: 'Gulfport',
    streetName: 'Valentine Isle',
    streetPrefix: 'b',
    streetSuffix: 'Isle',
    secondaryAddress: 'Apt. 791',
    county: 'Berkshire',
    country: 'Haiti',
    countryCode: 'GY',
    state: 'Maine',
    stateAbbr: 'ME',
    zipCode: '79177',
    timeZone: 'Europe/Amsterdam',
    nearbyGPSCoordinate: ['-22.5828', '106.7555'],
  },
  {
    seed: 1337,
    streetAddress: {
      normal: '51225 Hammes Lodge',
      full: '51225 Hammes Lodge Apt. 552',
    },
    direction: {
      normal: 'South',
      full: 'South',
      abbr: 'S',
    },
    ordinalDirection: {
      full: 'Northwest',
      abbr: 'NW',
    },
    cardinalDirection: {
      normal: 'East',
      full: 'East',
      abbr: 'E',
    },
    city: 'New Carmelo',
    cityPrefix: 'West',
    citySuffix: 'boro',
    cityName: 'Dubuque',
    streetName: 'Carmelo Forks',
    streetPrefix: 'a',
    streetSuffix: 'Forks',
    secondaryAddress: 'Apt. 512',
    county: 'Bedfordshire',
    country: 'Equatorial Guinea',
    countryCode: 'EH',
    state: 'Indiana',
    stateAbbr: 'IN',
    zipCode: '51225',
    timeZone: 'Africa/Casablanca',
    nearbyGPSCoordinate: ['-42.8356', '21.7907'],
  },
  {
    seed: 1211,
    streetAddress: {
      normal: '487 Zieme Flat',
      full: '487 Zieme Flat Apt. 616',
    },
    direction: {
      normal: 'Southwest',
      full: 'Southwest',
      abbr: 'SW',
    },
    ordinalDirection: {
      full: 'Southwest',
      abbr: 'SW',
    },
    cardinalDirection: {
      normal: 'West',
      full: 'West',
      abbr: 'W',
    },
    city: 'La Crosse',
    cityPrefix: 'Fort',
    citySuffix: 'shire',
    cityName: 'Urbana',
    streetName: 'Trantow Via',
    streetPrefix: 'c',
    streetSuffix: 'Via',
    secondaryAddress: 'Suite 487',
    county: 'Cambridgeshire',
    country: 'Uganda',
    countryCode: 'UM',
    state: 'Washington',
    stateAbbr: 'WA',
    zipCode: '48721-9061',
    timeZone: 'Asia/Magadan',
    nearbyGPSCoordinate: ['77.1337', '-14.7545'],
  },
];

const NON_SEEDED_BASED_RUN = 5;
const expectationStore = new ExpectationStore(
  seededRuns,
  faker,
  resolve('test', 'address.actual.json')
);

describe('address', () => {
  afterEach(() => {
    faker.locale = 'en';
  });

  expectationStore.describe((f) => {
    f.it('city', (faker) => faker.address.city())
      .it('cityPrefix', (faker) => faker.address.cityPrefix())
      .it('citySuffix', (faker) => faker.address.citySuffix())
      .it('cityName', (faker) => faker.address.cityName())

      .it('streetName', (faker) => faker.address.streetName())
      .describe('streetAddress', (f) => {
        f.it('normal', (faker) => faker.address.streetAddress());
        f.it('full', (faker) => faker.address.streetAddress(true));
      })
      .it('streetPrefix', (faker) => faker.address.streetPrefix())
      .it('streetSuffix', (faker) => faker.address.streetSuffix())
      .it('secondaryAddress', (faker) => faker.address.secondaryAddress())

      .it('county', (faker) => faker.address.county())
      .it('country', (faker) => faker.address.country())
      .it('countryCode', (faker) => faker.address.countryCode())
      .it('state', (faker) => faker.address.state())
      .it('stateAbbr', (faker) => faker.address.stateAbbr())

      .it('zipCode', (faker) => faker.address.zipCode())

      .describe('direction', (f) => {
        f.it('normal', (faker) => faker.address.direction());
        f.it('full', (faker) => faker.address.direction(false));
        f.it('abbr', (faker) => faker.address.direction(true));
      })

      .describe('ordinalDirection', (f) => {
        f.it('full', (faker) => faker.address.ordinalDirection());
        f.it('full', (faker) => faker.address.ordinalDirection(false));
        f.it('abbr', (faker) => faker.address.ordinalDirection(true));
      })

      .describe('cardinalDirection', (f) => {
        f.it('normal', (faker) => faker.address.cardinalDirection());
        f.it('full', (faker) => faker.address.cardinalDirection(false));
        f.it('abbr', (faker) => faker.address.cardinalDirection(true));
      })

      .it('timeZone', (faker) => faker.address.timeZone())
      .it(
        'nearbyGPSCoordinate',
        (faker) => faker.address.nearbyGPSCoordinate(),
        'toEqual'
      );
  });

  // Create and log-back the seed for debug purposes
  faker.seed(Math.ceil(Math.random() * 1_000_000_000));

  describe(`random seeded tests for seed ${JSON.stringify(
    faker.seedValue
  )}`, () => {
    for (let i = 1; i <= NON_SEEDED_BASED_RUN; i++) {
      describe('countryCode()', () => {
        it('returns random alpha-3 countryCode', () => {
          const countryCode = faker.address.countryCode('alpha-3');

          expect(countryCode).toBeTruthy();
          expect(
            countryCode.length,
            'The countryCode should be 3 characters long'
          ).toBe(3);
        });
      });

      describe('zipCode()', () => {
        it('returns random zipCode - user specified format', () => {
          let zipCode = faker.address.zipCode('?#? #?#');

          expect(zipCode).match(/^[A-Za-z]\d[A-Za-z]\s\d[A-Za-z]\d$/);

          // try another format
          zipCode = faker.address.zipCode('###-###');

          expect(zipCode).match(/^\d{3}-\d{3}$/);
        });

        it('returns zipCode with proper locale format', () => {
          // we'll use the en_CA locale..
          faker.locale = 'en_CA';
          const zipCode = faker.address.zipCode();

          expect(zipCode).match(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/);
        });
      });

      describe('zipCodeByState()', () => {
        it('returns zipCode valid for specified State', () => {
          faker.locale = 'en_US';
          const states = ['IL', 'GA', 'WA'];

          const zipCode1 = +faker.address.zipCodeByState(states[0]);
          expect(zipCode1).greaterThanOrEqual(60001);
          expect(zipCode1).lessThanOrEqual(62999);

          const zipCode2 = +faker.address.zipCodeByState(states[1]);
          expect(zipCode2).greaterThanOrEqual(30001);
          expect(zipCode2).lessThanOrEqual(31999);

          const zipCode3 = +faker.address.zipCodeByState(states[2]);
          expect(zipCode3).greaterThanOrEqual(98001);
          expect(zipCode3).lessThanOrEqual(99403);
        });
      });

      describe('latitude()', () => {
        it('returns random latitude', () => {
          for (let i = 0; i < 100; i++) {
            const latitude = faker.address.latitude();

            expect(latitude).toBeTypeOf('string');

            const latitude_float = parseFloat(latitude);

            expect(latitude_float).greaterThanOrEqual(-90.0);
            expect(latitude_float).lessThanOrEqual(90.0);
          }
        });

        it('returns latitude with min and max and default precision', () => {
          for (let i = 0; i < 100; i++) {
            const latitude = faker.address.latitude(5, -5);

            expect(latitude).toBeTypeOf('string');
            expect(
              latitude.split('.')[1].length,
              'The precision of latitude should be 4 digits'
            ).toBe(4);

            const latitude_float = parseFloat(latitude);

            expect(latitude_float).greaterThanOrEqual(-5);
            expect(latitude_float).lessThanOrEqual(5);
          }
        });

        it('returns random latitude with custom precision', () => {
          for (let i = 0; i < 100; i++) {
            const latitude = faker.address.latitude(undefined, undefined, 7);

            expect(latitude).toBeTypeOf('string');
            expect(
              latitude.split('.')[1].length,
              'The precision of latitude should be 7 digits'
            ).toBe(7);

            const latitude_float = parseFloat(latitude);

            expect(latitude_float).greaterThanOrEqual(-180);
            expect(latitude_float).lessThanOrEqual(180);
          }
        });
      });

      describe('longitude()', () => {
        it('returns random longitude', () => {
          for (let i = 0; i < 100; i++) {
            const longitude = faker.address.longitude();

            expect(longitude).toBeTypeOf('string');

            const longitude_float = parseFloat(longitude);

            expect(longitude_float).greaterThanOrEqual(-180);
            expect(longitude_float).lessThanOrEqual(180);
          }
        });

        it('returns random longitude with min and max and default precision', () => {
          for (let i = 0; i < 100; i++) {
            const longitude = faker.address.longitude(100, -30);

            expect(longitude).toBeTypeOf('string');
            expect(
              longitude.split('.')[1].length,
              'The precision of longitude should be 4 digits'
            ).toBe(4);

            const longitude_float = parseFloat(longitude);

            expect(longitude_float).greaterThanOrEqual(-30);
            expect(longitude_float).lessThanOrEqual(100);
          }
        });

        it('returns random longitude with custom precision', () => {
          for (let i = 0; i < 100; i++) {
            const longitude = faker.address.longitude(undefined, undefined, 7);

            expect(longitude).toBeTypeOf('string');
            expect(
              longitude.split('.')[1].length,
              'The precision of longitude should be 7 digits'
            ).toBe(7);

            const longitude_float = parseFloat(longitude);

            expect(longitude_float).greaterThanOrEqual(-180);
            expect(longitude_float).lessThanOrEqual(180);
          }
        });
      });

      describe('direction()', () => {
        it('returns abbreviation when useAbbr is true', () => {
          const direction = faker.address.direction(true);
          const lengthDirection = direction.length;
          const prefixErrorMessage =
            'The abbreviation of direction when useAbbr is true should';

          expect(
            direction,
            `${prefixErrorMessage} be of type string. Current is ${typeof direction}`
          ).toBeTypeOf('string');
          expect(lengthDirection).lessThanOrEqual(2);
        });
      });

      describe('ordinalDirection()', () => {
        it('returns abbreviation when useAbbr is true', () => {
          const ordinalDirection = faker.address.ordinalDirection(true);
          const expectedType = 'string';
          const ordinalDirectionLength = ordinalDirection.length;
          const prefixErrorMessage =
            'The ordinal direction when useAbbr is true should';

          expect(
            ordinalDirection,
            `${prefixErrorMessage} be equal ${expectedType}. Current is ${typeof ordinalDirection}`
          ).toBeTypeOf(expectedType);
          expect(ordinalDirectionLength).lessThanOrEqual(2);
        });
      });

      describe('cardinalDirection()', () => {
        it('returns abbreviation when useAbbr is true', () => {
          const cardinalDirection = faker.address.cardinalDirection(true);
          const expectedType = 'string';
          const cardinalDirectionLength = cardinalDirection.length;
          const prefixErrorMessage =
            'The cardinal direction when useAbbr is true should';

          expect(
            cardinalDirection,
            `${prefixErrorMessage} be of type ${expectedType}. Current is ${typeof cardinalDirection}`
          ).toBeTypeOf(expectedType);
          expect(cardinalDirectionLength).lessThanOrEqual(2);
        });
      });

      describe('nearbyGPSCoordinate()', () => {
        it('should return random gps coordinate within a distance of another one', () => {
          function haversine(lat1, lon1, lat2, lon2, isMetric) {
            function degreesToRadians(degrees) {
              return degrees * (Math.PI / 180.0);
            }
            function kilometersToMiles(miles) {
              return miles * 0.621371;
            }
            const R = 6378.137;
            const dLat = degreesToRadians(lat2 - lat1);
            const dLon = degreesToRadians(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(lat1)) *
                Math.cos(degreesToRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return isMetric ? distance : kilometersToMiles(distance);
          }

          let latFloat1: number;
          let lonFloat1: number;
          let isMetric: boolean;

          for (let i = 0; i < 10000; i++) {
            latFloat1 = parseFloat(faker.address.latitude());
            lonFloat1 = parseFloat(faker.address.longitude());
            const radius = Math.random() * 99 + 1; // range of [1, 100)
            isMetric = Math.round(Math.random()) === 1;

            const coordinate = faker.address.nearbyGPSCoordinate(
              [latFloat1, lonFloat1],
              radius,
              isMetric
            );

            expect(coordinate.length).toBe(2);
            expect(coordinate[0]).toBeTypeOf('string');
            expect(coordinate[1]).toBeTypeOf('string');

            const latFloat2 = parseFloat(coordinate[0]);
            expect(latFloat2).greaterThanOrEqual(-90.0);
            expect(latFloat2).lessThanOrEqual(90.0);

            const lonFloat2 = parseFloat(coordinate[1]);
            expect(lonFloat2).greaterThanOrEqual(-180.0);
            expect(lonFloat2).lessThanOrEqual(180.0);

            // Due to floating point math, and constants that are not extremely precise,
            // returned points will not be strictly within the given radius of the input
            // coordinate. Using a error of 1.0 to compensate.
            const error = 1.0;
            const actualDistance = haversine(
              latFloat1,
              lonFloat1,
              latFloat2,
              lonFloat2,
              isMetric
            );
            expect(actualDistance).lessThanOrEqual(radius + error);
          }
        });

        it('should return near metric coordinates when radius is undefined', () => {
          const latitude = parseFloat(faker.address.latitude());
          const longitude = parseFloat(faker.address.longitude());
          const isMetric = true;

          const coordinate = faker.address.nearbyGPSCoordinate(
            [latitude, longitude],
            undefined,
            isMetric
          );

          expect(coordinate.length).toBe(2);
          expect(coordinate[0]).toBeTypeOf('string');
          expect(coordinate[1]).toBeTypeOf('string');

          const distanceToTarget =
            Math.pow(+coordinate[0] - latitude, 2) +
            Math.pow(+coordinate[1] - longitude, 2);

          expect(distanceToTarget).lessThanOrEqual(
            100 * 0.002 // 100 km ~= 0.9 degrees, we take 2 degrees
          );
        });

        it('should return near non metric coordinates when radius is undefined', () => {
          const latitude = parseFloat(faker.address.latitude());
          const longitude = parseFloat(faker.address.longitude());
          const isMetric = false;

          const coordinate = faker.address.nearbyGPSCoordinate(
            [latitude, longitude],
            undefined,
            isMetric
          );

          expect(coordinate.length).toBe(2);
          expect(coordinate[0]).toBeTypeOf('string');
          expect(coordinate[1]).toBeTypeOf('string');

          // const distanceToTarget =
          //   Math.pow(coordinate[0] - latitude, 2) +
          //   Math.pow(coordinate[1] - longitude, 2);

          // TODO @Shinigami92 2022-01-27: Investigate why this test sometimes fails
          // expect(distanceToTarget).lessThanOrEqual(
          //   100 * 0.002 * 1.6093444978925633 // 100 miles to km ~= 0.9 degrees, we take 2 degrees
          // );
        });
      });
    }
  });
});
