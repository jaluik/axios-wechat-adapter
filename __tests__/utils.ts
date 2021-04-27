import { methodProcessor } from './../src/utils';

describe('Test methodProcessor', () => {
  function processUnknownMethod() {
    methodProcessor('unknownmethod' as any);
  }

  test('it should return right method', () => {
    expect(methodProcessor('get')).toBe('GET');
  });
  test('it should throw error with unknown method', () => {
    expect(processUnknownMethod).toThrowError(
      '微信小程序暂不支持unknownmethod方法'
    );
  });
});
