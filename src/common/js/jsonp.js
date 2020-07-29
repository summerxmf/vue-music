import originJSONP from 'jsonp'

const parseParam = param => {
	let params = []
	for (const k in param) {
    let value = param[k] !== undefined ? param[k] : ''
    value = encodeURIComponent(value)
		params.push([k, value])
	}
	return params.map(value => value.join('=')).join('&')
}

export default (url, data, options) => {
  url += (url.indexOf('?') < 0 ? '?' : '&') + parseParam(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}