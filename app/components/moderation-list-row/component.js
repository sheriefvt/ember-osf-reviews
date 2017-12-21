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

    noActions: computed.not('submission.actions.length'),

    // latest action attempted on the preprint
    latestAction: computed('submission.actions.[]', function() {
        return latestAction(this.get('submission.actions'));
    }),

    // first three contributors to the preprint
    firstContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors').slice(0, 3);
    }),

    // count of contributors in-addition to the first three
    additionalContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors.content.meta.pagination.total') - 3;
    }),

    // check if it has been more than a day since preprint last transition
    gtDay: computed('submission.dateLastTransitioned', function() {
        return moment().diff(this.get('submission.dateLastTransitioned'), 'days') > 1;
    }),

    // date of preprint acceptance or rejection
    acceptedRejectedtDate: computed('submission.dateLastTransitioned', 'gtDay', function() {
        return this.get('gtDay') ?
            moment(this.get('submission.dateLastTransitioned')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateLastTransitioned')), Date.now())).fromNow();
    }),

    // date of preprint submission
    submitDate: computed('submission.dateCreated', 'gtDay', function() {
        return this.get('gtDay') ?
            moment(this.get('submission.dateCreated')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateCreated')), Date.now())).fromNow();
    }),

    // translations for accepted and rejected records
    acceptedRejectedStatusTimeDate: computed('submission.reviewsState', 'gtDay', 'noActions', function() {
        const i18n = this.get('i18n');
        const dayValue = this.get('gtDay') ? 'gtDay' : 'ltDay';
        const timeWording = this.get('noActions') ? `${dayValue}_automatic` : dayValue;
        const status = this.get('submission.reviewsState');
        const labels = ACTION_LABELS[status][timeWording];
        return i18n.t(labels, { timeDate: this.get('acceptedRejectedtDate'), moderatorName: this.get('latestActionCreator') });
    }),

    // translations for pending records
    pendingStatusTimeDate: computed('submission.reviewsState', 'gtDay', 'noActions', function() {
        const i18n = this.get('i18n');
        const dayValue = this.get('gtDay') ? 'gtDay' : 'ltDay';
        const labels = ACTION_LABELS.pending[dayValue];
        return i18n.t(labels, { timeDate: this.get('submitDate') });
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
        yield this.get('submission.actions');
    }),
});
