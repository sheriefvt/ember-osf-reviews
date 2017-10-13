import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

/**
 * A feed of recent actions for all providers the user has access to
 *
 * Sample usage:
 * ```handlebars
 * {{action-feed}}
 * ```
 * @class action-feed
 */
export default Ember.Component.extend({
    store: Ember.inject.service(),
    toast: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    classNames: ['action-feed'],

    errorMessage: t('components.action-feed.error_loading'),

    page: 1,

    init() {
        this._super(...arguments);
        this.actionsList = [];
        this.loadPage();
    },

    loadPage() {
        const page = this.get('page');
        this.set('loadingPage', page);
        this.get('user').query('actions', {page: this.get('page')}).then((response) => {
            if (this.get('loadingPage') === page) {
                this.setProperties({
                    actionsList: this.get('actionsList').concat(response.toArray()),
                    totalPages: response.get('meta.total'),
                    loadingPage: null,
                });
            }
        }, () => {
            // Error
            this.set('loadingPage', null);
            this.get('toast').error(this.get('errorMessage'));
        });
    },

    nextPage() {
        this.incrementProperty('page');
        this.loadPage();
    },

    moreActions: Ember.computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),
});
