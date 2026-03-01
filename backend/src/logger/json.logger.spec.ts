import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('formats log message to JSON', () => {
    const formatted = logger.formatMessage('log', 'hello', { requestId: '1' });
    const parsed = JSON.parse(formatted);

    expect(parsed).toEqual({
      level: 'log',
      message: 'hello',
      optionalParams: [{ requestId: '1' }],
    });
  });

  it('serializes Error as object', () => {
    const err = new Error('boom');
    const formatted = logger.formatMessage('error', err);
    const parsed = JSON.parse(formatted);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toMatchObject({
      name: 'Error',
      message: 'boom',
    });
    expect(parsed.optionalParams).toEqual([]);
  });

  it('sends formatted log to console.log', () => {
    logger.log('started', { pid: 1 });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const [arg] = logSpy.mock.calls[0];
    const parsed = JSON.parse(arg);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('started');
    expect(parsed.optionalParams).toEqual([{ pid: 1 }]);
  });

  it('sends formatted error to console.error', () => {
    logger.error('failed');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const [arg] = errorSpy.mock.calls[0];
    const parsed = JSON.parse(arg);
    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('failed');
  });
});
