const request = require('supertest');

describe('API smoke', () => {
  it('health returns ok', async () => {
    const { app, server } = startServer();
    const res = await request(app).get('/api/health');
    if (server.listening) server.close();
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

function startServer() {
  delete require.cache[require.resolve('../src/index')];
  const mod = require('../src/index');
  return mod;
}

