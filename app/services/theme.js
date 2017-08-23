import Ember from 'ember';
import config from 'ember-get-config';

/**
 * @module ember-osf-reviews
 * @submodule services
 */

/**
 * Allows you to inject that provider's theme into parts of your application
 *
 * @class theme
 * @extends Ember.Service
 */
export default Ember.Service.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),

    // If we're using a provider domain
    isDomain: window.isProviderDomain,

    // The id of the current provider
    id: config.Reviews.defaultProvider,

    provider: Ember.computed('id', function() {
        return this.get('store').findRecord('preprint-provider', this.get('id'));
    }),

    isProvider: Ember.computed('id', function() {
        return this.get('id') !== 'osf';
    }),

    // The url to redirect users to sign up to
    signupUrl: Ember.computed('id', function() {
        const query = Ember.$.param({
            campaign: `${this.get('id')}-reviews`,
            next: window.location.href
        });

        return `${config.OSF.url}register?${query}`;
    }),

});
