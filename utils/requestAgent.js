

module.exports.detectClient =  function detectClient(req) {
    const userAgent = req.headers['user-agent'];
    const secFetchSite = req.headers['sec-fetch-site'];
    const secFetchMode = req.headers['sec-fetch-mode'];
    const secFetchUser = req.headers['sec-fetch-user'];
    const secFetchDest = req.headers['sec-fetch-dest'];
    const acceptLanguage = req.headers['accept-language'];
    const referer = req.headers['referer'];
    const cookie = req.headers['cookie'];
  
    let isBrowser = false;
    let isFetch = false;
  
    // Basic User-Agent analysis
    if (userAgent && /Mozilla|Chrome|Safari|Firefox|Edge/.test(userAgent)) {
      isBrowser = true;
    }
  
    // Check for typical browser headers
    if (acceptLanguage || referer || cookie) {
      isBrowser = true;
    }
  
    // Check for Sec-Fetch-* headers
    if (secFetchSite || secFetchMode || secFetchUser || secFetchDest) {
      isBrowser = true;
    }
  
    // Heuristic for fetch requests
    if (userAgent && /node-fetch|axios|PostmanRuntime/.test(userAgent)) {
      isFetch = true;
    }
  
    if((isBrowser && isFetch) || (!isBrowser && !isFetch)) {
        return null;
    }
  
    return isBrowser? 'Browser' : 'Fetch API';
  }