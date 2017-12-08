/* eslint-env jest */
const server = require('../../server')
const request = require('supertest')


afterEach(() => {
  server.close()
})

describe('test using async/await', () => {
  it('GET /api/', async (done) => {
    const response = await request(server).get('/api/')
    console.log('status => ', response.status)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      text: 'Hello World'
    })
    done()
  })
})
