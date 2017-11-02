import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';
import latestAction from 'reviews/utils/latest-action';

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

    classNames: ['moderation-list-row'],

    latestActionCreator: computed.alias('latestAction.creator.fullName'),

    moderatorLoading: computed('noActions', 'latestActionCreator', function () {
        return !(this.get('noActions') || this.get('latestActionCreator'));
    }),

    latestAction: computed('submission.actions.[]', function() {
        return latestAction(this.get('submission.actions'));
    }),

    noActions: computed('submission.actions.{length,isPending}', function () {
        return !this.get('submission.actions.length') || this.get('submission.actions.isPending');
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
        const timeWording = this.get('noActions') ? `${dayValue}_automatic` : dayValue;
        const labels = ACTION_LABELS[this.get('submission.reviewsState')][timeWording];
        return i18n.t(labels, { timeDate: this.get('relevantDate'), moderatorName: this.get('latestActionCreator') });
    }),

    init() {
        this._super(...arguments);

        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };
    },
});
