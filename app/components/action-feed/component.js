import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
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

export default Component.extend({
    store: service(),
    toast: service(),
    currentUser: service(),
    classNames: ['action-feed'],
    page: 1,
    errorMessage: t('components.action-feed.error_loading'),

    moreActions: computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),

    init() {
        this._super(...arguments);
        this.actionsList = [];
        this.loadPage();
    },

    loadPage() {
        const page = this.get('page');
        this.set('loadingPage', page);
        this.get('user').query('actions', { page: this.get('page') }).then(
            response => this._setPageProperties(response)
            , () => {
                // Error
                this.set('loadingPage', null);
                this.get('toast').error(this.get('errorMessage'));
            },
        );
    },

    _setPageProperties(response) {
        if (this.get('loadingPage') === this.get('page')) {
            this.setProperties({
                actionsList: this.get('actionsList').concat(response.toArray()),
                totalPages: response.get('meta.total'),
                loadingPage: null,
            });
        }
    },

    nextPage() {
        this.incrementProperty('page');
        this.loadPage();
    },
});
