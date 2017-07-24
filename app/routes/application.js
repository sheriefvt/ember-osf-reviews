import Ember from 'ember';

import OSFAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Application Route Handler
 */
export default Ember.Route.extend(OSFAgnosticAuthRouteMixin);
