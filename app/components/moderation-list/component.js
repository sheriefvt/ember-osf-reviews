import Ember from 'ember';
import queryParamsMixin from '../../mixins/query-params-mixin';
import DS from 'ember-data';
/**
 * Provides a list of pending, accepted, and rejected preprints. Provides filtering by preprint state and sorting based
 * on the preprint creation date. If number of records in each type exceeds 10, pagination is enabled. Current page for
 * each state is tracked and used by the paginator. Pagination is using the pagination-pager addon
 * (source: https://github.com/knownasilya/pagination-pager).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-list}}
 * ```
 * @class moderation-list
 **/
export default Ember.Component.extend(queryParamsMixin, {
    store: Ember.inject.service(),
    theme: Ember.inject.service(),
    i18n: Ember.inject.service(),

    loading: false,
    screenWidth: 0,
    sortType: 'date_created',
    activeButton: 'pending',

    preprintRecords: Ember.computed('theme.provider', 'params', 'buttonType', function () {
        const type = this.get('buttonType');
        return DS.PromiseObject.create({
            promise: this.get('store').query('preprint',
                Object.assign({
                    'filter[reviews_state]': type,
                    'filter[provider]': this.get('theme.provider.id')
                }, this.get('params'))).then((results) => {
                this.set('loading', false);
                return {
                    records: results,
                    meta: results.get('meta')
                };
            })
        })
    }),
    sortOptions: Ember.computed('i18n.local', function() { // Sort options for moderation list
        const i18n = this.get('i18n');
        return [i18n.t('moderation_list.oldest'), i18n.t('moderation_list.newest')];
    }),
    currentPage: Ember.computed('buttonType', 'pendingpage', 'acceptedpage', 'rejectedpage', function () {
        const type = this.get('buttonType');
        return this.get(type + 'page');
    }),

    didInsertElement: function() {
        this._super(...arguments);
        this.set('screenWidth', Math.round(Ember.$('.btn-toolbar').width() / 12));
        Ember.$('.table tr').css('display', 'none');
        const type = this.get('buttonType');
        Ember.$('.btn-toolbar button[data-target="' + type + '"]').addClass('activated');
        Ember.$('.table tr[data-status="' + type + '"]').fadeIn('fast');
    },

    actions: {
        buttonPressed: function(target){
            Ember.$('.btn-toolbar button[data-target="' +  this.get('activeButton') + '"]').removeClass('activated');
            this.set('buttonType', target);
            this.set('activeButton', target);
            Ember.$('.table tr').css('display', 'none');
            Ember.$('.table tr[data-status="' + target + '"]').fadeIn('fast');
        },
        sortSelected: function (type) {
            this.set('sort', type);
            this.set('sortType', type);
            this.send('pageChanged', 1);
        },
        pageChanged: function (current) {
            this.set('loading', true);
            const state = this.get('buttonType');
            this.set('page', current);
            this.set(state +'page', current);
            this.set('loading', false);
        }
    }
});
