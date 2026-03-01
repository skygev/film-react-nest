import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('formats message in tskv format', () => {
    const formatted = logger.formatMessage('warn', 'bad request', 42);

    expect(formatted).toBe(
      'level=warn\tmessage=bad request\toptional0=42\n',
    );
  });

  it('escapes special symbols in value', () => {
    const formatted = logger.formatMessage('log', 'line1\tline2=value\\ok');

    expect(formatted).toContain('message=line1\\tline2\\=value\\\\ok');
  });

  it('sends formatted log to console.log', () => {
    logger.log('hello');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const [arg] = logSpy.mock.calls[0];
    expect(arg).toBe('level=log\tmessage=hello\n');
  });

  it('sends formatted error to console.error', () => {
    logger.error('boom');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const [arg] = errorSpy.mock.calls[0];
    expect(arg).toBe('level=error\tmessage=boom\n');
  });
});
