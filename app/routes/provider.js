import Ember from 'ember';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Provider Route Handler
 */
export default Ember.Route.extend({
    theme: Ember.inject.service(),

    beforeModel(transition) {
        const {slug = ''} = transition.params.provider;
        const slugLower = slug.toLowerCase();
        const upstreamPromise = this._super();
        this.store.find('preprint-provider', slugLower).then((provider) =>{
            this.set('theme.id', provider.id);
        }).catch(() =>{
            this.replaceWith('page-not-found');
        });
        return Ember.RSVP.resolve(upstreamPromise)
            .then(function() {
                return new Ember.RSVP.Promise(function(resolve) {
                    setTimeout(function() {
                        resolve();
                    }, 500);
                });
            });
    },
});
