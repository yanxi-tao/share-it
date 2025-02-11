export default function validUrl(search: string): string | Error {
  try {
    console.log('url check')
    let link = search.trim()
    console.log('Link:', link)

    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = `https://${link}`
    }
    if (!link.match(/\.[a-zA-Z]+$/)) {
      throw new Error('URL does not end with .com, .org, .net, etc.')
    }
    const url = new URL(link)

    const isValidUrl = (urlString: string): boolean => {
      var urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ) // fragment locator
      return !!urlPattern.test(urlString)
    }
    if (isValidUrl(link) === false) {
      throw new Error('Invalid URL')
    }

    // Optional: Actually check if the URL is accessible
    fetch(link, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        console.log('URL is accessible')
      })
      .catch(() => {
        throw new Error('URL is not accessible')
      })
    return link
  } catch (error) {
    return error
  }
}
