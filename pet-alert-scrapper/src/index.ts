import { addQueryToUrl } from '@utils/index'

console.log(
  'Hello World!',
  addQueryToUrl(new URL('http://localhost:3000'), { a: 'b' }),
)
