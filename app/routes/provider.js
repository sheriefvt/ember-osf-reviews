import Ember from 'ember';
import config from 'ember-get-config';

const providers = config.Reviews.providers.slice(1);
const providerIds = providers.map(p => p.id);

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

        if (providerIds.includes(slugLower)) {
            if (slugLower !== slug) {
                const {pathname} = window.location;
                const pathRegex = new RegExp(`^/preprints/${slug}`);

                window.location.pathname = pathname.replace(
                    pathRegex,
                    `/preprints/${slugLower}`
                );
            }

            this.set('theme.id', slug);
        } else {
            this.set('theme.id', config.Reviews.defaultProvider);

            if (slug.length === 5) {
                this.transitionTo('content', slug);
            } else {
                this.replaceWith('page-not-found');
            }
        }
    },
});
