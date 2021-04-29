import {
  methodProcessor,
  urlProcessor,
  isDate,
  isJSONstr,
  dataProcessor,
} from './../src/utils';

describe('Test urlProcessor', () => {
  it('should test right with isDate', () => {
    expect(isDate(new Date())).toBeTruthy();
    expect(isDate(0)).toBeFalsy();
  });
});

describe('Test isJSONstr', () => {
  it('should test right with isJSONstr', () => {
    expect(isJSONstr('{"a":0}')).toBeTruthy();
    expect(isJSONstr(true)).toBeFalsy();
    expect(isJSONstr('{a:1}')).toBeFalsy();
  });
});

describe('Test methodProcessor', () => {
  function processUnknownMethod() {
    methodProcessor('unknownmethod' as any);
  }

  it('should return right method', () => {
    expect(methodProcessor('get')).toBe('GET');
  });
  it('should throw error with unknown method', () => {
    expect(processUnknownMethod).toThrowError(
      '微信小程序暂不支持unknownmethod方法'
    );
  });
});

describe('Test urlProcessor', () => {
  it('should take uri when uri starts with https', () => {
    expect(urlProcessor('https://www.a.com', 'https://www.b.com')).toBe(
      'https://www.b.com'
    );
  });
  it('should take uri when uri starts with https', () => {
    expect(urlProcessor(undefined, undefined)).toBe('');
  });
  it('should combine baseurl with uri', () => {
    expect(urlProcessor('https://www.a.com', '/api/uri')).toBe(
      'https://www.a.com/api/uri'
    );
  });
  it('should return right url with params', () => {
    expect(urlProcessor('https://www.a.com', '/api/uri', 'a')).toBe(
      'https://www.a.com/api/uri?a'
    );
    expect(
      urlProcessor('https://www.a.com', '/api/uri', { a: 1, b: 2, c: { d: 4 } })
    ).toBe('https://www.a.com/api/uri?a=1&b=2&c=[object+Object]');
    expect(urlProcessor('https://www.a.com', '/api/uri', { a: '' })).toBe(
      'https://www.a.com/api/uri'
    );
    expect(urlProcessor('https://www.a.com', '/api/uri', { a: [1, 2] })).toBe(
      'https://www.a.com/api/uri?a[]=1&a[]=2'
    );
    expect(
      urlProcessor('https://www.a.com', '/api/uri', {
        a: new Date('1995-12-17T03:24:00'),
      })
    ).toBe(
      `https://www.a.com/api/uri?a=${new Date(
        '1995-12-17T03:24:00'
      ).toISOString()}`
    );
    expect(urlProcessor('https://www.a.com', '/api/uri?a=1', { b: 2 })).toBe(
      'https://www.a.com/api/uri?a=1&b=2'
    );
    expect(
      urlProcessor(
        'https://www.a.com',
        '/api/uri?a=1',
        { c: 3 },
        (p) => `b=2&c=${p.c}`
      )
    ).toBe('https://www.a.com/api/uri?a=1&b=2&c=3');
  });
});

describe('Test dataProcessor', () => {
  it('should test right with dataProcessor', () => {
    expect(dataProcessor('{"a":0}')).toEqual({ a: 0 });
    expect(dataProcessor(true)).toBeTruthy();
  });
});
