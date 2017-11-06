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

    errorMessage: t('components.actionFeed.errorLoading'),

    moreActions: computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),

    init() {
        this._super(...arguments);
        this.set('listLoading', true);
        this.set('actionsList', []);
        this.loadPage();
    },

    loadPage() {
        const page = this.get('page');
        this.get('currentUser.user')
            .then(user => this.get('store').queryHasMany(user, 'actions', { page }))
            .then(this._setPageProperties.bind(this))
            .catch(this._handleLoadError.bind(this));
    },

    _handleLoadError() {
        this.set('listLoading', false);
        this.set('loadingMore', false);
        this.get('toast').error(this.get('errorMessage'));
    },

    _setPageProperties(response) {
        this.get('actionsList').pushObjects(response.toArray());
        this.setProperties({
            totalPages: Math.ceil(response.get('links.meta.total') / response.get('links.meta.per_page')),
            listLoading: false,
            loadingMore: false,
        });
    },

    nextPage() {
        this.incrementProperty('page');
        this.set('loadingMore', true);
        this.loadPage();
    },
});
