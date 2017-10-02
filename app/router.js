import Ember from 'ember';
import config from './config/environment';

// Disable the reset scroll behaviour on transitions between the two given routes.
const SCROLL_RESET_DISABLED_ROUTES = ['preprints.provider.moderation', 'preprints.provider.settings'];

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL,
    metrics: Ember.inject.service(),
    transitioningFrom: '',
    transitioningTo: '',

    disableResetScroll: Ember.computed('transitioningFrom', 'transitioningTo', function() {
        return SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningFrom')) &&
            SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningTo'));
    }),

    willTransition(oldInfos, newInfos) {
        this._super(...arguments);

        this.set('transitioningFrom', Ember.Router._routePath(oldInfos));
        this.set('transitioningTo', Ember.Router._routePath(newInfos));
    },

    didTransition() {
        this._super(...arguments);

        if (!this.get('disableResetScroll')) {
            window.scrollTo(0, 0);
        }
    },

    didTransition(){
        this._super(...arguments);
        this._trackPage()
    },

    // Track page/route views
    _trackPage() {
        Ember.run.scheduleOnce('afterRender', this, () => {
            const page = document.location.pathname;
            const routeName = this.getWithDefault('currentRouteName', 'unknown');
            Ember.get(this, 'metrics').trackPage({ page, routeName });
        });
    }

});

Router.map(function() {
    this.route('page-not-found', {path: '/*bad_url'});

    this.route('preprints', function() {
        this.route('page-not-found', { path: '/' });
        this.route('provider', {path: ':provider_id'}, function() {
            this.route('setup');
            this.route('moderation', {path: '/'});
            this.route('settings');
            this.route('preprint-detail', {path:':preprint_id'});
        });
    });
    this.route('dashboard');
    this.route('page-not-found');
    this.route('not-authenticated');
    this.route('forbidden');
});

export default Router;
