import { describe, expect, it } from 'vitest';
import faker from '../../src';
import type { Faker } from '../../src/faker';

type MethodOf<T> = string &
  {
    [P in keyof T]: T[P] extends (...args) => unknown ? P : never;
  }[keyof T];

type NoArgMethodOf<T> = string &
  MethodOf<T> &
  {
    [P in keyof T]: T[P] extends () => unknown ? P : never;
  }[keyof T];

export class TestGenerator<
  K extends string &
    Exclude<
      keyof Faker,
      Extract<
        keyof Faker,
        | 'locale'
        | 'locales'
        | 'localeFallback'
        | 'seed'
        | 'setSeed'
        | 'setLocale'
        | ''
      >
    >,
  M extends Faker[K] & Record<string, any> = Faker[K]
> {
  private readonly tested: Set<MethodOf<M>>;
  private readonly module: M;

  constructor(
    private faker: Faker,
    private readonly seed: number | number[],
    private readonly moduleName: K
  ) {
    this.module = faker[moduleName] as M;
  }

  private expectNotTested(method: MethodOf<M>): void {
    expect(
      this.tested.has(method),
      `${method} not to be tested yet`
    ).toBeFalsy();
    this.tested.add(method);
  }

  setup(): void {
    this.faker.seed(this.seed);
    this.faker.locale = 'en';
  }

  testNoArgs(method: NoArgMethodOf<M>): TestGenerator<K, M> {
    this.expectNotTested(method);
    it(method, () => {
      this.setup();
      const fn: () => unknown = this.module[method];
      fn();
    });
    return this;
  }

  testWithArgs<N extends MethodOf<M>>(
    method: N,
    factory: (tester: MethodTester<M[N]>) => void
  ): void {
    this.expectNotTested(method);
    const tester: MethodTester<M[N]> = {
      test(name: string, ...args: Parameters<M[N]>): MethodTester<M[N]> {
        it(name, () => {
          this.setup();
          const fn: M[N] = this.module[method];
          const value = fn(args);
          expect(value).toMatchSnapshot();
        });
        return tester;
      },
    };
    describe(method, () => {
      factory(tester);
    });
  }
}

interface MethodTester<T extends (...args) => unknown> {
  test(name: string, ...args: Parameters<T>): MethodTester<T>;
}

const tg = new TestGenerator(faker, 1337, 'address');
tg.testNoArgs('city');
tg.testNoArgs('zipCode');
tg.testWithArgs('zipCodeByState', (tester) => {
  tester.test('state', 'CA');
  tester.test('bla', 'WA');
});
