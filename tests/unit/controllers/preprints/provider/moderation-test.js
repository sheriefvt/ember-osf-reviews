import { moduleFor, test } from 'ember-qunit';
import EmberService from '@ember/service';

const analyticsService = EmberService.extend({
    props: null,
    trackEvent(...args) {
        this.set('props', [...args]);
    },
});

moduleFor('controller:preprints/provider/moderation', 'Unit | Controller | preprints/provider/moderation', {
    // Specify the other units that are required for this test.
    needs: [
        'service:theme',
        'service:metrics',
    ],
    beforeEach() {
        this.register('service:metrics', analyticsService);
        this.inject.service('metrics', { as: 'metrics' });
    },
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        page: 1,
        status: 'pending',
        sort: '-date_last_transitioned',
        loading: true,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});

test('statusChanged action', function (assert) {
    const ctrl = this.subject();
    ctrl.set('page', 2);
    ctrl.set('status', 'reject');
    ctrl.set('loading', false);

    ctrl.send('statusChanged', 'accept');

    assert.strictEqual(ctrl.get('status'), 'accept');
    assert.strictEqual(ctrl.get('loading'), true);
    assert.strictEqual(ctrl.get('page'), 1);
});

test('pageChanged action', function (assert) {
    const ctrl = this.subject();
    ctrl.set('page', 2);
    ctrl.set('status', 'reject');
    ctrl.set('loading', false);

    ctrl.send('pageChanged', 1);

    assert.strictEqual(ctrl.get('status'), 'reject');
    assert.strictEqual(ctrl.get('loading'), true);
    assert.strictEqual(ctrl.get('page'), 1);

    assert.ok(ctrl.get('metrics.props'));
});

test('sortChanged action', function (assert) {
    const ctrl = this.subject();
    ctrl.set('page', 2);
    ctrl.set('status', 'reject');
    ctrl.set('loading', false);

    ctrl.send('sortChanged', 1);

    assert.strictEqual(ctrl.get('status'), 'reject');
    assert.strictEqual(ctrl.get('loading'), true);
    assert.strictEqual(ctrl.get('page'), 1);
});
