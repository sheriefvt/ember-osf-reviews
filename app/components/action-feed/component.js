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
    listLoading: false,

    errorMessage: t('components.action-feed.error_loading'),

    moreActions: computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),

    init() {
        this._super(...arguments);
        this.actionsList = [];
        this.loadPage();
        this.set('listLoading', true);
        this.actionsList = [];
    },

    loadPage() {
        const page = this.get('page');
        this.set('loadingPage', page);
        this.get('store').queryHasMany(this.get('user'), 'actions', { page: this.get('page') }).then(
            response => this._setPageProperties(response)
            , () => {
                // Error
                this.set('listLoading', false);
                this.get('toast').error(this.get('errorMessage'));
            },
        );
    },

    _setPageProperties(response) {
        if (this.get('loadingPage') === this.get('page')) {
            this.setProperties({
                actionsList: this.get('actionsList').concat(response.toArray()),
                totalPages: Math.ceil(response.get('links.meta.total') / response.get('links.meta.per_page')),
                listLoading: false,
            });
        }
    },

    nextPage() {
        this.incrementProperty('page');
        this.loadPage();
    },
});
