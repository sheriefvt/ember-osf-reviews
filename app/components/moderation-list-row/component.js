import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import moment from 'moment';
import { task } from 'ember-concurrency';

import latestAction from 'reviews/utils/latest-action';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const ACTION_LABELS = Object.freeze({
    [PENDING]: {
        gtDay: 'components.moderationListRow.submission.submittedOn',
        ltDay: 'components.moderationListRow.submission.submitted',
    },
    [ACCEPTED]: {
        gtDay: 'components.moderationListRow.submission.acceptedOn',
        ltDay: 'components.moderationListRow.submission.accepted',
        gtDay_automatic: 'components.moderationListRow.submission.acceptedAutomaticallyOn',
        ltDay_automatic: 'components.moderationListRow.submission.acceptedAutomatically',
    },
    [REJECTED]: {
        gtDay: 'components.moderationListRow.submission.rejectedOn',
        ltDay: 'components.moderationListRow.submission.rejected',
    },
});


export default Component.extend({
    theme: service(),
    i18n: service(),

    classNames: ['moderation-list-row'],

    latestActionCreator: computed.alias('latestAction.creator.fullName'),

    noActions: computed.not('submission.reviewActions.length'),

    // latest action attempted on the preprint
    latestAction: computed('submission.reviewActions.[]', function() {
        return latestAction(this.get('submission.reviewActions'));
    }),

    // first three contributors to the preprint
    firstContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors').slice(0, 3);
    }),

    // count of contributors in-addition to the first three
    additionalContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors.content.meta.pagination.total') - 3;
    }),

    // translations for moderator action label
    reviewedOnLabel: computed('submission.{reviewsState,dateLastTransitioned}', 'noActions', 'latestActionCreator', function() {
        const gtDay = moment().diff(this.get('submission.dateLastTransitioned'), 'days') > 1;
        const acceptedRejectedDate = gtDay ?
            moment(this.get('submission.dateLastTransitioned')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateLastTransitioned')), Date.now())).fromNow();
        const i18n = this.get('i18n');
        const dayValue = gtDay ? 'gtDay' : 'ltDay';
        const timeWording = this.get('noActions') ? `${dayValue}_automatic` : dayValue;
        const status = this.get('submission.reviewsState');
        const labels = ACTION_LABELS[status][timeWording];
        return i18n.t(labels, { timeDate: acceptedRejectedDate, moderatorName: this.get('latestActionCreator') });
    }),

    // translations for submitted on label
    submittedOnLabel: computed('submission.dateCreated', function() {
        const i18n = this.get('i18n');
        const gtDaySubmit = moment().diff(this.get('submission.dateCreated'), 'days') > 1;
        const dayValue = gtDaySubmit ? 'gtDay' : 'ltDay';
        const submitDate = gtDaySubmit ?
            moment(this.get('submission.dateCreated')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateCreated')), Date.now())).fromNow();
        const labels = ACTION_LABELS.pending[dayValue];
        return i18n.t(labels, { timeDate: submitDate });
    }),

    didReceiveAttrs() {
        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        const node = yield this.get('submission.node');
        yield node.get('contributors');
        yield this.get('submission.reviewActions');
    }),
});
