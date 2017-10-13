import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const ACTION_LABELS = Object.freeze({
    [PENDING]: {
        gtDay: 'components.moderation-list-row.submission.submitted_on',
        ltDay: 'components.moderation-list-row.submission.submitted',
    },
    [ACCEPTED]: {
        gtDay: 'components.moderation-list-row.submission.accepted_on',
        ltDay: 'components.moderation-list-row.submission.accepted',
        gtDay_automatic: 'components.moderation-list-row.submission.accepted_automatically_on',
        ltDay_automatic: 'components.moderation-list-row.submission.accepted_automatically',
    },
    [REJECTED]: {
        gtDay: 'components.moderation-list-row.submission.rejected_on',
        ltDay: 'components.moderation-list-row.submission.rejected',
    },
});


export default Component.extend({
    theme: service(),
    i18n: service(),

    noActions: false,

    classNames: ['moderation-list-row'],

    contributorLoading: computed.not('firstContributors.length'),

    moderatorLoading: computed.none('lastActionCreator'),

    lastActionCreator: computed.alias('latestAction.creator.fullName'),

    latestAction: computed('submission.actions.[]', function() {
        if (!this.get('submission.actions.length')) {
            return null;
        }
        // on create, Ember puts the new object at the end of the array
        // https://stackoverflow.com/questions/15210249/ember-data-insert-new-item-at-beginning-of-array-instead-of-at-the-end
        const first = this.get('submission.actions.firstObject');
        const last = this.get('submission.actions.lastObject');
        return moment(first.get('dateModified')) > moment(last.get('dateModified')) ? first : last;
    }),

    firstContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors').slice(0, 3);
    }),

    additionalContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors.content.meta.pagination.total') - 3;
    }),

    gtDay: computed('submission.dateLastTransitioned', function() {
        return moment().diff(this.get('submission.dateLastTransitioned'), 'days') > 1;
    }),

    relevantDate: computed('submission.dateLastTransitioned', 'gtDay', function() {
        return this.get('gtDay') ?
            moment(this.get('submission.dateLastTransitioned')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateLastTransitioned')), Date.now())).fromNow();
    }),

    // translations
    statusTimeDate: computed('submission.reviewsState', 'gtDay', 'noActions', function() {
        const i18n = this.get('i18n');
        const dayValue = this.get('gtDay') ? 'gtDay' : 'ltDay';
        const timeWording = this.get('noAction') ? `${dayValue}_automatic` : dayValue;
        return i18n.t(ACTION_LABELS[this.get('submission.reviewsState')][timeWording], { timeDate: this.get('relevantDate'), moderatorName: this.get('lastActionCreator') });
    }),

    init() {
        this._super(...arguments);

        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };

        this.get('submission.actions').then(this._handleActions.bind(this));
    },

    _handleActions(actions) {
        if (actions.length) {
            this.set('noActions', false);
        } else {
            this.set('noActions', true);
        }
    },
});
