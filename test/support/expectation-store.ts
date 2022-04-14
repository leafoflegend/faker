import { writeFileSync } from 'fs';
import { afterAll, describe as vi_describe, expect, it as vi_it } from 'vitest';
import type { Faker } from '../../src';

class ExpectationFactory<T> {
  constructor(
    private readonly expected: T,
    private readonly actual: T,
    private readonly faker: Faker,
    private readonly seed: number | number[],
    private readonly path = '.'
  ) {}

  it<K extends string & keyof T>(
    id: K,
    source: (faker: Faker) => T[K],
    match: 'toBe' | 'toEqual' = 'toBe'
  ): ExpectationFactory<T> {
    vi_it(id, () => {
      this.faker.seed(this.seed);
      this.faker.locale = 'en';

      const actual = source(this.faker);
      this.actual[id] = actual;

      expect(actual)[match](this.expected[id]);
    });

    return this;
  }

  private expectable<K extends string & keyof T>(base: T, id: K): T[K] {
    const expected = base[id];
    if (typeof expected === 'object') {
      return expected;
    } else {
      vi_it(id, () => {
        expect(expected, `expected-data: ${this.path}/${id}`).toBeTypeOf(
          'object'
        );
      });
      return {} as T[K];
    }
  }

  describe<K extends string & keyof T>(
    id: K,
    tests: (factory: ExpectationFactory<T[K]>) => void,
    name: string = id
  ): ExpectationFactory<T> {
    const actual: T[K] = {} as T[K];
    this.actual[id] = actual;
    const expected = this.expectable(this.expected, id);

    vi_describe(name, () => {
      tests(
        new ExpectationFactory(
          expected,
          actual,
          this.faker,
          this.seed,
          `${this.path}/${id}`
        )
      );

      afterAll(() => {
        expect(
          Object.keys(actual),
          'expected to not contain obsolete keys'
        ).toEqual(Object.keys(expected));
      });
    });

    return this;
  }
}

export class ExpectationStore<T extends { seed: number | number[] }> {
  private readonly actual: T[] = [];

  constructor(
    private readonly expected: T[],
    private readonly faker: Faker,
    private readonly outputPath?: string
  ) {}

  describe(tests: (factory: ExpectationFactory<T>) => void): void {
    for (const expected of this.expected) {
      const seed = expected.seed;
      const actual: T = { seed } as T;
      this.actual.push(actual);

      vi_describe(`seed: ${seed.toString()}`, () => {
        tests(new ExpectationFactory(expected, actual, this.faker, seed));
      });

      afterAll(() => {
        expect(
          Object.keys(actual),
          'expected to not contain obsolete keys'
        ).toEqual(Object.keys(expected));
      });
    }

    afterAll(() => {
      if (this.outputPath) {
        writeFileSync(
          this.outputPath,
          JSON.stringify(this.actual, undefined, '  ')
        );
      }
    });
  }
}
