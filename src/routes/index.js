'use strict';
/*
 *  Router: loads all api routes
 */
import express        from 'express';
import referralInstaller from './referralInstaller'
/*
  TODO: Import all your route installers here
  ```
    import sampleInstaller from './sampleInstaller'
  ```
*/

export default () => {
  let routes = express.Router();

  routes.use('/referral', referralInstaller());
  /*
    TODO: Mount all your rote installers here
    ```
      routes.use('/sample', sampleInstaller());
    ```
  */

  return routes;
}
