# fetch-api-tracking
Tracking fetch-api's request and response

## Installation

- **HTML**

  Insert script tag to head section

  ```html
  <html>
      <head>
          <script src="https://cdn.jsdelivr.net/gh/zingfeng/fetch-api-tracking/sun_tracking.min.js"></script>
      </head>
      <body>
          
      </body>
  </html>
  ```

- Javascript

  ```javascript
    var script = document.createElement( 'script' );
    script.setAttribute( 'src', 'https://cdn.jsdelivr.net/gh/zingfeng/fetch-api-tracking/sun_tracking.min.js' );
    document.head.appendChild( script );
  ```
  
- Puppeteer

    Download file sun_tracking.js 
    
    ```javascript
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    
    (async () => {
    
        const browser = await puppeteer.launch({
            args: ['--disable-dev-shm-usage'],
        });
        const page = await browser.newPage();
    
        // Preload Script - change './sun_tracking.js' to your path
        const preloadFile = fs.readFileSync('./sun_tracking.js', 'utf8');
        await page.evaluateOnNewDocument(preloadFile);
    
        await page.goto('https://login.newrelic.com/login');
    
        // Sleep
        await page.waitForTimeout(10000);
    
        // Get result
        var result = await page.evaluate(function () {
            return sun_tracking.getAll()
        });
        console.log(result);
    
        await browser.close();
    
    })();
    ```  


## Usage
- Init
  ```javascript
  // By default, library is initialized on loading script
  // and you no need to run this command   
  sun_tracking.init();
  ```
- Config
  ```js
  // Set config
  sun_tracking.setConfig({
      // track all fetch request ?
      track_all: true, // default = true
  
      // Specify URL if track_all = false
      tracked_url: // default = []
      [
          'url1',
          'url2',
          // ...
      ]
  })
  
  // Insert track URL (when track_all = false)
  sun_tracking.insertUrl('url3')
  sun_tracking.insertUrl(['url4','url5'])
  
  // Remove track URL (when track_all = false)
  sun_tracking.removeUrl('url3')
  sun_tracking.removeUrl(['url4','url5'])
  ```
- Result

    - Format
  ```javascript
  // result = Array [
  //    fetch1,
  //    fetch2,
  //    ...,
  //    fetchN
  // ]
    
  // fetchM = {
  //      url: url, 
  //      domain: domain, 
  //      body: 'body text from response', 
  //      time: 'timestamp get response', 
  //      arguments: arguments Object, 
  //      response: response Object, 
  // }
  ```
    - Function
  ```js
  // Get all result
  sun_tracking.getAll()
  
  // Filter by URL
  sun_tracking.getByUrl()
  
  // Filter by Domain
  sun_tracking.getByDomain()
  
  // Filter response by string
  sun_tracking.filterResponseByString('ticktack')
  
  // Filter response by regex
  sun_tracking.filterResponseByRegex('/ticktack/g')
  
  // Group result by URL
  sun_tracking.groupByUrl()
  
  // Group result by Domain
  sun_tracking.groupByDomain()
  
  // Clear all result
  sun_tracking.clear()
  ```

- Log
  
  By default, all request log but response may not be readable 
  ```js
  sun_tracking.getLog();
  ```
